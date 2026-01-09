"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  VoloAbpBackgroundJobsBackgroundJobPriority,
  WalleeMallBackgroundJobsDtosBackgroundJobRecordDto,
} from "@/openapi";
import { format } from "date-fns";
import { Calendar, Delete, Menu } from "lucide-react";
import { PermissionButton } from "@/components/auth/permission-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type Props = {
  onPendingJob: (
    entity: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto
  ) => void;
  onDeleteJob: (
    entity: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto
  ) => void;
};

export const createColumns = ({
  onPendingJob,
  onDeleteJob,
}: Props): ColumnDef<WalleeMallBackgroundJobsDtosBackgroundJobRecordDto>[] => [
  {
    id: "actions",
    meta: { label: "操作" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="操作" />
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className={cn("flex items-center space-x-2")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 data-[state=open]:bg-accent"
            >
              <Menu className="mr-2 h-4 w-4 text-muted-foreground/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <PermissionButton
                size="sm"
                variant="ghost"
                onClick={() => onPendingJob(row.original)}
                permission="HrTools.BackgroundJob.Update"
                disabled={row.original.isAbandoned === true}
              >
                <Calendar />
                立即执行
              </PermissionButton>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PermissionButton
                size="sm"
                variant="destructive"
                onClick={() => onDeleteJob(row.original)}
                permission="HrTools.BackgroundJob.Delete"
              >
                <Delete />
                立即删除
              </PermissionButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 20,
  },
  // {
  //   accessorKey: "applicationName",
  //   meta: { label: "应用名称" },
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       label="应用名称"
  //       className="min-w-[100px]"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <Badge variant={"default"}>{row.getValue("applicationName")}</Badge>
  //     );
  //   },
  // },
  {
    id: "jobName",
    accessorKey: "jobName",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="任务名称" />
    ),
    cell: ({ row }) => {
      return <Badge variant={"default"}>{row.getValue("jobName")}</Badge>;
    },
    meta: {
      label: "任务名称",
      variant: "text",
      placeholder: "请输入任务名称",
    },
    enableColumnFilter: true,
    size: 150,
  },
  {
    accessorKey: "tryCount",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="尝试次数" />
    ),
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue("tryCount")}</span>;
    },
    meta: { label: "尝试次数" },
    enableColumnFilter: false,
    size: 80,
  },
  {
    accessorKey: "nextTryTime",
    meta: { label: "下次尝试时间" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="下次尝试时间" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {format(row.getValue("nextTryTime") as string, "yyyy-MM-dd HH:mm:ss")}
        </span>
      );
    },
    size: 100,
  },

  {
    accessorKey: "lastTryTime",
    meta: { label: "上次尝试时间" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="上次尝试时间" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {row.getValue("lastTryTime")
            ? format(
                row.getValue("lastTryTime") as string,
                "yyyy-MM-dd HH:mm:ss"
              )
            : "-"}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "isAbandoned",
    meta: { label: "是否放弃" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="是否放弃" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {row.getValue<boolean>("isAbandoned") ? "是" : "否"}
        </span>
      );
    },
    size: 80,
  },
  {
    accessorKey: "priority",
    meta: { label: "优先级" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="优先级" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant={"outline"}>
          {
            VoloAbpBackgroundJobsBackgroundJobPriority[
              row.getValue<number>("priority")
            ]
          }
        </Badge>
      );
    },
    size: 80,
  },
  {
    accessorKey: "creationTime",
    meta: { label: "创建时间" },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="创建时间" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant={"destructive"}>
          {format(
            row.getValue("creationTime") as string,
            "yyyy-MM-dd HH:mm:ss"
          )}
        </Badge>
      );
    },
    size: 80,
  },
];
