import { postCreate, WalleeMallCmsPostCategory } from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCreatePost = ({
  productId = undefined,
}: {
  productId?: string;
}) => {
  const schema = z.object({
    productId: z.string().optional(),
    category: z
      .enum(WalleeMallCmsPostCategory, {
        message: "分类不能为空",
      })
      .optional(),
    title: z.string().optional(),
    content: z.string().min(1, { message: "内容不能为空" }),
  });
  type FormValue = z.infer<typeof schema>;
  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: productId,
      category: WalleeMallCmsPostCategory.商品详情,
      title: "",
      content: "",
    },
  });
  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await postCreate({
      throwOnError: true,
      body: {
        ...data,
      },
    });
    return res;
  };

  return { form, submit };
};
