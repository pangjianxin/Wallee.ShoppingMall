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

    // Get session from better-auth using internal adapter
    const adapter = betterAuthInstance.options.database.adapter;
    const sessionData = await adapter.findSession(sessionToken);

    if (!sessionData) {
      return null;
    }

    // Get user
    const user = await adapter.findUserById(sessionData.userId);
    
    if (!user) {
      return null;
    }

    // Get account to retrieve tokens
    const accounts = await adapter.findAccounts({ userId: user.id });
    const account = accounts?.[0];

    // Return session in the expected format
    return {
      user: {
        id: user.id,
        name: user.name || "",
        username: (user as any).username || "",
        email: user.email || "",
        image: user.image || undefined,
        roles: (user as any).roles,
        organization_unit_code: (user as any).organization_unit_code,
        organization_unit_id: (user as any).organization_unit_id,
        supplier_id: (user as any).supplier_id,
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
