import DeleteUser from "@/components/identity/users/delete";
import { userGet } from "@/openapi/sdk.gen";
import { client } from "@/hey-api/client";

const UserDeletePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data: user } = await userGet({
    client: client,
    path: {
      id: id,
    },
  });

  return <DeleteUser user={user} />;
};

export default UserDeletePage;
