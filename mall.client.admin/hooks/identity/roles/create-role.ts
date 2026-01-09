import { roleCreate } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useCreateRole = () => {
  const schema = z.object({
    name: z.string().min(1, { message: "角色名称不能为空" }),
    isDefault: z.boolean().optional(),
    isPublic: z.boolean().optional(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      isDefault: false,
      isPublic: false,
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await roleCreate({
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
