import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/";
  const error = searchParams.get("error");

  if (error) {
    // Handle error from OIDC provider
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/account/login?error=${error}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/account/login?error=invalid_grant`
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(
      `${process.env.OPENIDDICT_INTERNAL_ISSUER}/connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.NEXTAUTH_CLIENT_ID || "",
          client_secret: process.env.NEXTAUTH_CLIENT_SECRET || "",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/oidc`,
        }),
      }
    );

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || !tokens.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/account/login?error=invalid_grant`
      );
    }

    // Create session
    await createSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      id_token: tokens.id_token,
    });

    // Redirect to callback URL
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}${state}`);
  } catch (error) {
    console.error("OIDC callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/account/login?error=invalid_grant`
    );
  }
}
