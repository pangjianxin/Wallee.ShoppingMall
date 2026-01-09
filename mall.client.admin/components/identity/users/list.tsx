"use client";

import { createColumns } from "@/components/identity/users/columns";
import {
  VoloAbpApplicationDtosPagedResultDtoOfIdentityUserDto,
  VoloAbpIdentityIdentityUserDto,
} from "@/openapi";
import { FC, use } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PermissionButton } from "@/components/auth/permission-button";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

type Props = {
  promise: Promise<{
    data: VoloAbpApplicationDtosPagedResultDtoOfIdentityUserDto | undefined;
    error: unknown;
    pageCount: number;
  }>;
};
const UserList: FC<Props> = ({ promise }) => {
  const { data, error, pageCount } = use(promise);

  const router = useRouter();

  const handleCreate = () => {
    router.push("/identity/users/create");
  };

  const handleUpdate = (v: VoloAbpIdentityIdentityUserDto) => {
    router.push(`/identity/users/update/${v.id}`);
  };

  const handleDelete = (v: VoloAbpIdentityIdentityUserDto) => {
    router.push(`/identity/users/delete/${v.id}`);
  };

  const handlePermission = (v: VoloAbpIdentityIdentityUserDto) => {
    router.push(`/identity/users/permissions/${v.id}`);
  };

  const columns = createColumns({
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onPermission: handlePermission,
  });

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<VoloAbpIdentityIdentityUserDto>({
      data: data?.items || [],
      pageCount: pageCount,
      columns: columns,
      getRowId: (row) => row.id as string,
      initialState: {
        sorting: [{ id: "creationTime", desc: true }],
        columnPinning: { right: ["actions"] },
        columnVisibility: {
          filter: false,
        },
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
            <DataTableSortList table={table} />
            <div className="flex-1"></div>
            <PermissionButton
              permission="AbpIdentity.Users.Create"
              size="sm"
              onClick={handleCreate}
            >
              新建用户
            </PermissionButton>
          </DataTableAdvancedToolbar>
        </DataTable>
      </Card>
    </>
  );
};

export default UserList;
