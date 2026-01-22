"use client";
import {
  VoloAbpApplicationDtosPagedResultDtoOfCarouselDto,
  WalleeMallCarouselsDtosCarouselDto,
} from "@/openapi";
import { FC, use, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createColumns } from "@/components/carousels/columns";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import CreateCarousel from "@/components/carousels/create";

type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfCarouselDto;
    error?: unknown;
    pageCount: number;
  }>;
};

const CarouselTable: FC<Props> = ({ promise }) => {
  const router = useRouter();
  const { data, error, pageCount } = use(promise);

  const handleUpdate = useCallback(
    (v: WalleeMallCarouselsDtosCarouselDto) => {
      router.push(`/carousels/${v.id}/update`);
    },
    [router],
  );

  const handleDelete = useCallback(
    (v: WalleeMallCarouselsDtosCarouselDto) => {
      router.push(`/carousels/${v.id}/delete`);
    },
    [router],
  );

  const columns = useMemo(() => {
    return createColumns({
      onUpdate: handleUpdate,
      onDelete: handleDelete,
    });
  }, [handleUpdate, handleDelete]);

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<WalleeMallCarouselsDtosCarouselDto>({
      data: data?.items || [],
      pageCount: pageCount,
      columns: columns,
      getRowId: (row) => row.id as string,
      initialState: {
        sorting: [{ id: "creationTime", desc: true }],
        columnPinning: { right: ["actions"] },
        columnVisibility: { filter: false },
      },
      shallow: false,
      clearOnDefault: true,
    });

  if (error) {
    console.log(parseVoloAbpError(error));
  }

  return (
    <>
      <Card className="w-full px-3 pt-5 pb-3">
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterMenu
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
            <div className="flex-1"></div>
            <CreateCarousel />
          </DataTableAdvancedToolbar>
        </DataTable>
      </Card>
    </>
  );
};

export default CarouselTable;
