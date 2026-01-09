"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  onSearch?: (value: string | undefined) => void;
  className?: string;
  showFilterButton?: boolean;
  filterOptions?: { label: string; value: string | undefined }[];
  onFilterChange?: (filter: string | undefined) => void;
  showSortButton?: boolean;
  sortOptions?: { label: string; value: string | undefined }[];
  onSortChange?: (sort: string | undefined) => void;
  rightContent?: React.ReactNode;
}

export default function SearchBar({
  placeholder = "搜索...",
  value = "",
  onChange,
  onSearch,
  className,
  showFilterButton = false,
  filterOptions = [],
  onFilterChange,
  showSortButton = false,
  sortOptions = [],
  onSortChange,
  rightContent,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue || undefined);
    } else {
      onChange(searchValue || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue("");
    onChange(undefined);
    if (onSearch) onSearch(undefined);
  };

  return (
    <div className={cn("w-full flex flex-col space-y-4", className)}>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder={placeholder}
              className="pl-10 pr-10 h-10 bg-background border-border focus-visible:ring-primary w-full"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                // 如果不需要立即触发搜索，可以注释掉下面这行
                // onChange(e.target.value || undefined);
              }}
              onKeyDown={handleKeyDown}
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">清除搜索</span>
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            搜索
          </Button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showFilterButton && filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">筛选</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.label}
                    onClick={() => onFilterChange?.(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showSortButton && sortOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">排序</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.label}
                    onClick={() => onSortChange?.(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {rightContent}
        </div>
      </div>
    </div>
  );
}
