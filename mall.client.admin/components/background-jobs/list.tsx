"use client";
import { DataTable } from "@/components/data-table/data-table";
import { use, useCallback, useMemo, type FC } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createColumns } from "@/components/background-jobs/columns";
import {
  WalleeMallBackgroundJobsDtosBackgroundJobRecordDto,
  VoloAbpApplicationDtosPagedResultDtoOfBackgroundJobRecordDto,
} from "@/openapi";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableAdvancedToolbar } from "../data-table/data-table-advanced-toolbar";
import { DataTableSortList } from "../data-table/data-table-sort-list";
import { DataTableFilterList } from "../data-table/data-table-filter-list";
type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfBackgroundJobRecordDto;
    error: unknown;
    pageCount: number;
  }>;
};
const List: FC<Props> = ({ promise }) => {
  const router = useRouter();
  const { data, pageCount } = use(promise);

  const handleDelete = useCallback(
    (e: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto) => {
      router.push(`/background-jobs/${e.id as string}/delete`);
    },
    [router]
  );

  const handlePending = useCallback(
    (e: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto) => {
      router.push(`/background-jobs/${e.id as string}/pending-job`);
    },
    [router]
  );
  const columns = useMemo(
    () =>
      createColumns({
        onDeleteJob: handleDelete,
        onPendingJob: handlePending,
      }),
    [handlePending, handleDelete]
  );

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<WalleeMallBackgroundJobsDtosBackgroundJobRecordDto>({
      data: data?.items || [],
      pageCount: pageCount,
      columns: columns,
      getRowId: (row) => row.id as string,
      initialState: {
        sorting: [],
        columnPinning: { right: ["actions"] },
      },
      shallow: false,
      clearOnDefault: true,
    });

  return (
    <>
      <div className="w-full max-w-full">
        <Card className="p-6">
          <DataTable table={table}>
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <div className="flex-1"></div>
            </DataTableAdvancedToolbar>
          </DataTable>
        </Card>
      </div>
    </>
  );
};

export default List;
