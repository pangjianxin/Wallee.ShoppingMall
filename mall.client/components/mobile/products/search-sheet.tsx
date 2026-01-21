"use client";

import { SearchSheet } from "@/components/mobile/query-builder/search-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { productQueryConfig } from "@/lib/query-builder/config";
import { ProductGetListData } from "@/openapi";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
type Props = {
  trigger?: React.ReactNode;
};

/**
 * 商品搜索组件（基于配置的通用查询组件）
 */
export function ProductSearchSheet({ trigger }: Props) {
  return (
    <SearchSheet
      config={productQueryConfig}
      trigger={trigger}
      title="搜索商品"
    />
  );
}

// 保留原有实现作为参考
export function ProductSearchSheetOld({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  // 使用 nuqs 管理查询参数
  const [query, setQuery] = useQueryStates(
    {
      "Name.Contains": parseAsString,
      "Name.StartsWith": parseAsString,
      "Name.EndsWith": parseAsString,
      Sorting: parseAsString,
    },
    {
      history: "push",
    },
  );

  // 本地状态用于表单输入
  const [localFilters, setLocalFilters] = useState({
    contains: query["Name.Contains"] ?? "",
    startsWith: query["Name.StartsWith"] ?? "",
    endsWith: query["Name.EndsWith"] ?? "",
    sorting: query.Sorting ?? "",
  });

  // 应用筛选
  const handleApply = () => {
    const newQuery: ProductGetListData["query"] = {};

    if (localFilters.contains) {
      newQuery["Name.Contains"] = localFilters.contains;
    }
    if (localFilters.startsWith) {
      newQuery["Name.StartsWith"] = localFilters.startsWith;
    }
    if (localFilters.endsWith) {
      newQuery["Name.EndsWith"] = localFilters.endsWith;
    }
    if (localFilters.sorting) {
      newQuery.Sorting = localFilters.sorting;
    }

    setQuery({
      "Name.Contains": newQuery["Name.Contains"] ?? null,
      "Name.StartsWith": newQuery["Name.StartsWith"] ?? null,
      "Name.EndsWith": newQuery["Name.EndsWith"] ?? null,
      Sorting: newQuery.Sorting ?? null,
    });

    setOpen(false);
  };

  // 重置筛选
  const handleReset = () => {
    setLocalFilters({
      contains: "",
      startsWith: "",
      endsWith: "",
      sorting: "",
    });

    setQuery({
      "Name.Contains": null,
      "Name.StartsWith": null,
      "Name.EndsWith": null,
      Sorting: null,
    });
  };

  // 同步 URL 参数到本地状态
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalFilters({
        contains: query["Name.Contains"] ?? "",
        startsWith: query["Name.StartsWith"] ?? "",
        endsWith: query["Name.EndsWith"] ?? "",
        sorting: query.Sorting ?? "",
      });
    }
    setOpen(open);
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
          <SheetTitle>搜索和筛选</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
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
                  onClick={() =>
                    setLocalFilters({ ...localFilters, contains: "" })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* 开头搜索 */}
          <div className="space-y-2">
            <Label htmlFor="startsWith">以...开头</Label>
            <div className="relative">
              <Input
                id="startsWith"
                placeholder="以...开头"
                value={localFilters.startsWith}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startsWith: e.target.value,
                  })
                }
                className="pr-9"
              />
              {localFilters.startsWith && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalFilters({ ...localFilters, startsWith: "" })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* 结尾搜索 */}
          <div className="space-y-2">
            <Label htmlFor="endsWith">以...结尾</Label>
            <div className="relative">
              <Input
                id="endsWith"
                placeholder="以...结尾"
                value={localFilters.endsWith}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, endsWith: e.target.value })
                }
                className="pr-9"
              />
              {localFilters.endsWith && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalFilters({ ...localFilters, endsWith: "" })
                  }
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
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="sorting"
                placeholder="例如: Name ASC, CreationTime DESC"
                value={localFilters.sorting}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, sorting: e.target.value })
                }
                className="pl-9 pr-9"
              />
              {localFilters.sorting && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalFilters({ ...localFilters, sorting: "" })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
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
