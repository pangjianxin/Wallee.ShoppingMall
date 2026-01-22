import {
  productPostUpdate,
  WalleeMallCmsProductPostCategory,
  WalleeMallCmsDtosProductPostDto,
} from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useUpdateProductPost = ({
  post,
}: {
  post: WalleeMallCmsDtosProductPostDto;
}) => {
  const schema = z.object({
    category: z.enum(WalleeMallCmsProductPostCategory, {
      message: "分类不能为空",
    }),
    content: z.string().min(1, { message: "内容不能为空" }),
  });
  type FormValue = z.infer<typeof schema>;
  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: post.category,
      content: post.content || "",
    },
  });
  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await productPostUpdate({
      path: { id: post.id as string },
      throwOnError: true,
      body: {
        ...data,
      },
    });
    return res;
  };

  return { form, submit };
};
