"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryStates, parseAsInteger } from "nuqs";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobilePaginationProps {
  /** 总数据条数 */
  totalCount: number;
  /** 每页显示数量（默认从配置读取） */
  pageSize?: number;
  /** 自定义类名 */
  className?: string;
  /** 显示信息文本 */
  showInfo?: boolean;
  /** 紧凑模式 */
  compact?: boolean;
}

export function MobilePagination({
  totalCount,
  pageSize = 20,
  className,
  showInfo = true,
  compact = false,
}: MobilePaginationProps) {
  // 使用 nuqs 管理分页参数
  const [query, setQuery] = useQueryStates(
    {
      SkipCount: parseAsInteger.withDefault(0),
      MaxResultCount: parseAsInteger.withDefault(pageSize),
    },
    {
      history: "push",
    }
  );

  const skipCount = query.SkipCount ?? 0;
  const maxResultCount = query.MaxResultCount ?? pageSize;

  // 计算分页信息
  const totalPages = Math.ceil(totalCount / maxResultCount);
  const currentPage = Math.floor(skipCount / maxResultCount) + 1;
  const startIndex = skipCount + 1;
  const endIndex = Math.min(skipCount + maxResultCount, totalCount);

  console.log("Pagination Debug:", {
    totalCount,
    pageSize,
    maxResultCount,
    totalPages,
    skipCount,
    shouldShow: totalCount > 0 && totalPages > 1,
  });

  // 是否可以上一页/下一页
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  // 处理分页跳转
  const handlePageChange = (page: number) => {
    const newSkipCount = (page - 1) * maxResultCount;
    setQuery({
      SkipCount: newSkipCount,
      MaxResultCount: maxResultCount,
    });
  };

  const handlePrevious = () => {
    if (canPrevious) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canNext) {
      handlePageChange(currentPage + 1);
    }
  };

  // 计算显示的页码列表（移动端简化显示）
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 7) {
      // 总页数少于7页，全部显示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数大于7页，智能显示
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      
      // 显示当前页附近的页码
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // 无数据时不显示分页
  if (totalCount === 0) {
    return null;
  }

  // 注意：即使只有一页也显示分页信息（方便调试和用户体验）
  // if (totalPages <= 1) {
  //   return null;
  // }

  if (compact) {
    // 紧凑模式：只显示上一页/下一页按钮和信息
    return (
      <div className={cn("flex items-center justify-between py-4", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!canPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一页
        </Button>
        
        {showInfo && (
          <div className="text-sm text-muted-foreground">
            {startIndex}-{endIndex} / {totalCount}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canNext}
        >
          下一页
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  // 完整模式
  return (
    <div className={cn("flex flex-col gap-4 py-4", className)}>
      {/* 分页信息 */}
      {showInfo && (
        <div className="text-center text-sm text-muted-foreground">
          显示第 {startIndex} - {endIndex} 条，共 {totalCount} 条
        </div>
      )}

      {/* 分页按钮 */}
      <div className="flex items-center justify-center gap-1">
        {/* 上一页 */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={!canPrevious}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* 页码按钮 */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center"
              >
                <span className="text-muted-foreground">...</span>
              </div>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className={cn(
                "h-9 w-9",
                currentPage === page && "pointer-events-none"
              )}
            >
              {page}
            </Button>
          );
        })}

        {/* 下一页 */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!canNext}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
