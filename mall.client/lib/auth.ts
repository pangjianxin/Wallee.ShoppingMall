import { betterAuth } from "better-auth";
import { credentials } from "@/lib/plugins/credentials";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import type {
  DecodedJWT,
  ExtendedAccountData,
  ExtendedSessionData,
} from "@/types/auth-types";
import { createAuthMiddleware } from "better-auth/plugins";
import { customSession } from "better-auth/plugins";

export const inputSchema = z.object({
  username: z.string(),
  password: z.string(),
  captchaid: z.string(),
  captchacode: z.string(),
});

/**
 * 规范化角色数据为字符串格式
 */
function normalizeRole(role: string | string[] | undefined): string[] {
  if (!role) return [];
  if (Array.isArray(role)) {
    return role.map((item) => String(item)).filter(Boolean);
  }
  if (typeof role === "string") {
    try {
      const parsed = JSON.parse(role);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      // ignore JSON parse errors
    }

    return role
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

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
      expiresAt: {
        type: "date",
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
        type: "date",
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
        type: "string[]",
        required: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    customSession(async (sessionData, ctx) => {
      // Get the user's accounts to retrieve tokens
      const accounts = await ctx.context.internalAdapter.findAccounts(
        sessionData.user.id
      );
      const account = accounts?.[0] as ExtendedAccountData | undefined;

      // Add tokens to session from account
      const extendedSession: ExtendedSessionData = {
        accessToken: account?.accessToken,
        refreshToken: account?.refreshToken,
        idToken: account?.idToken,
      };

      const mergedSession: ExtendedSessionData = {
        ...sessionData.session,
      };

      if (extendedSession.accessToken) {
        mergedSession.accessToken = extendedSession.accessToken;
      }
      if (extendedSession.refreshToken) {
        mergedSession.refreshToken = extendedSession.refreshToken;
      }
      if (extendedSession.idToken) {
        mergedSession.idToken = extendedSession.idToken;
      }

      return {
        ...sessionData,
        session: {
          ...mergedSession,
        },
      };
    }),
    credentials({
      autoSignUp: true,
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
          roles: normalizeRole(decodedJWT.role),
          session: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            idToken: data.id_token,
            expiresAt: decodedJWT.exp ? new Date(decodedJWT.exp * 1000) : undefined,
          },

          onSignIn(userData) {
            // Update user on each sign-in
            return {
              ...userData,
              name: decodedJWT.preferred_username,
              username: decodedJWT.preferred_username,
              roles: normalizeRole(decodedJWT.role),
            };
          },

          onSignUp(userData) {
            // Set initial user data on sign-up
            return userData;
          },

          onLinkAccount() {
            // Store tokens in the account
            return {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              idToken: data.id_token,
              expiresAt: decodedJWT.exp ? new Date(decodedJWT.exp * 1000) : undefined,
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
            roles: normalizeRole(decoded.role),
          });
        }
      }
    }),
  },
});

