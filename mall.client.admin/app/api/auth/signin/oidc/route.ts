import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Build authorization URL
  const authUrl = new URL(
    `${process.env.OPENIDDICT_EXTERNAL_ISSUER}/connect/authorize`
  );

  authUrl.searchParams.set("client_id", process.env.NEXTAUTH_CLIENT_ID || "");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", process.env.NEXTAUTH_SCOPE || "openid profile email");
  authUrl.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/callback/oidc`);
  authUrl.searchParams.set("state", callbackUrl);

  // Redirect to OIDC provider
  return NextResponse.redirect(authUrl.toString());
}
