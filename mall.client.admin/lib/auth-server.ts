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
    
    // Extract session token from cookies
    const sessionTokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    const sessionToken = sessionTokenMatch?.[1];

    if (!sessionToken) {
      return null;
    }

    // Get session from better-auth
    const session = await betterAuthInstance.api.getSession({
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!session) {
      return null;
    }

    // Get account to retrieve tokens
    const accounts = await betterAuthInstance.api.listAccounts({
      headers: {
        cookie: cookieHeader,
      },
    });

    const account = accounts?.[0];

    // Return session in the expected format
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        username: (session.user as any).username,
        email: session.user.email,
        image: session.user.image,
        roles: (session.user as any).roles,
        organization_unit_code: (session.user as any).organization_unit_code,
        organization_unit_id: (session.user as any).organization_unit_id,
        supplier_id: (session.user as any).supplier_id,
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
