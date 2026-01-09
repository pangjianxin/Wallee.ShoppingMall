import { NextPage } from "next";
import RoleList from "@/components/identity/roles/list";
import { roleGetList } from "@/openapi";
import { client } from "@/hey-api/client";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import {
  searchParamsCache,
  toPaginationQuery,
  toSortingQuery,
} from "@/lib/search-params-cache";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
type Props = {
  searchParams: Promise<SearchParams>;
};

const Page: NextPage<Props> = async ({ searchParams }) => {
  const search = await searchParams;
  const params = searchParamsCache().parse(search);

  const promise = roleGetList({
    client,
    query: {
      ...toPaginationQuery({ page: params.page, perPage: params.perPage }),
      ...toSortingQuery(params.sort),
      Filter: params.filters?.find((f) => f.id === "filter")?.value as string,
    },
  }).then(({ data, error }) => ({
    data,
    error,
    pageCount: data?.totalCount
      ? Math.ceil(data.totalCount / (params.perPage || 10))
      : 0,
  }));

  return (
    <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
      <RoleList promise={promise} />
    </Suspense>
  );
};

Page.displayName = "AdminRolesPage";

export default Page;
