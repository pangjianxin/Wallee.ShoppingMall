import { VoloAbpAccountProfileDto } from "@/openapi";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { profileGetOptions } from "@/openapi/@tanstack/react-query.gen";

/**
 * Custom hook to fetch the user's profile data.
 *
 * This hook uses the `useQuery` hook from `react-query` to fetch the profile data
 * asynchronously. The query key used is `QueryNames.GetProfile` and the query function
 * is `profileGet`.
 *
 * @returns {UseQueryResult<ProfileDto, unknown>} The result of the query, which includes
 * the profile data and query status.
 */
export const useProfile = (): UseQueryResult<
  VoloAbpAccountProfileDto,
  unknown
> => {
  return useQuery(profileGetOptions({ baseUrl: "/gateway" }));
};
