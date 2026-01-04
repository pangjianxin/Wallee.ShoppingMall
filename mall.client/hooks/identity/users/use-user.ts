import { useQuery } from "@tanstack/react-query";
import { userGet } from "@/openapi";
import { userGetQueryKey } from "@/openapi/@tanstack/react-query.gen";
export const useUser = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: userGetQueryKey({ path: { id: userId } }),
    queryFn: async () => {
      const { data } = await userGet({
        path: {
          id: userId,
        },
      });
      return data ?? null;
    },
  });
};
