"use client"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalRecords: number
  onPageChangeAction: (page: number) => void
  pageSize: number
  currentPage: number
}

const MobilePaginationComponent: React.FC<PaginationProps> = ({
  totalRecords,
  onPageChangeAction,
  pageSize,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize)

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChangeAction(page)
    }
  }

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-between">
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">上一页</span>
          </Button>
        </PaginationItem>

        <span className="text-sm text-muted-foreground px-2">
          {currentPage + 1}/{totalPages}页
        </span>

        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">下一页</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default MobilePaginationComponent

