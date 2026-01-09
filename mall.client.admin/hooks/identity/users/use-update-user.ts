import { userUpdate, VoloAbpIdentityIdentityUserDto } from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useUpdateUser = (
  user: VoloAbpIdentityIdentityUserDto,
  userRoles: string[]
) => {
  const schema = z.object({
    userName: z.string().min(1, { message: "用户名不能为空" }),
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email({ message: "邮箱格式不正确" }),
    phoneNumber: z.string().min(1, { message: "手机号不能为空" }),
    isActive: z.boolean().default(false).optional(),
    lockoutEnabled: z.boolean(),
    roleNames: z.array(z.string()).optional(),
    password: z.string().optional(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: user?.userName ?? "",
      name: user?.name ?? "",
      surname: user?.surname ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      isActive: user?.isActive as boolean,
      lockoutEnabled: user?.lockoutEnabled as boolean,
      roleNames: userRoles,
      password: "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await userUpdate({
      throwOnError: true,
      path: { id: user.id as string },
      body: data,
    });
    return res;
  };

  return { form, submit };
};
