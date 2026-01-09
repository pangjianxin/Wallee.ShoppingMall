import AuditLogs from "@/components/audit-logs/list";
import { client } from "@/hey-api/client";
import { auditLogGetList } from "@/openapi";
import {
  toPaginationQuery,
  toSortingQuery,
  toFiltersQuery,
} from "@/lib/search-params-cache";
import { type SearchParams } from "nuqs";
import { searchParamsCache } from "@/lib/search-params-cache";
import { FC, Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
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
  const promise = auditLogGetList({
    client,
    query: {
      ...toPaginationQuery({ page: search.page, perPage: search.perPage }),
      ...toSortingQuery(search.sort),
      ...toFiltersQuery(["ExecutionTime"], search.filters),
    },
  }).then((res) => ({
    data: res.data,
    error: res.error,
    pageCount: res.data?.totalCount
      ? Math.ceil(res.data.totalCount / (search.perPage || 10))
      : 0,
  }));
  return <AuditLogs promise={promise} />;
};

export default AuditLogsPage;
