import { roleGet } from "@/openapi";
import { client } from "@/hey-api/client";
import DeleteRole from "@/components/identity/roles/delete";
const RoleDeletePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: role } = await roleGet({
    client: client,
    path: {
      id,
    },
  });
  return <DeleteRole role={role!} />;
};

export default RoleDeletePage;
