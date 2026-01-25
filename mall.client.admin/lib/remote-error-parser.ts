export type VoloAbpHttpRemoteServiceErrorInfo = {
  error?: {
    message?: string | null;
    code?: string | number | null;
    originalError?: {
      error?: {
        code?: string | number | null;
        message?: string | null;
        details?: string | null;
        data?: object | null;
        validationErrors?: Array<VoloAbpHttpRemoteServiceValidationErrorInfo> | null;
      } | null;
    } | null;
  } | null;
};

export type VoloAbpHttpRemoteServiceValidationErrorInfo = {
  message?: string | null;
  members?: Array<string> | null;
};

/**
 * Parses an error response from Volo ABP HTTP remote service
 * Prioritizes: details -> message -> validationErrors -> error.message -> code
 * @param error The error object to parse
 * @returns A formatted error message string
 */
export function parseVoloAbpError(e: any): string {
  const pickMessage = (source: any): string | null => {
    if (!source || typeof source !== "object") return null;

    if (
      source.details &&
      typeof source.details === "string" &&
      source.details.trim() !== ""
    ) {
      return source.details;
    }

    if (
      source.message &&
      typeof source.message === "string" &&
      source.message.trim() !== ""
    ) {
      return source.message;
    }

    if (
      source.validationErrors &&
      Array.isArray(source.validationErrors) &&
      source.validationErrors.length > 0
    ) {
      const validationMessages = source.validationErrors
        .filter((ve: any) => ve.message)
        .map((ve: any) => {
          const message = ve.message || "";
          const members =
            ve.members && ve.members.length > 0
              ? ` (${ve.members.join(", ")})`
              : "";
          return `${message}${members}`;
        });

      if (validationMessages.length > 0) {
        return validationMessages.join("\n");
      }
    }

    if (source.code !== undefined && source.code !== null) {
      const code = String(source.code).trim();
      if (code !== "") return code;
    }

    return null;
  };

  const findOriginalErrorInfo = (source: any) => {
    return source?.error?.originalError?.error ?? source?.originalError?.error;
  };

  // 首先检查是否是规范化后的错误对象
  if (e && typeof e === 'object') {
    // 优先输出最内层的 message
    if (
      e.error?.originalError?.error?.message &&
      typeof e.error.originalError.error.message === "string" &&
      e.error.originalError.error.message.trim() !== ""
    ) {
      return e.error.originalError.error.message;
    }

    // 检查 error.error.message（规范化错误）
    if (
      e.error?.message &&
      typeof e.error.message === "string" &&
      e.error.message.trim() !== ""
    ) {
      return e.error.message;
    }

    // 检查 error.message（规范化错误或原始错误）
    if (e.message && typeof e.message === "string" && e.message.trim() !== "") {
      return e.message;
    }

    // 检查 ABP 标准错误结构
    const abpError = e.error ?? e;

    const abpMessage = pickMessage(abpError);
    if (abpMessage) return abpMessage;

    // 检查 originalError 链路
    const originalError = findOriginalErrorInfo(e);
    const originalMessage = pickMessage(originalError);
    if (originalMessage) return originalMessage;
  }

  // 如果 e 是字符串
  if (typeof e === 'string' && e.trim() !== '') {
    return e;
  }

  // If no meaningful error information found
  return "An unknown error occurred";
}
