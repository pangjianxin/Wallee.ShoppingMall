import {
  toPaginationQuery,
  toFiltersQuery,
  toSortingQuery,
} from "@/lib/search-params-cache";
import { type SearchParams } from "nuqs";
import { searchParamsCache } from "@/lib/search-params-cache";
import { FC, Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ProductGrid } from "@/components/mobile/products/product-grid";
import type { ProductGetListData } from "@/openapi";
type Props = {
  searchParams: Promise<SearchParams>;
};
const AuditLogsPage = async ({ searchParams }: Props) => {
  return (
    <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
      <Wrapper searchParams={searchParams} />
    </Suspense>
  );
};

const Wrapper: FC<{ searchParams: Promise<SearchParams> }> = async ({
  searchParams,
}) => {
  const search = await searchParamsCache().parse(searchParams);

  const query: ProductGetListData["query"] = {
    ...toPaginationQuery({ page: search.page, perPage: search.perPage }),
    ...toSortingQuery(search.sort),
    ...toFiltersQuery(["ExecutionTime"], search.filters),
  };

  return <ProductGrid query={query} />;
};

export default AuditLogsPage;
