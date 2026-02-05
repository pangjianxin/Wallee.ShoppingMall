"use client";
import { Card } from "@/components/ui/card";
import { createColumns } from "@/components/audit-logs/columns";
import { DataTable } from "@/components/data-table/data-table";
import {
  VoloAbpApplicationDtosPagedResultDtoOfAuditLogDto,
  WalleeMallAuditLogsDtosAuditLogDto,
} from "@/openapi";
import { useRouter } from "next/navigation";
import { FC, use, useCallback, useMemo, useTransition } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import Loader from "@/components/shared/loading";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfAuditLogDto;
    error: unknown;
    pageCount: number;
  }>;
};

const AuditLogs: FC<Props> = ({ promise }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data, error, pageCount } = use(promise);
  const handleDetail = useCallback(
    (v: WalleeMallAuditLogsDtosAuditLogDto) => {
      router.push(`/audit-logs/${v.id}`);
    },
    [router],
  );

  const columns = useMemo(() => {
    return createColumns(handleDetail);
  }, [handleDetail]);

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<WalleeMallAuditLogsDtosAuditLogDto>({
      data: data?.items || [],
      pageCount: pageCount,
      columns: columns,
      getRowId: (row) => row.id as string,
      initialState: {
        columnPinning: {
          right: ["actions"],
        },
        sorting: [{ id: "executionTime", desc: true }],
      },
      shallow: false,
      clearOnDefault: true,
      startTransition: startTransition,
      // 不使用 enableAdvancedFilter，让 use-data-table 管理简单过滤器
      // 高级过滤器通过上面的 useQueryState 单独管理
    });

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    console.log(parseVoloAbpError(error));
  }

  return (
    <>
      <Card className="w-full p-5  border-none shadow-none transition-all ease-in-out duration-100 hover:shadow-lg">
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} />
            <DataTableFilterList
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
              align="start"
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      </Card>
    </>
  );
};

export default AuditLogs;
