import { WalleeMallProductsDtosProductDto, productUpsertSkus } from "@/openapi";
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
          skuCode: z.string().min(1, { message: "SKU 代码不能为空" }),
          originalPrice: z.number().min(0, { message: "原价不能为负数" }),
          discountRate: z
            .number()
            .min(0, { message: "折扣不能为负数" })
            .max(1, { message: "折扣不能大于 1" }),
          jdPrice: z.number().min(0, { message: "京东价不能为负数" }),
          currency: z.string().min(1, { message: "币种不能为空" }),
          stockQuantity: z.number().min(0, { message: "库存数量不能为负数" }),
          attributes: z.array(
            z.object({
              key: z.string().min(1, { message: "属性键不能为空" }),
              value: z.string().min(1, { message: "属性值不能为空" }),
            })
          ),
        })
      )
      .min(1, { message: "请至少添加一个 SKU" }),
    validateSkuCodeUniqueness: z.boolean(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      items:
        entity.skus?.map((sku) => ({
          id: sku.id,
          skuCode: sku.skuCode || "",
          originalPrice: sku.originalPrice || 0,
          discountRate: sku.discountRate ?? 1,
          jdPrice: sku.jdPrice || 0,
          currency: sku.currency || "CNY",
          stockQuantity: sku.stockQuantity || 0,
          attributes:
            sku.attributes?.map((a) => ({
              key: (a as any).key ?? String((a as any).name ?? ""),
              value: (a as any).value ?? String((a as any).val ?? ""),
            })) ?? [],
        })) ?? [],
      validateSkuCodeUniqueness: true,
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: result } = await productUpsertSkus({
      throwOnError: true,
      path: { id: entity.id as string },
      body: {
        validateSkuCodeUniqueness: data.validateSkuCodeUniqueness,
        items: data.items,
      },
    });
    return result;
  };

  return { form, submit };
};
