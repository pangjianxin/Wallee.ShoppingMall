import { createAuthClient } from "better-auth/react";
import { credentialsClient, defaultCredentialsSchema } from "better-auth-credentials-plugin/client";
import type { Session } from "@/types/auth-types";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4201",
  plugins: [
    credentialsClient({
      path: "/sign-in/credentials",
    }),
  ],
});

export const { useSession, signOut, signIn } = authClient;

// Export custom credentials sign-in function for convenience
export async function signInWithCredentials({
  username,
  password,
  captchaid,
  captchacode,
}: {
  username: string;
  password: string;
  captchaid: string;
  captchacode: string;
}) {
  try {
    const result = await authClient.signIn.credentials({
      username,
      password,
      captchaid,
      captchacode,
    });
    
    if (result.error) {
      return {
        error: result.error.message || "invalid_grant",
      };
    }
    
    // Reload to update session
    window.location.href = "/";
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || "invalid_grant",
    };
  }
}

// OIDC sign-in
export async function signInWithOIDC() {
  await signIn.social({
    provider: "oidc",
    callbackURL: "/",
  });
}
