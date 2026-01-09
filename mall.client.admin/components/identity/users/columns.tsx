"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { VoloAbpIdentityIdentityUserDto } from "@/openapi";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PermissionButton } from "@/components/auth/permission-button";
type Props = {
  onUpdate?: (row: VoloAbpIdentityIdentityUserDto) => void;
  onDelete?: (row: VoloAbpIdentityIdentityUserDto) => void;
  onPermission?: (row: VoloAbpIdentityIdentityUserDto) => void;
};
export const createColumns = ({
  onUpdate,
  onDelete,
  onPermission,
}: Props): ColumnDef<VoloAbpIdentityIdentityUserDto>[] => {
  return [
    {
      accessorKey: "userName",
      meta: { label: "登录用户名" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="登录用户名" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("userName")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      meta: { label: "用户名" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="用户名" />
      ),
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "surname",
      meta: { label: "工号" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="工号" />
      ),
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue("surname")}</div>;
      },
    },
    {
      accessorKey: "creationTime",
      meta: { label: "创建日期" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="创建日期" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge>{format(row.getValue("creationTime"), "yyyy-MM-dd")}</Badge>
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
            {onUpdate && (
              <PermissionButton
                size={"sm"}
                onClick={() => onUpdate(row.original)}
                permission="AbpIdentity.Users.Update"
              >
                更新
              </PermissionButton>
            )}

            {onDelete && (
              <PermissionButton
                size={"sm"}
                variant={"destructive"}
                onClick={() => onDelete(row.original)}
                permission="AbpIdentity.Users.Delete"
              >
                删除
              </PermissionButton>
            )}
            {onPermission && (
              <PermissionButton
                size={"sm"}
                variant={"outline"}
                onClick={() => onPermission(row.original)}
                permission="AbpIdentity.Users.ManagePermissions"
              >
                权限
              </PermissionButton>
            )}
          </div>
        </>
      ),
    },
    {
      id: "filter",
      enableColumnFilter: true,
      meta: {
        label: "全局搜索",
      },
    },
  ];
};
