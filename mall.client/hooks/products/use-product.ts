import { useQuery } from "@tanstack/react-query";
import { productGetOptions } from "@/openapi/@tanstack/react-query.gen";

export const useProduct = ({
  id,
  keepPreviousData = true,
  staleTime = 30_000,
}: {
  id: string;
  keepPreviousData?: boolean;
  staleTime?: number;
}) => {
  const queryOptions = productGetOptions({ path: { id } });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData ? (prev) => prev : undefined,
    staleTime,
  });
};
