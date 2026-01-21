import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

/**
 * 商品页面查询参数缓存配置
 * 使用 nuqs 的 searchParamsCache 模式
 */
export const searchParamsCache = createSearchParamsCache({
  // 分页参数
  SkipCount: parseAsInteger.withDefault(0),
  MaxResultCount: parseAsInteger.withDefault(20),
  
  // 排序参数
  Sorting: parseAsString.withDefault("creationTime desc"),
  
  // 商品名称过滤器
  "Name.Contains": parseAsString,
  "Name.StartsWith": parseAsString,
  "Name.EndsWith": parseAsString,
  "Name.Eq": parseAsString,
});

/**
 * 商品查询参数类型（从 searchParamsCache 推断）
 */
export type ProductSearchParams = ReturnType<typeof searchParamsCache.parse>;
