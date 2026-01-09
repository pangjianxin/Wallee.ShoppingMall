import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileChangePassword } from "@/openapi";

export const useUpdateAccountPassword = () => {
  const schema = z
    .object({
      currentPassword: z.string().min(1, "当前密码不能为空"),
      newPassword: z.string().min(1, "新密码不能为空"),
      confirmPassword: z.string().min(1, "确认密码不能为空"),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "新密码和确认密码不一致",
          path: ["confirmPassword"],
        });
      }
    });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValue) => {
    await profileChangePassword({
      throwOnError: true,
      body: data,
    });
  };

  return {
    form,
    onSubmit,
  };
};
