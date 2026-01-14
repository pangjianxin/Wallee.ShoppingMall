import { auth as betterAuthInstance } from "@/lib/auth";
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

    // Return session in the expected format
    // Tokens should already be in session from customSession plugin
    return {
      user: {
        id: sessionData.user.id,
        name: sessionData.user.name || "",
        username: (sessionData.user as any).username || "",
        email: sessionData.user.email || "",
        image: sessionData.user.image || undefined,
        roles: (sessionData.user as any).roles,
        organization_unit_code: (sessionData.user as any).organization_unit_code,
        organization_unit_id: (sessionData.user as any).organization_unit_id,
        supplier_id: (sessionData.user as any).supplier_id,
      },
      accessToken: (sessionData.session as any)?.accessToken,
      refreshToken: (sessionData.session as any)?.refreshToken,
      idToken: (sessionData.session as any)?.idToken,
      expiresAt: (sessionData.session as any)?.expiresAt,
    } as any;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Export for compatibility
export const getSession = auth;
