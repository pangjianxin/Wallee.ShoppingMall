import { betterAuth } from "better-auth";
import { credentials } from "better-auth-credentials-plugin";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import type { DecodedJWT } from "@/types/auth-types";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:",
  },
  emailAndPassword: {
    enabled: false,
  },
  // OIDC provider for OpenIddict
  socialProviders: {
    oidc: {
      clientId: process.env.NEXTAUTH_CLIENT_ID || "",
      clientSecret: process.env.NEXTAUTH_CLIENT_SECRET || "",
      issuer: process.env.OPENIDDICT_INTERNAL_ISSUER || "",
      discoveryUrl: process.env.OPENIDDICT_WELL_KNOWN,
      scopes: (process.env.NEXTAUTH_SCOPE || "openid profile email").split(" "),
      // Override authorization endpoint to use external issuer
      authorizationEndpoint: `${process.env.OPENIDDICT_EXTERNAL_ISSUER}/connect/authorize`,
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
      organization_unit_code: {
        type: "string",
        required: false,
      },
      organization_unit_id: {
        type: "string",
        required: false,
      },
      supplier_id: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
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
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    credentials({
      autoSignUp: true,
      path: "/sign-in/credentials",
      inputSchema: z.object({
        username: z.string(),
        password: z.string(),
        captchaid: z.string(),
        captchacode: z.string(),
      }),
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
          roles: typeof decodedJWT.role === "string" 
            ? decodedJWT.role 
            : JSON.stringify(decodedJWT.role),
          organization_unit_code: decodedJWT.organization_unit_code,
          organization_unit_id: decodedJWT.organization_unit_id,
          supplier_id: decodedJWT.supplier_id,
          image: "/images/avatar.jpg",

          onSignIn(userData, user, account) {
            // Update user on each sign-in
            return {
              ...userData,
              name: decodedJWT.preferred_username,
              username: decodedJWT.preferred_username,
              roles: typeof decodedJWT.role === "string" 
                ? decodedJWT.role 
                : JSON.stringify(decodedJWT.role),
              organization_unit_code: decodedJWT.organization_unit_code,
              organization_unit_id: decodedJWT.organization_unit_id,
              supplier_id: decodedJWT.supplier_id,
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
    after: [
      {
        matcher: (context) => {
          return context.path?.includes("/sign-in/social") || 
                 context.path?.includes("/callback/oidc");
        },
        handler: async (context) => {
          // Extract and store additional OIDC claims
          if (context.user && context.session) {
            const accounts = await context.context.internalAdapter.findAccounts({
              userId: context.user.id,
            });
            
            if (accounts && accounts.length > 0 && accounts[0].idToken) {
              const decoded = jwtDecode<DecodedJWT>(accounts[0].idToken);
              
              // Update user with additional fields from OIDC
              await context.context.internalAdapter.updateUser(context.user.id, {
                username: decoded.preferred_username || decoded.unique_name,
                roles: typeof decoded.role === "string" 
                  ? decoded.role 
                  : JSON.stringify(decoded.role),
                organization_unit_code: decoded.organization_unit_code,
                organization_unit_id: decoded.organization_unit_id,
                supplier_id: decoded.supplier_id,
              });
            }
          }
        },
      },
    ],
  },
});

export type Session = typeof auth.$Infer.Session;
