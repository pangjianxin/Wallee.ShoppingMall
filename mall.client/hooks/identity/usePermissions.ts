import { VoloAbpPermissionManagementGetPermissionListResultDto } from "@/openapi";
import { permissionsGetOptions } from "@/openapi/@tanstack/react-query.gen";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch permissions based on provider name and provider key.
 *
 * @param providerName - The name of the provider.
 * @param providerKey - The key of the provider.
 * @returns A `UseQueryResult` containing the permission list result.
 */
export const usePermissions = (
  providerName: string | undefined,
  providerKey: string | undefined
): UseQueryResult<
  VoloAbpPermissionManagementGetPermissionListResultDto,
  Error
> => {
  return useQuery(
    permissionsGetOptions({
      query: {
        providerName: providerName,
        providerKey: providerKey,
      },
    })
  );
};
