import { useQuery } from "@tanstack/react-query";
import { productGetListOptions } from "@/openapi/@tanstack/react-query.gen";
import type { ProductGetListData } from "@/openapi";

type ProductListQuery = ProductGetListData["query"];

export const useProducts = (
  query?: ProductListQuery,
  {
    enabled = true,
    keepPreviousData = true,
    staleTime = 30_000,
  }: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    staleTime?: number;
  } = {}
) => {
  const queryOptions = productGetListOptions(query ? { query } : undefined);

  return useQuery({
    ...queryOptions,
    enabled,
    placeholderData: keepPreviousData ? (prev) => prev : undefined,
    staleTime,
  });
};
