"use client";

import {
  VoloAbpIdentityIdentityRoleDto,
  VoloAbpApplicationDtosPagedResultDtoOfIdentityRoleDto,
} from "@/openapi";
import { FC, use, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createColumns } from "@/components/identity/roles/columns";
import { PermissionButton } from "@/components/auth/permission-button";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfIdentityRoleDto;
    error?: unknown;
    pageCount: number;
  }>;
};

const RoleList: FC<Props> = ({ promise }) => {
  const router = useRouter();
  const { data, error, pageCount } = use(promise);
  const handleCreate = () => {
    router.push(`/identity/roles/create`);
  };

  const handleUpdate = useCallback(
    (v: VoloAbpIdentityIdentityRoleDto) => {
      router.push(`/identity/roles/update/${v.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (v: VoloAbpIdentityIdentityRoleDto) => {
      router.push(`/identity/roles/delete/${v.id}`);
    },
    [router]
  );

  const handlePermission = useCallback(
    (v: VoloAbpIdentityIdentityRoleDto) => {
      router.push(`/identity/roles/permissions/${v.name}`);
    },
    [router]
  );

  const columns = useMemo(() => {
    return createColumns(handleUpdate, handleDelete, handlePermission);
  }, [handleUpdate, handleDelete, handlePermission]);

  const { table, shallow, debounceMs, throttleMs } =
    useDataTable<VoloAbpIdentityIdentityRoleDto>({
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
            <PermissionButton
              size={"sm"}
              onClick={handleCreate}
              permission="AbpIdentity.Roles.Create"
            >
              新建角色
            </PermissionButton>
          </DataTableAdvancedToolbar>
        </DataTable>
      </Card>
    </>
  );
};

export default RoleList;
