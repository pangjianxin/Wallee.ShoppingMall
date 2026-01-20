import { productPostCreate, WalleeMallCmsProductPostCategory } from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCreateProductPost = ({ productId }: { productId: string }) => {
  const schema = z.object({
    productId: z.string().min(1, { message: "产品ID不能为空" }),
    category: z.enum(WalleeMallCmsProductPostCategory, {
      message: "分类不能为空",
    }),
    content: z.string().min(1, { message: "内容不能为空" }),
  });
  type FormValue = z.infer<typeof schema>;
  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: productId,
      category: WalleeMallCmsProductPostCategory.产品详情,
      content: "",
    },
  });
  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await productPostCreate({
      throwOnError: true,
      body: {
        ...data,
      },
    });
    return res;
  };

  return { form, submit };
};
