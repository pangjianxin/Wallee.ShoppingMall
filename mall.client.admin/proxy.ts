import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// 公共路径白名单 - 无需认证即可访问
const PUBLIC_PATHS = [
  "/",
  "/account/login",
  "/account/register",
  "/account/forgot-password",
  "/account/reset-password",
];

// 公共路径前缀 - 以这些前缀开头的路径无需认证
const PUBLIC_PATH_PREFIXES: string[] = [];

/**
 * 检查路径是否为公共路径（无需认证）
 */
function isPublicPath(path: string): boolean {
  // 精确匹配公共路径
  if (PUBLIC_PATHS.includes(path)) {
    return true;
  }
  
  // 检查是否匹配公共路径前缀
  return PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 公共路径直接放行
  if (isPublicPath(path)) {
    return NextResponse.next();
  }
  
  // 获取用户会话
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // 未认证用户重定向到登录页
  // 注意: 这是乐观重定向，建议在每个页面/路由中进行额外的权限检查
  if (!session) {
    const loginUrl = new URL("/account/login", request.url);
    // 添加回调 URL，登录成功后返回原页面
    loginUrl.searchParams.set("cb", path);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|dashboard|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
