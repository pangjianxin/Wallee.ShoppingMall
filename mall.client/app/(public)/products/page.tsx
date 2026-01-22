import { FC, Suspense } from "react";
import { ProductGrid } from "@/components/mobile/products/grid";
import { productGetList } from "@/openapi";
import { client } from "@/hey-api/client";
import { SearchParams } from "nuqs";
import { NextPage } from "next";
import { productsSearchParamsCache } from "@/lib/nuqs";
import { SkeletonCard } from "@/components/shared/skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page: NextPage<Props> = ({ searchParams }) => {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <Wrapper searchParams={searchParams} />
    </Suspense>
  );
};

const Wrapper: FC<Props> = async ({ searchParams }) => {
  const search = await productsSearchParamsCache.parse(searchParams);
  const promise = productGetList({
    client,
    query: {
      SkipCount: search.SkipCount,
      MaxResultCount: search.MaxResultCount,
      Sorting: search.Sorting,
      "Name.Contains": search["Name.Contains"] || undefined,
    },
  }).then(({ data, error }) => ({
    data,
    error,
    pageSize: search.MaxResultCount,
  }));

  return <ProductGrid promise={promise} />;
};

Page.displayName = "ProductsPage";

export default Page;
