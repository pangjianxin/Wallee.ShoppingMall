/**
 * Custom hook to fetch the application configuration using React Query.
 * It uses the `abpApplicationConfigurationGet` function to retrieve the configuration data.
 * The data is considered fresh for 1 hour (staleTime: 60 * 60 * 1000).
 */
import {
  abpApplicationConfigurationGet,
  VoloAbpAspNetCoreMvcApplicationConfigurationsApplicationConfigurationDto,
} from "@/openapi";
import { abpApplicationConfigurationGetQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useAppConfig = (): UseQueryResult<
  VoloAbpAspNetCoreMvcApplicationConfigurationsApplicationConfigurationDto | null,
  Error
> => {
  return useQuery({
    queryKey: [abpApplicationConfigurationGetQueryKey()],
    queryFn: async () => {
      const { data } = await abpApplicationConfigurationGet();
      return data ?? null;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
