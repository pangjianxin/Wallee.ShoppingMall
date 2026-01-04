import {
  createSearchParamsCache,
  parseAsInteger,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

export const searchParamsCache = <TData>() => {
  return createSearchParamsCache({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<TData>().withDefault([]),
    // advanced filter
    filters: getFiltersStateParser().withDefault([]),
  });
};
