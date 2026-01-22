"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";
import { Badge } from "@/components/ui/badge";
import { PermissionButton } from "@/components/auth/permission-button";
import { Text, SortAsc } from "lucide-react";

export const createColumns = ({
  onUpdate,
  onDelete,
}: {
  onUpdate: (product: WalleeMallCarouselsDtosCarouselDto) => void;
  onDelete: (product: WalleeMallCarouselsDtosCarouselDto) => void;
}): ColumnDef<WalleeMallCarouselsDtosCarouselDto>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="轮播图标题" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[300px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
      meta: { label: "轮播图标题", placeholder: "搜索轮播图标题", icon: Text },
      enableColumnFilter: true,
    },
    {
      accessorKey: "description",
      meta: { label: "描述" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="描述" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[150px] truncate">
              {row.getValue("description") || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      meta: { label: "优先级" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="优先级" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <SortAsc className="h-4 w-4" />
            <span className="max-w-[200px] truncate">
              {row.getValue("priority") || "-"}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "link",
      meta: { label: "外部链接" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="外部链接" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant="default">{row.getValue("link") || "-"}</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      meta: { label: "操作" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="操作" />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className="flex items-center gap-2">
            <PermissionButton
              size={"sm"}
              onClick={() => onUpdate?.(row.original)}
              permission="Mall.Product.Update"
            >
              编辑
            </PermissionButton>
            <PermissionButton
              size={"sm"}
              variant="destructive"
              onClick={() => onDelete?.(row.original)}
              permission="Mall.Product.Delete"
            >
              删除
            </PermissionButton>
          </div>
        </>
      ),
    },
  ];
};
