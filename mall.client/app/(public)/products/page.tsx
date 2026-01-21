import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProductGrid } from "@/components/mobile/products/grid";
import { ProductSearchSheet } from "@/components/mobile/products/search-sheet";
import { parseQueryFromConfig } from "@/lib/query-builder/parser";
import { productQueryConfig, type ProductQuery } from "@/lib/query-builder/config";
import { productGetList } from "@/openapi";
import { getQueryClient } from "@/lib/tanstack-query-provider";
import { productGetListOptions } from "@/openapi/@tanstack/react-query.gen";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  // 解析 URL 查询参数
  const params = await searchParams;
  const query = parseQueryFromConfig<ProductQuery>(params, productQueryConfig);

  // 在服务端预取数据
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    productGetListOptions(query ? { query } : undefined)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">商品列表</h1>
          <ProductSearchSheet />
        </div>
        <Suspense fallback={<div>加载中...</div>}>
          <ProductGrid />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default ProductsPage;
