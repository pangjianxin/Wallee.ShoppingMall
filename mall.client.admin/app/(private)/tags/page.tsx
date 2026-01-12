import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { SearchParams } from "nuqs";
import { FC, Suspense } from "react";
import {
  searchParamsCache,
  toFiltersQuery,
  toPaginationQuery,
  toSortingQuery,
} from "@/lib/search-params-cache";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { tagGetList } from "@/openapi";
import TagTable from "@/components/tags/list";

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

const Wrapper: FC<Props> = async ({ searchParams }) => {
  const search = await searchParamsCache().parse(searchParams);
  const promise = tagGetList({
    client,
    query: {
      ...toPaginationQuery(search),
      ...toSortingQuery(search.sort),
      ...toFiltersQuery(
        ["CreationTime", "LastModificationTime"],
        search.filters
      ),
    },
  }).then(({ data, error }) => ({
    data,
    error,
    pageCount: data?.totalCount
      ? Math.ceil(data.totalCount / (search.perPage || 10))
      : 0,
  }));

  return <TagTable promise={promise} />;
};

Page.displayName = "PrivateTagsPage";

export default Page;
