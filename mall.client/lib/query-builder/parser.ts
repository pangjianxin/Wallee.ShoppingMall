import {
  type SearchParams,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
  createSearchParamsCache,
} from "nuqs/server";
import type { BaseQueryParams, QueryConfig } from "@/lib/query-builder/types";
import { DEFAULT_QUERY_VALUES } from "@/lib/query-builder/types";

/**
 * 根据字段配置解析查询参数
 * @param searchParams URL 查询参数
 * @param config 查询配置
 * @returns 解析后的查询对象
 */
export function parseQueryFromConfig<T extends BaseQueryParams>(
  searchParams: SearchParams,
  config: QueryConfig,
): T {
  const query: any = {};
  // 获取默认值
  const defaults = config.defaults || {};
  // 解析通用的基础参数（分页和排序），使用默认值
  if (searchParams.SkipCount !== undefined) {
    const skip = Number(searchParams.SkipCount);
    if (!isNaN(skip)) query.SkipCount = skip;
  } else if (defaults.skipCount !== undefined) {
    query.SkipCount = defaults.skipCount;
  } else {
    query.SkipCount = DEFAULT_QUERY_VALUES.skipCount;
  }

  if (searchParams.MaxResultCount !== undefined) {
    const max = Number(searchParams.MaxResultCount);
    if (!isNaN(max)) query.MaxResultCount = max;
  } else if (defaults.maxResultCount !== undefined) {
    query.MaxResultCount = defaults.maxResultCount;
  } else {
    query.MaxResultCount = DEFAULT_QUERY_VALUES.maxResultCount;
  }

  if (searchParams.Sorting) {
    query.Sorting = String(searchParams.Sorting);
  } else if (defaults.sorting) {
    query.Sorting = defaults.sorting;
  }

  // 解析每个字段的操作符
  for (const field of config.fields) {
    const fieldName = field.name;

    // 根据字段类型和操作符解析
    if (field.type === "string") {
      const operators = field.operators || ["Contains"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        const value = searchParams[key];

        if (value !== undefined && value !== null && value !== "") {
          if (
            operator === "IsNull" ||
            operator === "IsNotNull" ||
            operator === "IsEmpty" ||
            operator === "IsNotEmpty"
          ) {
            query[key] = value === "true";
          } else {
            query[key] = String(value);
          }
        }
      }
    } else if (field.type === "number" || field.type === "enum") {
      const operators = field.operators || ["Eq"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        const value = searchParams[key];

        if (value !== undefined && value !== null && value !== "") {
          if (operator === "IsNull" || operator === "IsNotNull") {
            query[key] = value === "true";
          } else {
            const num = Number(value);
            if (!isNaN(num)) {
              query[key] = num;
            }
          }
        }
      }
    } else if (field.type === "boolean") {
      const value = searchParams[fieldName];
      if (value !== undefined && value !== null && value !== "") {
        query[fieldName] = value === "true";
      }
    } else if (field.type === "date") {
      const operators = field.operators || ["Eq"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        const value = searchParams[key];

        if (value !== undefined && value !== null && value !== "") {
          query[key] = String(value);
        }
      }
    }
  }
  return query as T;
}

/**
 * 从查询配置生成 nuqs 解析器配置
 * @param config 查询配置
 * @returns nuqs 解析器配置对象
 */
export function generateNuqsParsers(config: QueryConfig) {
  const parsers: Record<string, any> = {};

  // 添加基础参数解析器
  if (config.enableSorting !== false) {
    parsers.Sorting = parseAsString;
  }

  // 为每个字段添加解析器
  for (const field of config.fields) {
    const fieldName = field.name;

    if (field.type === "string") {
      const operators = field.operators || ["Contains"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        if (
          operator === "IsNull" ||
          operator === "IsNotNull" ||
          operator === "IsEmpty" ||
          operator === "IsNotEmpty"
        ) {
          parsers[key] = parseAsBoolean;
        } else {
          parsers[key] = parseAsString;
        }
      }
    } else if (field.type === "number" || field.type === "enum") {
      const operators = field.operators || ["Eq"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        if (operator === "IsNull" || operator === "IsNotNull") {
          parsers[key] = parseAsBoolean;
        } else {
          parsers[key] = parseAsInteger;
        }
      }
    } else if (field.type === "boolean") {
      parsers[fieldName] = parseAsBoolean;
    } else if (field.type === "date") {
      const operators = field.operators || ["Eq"];
      for (const operator of operators) {
        const key = `${fieldName}.${operator}`;
        parsers[key] = parseAsString;
      }
    }
  }

  return parsers;
}
