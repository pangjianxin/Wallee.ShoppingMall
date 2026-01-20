"use client";

import { ProductCard } from "@/components/mobile/products/product-card";
import EmptyState from "@/components/shared/empty";
import ErrorState from "@/components/shared/error";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/products/use-products";
import type { ProductGetListData } from "@/openapi";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

type Props = {
  query?: ProductGetListData["query"];
};

export function ProductGrid({ query }: Props) {
  const { data, isPending, isError, refetch } = useProducts(query, {
    keepPreviousData: true,
  });

  const items = data?.items ?? [];

  return (
    <div>
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
            <DataTableSkeleton columnCount={4} />
          ) : null}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
