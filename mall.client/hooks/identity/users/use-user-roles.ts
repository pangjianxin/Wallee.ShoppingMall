import { userGetRolesOptions } from "@/openapi/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { userGetRoles } from "@/openapi";

type UseUserRolesProps = {
  userId: string;
};

/**
 * Custom hook to fetch the roles of a specific user.
 *
 * This hook uses the `useQuery` hook from `react-query` to fetch the user roles
 * asynchronously. The query key used is `QueryNames.GetUserRoles` along with the user ID.
 *
 * @param {UseUserRolesProps} props - The properties object containing the user ID.
 * @returns {UseQueryResult} The result of the query, which includes the user roles data and query status.
 */
export const useUserRoles = ({ userId }: UseUserRolesProps) => {
  return useQuery({
    queryKey: ["userGetRoles", userId],
    queryFn: async () => {
      const { data } = await userGetRoles({
        path: {
          id: userId,
        },
      });
      return data ?? null;
    },
    staleTime: 0,
  });
};
