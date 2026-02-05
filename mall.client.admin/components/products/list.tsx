"use client";
import {
  VoloAbpApplicationDtosPagedResultDtoOfProductDto,
  WalleeMallProductsDtosProductDto,
} from "@/openapi";
import { FC, use, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createColumns } from "@/components/products/columns";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import CreateProduct from "@/components/products/create";
import CreateProductByJdSku from "@/components/products/create-jd";

type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfProductDto;
    error?: unknown;
    pageCount: number;
  }>;
};

const ProductTable: FC<Props> = ({ promise }) => {
  const router = useRouter();
  const { data, error, pageCount } = use(promise);

  const handleUpdate = useCallback(
    (v: WalleeMallProductsDtosProductDto) => {
      router.push(`/products/${v.id}/update`);
    },
    [router],
  );

  const handleUpdateSkus = useCallback(
    (v: WalleeMallProductsDtosProductDto) => {
      router.push(`/products/${v.id}/update-skus`);
    },
    [router],
  );

  const handleView = useCallback(
    (v: WalleeMallProductsDtosProductDto) => {
      router.push(`/products/${v.id}`);
    },
    [router],
  );

  const columns = useMemo(() => {
    return createColumns({
      onUpdate: handleUpdate,
      onUpdateSkus: handleUpdateSkus,
      onView: handleView,
    });
  }, [handleUpdate, handleUpdateSkus, handleView]);

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<WalleeMallProductsDtosProductDto>({
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
            <CreateProduct />
            <CreateProductByJdSku />
          </DataTableAdvancedToolbar>
        </DataTable>
      </Card>
    </>
  );
};

export default ProductTable;
