"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  QueryConfig,
  FieldConfig,
  StringFieldConfig,
  NumericFieldConfig,
} from "@/lib/query-builder/types";
import { OPERATOR_LABELS } from "@/lib/query-builder/types";
import { generateNuqsParsers } from "@/lib/query-builder/parser";

type Props = {
  /** 查询配置 */
  config: QueryConfig;
  /** 自定义触发按钮 */
  trigger?: React.ReactNode;
  /** Sheet 标题 */
  title?: string;
};

export function SearchSheet({ config, trigger, title = "搜索和筛选" }: Props) {
  const [open, setOpen] = useState(false);

  // 生成 nuqs 解析器
  const parsers = useMemo(() => generateNuqsParsers(config), [config]);

  // 使用 nuqs 管理查询参数
  const [query, setQuery] = useQueryStates(parsers, {
    history: "push",
  });

  // 本地状态用于表单输入
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

  // 初始化本地状态
  const initLocalFilters = () => {
    const filters: Record<string, any> = {};

    for (const field of config.fields) {
      if (field.type === "string") {
        const operators = field.operators || ["Contains"];
        for (const operator of operators) {
          const key = `${field.name}.${operator}`;
          filters[key] = query[key] ?? "";
        }
        // 存储当前选中的操作符
        const defaultOp = field.defaultOperator || operators[0];
        filters[`${field.name}._operator`] = defaultOp;
      } else if (field.type === "number" || field.type === "enum") {
        const operators = field.operators || ["Eq"];
        for (const operator of operators) {
          const key = `${field.name}.${operator}`;
          filters[key] = query[key] ?? "";
        }
        filters[`${field.name}._operator`] =
          field.defaultOperator || operators[0];
      } else if (field.type === "boolean") {
        filters[field.name] = query[field.name] ?? false;
      }
    }

    if (config.enableSorting !== false) {
      filters.Sorting = query.Sorting ?? "";
    }

    return filters;
  };

  // 应用筛选
  const handleApply = () => {
    const newQuery: Record<string, any> = {};

    for (const field of config.fields) {
      if (
        field.type === "string" ||
        field.type === "number" ||
        field.type === "enum"
      ) {
        const operators =
          (field as StringFieldConfig | NumericFieldConfig).operators ||
          (field.type === "string" ? ["Contains"] : ["Eq"]);

        for (const operator of operators) {
          const key = `${field.name}.${operator}`;
          const value = localFilters[key];

          if (value !== undefined && value !== null && value !== "") {
            newQuery[key] = value;
          } else {
            newQuery[key] = null;
          }
        }
      } else if (field.type === "boolean") {
        const value = localFilters[field.name];
        newQuery[field.name] = value || null;
      }
    }

    if (config.enableSorting !== false) {
      newQuery.Sorting = localFilters.Sorting || null;
    }

    setQuery(newQuery);
    setOpen(false);
  };

  // 重置筛选
  const handleReset = () => {
    const resetFilters: Record<string, any> = {};

    for (const field of config.fields) {
      if (field.type === "string") {
        const operators = field.operators || ["Contains"];
        for (const operator of operators) {
          resetFilters[`${field.name}.${operator}`] = "";
        }
        resetFilters[`${field.name}._operator`] =
          field.defaultOperator || operators[0];
      } else if (field.type === "number" || field.type === "enum") {
        const operators = field.operators || ["Eq"];
        for (const operator of operators) {
          resetFilters[`${field.name}.${operator}`] = "";
        }
        resetFilters[`${field.name}._operator`] =
          field.defaultOperator || operators[0];
      } else if (field.type === "boolean") {
        resetFilters[field.name] = false;
      }
    }

    if (config.enableSorting !== false) {
      resetFilters.Sorting = "";
    }

    setLocalFilters(resetFilters);

    const resetQuery: Record<string, any> = {};
    for (const key in parsers) {
      resetQuery[key] = null;
    }
    setQuery(resetQuery);
  };

  // 同步 URL 参数到本地状态
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalFilters(initLocalFilters());
    }
    setOpen(open);
  };

  // 渲染字段输入组件
  const renderFieldInput = (field: FieldConfig) => {
    if (field.type === "string") {
      return renderStringField(field as StringFieldConfig);
    } else if (field.type === "number") {
      return renderNumericField(field as NumericFieldConfig);
    } else if (field.type === "enum") {
      return renderEnumField(field as NumericFieldConfig);
    }
    return null;
  };

  // 渲染字符串字段
  const renderStringField = (field: StringFieldConfig) => {
    const operators = field.operators || ["Contains"];
    const currentOperator =
      localFilters[`${field.name}._operator`] ||
      field.defaultOperator ||
      operators[0];
    const currentKey = `${field.name}.${currentOperator}`;
    const value = localFilters[currentKey] || "";

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={currentKey}>{field.label}</Label>
        <div className="flex gap-2">
          {operators.length > 1 && (
            <Select
              value={currentOperator}
              onValueChange={(op) => {
                setLocalFilters({
                  ...localFilters,
                  [`${field.name}._operator`]: op,
                });
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={currentKey}
              placeholder={field.placeholder || `请输入${field.label}...`}
              value={value}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  [currentKey]: e.target.value,
                })
              }
              className="pl-9 pr-9"
            />
            {value && (
              <button
                type="button"
                onClick={() =>
                  setLocalFilters({ ...localFilters, [currentKey]: "" })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染数字字段
  const renderNumericField = (field: NumericFieldConfig) => {
    const operators = field.operators || ["Eq"];
    const currentOperator =
      localFilters[`${field.name}._operator`] ||
      field.defaultOperator ||
      operators[0];
    const currentKey = `${field.name}.${currentOperator}`;
    const value = localFilters[currentKey] || "";

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={currentKey}>{field.label}</Label>
        <div className="flex gap-2">
          {operators.length > 1 && (
            <Select
              value={currentOperator}
              onValueChange={(op) => {
                setLocalFilters({
                  ...localFilters,
                  [`${field.name}._operator`]: op,
                });
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative flex-1">
            <Input
              id={currentKey}
              type="number"
              placeholder={field.placeholder || `请输入${field.label}...`}
              value={value}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  [currentKey]: e.target.value,
                })
              }
              min={field.min}
              max={field.max}
              step={field.step}
              className="pr-9"
            />
            {value && (
              <button
                type="button"
                onClick={() =>
                  setLocalFilters({ ...localFilters, [currentKey]: "" })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染枚举字段
  const renderEnumField = (field: NumericFieldConfig) => {
    const operators = field.operators || ["Eq"];
    const currentOperator =
      localFilters[`${field.name}._operator`] ||
      field.defaultOperator ||
      operators[0];
    const currentKey = `${field.name}.${currentOperator}`;
    const value = localFilters[currentKey];

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={currentKey}>{field.label}</Label>
        <div className="flex gap-2">
          {operators.length > 1 && (
            <Select
              value={currentOperator}
              onValueChange={(op) => {
                setLocalFilters({
                  ...localFilters,
                  [`${field.name}._operator`]: op,
                });
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select
            value={value?.toString() || ""}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, [currentKey]: Number(val) })
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue
                placeholder={field.placeholder || `请选择${field.label}...`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.enumOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* 渲染所有字段 */}
          {config.fields.map((field) => renderFieldInput(field))}

          {/* 排序 */}
          {config.enableSorting !== false && config.sortingOptions && (
            <div className="space-y-2">
              <Label htmlFor="sorting">排序</Label>
              <Select
                value={localFilters.Sorting || ""}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, Sorting: value })
                }
              >
                <SelectTrigger id="sorting">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="选择排序方式..." />
                </SelectTrigger>
                <SelectContent>
                  {config.sortingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            重置
          </Button>
          <Button onClick={handleApply} className="flex-1">
            应用筛选
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
