import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // 排除静态资源、根路径和特定路径
  if (
    pathname === "/" ||
    pathname.startsWith("/images/") ||
    /\.(jpg|jpeg|png|gif|svg|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const isLoginPage = pathname === "/account/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/account/login", nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|dashboard|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};