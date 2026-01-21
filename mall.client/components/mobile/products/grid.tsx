"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/mobile/products/product-card";
import EmptyState from "@/components/shared/empty";
import ErrorState from "@/components/shared/error";
import { Button } from "@/components/ui/button";
import { MobilePagination } from "@/components/mobile/query-builder/pagination";
import { productGetListOptions } from "@/openapi/@tanstack/react-query.gen";
import type { ProductGetListResponse } from "@/openapi";

import { generateNuqsParsers, parseQueryFromConfig } from "@/lib/query-builder/parser";
import { productQueryConfig, type ProductQuery } from "@/lib/query-builder/config";
import { useProducts } from "@/hooks/products/use-products";

type ProductGridProps = {
  /**
   * 可选的服务端数据 Promise
   * 如果提供，组件将使用 useSuspenseQuery 从服务端预取的数据
   * 如果不提供，将使用客户端查询
   */
  dataPromise?: Promise<ProductGetListResponse>;
};

/**
 * 商品网格展示组件（客户端组件）
 * 支持服务端数据预取或客户端实时查询
 */
export function ProductGrid({ dataPromise }: ProductGridProps = {}) {
  // 生成 nuqs 解析器
  const parsers = useMemo(() => generateNuqsParsers(productQueryConfig), []);
  
  // 从 URL 读取查询参数
  const [urlParams] = useQueryStates(parsers);
  
  // 解析为 query 对象
  const query = useMemo(
    () => parseQueryFromConfig<ProductQuery>(urlParams, productQueryConfig),
    [urlParams]
  );
  
  // 根据是否有 dataPromise 选择数据获取方式
  const clientQuery = useProducts(query, {
    keepPreviousData: true,
    enabled: !dataPromise, // 如果有服务端数据，禁用客户端查询
  });

  // 如果提供了 dataPromise，使用 useSuspenseQuery
  const serverQuery = dataPromise
    ? useSuspenseQuery({
        ...productGetListOptions(query ? { query } : undefined),
      })
    : null;

  // 选择使用哪个查询结果
  const { data, isPending, isError, refetch } = serverQuery || clientQuery;
  
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  console.log("Grid Debug:", {
    totalCount,
    maxResultCount: query?.MaxResultCount,
    itemsLength: items.length,
    hasError: !!isError,
  });

  return (
    <div className="mb-[--footer-height]">
      {isError ? (
        <ErrorState title="加载失败" description="商品列表获取失败，请重试。">
          <Button variant="secondary" onClick={() => refetch()}>
            重试
          </Button>
        </ErrorState>
      ) : items.length === 0 && !isPending ? (
        <EmptyState
          title="暂无商品"
          description="当前条件下没有可展示的商品。"
        />
      ) : (
        <>
          {isPending && items.length === 0 ? (
            <SkeletonPlaceholder columnCount={4} />
          ) : null}
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* 分页组件 */}
          {totalCount > 0 && (
            <MobilePagination
              totalCount={totalCount}
              pageSize={query?.MaxResultCount}
            />
          )}
        </>
      )}
    </div>
  );
}

/**
 * 骨架屏占位组件
 */
function SkeletonPlaceholder({ columnCount }: { columnCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: columnCount * 2 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
