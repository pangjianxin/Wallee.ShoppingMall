import { cartAddItem } from "@/openapi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useAddItemToCart = () => {
  const schema = z.object({
    skuId: z.string().min(1, "产品ID不能为空"),
    quantity: z.number().min(1, "数量必须至少为1"),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      skuId: "",
      quantity: 1,
    },
  });

  const onSubmit = async (data: FormValue) => {
    await cartAddItem({
      throwOnError: true,
      body: data,
    });
  };

  return {
    form,
    onSubmit,
  };
};
