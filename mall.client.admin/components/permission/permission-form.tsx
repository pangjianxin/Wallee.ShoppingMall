"use client";
import { useState, useEffect, FC, JSX, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  permissionsUpdate,
  VoloAbpPermissionManagementGetPermissionListResultDto,
  VoloAbpPermissionManagementPermissionGrantInfoDto,
  VoloAbpPermissionManagementPermissionGroupDto,
} from "@/openapi";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/identity/usePermissions";
import Loader from "@/components/shared/loading";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { permissionsGetQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { dynamicClaimsRefresh } from "@/openapi";

const PermissionItem = ({
  permission,
  onChange,
  level = 0,
  providerName,
  providerKey,
}: {
  permission: VoloAbpPermissionManagementPermissionGrantInfoDto;
  onChange: (name: string, isGranted: boolean) => void;
  level: number;
  providerName: string;
  providerKey: string;
}) => {
  const isDisabled = isPermissionDisabled(
    permission,
    providerName,
    providerKey
  );

  return (
    <div
      className={`flex items-center space-x-2 py-1`}
      style={{ paddingLeft: `${level * 1.5}rem` }}
    >
      <Checkbox
        id={permission.name!}
        checked={permission.isGranted}
        onCheckedChange={(checked) =>
          onChange(permission.name!, checked as boolean)
        }
        disabled={isDisabled}
      />
      <label
        htmlFor={permission.name!}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          isDisabled ? "opacity-50" : ""
        }`}
      >
        {permission.displayName}
      </label>
    </div>
  );
};

const PermissionGroup = ({
  group,
  onChange,
  providerName,
  providerKey,
}: {
  group: VoloAbpPermissionManagementPermissionGroupDto;
  onChange: (name: string, isGranted: boolean) => void;
  providerName: string;
  providerKey: string;
}) => {
  const isAllChecked = useMemo(() => {
    return (
      group.permissions?.every(
        (permission) =>
          permission.isGranted &&
          !isPermissionDisabled(permission, providerName, providerKey)
      ) ?? false
    );
  }, [group.permissions, providerName, providerKey]);

  const handleGroupChange = (checked: boolean) => {
    group.permissions?.forEach((permission) => {
      if (
        permission.name &&
        !isPermissionDisabled(permission, providerName, providerKey)
      ) {
        onChange(permission.name, checked);
      }
    });
  };

  const renderPermissions = (
    permissions: VoloAbpPermissionManagementPermissionGrantInfoDto[],
    parentName: string | null = null,
    level = 0
  ): JSX.Element[] => {
    return permissions
      .filter((permission) => permission.parentName === parentName)
      .map((permission) => (
        <div key={permission.name}>
          <PermissionItem
            permission={permission}
            onChange={onChange}
            level={level}
            providerName={providerName}
            providerKey={providerKey}
          />
          {renderPermissions(permissions, permission.name, level + 1)}
        </div>
      ));
  };

  const areAllPermissionsDisabled =
    group.permissions?.every((permission) =>
      isPermissionDisabled(permission, providerName, providerKey)
    ) ?? true;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
        <Checkbox
          id={group.name || ""}
          checked={isAllChecked}
          onCheckedChange={handleGroupChange}
          disabled={areAllPermissionsDisabled}
          className="h-5 w-5"
        />
        <label
          htmlFor={group.name || ""}
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            areAllPermissionsDisabled ? "opacity-50" : ""
          }`}
        >
          {group.displayName}{" "}
          <span className="text-muted-foreground">(全选)</span>
        </label>
      </div>
      <div className="space-y-1 ml-4">
        {renderPermissions(group.permissions || [])}
      </div>
    </div>
  );
};
const isPermissionDisabled = (
  permission: VoloAbpPermissionManagementPermissionGrantInfoDto,
  providerName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  providerKey: string
): boolean => {
  // 如果 allowedProviders 和 grantedProviders 都为空，则不禁用
  if (
    !permission.allowedProviders?.length &&
    !permission.grantedProviders?.length
  ) {
    return false;
  }

  // 如果 allowedProviders 不为空，检查 providerName 是否在其中
  if (permission.allowedProviders?.length) {
    return !permission.allowedProviders.includes(providerName);
  }

  // 如果 grantedProviders 不为空，检查是否包含任何与传入的 providerName 不符的项
  if (permission.grantedProviders?.length) {
    return permission.grantedProviders.some(
      (provider) => provider.providerName !== providerName
    );
  }

  // 如果以上条件都不满足，默认不禁用
  return false;
};

type Props = {
  providerName: string;
  providerKey: string;
  providerKeyDisplayName: string;
};

const UpdatePermission: FC<Props> = ({
  providerName,
  providerKey,
  providerKeyDisplayName,
}) => {
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isFetched: isPermissionsFetched,
  } = usePermissions(providerName, providerKey);

  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [permissionState, setPermissionState] =
    useState<VoloAbpPermissionManagementGetPermissionListResultDto>(
      permissions || { groups: [] }
    );
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  const handlePermissionChange = (name: string, isGranted: boolean) => {
    setPermissionState((prevState) => ({
      ...prevState,
      groups:
        prevState.groups?.map((group) => ({
          ...group,
          permissions:
            group.permissions?.map((permission) =>
              permission.name === name
                ? { ...permission, isGranted }
                : permission
            ) || [],
        })) || [],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const permissions = permissionState.groups?.flatMap(
        (group) =>
          group.permissions?.map((permission) => ({
            name: permission.name,
            isGranted: permission.isGranted,
          })) || []
      );
      await permissionsUpdate({
        throwOnError: true,
        query: {
          providerKey,
          providerName,
        },
        body: {
          permissions,
        },
      });
      await dynamicClaimsRefresh({
        throwOnError: true,
      });
      toast.success("保存成功", {
        richColors: true,
        description: "权限保存成功",
      });
      await queryClient.invalidateQueries({
        queryKey: permissionsGetQueryKey({
          query: {
            providerName: providerName,
            providerKey: providerKey,
          },
        }),
      });
      handleClose();
    } catch (e: any) {
      toast.error("保存失败", {
        richColors: true,
        description: e.error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPermissionsFetched) {
      setPermissionState(permissions!);
    }
  }, [isPermissionsFetched, permissions]);

  if (isPermissionsLoading) {
    return <Loader />;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>权限配置-{providerKeyDisplayName}</DialogTitle>
          <DialogDescription>{providerName}</DialogDescription>
        </DialogHeader>
        <div className="grow overflow-hidden">
          <Tabs
            defaultValue={permissionState.groups?.[0]?.name || "tab0"}
            className="w-full h-full flex flex-col"
          >
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                {permissionState.groups?.map((group, index) => (
                  <TabsTrigger
                    key={group.name || `tab${index}`}
                    value={group.name || `tab${index}`}
                    className="ring-offset-background focus-visible:ring-ring px-3 py-2"
                  >
                    {group.displayName}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-3" />
            </ScrollArea>
            <div className="grow overflow-hidden">
              {permissionState.groups?.map((group, index) => (
                <TabsContent
                  key={group.name || `tab${index}`}
                  value={group.name || `tab${index}`}
                  className="h-full"
                >
                  <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
                    <PermissionGroup
                      group={group}
                      onChange={handlePermissionChange}
                      providerName={providerName}
                      providerKey={providerKey}
                    />
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>取消</Button>
          </DialogClose>
          <LoadingButton loading={loading} onClick={handleSubmit}>
            保存
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePermission;
