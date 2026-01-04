import { useQuery } from "@tanstack/react-query";
import { userGetList } from "@/openapi";
import { userGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
/**
 * Custom hook to fetch a list of users.
 *
 * This hook uses the `useQuery` hook from `react-query` to fetch the user data
 * asynchronously. The query key used is `QueryNames.GetUsers` along with pagination,
 * filter, and sorting parameters.
 *
 * @param {number} pageIndex - The current page index.
 * @param {number} pageSize - The number of items per page.
 * @param {string} [filter] - Optional filter string.
 * @param {string} [sorting] - Optional sorting string.
 * @returns {UseQueryResult} The result of the query, which includes the user data and query status.
 */
export const useUsers = ({
  pageIndex,
  pageSize,
  filter,
  sorting,
}: {
  pageIndex: number;
  pageSize: number;
  filter?: string | undefined;
  sorting?: string | undefined;
}) => {
  return useQuery({
    queryKey: [
      userGetListQueryKey({
        query: {
          SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
          MaxResultCount: pageSize,
          Filter: filter,
          Sorting: sorting,
        },
      }),
    ],
    queryFn: async () => {
      const { data } = await userGetList({
        query: {
          SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
          MaxResultCount: pageSize,
          Filter: filter,
          Sorting: sorting,
        },
      });
      return data ?? null;
    },
  });
};
