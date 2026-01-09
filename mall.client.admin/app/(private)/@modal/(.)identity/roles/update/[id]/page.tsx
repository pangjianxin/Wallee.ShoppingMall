import UpdateRole from "@/components/identity/roles/update";
import { Error } from "@/components/shared/error-page";
import { client } from "@/hey-api/client";
import { roleGet } from "@/openapi/sdk.gen";

const RoleUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: role, error: roleError } = await roleGet({
    client: client,
    path: { id: id },
  });

  if (roleError) {
    return <Error errorResponse={roleError} />;
  }
  return <UpdateRole role={role}></UpdateRole>;
};

export default RoleUpdatePage;
