"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductGetListData } from "@/openapi";
import { Search, X } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { ProductsSearchParams } from "@/lib/nuqs";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  trigger?: React.ReactNode;
};

// 保留原有实现作为参考
export function ProductSearchSheet({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  // 使用 nuqs 管理查询参数
  const [query, setQuery] = useQueryStates(ProductsSearchParams, {
    history: "push",
    shallow: false,
  });

  // 本地状态用于表单输入
  const [localFilters, setLocalFilters] = useState({
    contains: query["Name.Contains"] ?? undefined,
    sorting: query.Sorting ?? undefined,
  });

  // 应用筛选
  const handleApply = () => {
    const newQuery: ProductGetListData["query"] = {};
    if (localFilters.contains) {
      newQuery["Name.Contains"] = localFilters.contains;
    }
    if (localFilters.sorting) {
      newQuery.Sorting = localFilters.sorting;
    }
    setQuery({
      ...newQuery,
      Sorting: newQuery.Sorting ?? null,
    });
    setOpen(false);
  };

  // 重置筛选
  const handleReset = () => {
    setLocalFilters({
      contains: "",
      sorting: "",
    });
    setQuery({
      "Name.Contains": null,
      Sorting: null,
    });
  };

  // 同步 URL 参数到本地状态
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalFilters({
        contains: query["Name.Contains"] ?? "",
        sorting: query.Sorting ?? "",
      });
    }
    setOpen(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-2">
        <SheetTrigger asChild>
          {trigger ?? (
            <Button variant="outline" size="icon" aria-label="打开搜索">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </SheetTrigger>
        {query["Name.Contains"] ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery({
                "Name.Contains": null,
                Sorting: query.Sorting ?? null,
              });
              setLocalFilters({ ...localFilters, contains: "" });
            }}
            className="inline-flex items-center justify-center rounded-md border border-input bg-transparent p-2 text-muted-foreground hover:text-foreground"
            aria-label="清除检索"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>搜索和筛选</SheetTitle>
          <SheetDescription>设置商品搜索关键词和排序方式</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 py-4">
          {/* 包含搜索 */}
          <div className="space-y-2">
            <Label htmlFor="contains">包含关键词</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contains"
                placeholder="搜索商品名称..."
                value={localFilters.contains}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, contains: e.target.value })
                }
                className="pl-9 pr-9"
              />
              {localFilters.contains && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalFilters({ ...localFilters, contains: "" });
                    setQuery({
                      "Name.Contains": null,
                      Sorting: query.Sorting ?? null,
                    });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
          {/* 排序 */}
          <div className="space-y-2">
            <Label htmlFor="sorting">排序</Label>
            <div className="relative">
              <Select
                value={localFilters.sorting}
                onValueChange={(val) =>
                  setLocalFilters({ ...localFilters, sorting: val })
                }
              >
                <SelectTrigger id="sorting" className="w-full">
                  <SelectValue placeholder="选择排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creationTime desc">
                    不指定（默认）
                  </SelectItem>
                  <SelectItem value="name asc">名称:A → Z</SelectItem>
                  <SelectItem value="name desc">名称:Z → A</SelectItem>
                  <SelectItem value="originalPrice asc">
                    价格：从低到高
                  </SelectItem>
                  <SelectItem value="originalPrice desc">
                    价格：从高到低
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
