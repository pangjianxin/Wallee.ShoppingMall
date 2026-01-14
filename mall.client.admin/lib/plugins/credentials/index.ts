/**
 * 自定义 Credentials Plugin for Better-auth
 * 基于 better-auth-credentials-plugin 简化实现
 * 专门用于与 OpenIddict 集成的用户名/密码/验证码登录
 */

import { APIError } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import type { BetterAuthPlugin } from "better-auth";

// 错误代码
export const ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
} as const;

// 用户数据类型
export interface UserData {
  email: string;
  name?: string;
  username?: string;
  roles?: string;
  [key: string]: any;
}

// 账户数据类型
export interface AccountData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  [key: string]: any;
}

// 回调结果类型
export interface CallbackResult {
  email?: string;
  name?: string;
  username?: string;
  roles?: string;
  onSignIn?: (
    userData: UserData,
    user: any,
    account: any
  ) => UserData | Promise<UserData>;
  onSignUp?: (userData: UserData) => UserData | Promise<UserData>;
  onLinkAccount?: (user: any) => AccountData | Promise<AccountData>;
  [key: string]: any;
}

// 插件选项
export interface CredentialsOptions<TSchema extends z.ZodSchema = z.ZodSchema> {
  /**
   * 输入数据的 Zod schema
   */
  inputSchema: TSchema;

  /**
   * 认证回调函数
   * 返回用户数据或抛出错误
   */
  callback: (ctx: any, parsed: z.infer<TSchema>) => Promise<CallbackResult>;

  /**
   * 是否自动注册新用户
   * @default true
   */
  autoSignUp?: boolean;

  /**
   * 登录端点路径
   * @default "/sign-in/credentials"
   */
  path?: string;

  /**
   * Provider ID
   * @default "credentials"
   */
  providerId?: string;
}

/**
 * 创建 Credentials 认证插件
 */
export function credentials<TSchema extends z.ZodSchema>(
  options: CredentialsOptions<TSchema>
): BetterAuthPlugin {
  const providerId = options.providerId || "credentials";
  const path = options.path || "/sign-in/credentials";

  return {
    id: "credentials",
    endpoints: {
      signInCredentials: createAuthEndpoint(
        path,
        {
          method: "POST",
          body: options.inputSchema,
        },
        async (ctx) => {
          // 1. 解析输入数据
          const parsed = ctx.body as z.infer<TSchema>;

          if (
            !parsed ||
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
          ) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: ERROR_CODES.UNEXPECTED_ERROR,
            });
          }

          // 2. 调用认证回调
          let callbackResult: CallbackResult;
          try {
            callbackResult = await options.callback(ctx, parsed);

            if (!callbackResult) {
              throw new APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_CREDENTIALS,
              });
            }
          } catch (error) {
            // 如果是 Error 对象，使用其 message
            if (error instanceof Error) {
              throw new APIError("UNAUTHORIZED", {
                message: error.message,
              });
            }
            throw new APIError("UNAUTHORIZED", {
              message: ERROR_CODES.INVALID_CREDENTIALS,
            });
          }

          // 3. 提取用户数据和回调函数
          const {
            onSignIn,
            onSignUp,
            onLinkAccount,
            email: callbackEmail,
            ...userData
          } = callbackResult;

          // 确定 email - 从 callback 结果或 parsed 输入中获取
          let email: string | undefined = callbackEmail;
          const parsedEmail =
            "email" in parsed && typeof (parsed as any).email === "string"
              ? (parsed as any).email
              : undefined;

          if (!email) {
            email = parsedEmail;
          }

          if (!email) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: ERROR_CODES.EMAIL_REQUIRED,
            });
          }

          email = email.toLowerCase();

          // 4. 查找或创建用户
          let user: any = await ctx.context.adapter.findOne({
            model: "user",
            where: [{ field: "email", value: email }],
          });

          let account: any = null;

          if (!user) {
            // 自动注册新用户
            if (!options.autoSignUp) {
              throw new APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_CREDENTIALS,
              });
            }

            // 调用 onSignUp 回调
            let finalUserData: any = { ...userData };
            if (onSignUp) {
              const signUpResult = await onSignUp({ email, ...userData });
              finalUserData = { ...finalUserData, ...signUpResult };
            }

            // 创建新用户
            const { name, ...restUserData } = finalUserData;
            user = await ctx.context.internalAdapter.createUser({
              email,
              name: name || "",
              emailVerified: false,
              ...restUserData,
            });

            // 调用 onLinkAccount 回调并创建账户
            if (onLinkAccount) {
              const accountData = await onLinkAccount(user);
              account = await ctx.context.internalAdapter.createAccount({
                userId: user.id,
                providerId,
                accountId: user.id,
                ...accountData,
              });
            } else {
              account = await ctx.context.internalAdapter.createAccount({
                userId: user.id,
                providerId,
                accountId: user.id,
              });
            }
          } else {
            // 用户已存在 - 登录流程

            // 查找账户
            const accounts = await ctx.context.internalAdapter.findAccounts(
              user.id
            );
            account = accounts.find((a: any) => a.providerId === providerId);

            // 调用 onSignIn 回调
            let finalUserData: any = { ...userData };
            if (onSignIn) {
              const signInResult = await onSignIn(
                { email, ...userData },
                user,
                account
              );
              finalUserData = { ...finalUserData, ...signInResult };
            }

            // 如果没有账户，创建一个
            if (!account) {
              if (onLinkAccount) {
                const accountData = await onLinkAccount(user);
                account = await ctx.context.internalAdapter.createAccount({
                  userId: user.id,
                  providerId,
                  accountId: user.id,
                  ...accountData,
                });
              } else {
                account = await ctx.context.internalAdapter.createAccount({
                  userId: user.id,
                  providerId,
                  accountId: user.id,
                });
              }
            }

            // 更新用户信息
            if (finalUserData && Object.keys(finalUserData).length > 0) {
              const { email: _email, ...updateData } = finalUserData;
              user = await ctx.context.internalAdapter.updateUser(
                user.id,
                updateData
              );
            }
          }

          // 5. 创建 session
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.request as any
          );

          // 6. 设置 cookie
          await setSessionCookie(ctx, {
            session,
            user,
          });

          // 7. 返回结果
          return ctx.json({
            user,
            session,
          });
        }
      ),
    },
  };
}
