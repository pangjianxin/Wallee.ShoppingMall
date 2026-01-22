"use client";
import { use } from "react";
import { ProductCard } from "@/components/mobile/products/product-card";
import { MobilePagination } from "@/components/shared/pagination";
import type { VoloAbpApplicationDtosPagedResultDtoOfProductDto } from "@/openapi";
import { ProductSearchSheet } from "@/components/mobile/products/search-sheet";
import { MobilePageHeader } from "@/components/mobile/sections/page-header";
import ErrorState from "@/components/shared/error";
type ProductGridProps = {
  /**
   * 可选的服务端数据 Promise
   * 如果提供，组件将使用 useSuspenseQuery 从服务端预取的数据
   * 如果不提供，将使用客户端查询
   */
  promise: Promise<{
    data: VoloAbpApplicationDtosPagedResultDtoOfProductDto | undefined;
    error: unknown;
    pageSize?: number;
  }>;
};

/**
 * 商品网格展示组件（客户端组件）
 * 支持服务端数据预取或客户端实时查询
 */
export function ProductGrid({ promise }: ProductGridProps) {
  // 如果提供了 promise，使用 useSuspenseQuery
  const { data, error, pageSize } = use(promise);
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (error) {
    return (
      <ErrorState
        title="加载商品失败"
        description="获取商品列表时发生错误，请稍后重试。"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <MobilePageHeader
          title="商品列表"
          subtitle="发现心仪的商品,或者点击商品标题查看详情"
          rightChildren={<ProductSearchSheet />}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalCount > 0 && (
        <MobilePagination totalCount={totalCount} pageSize={pageSize} />
      )}
    </div>
  );
}
