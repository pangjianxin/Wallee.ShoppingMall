import { auth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";
const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL;

function logAuthState(method: string, path: string, token?: string) {
  const tokenHint = token ? `${token.slice(0, 8)}...` : "<missing>";
  console.log(`[api-proxy] ${method} ${path} token=${tokenHint}`);
}

/**
 * 标准错误消息映射
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: "请求参数错误",
  401: "登录信息已过期，请重新登录",
  403: "您没有权限执行此操作",
  404: "请求的资源不存在",
  409: "请求冲突，请重试",
  422: "请求数据验证失败",
  500: "服务器内部错误，请稍后重试",
  502: "网关错误，请稍后重试",
  503: "服务暂时不可用，请稍后重试",
  504: "网关超时，请稍后重试",
};

/**
 * 处理错误响应，返回统一格式的错误信息
 */
async function handleErrorResponse(
  response: Response,
  customMessage?: string
): Promise<Response> {
  const status = response.status;
  const message =
    customMessage || ERROR_MESSAGES[status] || `请求失败 (${status})`;

  // 尝试读取原始响应体
  let originalError: any = null;
  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      originalError = await response.json();
    } else {
      originalError = await response.text();
    }
  } catch {
    // 如果读取失败，忽略
  }

  // 返回统一格式的错误响应
  return NextResponse.json(
    {
      error: {
        message,
        code: status,
        originalError,
      },
    },
    { status }
  );
}

/**
 * 检查是否为错误状态码
 */
function isErrorStatus(status: number): boolean {
  return status >= 400;
}

/**
 * Handles GET requests by forwarding them to an external API.
 * Retrieves the current session and uses the access token for authorization.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {Promise<Response>} - The response from the external API or an error response.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${EXTERNAL_API_URL}${path}${search}`;

  logAuthState("GET", path, session?.accessToken);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (isErrorStatus(response.status)) {
      return handleErrorResponse(response);
    }

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: "网络请求失败，请检查网络连接",
          originalError: e instanceof Error ? e.message : String(e),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests by forwarding them to an external API.
 * Retrieves the current session and uses the access token for authorization.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {Promise<Response>} - The response from the external API.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${EXTERNAL_API_URL}${path}${search}`;

  logAuthState("POST", path, session?.accessToken);

  const contentType = request.headers.get("Content-Type") || "application/json";
  let body: FormData | string;
  const headers: HeadersInit = {
    Authorization: `Bearer ${session?.accessToken}`,
  };

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const newFormData = new FormData();
    formData.forEach((value, key) => {
      newFormData.append(key, value);
    });
    body = newFormData;
    // Do not set Content-Type header for FormData, browser will set it automatically
  } else {
    try {
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    } catch {
      body = JSON.stringify({});
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (isErrorStatus(response.status)) {
      return handleErrorResponse(response);
    }

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: "网络请求失败，请检查网络连接",
          originalError: e instanceof Error ? e.message : String(e),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests by forwarding them to an external API.
 * Retrieves the current session and uses the access token for authorization.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {Promise<Response>} - The response from the external API.
 */
export async function PUT(request: NextRequest): Promise<Response> {
  const session = await auth();
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${EXTERNAL_API_URL}${path}${search}`;

  logAuthState("PUT", path, session?.accessToken);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: request.body,
      duplex: "half",
    } as RequestInit);

    if (isErrorStatus(response.status)) {
      return handleErrorResponse(response);
    }

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: "网络请求失败，请检查网络连接",
          originalError: e instanceof Error ? e.message : String(e),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests by forwarding them to an external API.
 * Retrieves the current session and uses the access token for authorization.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {Promise<Response>} - The response from the external API.
 */
export async function DELETE(request: NextRequest): Promise<Response> {
  const session = await auth();
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${EXTERNAL_API_URL}${path}${search}`;

  logAuthState("DELETE", path, session?.accessToken);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (isErrorStatus(response.status)) {
      return handleErrorResponse(response);
    }

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: {
          message: "网络请求失败，请检查网络连接",
          originalError: e instanceof Error ? e.message : String(e),
        },
      },
      { status: 500 }
    );
  }
}
