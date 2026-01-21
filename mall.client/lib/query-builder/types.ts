/**
 * 字段类型枚举
 */
export type FieldType = "string" | "number" | "enum" | "boolean" | "date";

/**
 * 字符串类型支持的操作符
 */
export type StringOperator =
  | "Eq"
  | "Not"
  | "Equals"
  | "Contains"
  | "NotContains"
  | "StartsWith"
  | "NotStartsWith"
  | "EndsWith"
  | "NotEndsWith"
  | "IsNull"
  | "IsNotNull"
  | "IsEmpty"
  | "IsNotEmpty";

/**
 * 数字/枚举类型支持的操作符
 */
export type NumericOperator =
  | "Eq"
  | "Not"
  | "Gt"
  | "Lt"
  | "Gte"
  | "Lte"
  | "IsNull"
  | "IsNotNull";

/**
 * 所有操作符类型
 */
export type Operator = StringOperator | NumericOperator;

/**
 * 字段配置基础接口
 */
export interface BaseFieldConfig {
  /** 字段名称 */
  name: string;
  /** 显示标签 */
  label: string;
  /** 字段类型 */
  type: FieldType;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否必填 */
  required?: boolean;
}

/**
 * 字符串字段配置
 */
export interface StringFieldConfig extends BaseFieldConfig {
  type: "string";
  /** 支持的操作符，默认为 ["Contains"] */
  operators?: StringOperator[];
  /** 默认操作符 */
  defaultOperator?: StringOperator;
}

/**
 * 数字字段配置
 */
export interface NumericFieldConfig extends BaseFieldConfig {
  type: "number" | "enum";
  /** 支持的操作符，默认为 ["Eq"] */
  operators?: NumericOperator[];
  /** 默认操作符 */
  defaultOperator?: NumericOperator;
  /** 枚举选项（仅用于 enum 类型） */
  enumOptions?: { label: string; value: number }[];
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步进值 */
  step?: number;
}

/**
 * 布尔字段配置
 */
export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "boolean";
}

/**
 * 日期字段配置
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  operators?: NumericOperator[];
  defaultOperator?: NumericOperator;
}

/**
 * 字段配置联合类型
 */
export type FieldConfig =
  | StringFieldConfig
  | NumericFieldConfig
  | BooleanFieldConfig
  | DateFieldConfig;

/**
 * 查询配置接口
 */
export interface QueryConfig {
  /** 字段配置列表 */
  fields: FieldConfig[];
  /** 是否支持排序 */
  enableSorting?: boolean;
  /** 排序字段选项 */
  sortingOptions?: { label: string; value: string }[];
  /** 默认值配置 */
  defaults?: QueryDefaults;
}

/**
 * 操作符显示名称映射
 */
export const OPERATOR_LABELS: Record<Operator, string> = {
  // 字符串操作符
  Eq: "等于",
  Not: "不等于",
  Equals: "完全匹配",
  Contains: "包含",
  NotContains: "不包含",
  StartsWith: "开头是",
  NotStartsWith: "开头不是",
  EndsWith: "结尾是",
  NotEndsWith: "结尾不是",
  IsNull: "为空",
  IsNotNull: "不为空",
  IsEmpty: "为空字符串",
  IsNotEmpty: "不为空字符串",
  // 数字操作符
  Gt: "大于",
  Lt: "小于",
  Gte: "大于等于",
  Lte: "小于等于",
};

/**
 * 查询值类型
 */
export interface QueryValue {
  field: string;
  operator: Operator;
  value: string | number | boolean | null;
}

/**
 * 通用查询参数基础接口
 * 包含分页和排序等通用字段
 */
export interface BaseQueryParams {
  SkipCount?: number;
  MaxResultCount?: number;
  Sorting?: string;
  [key: string]: any;
}

/**
 * 查询默认值配置
 */
export interface QueryDefaults {
  /** 默认跳过数量 */
  skipCount?: number;
  /** 默认最大结果数 */
  maxResultCount?: number;
  /** 默认排序 */
  sorting?: string;
}

/**
 * 全局查询默认值
 */
export const DEFAULT_QUERY_VALUES: Required<QueryDefaults> = {
  skipCount: 0,
  maxResultCount: 10,
  sorting: "creationTime desc",
};
