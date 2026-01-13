import { useState, useEffect } from "react";
import type { Session } from "@/types/auth-types";

/**
 * Client-side session hook
 * Compatible with better-auth patterns
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Fetch session from the server
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession(null);
      } finally {
        setIsPending(false);
      }
    };

    fetchSession();
  }, []);

  return {
    data: session,
    isPending,
  };
}

/**
 * Sign out function
 */
export async function signOut(options?: {
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  };
}) {
  try {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      options?.fetchOptions?.onSuccess?.();
    } else {
      throw new Error("Sign out failed");
    }
  } catch (error) {
    options?.fetchOptions?.onError?.(error as Error);
    console.error("Sign out error:", error);
  }
}

/**
 * Sign in function (generic)
 */
export const signIn = {
  social: async (options: { provider: string; callbackURL?: string }) => {
    // For OIDC provider
    if (options.provider === "oidc" || options.provider === "openiddict") {
      window.location.href = `/api/auth/signin/oidc?callbackUrl=${encodeURIComponent(options.callbackURL || "/")}`;
    }
  },
};

/**
 * Custom credentials sign-in function
 */
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
  const response = await fetch("/api/auth/credentials", {
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

/**
 * OIDC sign-in (for the openiddict provider)
 */
export async function signInWithOIDC() {
  await signIn.social({
    provider: "openiddict",
    callbackURL: "/",
  });
}

// Export authClient for compatibility
export const authClient = {
  useSession,
  signIn,
  signOut,
};
