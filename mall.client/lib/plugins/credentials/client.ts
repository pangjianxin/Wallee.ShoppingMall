/**
 * 客户端 Credentials Plugin
 */

import type { z } from "zod";

export interface CredentialsClientOptions<TSchema extends z.ZodSchema> {
  /**
   * 登录端点路径
   * @default "/sign-in/credentials"
   */
  path?: string;

  /**
   * 自定义请求体转换
   */
  transformBody?: (data: z.infer<TSchema>) => unknown;

  /**
   * 自定义请求配置扩展
   */
  fetchOptions?: Record<string, unknown>;
}

/**
 * 创建客户端 credentials plugin
 */
export function credentialsClient<
  TUserType = any,
  TPath extends string = "/sign-in/credentials",
  TSchema extends z.ZodSchema = z.ZodSchema,
  TResponse = { user?: TUserType; session?: unknown; error?: unknown }
>(options: CredentialsClientOptions<TSchema> & { path?: TPath } = {}) {
  const path = (options.path || "/sign-in/credentials") as TPath;
  
  return {
    id: "credentials-client",
    $InferServerPlugin: {} as ReturnType<typeof import("./index").credentials<TSchema>>,
    getActions: ($fetch: any) => {
      return {
        signInCredentials: async (data: z.infer<TSchema>): Promise<TResponse> => {
          const body = options.transformBody ? options.transformBody(data) : data;
          return await $fetch(path, {
            method: "POST",
            body,
            ...(options.fetchOptions || {}),
          });
        },
      };
    },
  };
}
