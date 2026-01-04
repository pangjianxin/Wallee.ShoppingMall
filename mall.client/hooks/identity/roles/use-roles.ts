import { useQuery } from "@tanstack/react-query";
import { roleGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { roleGetList } from "@/openapi";
import { useMemo } from "react";

export const useRoles = ({
  page,
  perPage,
  filter,
  sort,
}: {
  page: number;
  perPage: number;
  filter?: string | undefined;
  sort?: string | undefined;
}) => {
  const query = useMemo(
    () => ({
      MaxResultCount: perPage,
      SkipCount: page > 0 ? page * perPage : 0,
      Filter: filter,
      Sorting: sort,
    }),
    [page, perPage, filter, sort]
  );
  return useQuery({
    queryKey: [
      roleGetListQueryKey({
        query: query,
      }),
    ],
    queryFn: async () => {
      const { data } = await roleGetList({
        query: query,
      });
      return data ?? null;
    },
    placeholderData: (prev) => prev,
  });
};
