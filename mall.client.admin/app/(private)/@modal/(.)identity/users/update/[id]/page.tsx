import UpdateUser from "@/components/identity/users/update";
import {
  userGet,
  userGetRoles,
  userGetAssignableRoles,
} from "@/openapi/sdk.gen";
import { client } from "@/hey-api/client";
import { Error } from "@/components/shared/error-page";

const UserUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data: user, error: userError } = await userGet({
    client: client,
    path: { id: id },
  });
  const { data: userRoles, error: userRolesError } = await userGetRoles({
    client: client,
    path: { id: id },
  });

  const { data: assignableRoles, error: assignableRolesError } =
    await userGetAssignableRoles({
      client: client,
    });

  if (userError) {
    return <Error errorResponse={userError} />;
  }

  if (userRolesError) {
    return <Error errorResponse={userRolesError} />;
  }

  if (assignableRolesError) {
    return <Error errorResponse={assignableRolesError} />;
  }

  return (
    <UpdateUser
      user={user}
      userAssignableRoles={assignableRoles}
      userRoles={userRoles}
    ></UpdateUser>
  );
};

export default UserUpdatePage;
