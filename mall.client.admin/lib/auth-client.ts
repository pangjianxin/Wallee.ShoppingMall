import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4201",
});

export const {
  useSession,
  signIn,
  signOut,
} = authClient;

// Custom credentials sign-in function
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
  const response = await fetch("/api/auth/sign-in/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      captchaid,
      captchacode,
    }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.error || "invalid_grant",
      message: data.message,
    };
  }

  // Reload to update session
  window.location.href = "/";
  
  return { success: true };
}

// OIDC sign-in (for the openiddict provider)
export async function signInWithOIDC() {
  await signIn.social({
    provider: "oidc",
    callbackURL: "/",
  });
}
