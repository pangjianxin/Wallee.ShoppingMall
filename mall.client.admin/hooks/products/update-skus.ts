import { WalleeMallProductsDtosProductDto, productUpdateSkus } from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useUpdateProductSkus = ({
  entity,
}: {
  entity: WalleeMallProductsDtosProductDto;
}) => {
  const schema = z.object({
    items: z
      .array(
        z.object({
          id: z.string().optional(),
          jdSkuId: z.string().optional(),
          originalPrice: z.number().min(0, { message: "原价不能为负数" }),
          price: z.number().min(0, { message: "现价不能为负数" }),
          jdPrice: z.number().optional(),
          stockQuantity: z.number().min(0, { message: "库存数量不能为负数" }),
          attributes: z.array(
            z.object({
              key: z.string().min(1, { message: "属性键不能为空" }),
              value: z.string().min(1, { message: "属性值不能为空" }),
            }),
          ),
        }),
      )
      .min(1, { message: "请至少添加一个 SKU" }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      items:
        entity.skus?.map((sku) => ({
          id: sku.id,
          jdSkuId: sku.jdSkuId || "",
          originalPrice: sku.originalPrice || 0,
          price: sku.price || 0,
          jdPrice: sku.jdPrice || 0,
          stockQuantity: sku.stockQuantity || 0,
          attributes:
            sku.attributes?.map((a) => ({
              key: (a as any).key ?? String((a as any).name ?? ""),
              value: (a as any).value ?? String((a as any).val ?? ""),
            })) ?? [],
        })) ?? [],
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: result } = await productUpdateSkus({
      throwOnError: true,
      path: { id: entity.id as string },
      body: {
        items: data.items,
      },
    });
    return result;
  };

  return { form, submit };
};
