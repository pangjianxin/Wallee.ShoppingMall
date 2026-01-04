export type VoloAbpHttpRemoteServiceErrorInfo = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  data?: object | null;
  validationErrors?: Array<VoloAbpHttpRemoteServiceValidationErrorInfo> | null;
};

export type VoloAbpHttpRemoteServiceErrorResponse = {
  error?: VoloAbpHttpRemoteServiceErrorInfo;
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
export function parseVoloAbpError(
  e: any
): string {
  // 首先检查是否是规范化后的错误对象
  if (e && typeof e === 'object') {
    // 检查 error.error.message（规范化错误）
    if (e.error?.message && typeof e.error.message === 'string' && e.error.message.trim() !== '') {
      return e.error.message;
    }
    
    // 检查 error.message（规范化错误或原始错误）
    if (e.message && typeof e.message === 'string' && e.message.trim() !== '') {
      return e.message;
    }

    // 检查 ABP 标准错误结构
    const abpError = e.error ?? e;
    
    if (
      abpError?.details &&
      typeof abpError.details === "string" &&
      abpError?.details.trim() !== ""
    ) {
      return abpError.details;
    }

    if (
      abpError?.message &&
      typeof abpError.message === "string" &&
      abpError.message.trim() !== ""
    ) {
      return abpError.message;
    }

    if (
      abpError?.validationErrors &&
      Array.isArray(abpError.validationErrors) &&
      abpError.validationErrors.length > 0
    ) {
      // Format validation errors
      const validationMessages = abpError.validationErrors
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

    // 检查 code 字段
    if (e.code && typeof e.code === 'string' && e.code.trim() !== '') {
      return e.code;
    }
  }

  // 如果 e 是字符串
  if (typeof e === 'string' && e.trim() !== '') {
    return e;
  }

  // If no meaningful error information found
  return "An unknown error occurred";
}
