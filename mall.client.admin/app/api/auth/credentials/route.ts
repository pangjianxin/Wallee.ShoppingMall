import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { DecodedJWT } from "@/types/next-auth";
import { auth } from "@/lib/auth";

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
    const response = await fetch(
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

    const data = await response.json();

    if (!response.ok || !data.access_token) {
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

    // Decode JWT to get user info
    const decodedJWT = jwtDecode<DecodedJWT>(data.access_token);

    // Create or update user in better-auth database using the internal adapter
    const adapter = auth.options.database.adapter;
    
    // Check if user exists
    let user = await adapter.findUserByEmail(
      decodedJWT.email || `${decodedJWT.sub}@local.user`
    );

    if (!user) {
      // Create new user
      user = await adapter.createUser({
        id: decodedJWT.sub,
        name: decodedJWT.preferred_username,
        email: decodedJWT.email || `${decodedJWT.sub}@local.user`,
        emailVerified: false,
        image: "/images/avatar.jpg",
        username: decodedJWT.preferred_username,
        roles: typeof decodedJWT.role === "string" 
          ? decodedJWT.role 
          : JSON.stringify(decodedJWT.role),
        organization_unit_code: decodedJWT.organization_unit_code,
        organization_unit_id: decodedJWT.organization_unit_id,
        supplier_id: decodedJWT.supplier_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing user
      user = await adapter.updateUser(user.id, {
        name: decodedJWT.preferred_username,
        username: decodedJWT.preferred_username,
        roles: typeof decodedJWT.role === "string" 
          ? decodedJWT.role 
          : JSON.stringify(decodedJWT.role),
        organization_unit_code: decodedJWT.organization_unit_code,
        organization_unit_id: decodedJWT.organization_unit_id,
        supplier_id: decodedJWT.supplier_id,
        updatedAt: new Date(),
      });
    }

    // Create session
    const session = await adapter.createSession({
      userId: user.id,
      expiresAt: new Date(decodedJWT.exp * 1000),
    });

    // Create or update account with tokens
    const existingAccounts = await adapter.findAccounts({ userId: user.id });
    const existingAccount = existingAccounts.find((acc: any) => acc.providerId === "credentials");

    if (existingAccount) {
      await adapter.updateAccount(existingAccount.id, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
        expiresAt: decodedJWT.exp,
      });
    } else {
      await adapter.createAccount({
        userId: user.id,
        providerId: "credentials",
        providerAccountId: decodedJWT.sub,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
        expiresAt: decodedJWT.exp,
      });
    }

    // Set session cookie
    const cookieValue = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: "", // Not used, we're bypassing email/password
      },
      asResponse: true,
    });

    // Actually, we need to set the cookie manually since we can't use signInEmail
    // Let's use the session token
    const response = NextResponse.json({
      success: true,
      user,
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });

    // Set the session cookie
    response.cookies.set({
      name: "better-auth.session_token",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
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
