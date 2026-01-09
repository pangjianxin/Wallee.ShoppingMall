import PermissionUpdate from "@/components/permission/permission-form";

const UserPermission = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <PermissionUpdate
      providerKey={id}
      providerName="U"
      providerKeyDisplayName="用户权限设置"
    />
  );
};

export default UserPermission;
