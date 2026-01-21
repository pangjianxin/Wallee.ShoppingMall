import { Suspense } from "react";
import { ProductGrid } from "@/components/mobile/products/grid";
import { ProductSearchSheet } from "@/components/mobile/products/search-sheet";
import { productGetList } from "@/openapi";
import { client } from "@/hey-api/client";
import { SearchParams } from "nuqs";
import { NextPage } from "next";
import { nullsToUndefined } from "@/lib/utils";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

/**
 * 商品页面查询参数缓存配置
 * 使用 nuqs 的 searchParamsCache 模式
 */
export const searchParamsCache = createSearchParamsCache({
  // 分页参数
  SkipCount: parseAsInteger.withDefault(0),
  MaxResultCount: parseAsInteger.withDefault(20),
  // 排序参数
  Sorting: parseAsString.withDefault("creationTime desc"),
  // 商品名称过滤器
  "Name.Contains": parseAsString,
  "Name.StartsWith": parseAsString,
  "Name.EndsWith": parseAsString,
  "Name.Eq": parseAsString,
});

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page: NextPage<Props> = async ({ searchParams }) => {
  // 使用 searchParamsCache 解析和验证查询参数

  const parsedParams = searchParamsCache.parse(await searchParams);

  await productGetList({
    client,
    throwOnError: true,
    query: {
      ...nullsToUndefined(parsedParams),
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">商品列表</h1>
        <ProductSearchSheet />
      </div>
      <Suspense fallback={<div>加载中...</div>}>
        <ProductGrid />
      </Suspense>
    </div>
  );
};

Page.displayName = "ProductsPage";

export default Page;
