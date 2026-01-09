"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { WalleeMallMediasDtosMallMediaDto } from "@/openapi";

import { Download } from "lucide-react";
import { PermissionButton } from "@/components/auth/permission-button";
type Props = {
  onDownload: (
    row: WalleeMallMediasDtosMallMediaDto
  ) => Promise<void> | void;
};
export const createColumns = (
  props: Props
): ColumnDef<WalleeMallMediasDtosMallMediaDto>[] => [
  {
    id: "actions",
    meta: { label: "操作" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="操作"
        className="truncate max-w-[50px]"
      />
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-row gap-2">
        <PermissionButton
          size="sm"
          variant="outline"
          onClick={() => props.onDownload(row.original)}
          permission="HrTools.AttendanceRecord.Update"
        >
          <Download />
          下载
        </PermissionButton>
      </div>
    ),
  },
  {
    accessorKey: "name",
    meta: { label: "文件名称" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="文件名称"
        className="truncate max-w-[100px]"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[100px]" title={row.getValue("name")}>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "mimeType",
    meta: { label: "媒体类型" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="媒体类型"
        className="truncate max-w-[100px]"
      />
    ),
    cell: ({ row }) => (
      <Badge className="font-medium">{row.getValue("mimeType")}</Badge>
    ),
  },
  {
    accessorKey: "size",
    meta: { label: "文件大小" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="文件大小"
        className="truncate max-w-[50px]"
      />
    ),
    cell: ({ row }) => (
      <Badge className="font-medium">
        {Math.round(row.getValue<number>("size") / 1024)} KB
      </Badge>
    ),
  },
];
