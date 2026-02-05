import {
  productUpdate,
  WalleeMallProductsDtosProductDto,
} from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useUpdateProduct = ({
  entity,
}: {
  entity: WalleeMallProductsDtosProductDto;
}) => {
  const schema = z.object({
    name: z.string().min(1, { message: "角色名称不能为空" }),
    brand: z.string().min(1, { message: "品牌不能为空" }),
    shortDescription: z.string().min(1, { message: "简短描述不能为空" }),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name || "",
      brand: entity.brand || "",
      shortDescription: entity.shortDescription || "",
      sortOrder: entity.sortOrder || 0,
      isActive: entity.isActive ?? true,
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    // 更新产品基本信息
    const { data: res } = await productUpdate({
      throwOnError: true,
      path: {
        id: entity.id!,
      },
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
