import BackgroundJobTable from "@/components/background-jobs/list";
import { NextPage } from "next";
import {
  toPaginationQuery,
  toFiltersQuery,
  toSortingQuery,
} from "@/lib/search-params-cache";
import { client } from "@/hey-api/client";
import { backgroundJobGetList } from "@/openapi";
import { SearchParams } from "nuqs";
import { searchParamsCache } from "@/lib/search-params-cache";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page: NextPage<Props> = ({ searchParams }) => {
  return (
    <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
      <Wrapper searchParams={searchParams} />
    </Suspense>
  );
};

const Wrapper = async ({ searchParams }: Props) => {
  const params = await searchParamsCache().parse(searchParams);
  const backgroundJobsPromise = backgroundJobGetList({
    client,
    query: {
      ...toPaginationQuery({ page: params.page, perPage: params.perPage }),
      ...toSortingQuery(params.sort),
      ...toFiltersQuery([], params.filters),
    },
  }).then(({ data, error }) => ({
    data,
    error,
    pageCount: data?.totalCount
      ? Math.ceil(data.totalCount / (params.perPage || 10))
      : 0,
  }));
  return <BackgroundJobTable promise={backgroundJobsPromise} />;
};

Page.displayName = "AdminBackgroundJobsPage";

export default Page;
