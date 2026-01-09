import PermissionUpdate from "@/components/permission/permission-form";

const UserPermission = async ({
  params,
}: {
  params: Promise<{ role: string }>;
}) => {
  const { role } = await params;

  return (
    <PermissionUpdate
      providerKey={role}
      providerName="R"
      providerKeyDisplayName="角色权限变更"
    />
  );
};

export default UserPermission;
