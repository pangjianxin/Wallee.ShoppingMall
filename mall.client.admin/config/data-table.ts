export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  textOperators: [
    { label: "等于", value: "Eq" as const },
    { label: "不等于", value: "Not" as const },
    { label: "包含", value: "Contains" as const },
    { label: "不包含", value: "NotContains" as const },
    { label: "以...开头", value: "StartsWith" as const },
    { label: "以...结尾", value: "EndsWith" as const },
    { label: "为空", value: "IsEmpty" as const },
    { label: "不为空", value: "IsNotEmpty" as const },
  ],
  numericOperators: [
    { label: "等于", value: "Eq" as const },
    { label: "不等于", value: "Not" as const },
    { label: "小于", value: "Lt" as const },
    { label: "小于或等于", value: "Lte" as const },
    { label: "大于", value: "Gt" as const },
    { label: "大于或等于", value: "Gte" as const },
    { label: "为空", value: "IsNull" as const },
    { label: "不为空", value: "IsNotNull" as const },
  ],
  dateOperators: [
    { label: "等于", value: "Eq" as const },
    { label: "不等于", value: "Not" as const },
    { label: "小于", value: "Lt" as const },
    { label: "小于或等于", value: "Lte" as const },
    { label: "大于", value: "Gt" as const },
    { label: "大于或等于", value: "Gte" as const },
    { label: "为空", value: "IsNull" as const },
    { label: "不为空", value: "IsNotNull" as const },
  ],
  dateRangeOperators: [
    {
      label: "介于",
      value: "IsBetween" as const,
    },
  ],
  selectOperators: [
    { label: "等于", value: "Eq" as const },
    { label: "不等于", value: "Not" as const },
    { label: "为空", value: "IsEmpty" as const },
    { label: "不为空", value: "IsNotEmpty" as const },
  ],
  multiSelectOperators: [
    {
      label: "包含",
      value: "In" as const,
    },
  ],
  booleanOperators: [
    { label: "等于", value: "Eq" as const },
    { label: "不等于", value: "Not" as const },
    { label: "为空", value: "IsNull" as const },
    { label: "不为空", value: "IsNotNull" as const },
  ],
  sortOrders: [
    { label: "升序", value: "asc" as const },
    { label: "降序", value: "desc" as const },
  ],
  filterVariants: [
    "text",
    "number",
    "range",
    "date",
    "dateRange",
    "boolean",
    "select",
    "multiSelect",
  ] as const,

  operators: [
    //string operators
    "Eq",
    "Not",
    "Equals",
    "Contains",
    "NotContains",
    "StartsWith",
    "NotStartsWith",
    "EndsWith",
    "NotEndsWith",
    "IsNull",
    "IsNotNull",
    "IsEmpty",
    "IsNotEmpty",
    //struct operators
    "Eq",
    "Not",
    "Gt",
    "Lt",
    "Gte",
    "Lte",
    "IsNull",
    "IsNotNull",
    //range
    "IsBetween",
    //array operators
    "In",
    "NotIn",
  ] as const,
  joinOperators: ["and", "or"] as const,
};
