"use client";
import { DataTable } from "@/components/data-table/data-table";
import { use, type FC } from "react";
import { Card } from "@/components/ui/card";
import { createColumns } from "@/components/medias/columns";
import {
  VoloAbpApplicationDtosPagedResultDtoOfMallMediaDto,
  WalleeMallMediasDtosMallMediaDto,
} from "@/openapi";
import { download } from "@/hooks/medias/use-download";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableAdvancedToolbar } from "../data-table/data-table-advanced-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";

type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfMallMediaDto;
    error: unknown;
    pageCount: number;
  }>;
};

const List: FC<Props> = ({ promise }) => {
  const { data, pageCount } = use(promise);
  const handleDownload = async (row: WalleeMallMediasDtosMallMediaDto) => {
    await download({ id: row.id as string });
  };

  const columns = createColumns({ onDownload: handleDownload });

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<WalleeMallMediasDtosMallMediaDto>({
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
