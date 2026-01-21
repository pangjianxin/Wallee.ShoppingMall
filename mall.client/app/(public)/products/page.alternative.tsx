/**
 * 这是使用 nuqs searchParamsCache 模式的替代实现示例
 * 
 * 与当前 page.tsx 的区别：
 * 1. 使用 createSearchParamsCache 定义查询参数
 * 2. 自动处理参数验证和默认值
 * 3. 更简洁的类型推断
 */

import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProductGrid } from "@/components/mobile/products/grid";
import { ProductSearchSheet } from "@/components/mobile/products/search-sheet";
import { searchParamsCache } from "./search-params";
import { getQueryClient } from "@/lib/tanstack-query-provider";
import { productGetListOptions } from "@/openapi/@tanstack/react-query.gen";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ProductsPageAlternative = async ({ searchParams }: ProductsPageProps) => {
  // 使用 searchParamsCache 解析和验证查询参数
  const params = await searchParams;
  const parsedParams = searchParamsCache.parse(params);

  // 构建 API 查询对象
  const query = {
    SkipCount: parsedParams.SkipCount,
    MaxResultCount: parsedParams.MaxResultCount,
    Sorting: parsedParams.Sorting,
    ...(parsedParams["Name.Contains"] && {
      "Name.Contains": parsedParams["Name.Contains"],
    }),
    ...(parsedParams["Name.StartsWith"] && {
      "Name.StartsWith": parsedParams["Name.StartsWith"],
    }),
    ...(parsedParams["Name.EndsWith"] && {
      "Name.EndsWith": parsedParams["Name.EndsWith"],
    }),
    ...(parsedParams["Name.Eq"] && {
      "Name.Eq": parsedParams["Name.Eq"],
    }),
  };

  // 在服务端预取数据
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(productGetListOptions({ query }));

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

export default ProductsPageAlternative;
