import { userCreate, VoloAbpIdentityIdentityUserCreateDto } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useCreateUser = () => {
  const schema = z.object({
    userName: z.string().min(1, { message: "用户名不能为空" }),
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email({ message: "邮箱格式不正确" }),
    phoneNumber: z.string().min(1, { message: "手机号不能为空" }),
    isActive: z.boolean().default(false).optional(),
    lockoutEnabled: z.boolean(),
    roleNames: z.array(z.string()).optional(),
    password: z
      .string()
      .min(7, { message: "密码长度不能小于8" })
      .regex(/[a-z]/, { message: "密码必须包含小写字母" })
      .regex(/[A-Z]/, { message: "密码必须包含大写字母" })
      .regex(/\d/, { message: "密码必须包含数字" }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      isActive: true,
      lockoutEnabled: true,
      roleNames: [],
      password: "",
    },
  });

  const submit: SubmitHandler<VoloAbpIdentityIdentityUserCreateDto> = async (
    data
  ) => {
    const { data: res } = await userCreate({
      throwOnError: true,
      body: data,
    });
    return res;
  };

  return {
    submit,
    form,
  };
};
