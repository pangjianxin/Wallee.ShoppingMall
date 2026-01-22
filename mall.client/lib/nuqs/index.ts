import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const ProductsSearchParams = {
  // 分页参数
  SkipCount: parseAsInteger.withDefault(0),
  MaxResultCount: parseAsInteger.withDefault(10),
  // 排序参数
  Sorting: parseAsString.withDefault("creationTime desc"),
  // 商品名称过滤器
  "Name.Contains": parseAsString,
};

/**
 * 商品页面查询参数缓存配置
 * 使用 nuqs 的 searchParamsCache 模式
 */
export const productsSearchParamsCache =
  createSearchParamsCache(ProductsSearchParams);
