import { productCreate } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMedia } from "@/hooks/medias/use-media";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const useCreateProduct = () => {
  const { uploadMedia } = useMedia();
  const schema = z.object({
    name: z.string().min(1, { message: "角色名称不能为空" }),
    brand: z.string().min(1, { message: "品牌不能为空" }),
    shortDescription: z.string().min(1, { message: "简短描述不能为空" }),
    originalPrice: z.number().min(0, { message: "原价不能小于0" }),
    sortOrder: z.number().optional(),
    discountRate: z
      .number()
      .min(0.01, { message: "折扣率不能小于0" })
      .max(1, { message: "折扣率不能大于1" }),
    productCovers: z
      .array(z.custom<File>())
      .min(1, { message: "请上传至少一张产品封面" })
      .max(10, { message: "最多上传10张产品封面" })
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
      name: "",
      brand: "",
      shortDescription: "",
      discountRate: 1,
      originalPrice: 0,
      sortOrder: 0,
      productCovers: [],
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const uploadedMediaIds = [];
    for (const file of data.productCovers) {
      const media = await uploadMedia(file);
      uploadedMediaIds.push(media.id);
    }
    const { data: res } = await productCreate({
      throwOnError: true,
      body: {
        ...data,
        productCovers: uploadedMediaIds as string[],
      },
    });
    return res;
  };

  return {
    submit,
    form,
  };
};
