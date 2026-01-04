import { useQuery } from "@tanstack/react-query";
import { auditLogGetList } from "@/openapi";
import { auditLogGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";

export const useAuditLogs = ({
  pageIndex,
  pageSize,
  sorting,
}: {
  pageIndex: number;
  pageSize: number;
  sorting?: string | undefined;
}) => {
  return useQuery({
    queryKey: [
      auditLogGetListQueryKey({
        query: {
          SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
          MaxResultCount: pageSize,
          Sorting: sorting,
        },
      }),
    ],
    queryFn: async () => {
      const { data } = await auditLogGetList({
        query: {
          SkipCount: pageIndex > 0 ? pageIndex * pageSize : 0,
          MaxResultCount: pageSize,
          Sorting: sorting,
        },
      });
      return data ?? null;
    },
  });
};
