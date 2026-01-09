import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleUpdate, VoloAbpIdentityIdentityRoleDto } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";

export const useUpdateRole = (
  role: VoloAbpIdentityIdentityRoleDto | undefined | null
) => {
  const schema = z.object({
    name: z.string().min(1, { message: "角色名称不能为空" }),
    isDefault: z.boolean(),
    isPublic: z.boolean(),
    concurrencyStamp: z.string(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name ?? "",
      isDefault: role?.isDefault as boolean,
      isPublic: role?.isPublic as boolean,
      concurrencyStamp: role?.concurrencyStamp ?? "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await roleUpdate({
      throwOnError: true,
      path: { id: role?.id as string },
      body: data,
    });
    return res;
  };
  return { form, submit };
};
