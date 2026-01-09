"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { WalleeMallAuditLogsDtosAuditLogDto } from "@/openapi";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
export const createColumns = (
  onDetail: (v: WalleeMallAuditLogsDtosAuditLogDto) => void | Promise<void>
): ColumnDef<WalleeMallAuditLogsDtosAuditLogDto>[] => [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="用户名" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 w-full">
          <span className="truncate font-medium">
            {row.getValue("userName")}
          </span>
        </div>
      );
    },
    meta: { label: "用户名" },
  },
  {
    accessorKey: "executionTime",

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="截至日期"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {format(row.getValue("executionTime"), "yyyy-MM-dd")}
          </span>
        </div>
      );
    },
    meta: {
      label: "执行日期",
      variant: "date",
      icon: Calendar,
      placeholder: "选择日期",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "executionDuration",
    meta: { label: "消耗时间" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="消耗时间(毫秒)"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("executionDuration")}毫秒
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clientIpAddress",
    meta: { label: "源IP" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="源IP"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("clientIpAddress")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clientName",
    meta: { label: "客户端名称" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="客户端名称"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("clientName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clientId",
    meta: { label: "客户端ID" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="客户端ID"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("clientId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "browserInfo",
    meta: { label: "浏览器信息" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="浏览器信息"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full truncate font-medium">
                  {row.getValue("browserInfo")}
                </span>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("browserInfo")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "httpMethod",
    meta: { label: "HTTP METHOD" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="HTTP METHOD"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("httpMethod")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    meta: { label: "访问路径" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="访问路径"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full truncate font-medium">
                  {row.getValue("url")}
                </span>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("url")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "exceptions",
    meta: { label: "异常(若有)" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="异常(若有)"
        className="max-w-[100px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full truncate font-medium">
                  {row.getValue("exceptions")}
                </span>
              </TooltipTrigger>
              <TooltipContent>{row.getValue("exceptions")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "comments",
    meta: { label: "备注" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="备注"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("comments")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "httpStatusCode",
    meta: { label: "HTTP返回码" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label="HTTP返回码"
        className="max-w-[200px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[100px] space-x-2">
          <Badge
            variant={
              row.getValue<string>("httpStatusCode").toString().startsWith("2")
                ? "default"
                : "destructive"
            }
          >
            {row.getValue("httpStatusCode")}
          </Badge>
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
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          <Button size={"sm"} onClick={() => onDetail(row.original)}>
            详情
          </Button>
        </div>
      );
    },
  },
];
