import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { ExtendedColumnFilter, ExtendedColumnSort } from "@/types/data-table";
import { format } from "date-fns";

const formatDateParam = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return undefined;
  const date = new Date(Number(value));
  return Number.isNaN(date.getTime()) ? undefined : format(date, "yyyy-MM-dd");
};

export const searchParamsCache = () =>
  createSearchParamsCache({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser().withDefault([]),
    // advanced filter
    filters: getFiltersStateParser().withDefault([]),
    joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  });

// Shared helpers to transform parsed params to API query payloads.
export const toPaginationQuery = ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => ({
  SkipCount: Math.max(0, perPage * (page - 1)),
  MaxResultCount: perPage,
});

export const toSortingQuery = <TData>(sort: ExtendedColumnSort<TData>[]) => ({
  Sorting: sort
    .map((item) => `${item.id} ${item.desc ? "DESC" : "ASC"}`)
    .join(","),
});

export const toFiltersQuery = (
  fields: string[],
  filters?: ExtendedColumnFilter<any>[] | undefined
) => {
  const query: Record<string, any> = {};

  fields.forEach((field) => {
    const filter = filters?.find(
      (f) => f.id?.toLowerCase() === field.toLowerCase()
    );

    if (!filter) return;

    const operator = filter.operator as string;
    const operatorKey = `${field}.${operator}`;
    const variant = filter.variant;

    // isEmpty/isNotEmpty 操作符不需要值
    if (operator === "IsEmpty" || operator === "IsNotEmpty") {
      query[operatorKey] = true;
      return;
    }

    // 检查值是否为空（根据不同类型有不同的空值判断）
    const isEmpty = (value: any): boolean => {
      if (value === null || value === undefined) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    };

    if (isEmpty(filter.value)) return;

    switch (variant) {
      case "boolean": {
        // 处理布尔类型的过滤器值
        const booleanValue = Boolean(filter.value);
        query[operatorKey] = booleanValue;
        break;
      }
      case "number": {
        // 处理数字类型的过滤器值
        const numberValue = Number(filter.value);
        if (Number.isNaN(numberValue)) return;
        query[operatorKey] = numberValue;
        break;
      }
      case "date": {
        // 处理日期类型的过滤器值
        const timestamp = Number(filter.value);
        if (Number.isNaN(timestamp)) return;
        const date = format(new Date(timestamp), "yyyy-MM-dd");
        query[operatorKey] = date;
        break;
      }
      case "dateRange": {
        // 处理日期范围类型的过滤器值
        if (!Array.isArray(filter.value)) return;
        const [min, max] = filter.value;
        const minDate = formatDateParam(min);
        const maxDate = formatDateParam(max);
        if (minDate) query[`${field}.Min`] = minDate;
        if (maxDate) query[`${field}.Max`] = maxDate;
        break;
      }
      case "text": {
        const textValue = String(filter.value).trim();
        if (textValue === "") return;
        query[operatorKey] = textValue;
        break;
      }
      case "select": {
        const selectValue = String(filter.value).trim();
        if (selectValue === "") return;
        query[operatorKey] = selectValue;
        break;
      }
      case "multiSelect": {
        if (!Array.isArray(filter.value)) return;
        const multiSelectValues = filter.value
          .map((v) => String(v).trim())
          .filter((v) => v !== "");
        if (multiSelectValues.length === 0) return;
        query[operatorKey] = multiSelectValues;
        break;
      }
      case "range": {
        if (!Array.isArray(filter.value)) return;
        const rangeValues = filter.value.map((v) => Number(v));
        if (rangeValues.some((v) => Number.isNaN(v))) return;
        query[operatorKey] = rangeValues;
        break;
      }
      default: {
        // 默认情况，直接使用原始值
        query[operatorKey] = filter.value;
        break;
      }
    }
  });

  return query;
};
