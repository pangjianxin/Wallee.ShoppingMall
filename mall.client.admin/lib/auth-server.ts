import { auth as betterAuthInstance, ExtendedSessionData, ExtendedUserData } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";
import { Session } from "better-auth";

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

    // Type-safe access to session and user data
    const session = sessionData.session as unknown as ExtendedSessionData;
    const user = sessionData.user as unknown as ExtendedUserData;

    // Return session in the expected format
    // Tokens should already be in session from customSession plugin
    return {
      user: {
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        image: sessionData.user.image || undefined,
        roles: user.roles,
        organization_unit_code: user.organization_unit_code,
        organization_unit_id: user.organization_unit_id,
        supplier_id: user.supplier_id,
      },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      idToken: session.idToken,
      expiresAt: session.expiresAt,
    } as any;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Export for compatibility
export const getSession = auth;
