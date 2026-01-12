"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { WalleeMallTagsDtosTagDto } from "@/openapi";
import { PermissionButton } from "@/components/auth/permission-button";
import { format } from "date-fns";
import { Calendar, Text } from "lucide-react";

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : format(date, "yyyy-MM-dd HH:mm:ss");
}

export const createColumns = ({
  onUpdate,
}: {
  onUpdate: (tag: WalleeMallTagsDtosTagDto) => void;
}): ColumnDef<WalleeMallTagsDtosTagDto>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="标签名称" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[300px] truncate font-medium">
              {row.getValue("name") || "-"}
            </span>
          </div>
        );
      },
      meta: { label: "标签名称", placeholder: "搜索标签名称", icon: Text },
      enableColumnFilter: true,
    },

    {
      accessorKey: "normalizedName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="标准化名称" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[260px] truncate">
              {row.getValue("normalizedName") || "-"}
            </span>
          </div>
        );
      },
      meta: {
        label: "标准化名称",
        placeholder: "搜索标准化名称",
        icon: Text,
      },
      enableColumnFilter: true,
    },

    {
      accessorKey: "creationTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="创建时间" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[200px] truncate font-medium">
              {formatDateTime(
                row.getValue("creationTime") as string | undefined
              )}
            </span>
          </div>
        );
      },
      meta: {
        label: "创建时间",
        variant: "dateRange",
        icon: Calendar,
        placeholder: "选择日期范围",
      },
      enableColumnFilter: true,
    },

    {
      accessorKey: "lastModificationTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="最后修改时间" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[200px] truncate font-medium">
              {formatDateTime(
                row.getValue("lastModificationTime") as
                  | string
                  | null
                  | undefined
              )}
            </span>
          </div>
        );
      },
      meta: {
        label: "最后修改时间",
        variant: "dateRange",
        icon: Calendar,
        placeholder: "选择日期范围",
      },
      enableColumnFilter: true,
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
          </div>
        </>
      ),
    },
  ];
};
