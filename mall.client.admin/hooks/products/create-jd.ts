import { productCreateByJdSku } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useCreateProductByJdSku = () => {
  const schema = z.object({
    jdSkuId: z.string().min(1, { message: "角色名称不能为空" }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      jdSkuId: "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await productCreateByJdSku({
      throwOnError: true,
      body: {
        ...data,
      },
    });
    return res;
  };

  return {
    submit,
    form,
  };
};
