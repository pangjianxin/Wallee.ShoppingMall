/**
 * Custom session management for external JWT tokens
 * This implements a lightweight auth system that works with OpenIddict JWT tokens
 * while being compatible with better-auth client patterns
 */

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import type { DecodedJWT, Session, User } from "@/types/auth-types";

const SESSION_COOKIE_NAME = "app_session";
const TOKEN_COOKIE_NAME = "app_access_token";
const REFRESH_TOKEN_COOKIE_NAME = "app_refresh_token";
const ID_TOKEN_COOKIE_NAME = "app_id_token";

/**
 * Server-side function to get the current session
 * Use this in server components, API routes, and server actions
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    
    if (!accessToken) {
      return null;
    }

    // Decode JWT to check expiration
    const decoded = jwtDecode<DecodedJWT>(accessToken);
    
    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      // Token expired
      return null;
    }

    // Get other tokens
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
    const idToken = cookieStore.get(ID_TOKEN_COOKIE_NAME)?.value;

    // Build session from decoded JWT
    const user: User = {
      id: decoded.sub,
      name: decoded.preferred_username,
      username: decoded.preferred_username,
      email: decoded.email,
      image: "/images/avatar.jpg",
      roles: decoded.role,
      organization_unit_code: decoded.organization_unit_code,
      organization_unit_id: decoded.organization_unit_id,
      supplier_id: decoded.supplier_id,
    };

    return {
      user,
      accessToken,
      refreshToken,
      idToken,
      expiresAt: decoded.exp,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Alias for compatibility
export const auth = getSession;

/**
 * Create a new session (called after successful login)
 */
export async function createSession(tokens: {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
}): Promise<Session> {
  const decoded = jwtDecode<DecodedJWT>(tokens.access_token);
  
  const cookieStore = await cookies();
  
  // Set tokens in httpOnly cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };

  cookieStore.set(TOKEN_COOKIE_NAME, tokens.access_token, cookieOptions);
  cookieStore.set(SESSION_COOKIE_NAME, "true", cookieOptions);
  
  if (tokens.refresh_token) {
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refresh_token, cookieOptions);
  }
  
  if (tokens.id_token) {
    cookieStore.set(ID_TOKEN_COOKIE_NAME, tokens.id_token, cookieOptions);
  }

  const user: User = {
    id: decoded.sub,
    name: decoded.preferred_username,
    username: decoded.preferred_username,
    email: decoded.email,
    image: "/images/avatar.jpg",
    roles: decoded.role,
    organization_unit_code: decoded.organization_unit_code,
    organization_unit_id: decoded.organization_unit_id,
    supplier_id: decoded.supplier_id,
  };

  return {
    user,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: decoded.exp,
  };
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  cookieStore.delete(ID_TOKEN_COOKIE_NAME);
}
