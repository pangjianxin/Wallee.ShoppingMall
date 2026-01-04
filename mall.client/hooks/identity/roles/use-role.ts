import { useQuery } from "@tanstack/react-query";
import { roleGetQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { roleGet } from "@/openapi";

export const useRole = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: roleGetQueryKey({ path: { id } }),
    queryFn: async () => {
      const { data } = await roleGet({
        path: { id },
      });
      return data ?? null;
    },
  });
};
