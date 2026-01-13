import { betterAuth } from "better-auth";
import { jwtDecode } from "jwt-decode";
import type { DecodedJWT } from "@/types/next-auth";

// Custom plugin for credentials authentication with captcha
const credentialsPlugin = {
  id: "credentials" as const,
  endpoints: {
    signInCredentials: {
      method: "POST" as const,
      path: "/sign-in/credentials",
      body: {
        username: {
          type: "string" as const,
          required: true,
        },
        password: {
          type: "string" as const,
          required: true,
        },
        captchaid: {
          type: "string" as const,
          required: true,
        },
        captchacode: {
          type: "string" as const,
          required: true,
        },
      },
      handler: async (context: any) => {
        const { username, password, captchaid, captchacode } = context.body;

        // Call OpenIddict token endpoint
        const response = await fetch(
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
              username,
              password,
              captchaid,
              captchacode,
              scope: process.env.NEXTAUTH_SCOPE || "",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.access_token) {
          // Handle error
          const errorDesc = data.error_description?.toLowerCase() || "";
          let errorCode = "invalid_grant";

          if (
            errorDesc.includes("username") ||
            errorDesc.includes("用户名") ||
            errorDesc.includes("password") ||
            errorDesc.includes("密码")
          ) {
            errorCode = "invalid_username_or_password";
          } else if (
            errorDesc.includes("captcha") ||
            errorDesc.includes("验证码")
          ) {
            errorCode = "invalid_captcha";
          }

          return context.json(
            {
              error: errorCode,
              message: data.error_description,
            },
            {
              status: 401,
            }
          );
        }

        // Decode JWT to get user info
        const decodedJWT = jwtDecode<DecodedJWT>(data.access_token);

        // Create or update user in better-auth database
        const user = await context.context.internalAdapter.createUser({
          id: decodedJWT.sub,
          name: decodedJWT.preferred_username,
          email: decodedJWT.email || `${decodedJWT.sub}@local.user`,
          emailVerified: false,
          image: "/images/avatar.jpg",
          username: decodedJWT.preferred_username,
          roles: typeof decodedJWT.role === "string" 
            ? decodedJWT.role 
            : JSON.stringify(decodedJWT.role),
          organization_unit_code: decodedJWT.organization_unit_code,
          organization_unit_id: decodedJWT.organization_unit_id,
          supplier_id: decodedJWT.supplier_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Create session
        const session = await context.context.internalAdapter.createSession({
          userId: user.id,
          expiresAt: new Date(decodedJWT.exp * 1000),
        });

        // Store tokens in account
        await context.context.internalAdapter.createAccount({
          userId: user.id,
          providerId: "credentials",
          providerAccountId: decodedJWT.sub,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          expiresAt: decodedJWT.exp,
        });

        // Set session cookie
        await context.setSignedCookie(
          context.context.authCookies.sessionToken.name,
          session.token,
          context.context.secret,
          {
            ...context.context.authCookies.sessionToken.options,
            maxAge: 60 * 60 * 24, // 24 hours
          }
        );

        return context.json({
          user,
          session: {
            token: session.token,
            expiresAt: session.expiresAt,
          },
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          idToken: data.id_token,
        });
      },
    },
  },
};

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:",
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    oidc: {
      clientId: process.env.NEXTAUTH_CLIENT_ID || "",
      clientSecret: process.env.NEXTAUTH_CLIENT_SECRET || "",
      issuer: process.env.OPENIDDICT_INTERNAL_ISSUER || "",
      discoveryUrl: process.env.OPENIDDICT_WELL_KNOWN,
      scopes: (process.env.NEXTAUTH_SCOPE || "openid profile email").split(" "),
      authorizationEndpoint: `${process.env.OPENIDDICT_EXTERNAL_ISSUER}/connect/authorize`,
      mapProfileToUser: (profile: any) => {
        return {
          id: profile.sub,
          name: profile.unique_name || profile.name || profile.preferred_username,
          email: profile.email || `${profile.sub}@local.user`,
          emailVerified: profile.email_verified === true,
          image: "/images/avatar.jpg",
        };
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
  plugins: [credentialsPlugin],
  // Hook to enrich OIDC user with custom fields
  hooks: {
    after: [
      {
        matcher: (context) => {
          return context.path?.includes("/sign-in/social") || context.path?.includes("/callback/oidc");
        },
        handler: async (context) => {
          // Extract and store additional OIDC claims
          if (context.user && context.session) {
            // Get the ID token and decode it to extract additional fields
            const account = await context.context.internalAdapter.findAccounts({
              userId: context.user.id,
            });
            
            if (account && account.length > 0 && account[0].idToken) {
              const decoded = jwtDecode<DecodedJWT>(account[0].idToken);
              
              // Update user with additional fields
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
