import { betterAuth, User } from "better-auth";
import { credentials } from "better-auth-credentials-plugin";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import type { DecodedJWT } from "@/types/auth-types";
import { createAuthMiddleware } from "better-auth/plugins";
import { customSession } from "better-auth/plugins";
import { a } from "motion/react-client";

export const inputSchema = z.object({
  username: z.string(),
  password: z.string(),
  captchaid: z.string(),
  captchacode: z.string(),
});

export const auth = betterAuth({
  //https://www.better-auth.com/docs/concepts/session-management#stateless-session-management
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
      strategy: "jwe", // can be "jwt" or "compact"
      refreshCache: true, // Enable stateless refresh
    },
    additionalFields: {
      accessToken: {
        type: "string",
        required: false,
      },
      refreshToken: {
        type: "string",
        required: false,
      },
      idToken: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
    additionalFields: {
      accessToken: {
        type: "string",
        required: false,
      },
      refreshToken: {
        type: "string",
        required: false,
      },
      idToken: {
        type: "string",
        required: false,
      },
      expiresAt: {
        type: "number",
        required: false,
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
      roles: {
        type: "string",
        required: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    customSession(async (user, session) => {
      // const data = await abpApplicationConfigurationGet({
      //   query: {
      //     IncludeLocalizationResources: false,
      //   },
      // });
      console.log("Custom session plugin invoked for user:", user);
      return session;
    }),
    credentials({
      autoSignUp: true,
      UserType: {} as User & {
        username: string;
        roles: string | string[];
      },
      path: "/sign-in/credentials",
      inputSchema: inputSchema,
      async callback(ctx, parsed) {
        // Call OpenIddict token endpoint with credentials and captcha
        const tokenResponse = await fetch(
          `${process.env.OPENIDDICT_INTERNAL_ISSUER}/connect/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "password",
              client_id: process.env.NEXTAUTH_CLIENT_ID || "",
              client_secret: process.env.NEXTAUTH_CLIENT_SECRET || "",
              username: parsed.username,
              password: parsed.password,
              captchaid: parsed.captchaid,
              captchacode: parsed.captchacode,
              scope: process.env.NEXTAUTH_SCOPE || "",
            }),
          }
        );

        const data = await tokenResponse.json();

        console.log(data);

        if (!tokenResponse.ok || !data.access_token) {
          // Handle error responses
          const errorDesc = data.error_description?.toLowerCase() || "";

          if (
            errorDesc.includes("username") ||
            errorDesc.includes("用户名") ||
            errorDesc.includes("password") ||
            errorDesc.includes("密码")
          ) {
            throw new Error("invalid_username_or_password");
          } else if (
            errorDesc.includes("captcha") ||
            errorDesc.includes("验证码")
          ) {
            throw new Error("invalid_captcha");
          } else {
            throw new Error("invalid_grant");
          }
        }

        // Decode JWT to get user info
        const decodedJWT = jwtDecode<DecodedJWT>(data.access_token);

        // Return user data and callbacks
        return {
          email: decodedJWT.email || `${decodedJWT.sub}@local.user`,
          name: decodedJWT.preferred_username,
          username: decodedJWT.preferred_username,
          roles:
            typeof decodedJWT.role === "string"
              ? decodedJWT.role
              : JSON.stringify(decodedJWT.role),

          onSignIn(userData, user, account) {
            // Update user on each sign-in
            return {
              ...userData,
              name: decodedJWT.preferred_username,
              username: decodedJWT.preferred_username,
              roles:
                typeof decodedJWT.role === "string"
                  ? decodedJWT.role
                  : JSON.stringify(decodedJWT.role),
            };
          },

          onSignUp(userData) {
            // Set initial user data on sign-up
            return userData;
          },

          onLinkAccount(user) {
            // Store tokens in the account
            return {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              idToken: data.id_token,
              expiresAt: decodedJWT.exp,
            };
          },
        };
      },
    }),
  ],
  // Hook to add tokens from OIDC provider to account
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Extract and store additional OIDC claims
      if (ctx.context.user && ctx.context.session) {
        const accounts = await ctx.context.internalAdapter.findAccounts(
          ctx.context.session.user.id
        );

        if (accounts && accounts.length > 0 && accounts[0].idToken) {
          const decoded = jwtDecode<DecodedJWT>(accounts[0].idToken);

          // Update user with additional fields from OIDC
          await ctx.context.internalAdapter.updateUser(ctx.context.user.id, {
            username: decoded.preferred_username || decoded.unique_name,
            roles:
              typeof decoded.role === "string"
                ? decoded.role
                : JSON.stringify(decoded.role),
            organization_unit_code: decoded.organization_unit_code,
            organization_unit_id: decoded.organization_unit_id,
            supplier_id: decoded.supplier_id,
          });
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
