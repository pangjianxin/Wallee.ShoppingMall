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

// 仅允许同源下的安全回调地址，避免开放重定向
function getSafeRedirect(callbackUrl?: string) {
  if (!callbackUrl) return "/";

  try {
    const url = new URL(callbackUrl, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

// Export custom credentials sign-in function for convenience
export async function signInWithCredentials({
  username,
  password,
  captchaid,
  captchacode,
  callbackUrl,
}: {
  username: string;
  password: string;
  captchaid: string;
  captchacode: string;
  callbackUrl?: string;
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
        error: (result.error as any)?.message || "invalid_grant",
      };
    }

    // Reload to update session
    window.location.href = getSafeRedirect(callbackUrl);
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
