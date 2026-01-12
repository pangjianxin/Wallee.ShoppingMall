"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Badge } from "@/components/ui/badge";
import { PermissionButton } from "@/components/auth/permission-button";
import { Text } from "lucide-react";

export const createColumns = ({
  onUpdate,
  onUpdateSkus,
}: {
  onUpdate: (product: WalleeMallProductsDtosProductDto) => void;
  onUpdateSkus: (product: WalleeMallProductsDtosProductDto) => void;
}): ColumnDef<WalleeMallProductsDtosProductDto>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="产品名称" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[300px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        );
      },
      meta: { label: "产品名称", placeholder: "搜索产品名称", icon: Text },
      enableColumnFilter: true,
    },
    {
      accessorKey: "brand",
      meta: { label: "品牌" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="品牌" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[150px] truncate">
              {row.getValue("brand") || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "shortDescription",
      meta: { label: "简短描述" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="简短描述" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[200px] truncate">
              {row.getValue("shortDescription") || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "originalPrice",
      meta: { label: "原价" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="原价" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("originalPrice") as number | undefined;
        const currency = row.original.currency || "¥";
        return (
          <div className="flex space-x-2">
            <span className="font-medium">
              {price !== undefined ? `${currency}${price.toFixed(2)}` : "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "discountRate",
      meta: { label: "折扣" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="折扣(1表示不打折)" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("discountRate") as number | null | undefined;
        const currency = row.original.currency || "¥";
        return (
          <div className="flex space-x-2">
            <span className="font-medium text-red-600">
              {price !== null && price !== undefined
                ? `${currency}${price.toFixed(2)}`
                : "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "salesCount",
      meta: { label: "销量" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="销量" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span>{row.getValue("salesCount") || 0}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      meta: { label: "状态" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="状态" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="flex space-x-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "上架" : "下架"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "sortOrder",
      meta: { label: "排序" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="排序" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span>{row.getValue("sortOrder") || 0}</span>
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
              variant="outline"
              onClick={() => onUpdateSkus?.(row.original)}
              permission="Mall.Product.Update"
            >
              管理SKU
            </PermissionButton>
          </div>
        </>
      ),
    },
  ];
};
