import { credentialsClient } from "@/lib/plugins/credentials/client";
import { createAuthClient } from "better-auth/react";
import type { User } from "@/types/auth-types";
import { inputSchema } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4201",
  plugins: [
    credentialsClient<
      User & { roles: string[]; username: string },
      "/sign-in/credentials",
      typeof inputSchema
    >(),
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
    const result = await authClient.signInCredentials({
      username,
      password,
      captchaid,
      captchacode,
    });

    if (result.error) {
      return {
        error: result.error || "invalid_grant",
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
