import { toast } from "sonner";
import { parseVoloAbpError } from "@/lib/remote-error-parser";

interface ExecuteOperationOptions {
  /** 成功时显示的消息 */
  successMessage?: string;
  /** 错误时显示的消息前缀（实际错误信息会追加在后面） */
  errorMessagePrefix?: string;
  /** 是否使用丰富颜色 */
  richColors?: boolean;
  /** toast 描述 */
  description?: string;
  /** 操作完成后的回调函数 */
  onSuccess?: () => void | Promise<void>;
  /** 错误发生后的回调函数 */
  onError?: (error: any) => void;
  messagePosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

/**
 * 执行异步操作的工具函数
 * 提供统一的成功/错误处理和 toast 通知
 *
 * @param operation 要执行的异步操作
 * @param options 配置选项
 * @returns 操作的结果，如果出错则返回 undefined
 *
 * @example
 * ```tsx
 * const handleMarkAsRead = async () => {
 *   await executeOperation(
 *     () => notificationMessageMarkAsRead({ path: { id: message.id as string } }),
 *     {
 *       successMessage: "操作成功",
 *       onSuccess: () => queryClient.invalidateQueries(...)
 *     }
 *   );
 * };
 * ```
 */
export const executeOperation = async <T>(
  operation: () => Promise<T>,
  options: ExecuteOperationOptions = {}
): Promise<T | undefined> => {
  const {
    successMessage = "操作成功",
    errorMessagePrefix,
    richColors = true,
    description = "提示",
    onSuccess,
    onError,
  } = options;

  try {
    const result = await operation();

    // 显示成功通知
    toast.success(successMessage, {
      richColors,
      description,
      position: options.messagePosition,
    });

    // 执行成功回调
    if (onSuccess) {
      await onSuccess();
    }

    return result;
  } catch (error: any) {
    // 解析并显示错误
    const errorMessage = errorMessagePrefix
      ? `${errorMessagePrefix}: ${parseVoloAbpError(error)}`
      : parseVoloAbpError(error);

    toast.error(errorMessage, {
      richColors,
      description,
      position: options.messagePosition,
    });

    // 执行错误回调
    if (onError) {
      onError(error);
    }

    return undefined;
  }
};
