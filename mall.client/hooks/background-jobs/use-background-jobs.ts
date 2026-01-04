import { backgroundJobGetList } from "@/openapi";
import { backgroundJobGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export const useBackgroundJobs = ({
  pageIndex,
  pageSize,
  filter,
  sorting = "creationTime desc",
}: {
  pageIndex: number;
  pageSize: number;
  filter?: string | undefined;
  sorting?: string | undefined;
}) => {
  const query = useQuery({
    queryKey: backgroundJobGetListQueryKey({
      query: {
        Sorting: sorting,
        MaxResultCount: pageSize,
        SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
        Filter: filter,
      },
    }),
    queryFn: async () => {
      const { data } = await backgroundJobGetList({
        query: {
          Sorting: sorting,
          MaxResultCount: pageSize,
          SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
          Filter: filter,
        },
      });
      return data ?? null;
    },
  });
  return query;
};
