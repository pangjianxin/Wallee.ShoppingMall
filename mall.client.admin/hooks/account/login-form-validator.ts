import { z } from "zod";

// Client-side validation schema
export const schema = z.object({
  username: z.string().min(1, { message: "用户名不能为空" }),
  password: z.string().min(6, { message: "密码长度不能小于6位" }),
  captchaid: z.string().min(4, { message: "验证码ID不能为空" }),
  captchacode: z.string().min(4, { message: "验证码长度不能小于4位" }),
  remember: z.boolean().optional(),
});

export type FormValues = z.infer<typeof schema>;