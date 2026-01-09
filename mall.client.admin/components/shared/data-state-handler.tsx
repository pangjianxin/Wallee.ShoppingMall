"use client";

import React from "react";
import LoadingState from "@/components/shared/loading";
import ErrorState from "@/components/shared/error";

export interface DataStateHandlerProps<T> {
  /**
   * 是否处于加载状态
   */
  isLoading?: boolean;

  /**
   * 是否发生错误
   */
  isError?: boolean;

  /**
   * 错误对象，通常包含 error.code 和 error.message
   */
  error?: any;

  /**
   * 数据对象，用于判断是否有内容
   */
  data?: T | null;

  /**
   * 加载状态时显示的标题
   */
  loadingTitle?: string;

  /**
   * 错误状态时显示的标题，如果不提供则使用 error.code
   */
  errorTitle?: string;

  /**
   * 错误状态时显示的描述，如果不提供则使用 error.message
   */
  errorDescription?: string;

  /**
   * 是否为空状态（通常在数据为空或 data.items?.length === 0 时为 true）
   */
  isEmpty?: boolean;

  /**
   * 空状态时显示的标题
   */
  emptyTitle?: string;

  /**
   * 空状态时显示的描述
   */
  emptyDescription?: string;

  /**
   * 空状态时的自定义内容
   */
  emptyContent?: React.ReactNode;

  /**
   * 错误状态时的自定义内容
   */
  errorContent?: React.ReactNode;

  /**
   * 内容渲染函数
   */
  children: React.ReactNode;
}

/**
 * 数据状态处理组件
 *
 * 统一处理数据加载、错误、空状态的展示逻辑
 *
 * @example
 * ```tsx
 * <DataStateHandler
 *   isLoading={isLoading}
 *   isError={isError}
 *   error={error}
 *   data={defs}
 *   isEmpty={defs?.items?.length === 0}
 *   loadingTitle="正在加载维修问题定义..."
 * >
 *   <div>Your content here</div>
 * </DataStateHandler>
 * ```
 */
export const DataStateHandler = React.forwardRef<
  HTMLDivElement,
  DataStateHandlerProps<any>
>(
  (
    {
      isLoading = false,
      isError = false,
      error,
      data,
      loadingTitle,
      errorTitle,
      errorDescription,
      isEmpty = false,
      emptyTitle,
      emptyDescription,
      emptyContent,
      errorContent,
      children,
    },
    ref
  ) => {
    // 1. 加载状态优先级最高
    if (isLoading) {
      return <LoadingState title={loadingTitle} />;
    }

    // 2. 错误状态
    if (isError) {
      return (
        <ErrorState
          title={
            errorTitle ||
            (error?.error?.code ? `${error.error.code}` : "错误")
          }
          description={
            errorDescription || error?.error?.message || "请稍后重试"
          }
        >
          {errorContent}
        </ErrorState>
      );
    }

    // 3. 检查数据是否存在
    if (!data) {
      return null;
    }

    // 4. 空状态
    if (isEmpty) {
      return (
        <ErrorState
          title={emptyTitle || "没有数据"}
          description={emptyDescription || "当前没有可显示的数据"}
        >
          {emptyContent}
        </ErrorState>
      );
    }

    // 5. 正常渲染内容
    return <div ref={ref}>{children}</div>;
  }
);

DataStateHandler.displayName = "DataStateHandler";
