import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:",
  },
  emailAndPassword: {
    enabled: false,
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
