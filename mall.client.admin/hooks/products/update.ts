import {
  productUpdate,
  WalleeMallProductsDtosProductDto,
  WalleeMallProductsDtosProductCoverDto,
} from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMedia } from "@/hooks/medias/use-media";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const useUpdateProduct = ({
  entity,
}: {
  entity: WalleeMallProductsDtosProductDto;
}) => {
  const { uploadMedia } = useMedia();

  const schema = z.object({
    name: z.string().min(1, { message: "角色名称不能为空" }),
    brand: z.string().min(1, { message: "品牌不能为空" }),
    shortDescription: z.string().min(1, { message: "简短描述不能为空" }),
    originalPrice: z.number().min(0, { message: "原价不能小于0" }),
    jdPrice: z.number().min(0, { message: "京东参考价不能小于0" }),
    discountRate: z
      .number()
      .min(0.01, { message: "折扣率不能小于0" })
      .max(1, { message: "折扣率不能大于1" }),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
    productCovers: z.array(z.custom<WalleeMallProductsDtosProductCoverDto>()),
    // 新上传的封面文件
    newCovers: z
      .array(z.custom<File>())
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
        {
          message: "不支持的文件格式",
        }
      )
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
        message: "文件大小不能超过5MB",
      }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name || "",
      brand: entity.brand || "",
      shortDescription: entity.shortDescription || "",
      discountRate: entity.discountRate || 1,
      originalPrice: entity.originalPrice || 0,
      sortOrder: entity.sortOrder || 0,
      isActive: entity.isActive ?? true,
      jdPrice: entity.jdPrice ?? 0,
      productCovers: entity.productCovers || [],
      newCovers: [],
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    // 上传新封面
    const uploadedMediaIds = [];
    if (data.newCovers && data.newCovers.length > 0) {
      for (const file of data.newCovers) {
        const media = await uploadMedia(file);
        uploadedMediaIds.push(media.id);
      }
    }

    // 更新产品基本信息
    const { data: res } = await productUpdate({
      throwOnError: true,
      path: {
        id: entity.id!,
      },
      body: {
        ...data,
        productCovers: [
          ...data.productCovers.map((cover) => cover.mallMediaId as string),
          ...(uploadedMediaIds as string[]),
        ],
      },
    });
    return res;
  };

  return {
    submit,
    form,
  };
};
