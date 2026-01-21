import type { SearchParams } from "nuqs";
import type { AutoFiltererEnumsCombineType, ProductGetListData } from "@/openapi";

/**
 * 通用查询参数基础接口
 * 包含分页和排序等通用字段
 */
export interface BaseQueryParams {
  SkipCount?: number;
  MaxResultCount?: number;
  Sorting?: string;
  CombineWith?: AutoFiltererEnumsCombineType;
}

/**
 * 字段解析器类型定义
 */
export type FieldParser<T = any> = {
  type: "string" | "number" | "boolean" | "enum";
  parse?: (value: any) => T;
  validate?: (value: any) => boolean;
};

/**
 * 字段解析器配置
 */
export type FieldParserConfig<T> = {
  [K in keyof T]?: FieldParser<T[K]>;
};

/**
 * 通用查询参数解析器
 * @param searchParams URL 查询参数
 * @param fieldParsers 字段解析器配置
 * @returns 解析后的查询对象
 */
export function parseQuery<T extends BaseQueryParams>(
  searchParams: SearchParams,
  fieldParsers: FieldParserConfig<T>,
): T {
  const query: Partial<T> = {};

  // 解析通用的基础参数（分页和排序）
  if (searchParams.SkipCount !== undefined) {
    const skip = Number(searchParams.SkipCount);
    if (!isNaN(skip)) query.SkipCount = skip as T["SkipCount"];
  }
  if (searchParams.MaxResultCount !== undefined) {
    const max = Number(searchParams.MaxResultCount);
    if (!isNaN(max)) query.MaxResultCount = max as T["MaxResultCount"];
  }
  if (searchParams.Sorting) {
    query.Sorting = String(searchParams.Sorting) as T["Sorting"];
  }

  // 解析自定义字段
  for (const [key, parser] of Object.entries(fieldParsers) as [
    keyof T,
    FieldParser,
  ][]) {
    const value = searchParams[key as string];
    if (value === undefined || value === null) continue;

    // 跳过基础参数（已处理）
    if (key === "SkipCount" || key === "MaxResultCount" || key === "Sorting") {
      continue;
    }

    // 使用自定义解析器
    if (parser.parse) {
      const parsed = parser.parse(value);
      if (parser.validate ? parser.validate(parsed) : true) {
        query[key] = parsed;
      }
      continue;
    }

    // 使用内置类型解析
    switch (parser.type) {
      case "string":
        query[key] = String(value) as T[keyof T];
        break;
      case "number":
        const num = Number(value);
        if (!isNaN(num)) {
          query[key] = num as T[keyof T];
        }
        break;
      case "boolean":
        query[key] = (value === "true") as T[keyof T];
        break;
      case "enum":
        const enumValue = Number(value);
        if (!isNaN(enumValue)) {
          query[key] = enumValue as T[keyof T];
        }
        break;
    }
  }

  return query as T;
}

/**
 * 商品查询参数解析器配置
 */
const productFieldParsers: FieldParserConfig<
  NonNullable<ProductGetListData["query"]>
> = {
  // Name 相关过滤器
  "Name.Eq": { type: "string" },
  "Name.Not": { type: "string" },
  "Name.Equals": { type: "string" },
  "Name.Contains": { type: "string" },
  

  // 布尔值过滤器
  "Name.IsNull": { type: "boolean" },
  "Name.IsNotNull": { type: "boolean" },
  "Name.IsEmpty": { type: "boolean" },
  "Name.IsNotEmpty": { type: "boolean" },

  // 组合类型（枚举）
  "Name.CombineWith": {
    type: "enum",
    validate: (value) => value === 0 || value === 1,
  },
  CombineWith: {
    type: "enum",
    validate: (value) => value === 0 || value === 1,
  },

  // 字符串比较类型
  "Name.Compare": { type: "enum" },
};

/**
 * 从 URL SearchParams 解析商品查询参数
 * @param searchParams URL 查询参数
 * @returns 商品查询对象
 */
export function parseProductQuery(
  searchParams: SearchParams,
): NonNullable<ProductGetListData["query"]> {
  return parseQuery<NonNullable<ProductGetListData["query"]>>(
    searchParams,
    productFieldParsers,
  );
}

/**
 * 创建自定义查询解析器的工厂函数
 * @param fieldParsers 字段解析器配置
 * @returns 查询解析器函数
 *
 * @example
 * ```typescript
 * const parseOrderQuery = createQueryParser<OrderGetListData["query"]>({
 *   "Status.Eq": { type: "string" },
 *   "Amount.Gte": { type: "number" },
 *   "IsPaid": { type: "boolean" },
 * });
 *
 * const query = parseOrderQuery(searchParams);
 * ```
 */
export function createQueryParser<T extends BaseQueryParams>(
  fieldParsers: FieldParserConfig<T>,
) {
  return (searchParams: SearchParams): T => {
    return parseQuery<T>(searchParams, fieldParsers);
  };
}
