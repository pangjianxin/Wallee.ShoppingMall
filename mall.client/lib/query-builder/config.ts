import type { QueryConfig } from "./types";
import type { ProductGetListData } from "@/openapi";

/**
 * 商品查询类型
 */
export type ProductQuery = NonNullable<ProductGetListData["query"]>;

/**
 * 商品查询配置
 */
export const productQueryConfig: QueryConfig = {
  fields: [
    {
      name: "Name",
      label: "商品名称",
      type: "string",
      placeholder: "搜索商品名称...",
      operators: ["Contains", "StartsWith", "EndsWith", "Eq"],
      defaultOperator: "Contains",
    },
  ],
  enableSorting: true,
  sortingOptions: [
    { label: "名称升序", value: "name asc" },
    { label: "名称降序", value: "name desc" },
    { label: "创建时间升序", value: "creationTime asc" },
    { label: "创建时间降序", value: "creationTime desc" },
  ],
  defaults: {
    skipCount: 0,
    maxResultCount: 20,
    sorting: "creationTime desc",
  },
};
