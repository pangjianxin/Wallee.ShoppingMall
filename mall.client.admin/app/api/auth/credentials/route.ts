import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { DecodedJWT } from "@/types/auth-types";
import { createSession } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, captchaid, captchacode } = body;

    if (!username || !password || !captchaid || !captchacode) {
      return NextResponse.json(
        {
          error: "invalid_grant",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Call OpenIddict token endpoint
    const tokenResponse = await fetch(
      `${process.env.OPENIDDICT_INTERNAL_ISSUER}/connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: process.env.NEXTAUTH_CLIENT_ID || "",
          client_secret: process.env.NEXTAUTH_CLIENT_SECRET || "",
          username,
          password,
          captchaid,
          captchacode,
          scope: process.env.NEXTAUTH_SCOPE || "",
        }),
      }
    );

    const data = await tokenResponse.json();

    if (!tokenResponse.ok || !data.access_token) {
      // Handle error
      const errorDesc = data.error_description?.toLowerCase() || "";
      let errorCode = "invalid_grant";

      if (
        errorDesc.includes("username") ||
        errorDesc.includes("用户名") ||
        errorDesc.includes("password") ||
        errorDesc.includes("密码")
      ) {
        errorCode = "invalid_username_or_password";
      } else if (
        errorDesc.includes("captcha") ||
        errorDesc.includes("验证码")
      ) {
        errorCode = "invalid_captcha";
      }

      return NextResponse.json(
        {
          error: errorCode,
          message: data.error_description,
        },
        { status: 401 }
      );
    }

    // Create session with the tokens
    const session = await createSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      id_token: data.id_token,
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Credentials sign-in error:", error);
    return NextResponse.json(
      {
        error: "invalid_grant",
        message: "Authentication failed",
      },
      { status: 500 }
    );
  }
}
