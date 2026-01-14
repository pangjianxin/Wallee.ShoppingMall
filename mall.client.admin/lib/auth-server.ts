import { auth as betterAuthInstance } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";
import type { Session } from "@/types/auth-types";

/**
 * Server-side function to get the current session
 * Use this in server components, API routes, and server actions
 */
export async function auth(): Promise<Session | null> {
  try {
    const headers = await getHeaders();
    const cookieHeader = headers.get("cookie") || "";

    // Get session from better-auth using the API
    const sessionData = await betterAuthInstance.api.getSession({
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!sessionData || !sessionData.session || !sessionData.user) {
      return null;
    }

    // Get account to retrieve tokens
    const accounts = await betterAuthInstance.api.listUserAccounts({
      headers: {
        cookie: cookieHeader,
      },
    });

    const account = accounts?.[0];

    // Return session in the expected format
    return {
      user: {
        id: sessionData.user.id,
        name: sessionData.user.name || "",
        username: (sessionData.user as any).username || "",
        email: sessionData.user.email || "",
        image: sessionData.user.image || undefined,
        roles: (sessionData.user as any).roles,
        organization_unit_code: (sessionData.user as any)
          .organization_unit_code,
        organization_unit_id: (sessionData.user as any).organization_unit_id,
        supplier_id: (sessionData.user as any).supplier_id,
      },
      accessToken: account?.accessToken,
      refreshToken: account?.refreshToken,
      idToken: account?.idToken,
      expiresAt: account?.expiresAt,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Export for compatibility
export const getSession = auth;
