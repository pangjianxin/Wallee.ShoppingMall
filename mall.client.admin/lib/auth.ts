import { betterAuth } from "better-auth";

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
});

export type Session = typeof auth.$Infer.Session;
