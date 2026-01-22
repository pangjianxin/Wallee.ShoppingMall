import { carouselCreate } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMedia } from "@/hooks/medias/use-media";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const useCreateCarousel = ({ productId }: { productId?: string }) => {
  const { uploadMedia } = useMedia();
  const schema = z.object({
    title: z.string().min(1, { error: "标题不能为空" }),
    description: z.string().optional(),
    coverImageMediaId: z
      .array(z.custom<File>())
      .min(1, { message: "请上传至少1张封面" })
      .max(1, { message: "最多上传1张封面" })
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
        {
          message: "不支持的文件格式",
        },
      )
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
        message: "文件大小不能超过5MB",
      }),
    priority: z.number().optional(),
    productId: z.string().optional(),
    content: z.string().min(1, { error: "内容不能为空" }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      coverImageMediaId: [],
      priority: 1,
      productId: productId || "",
      content: "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const uploadedMediaIds = [];
    for (const file of data.coverImageMediaId) {
      const media = await uploadMedia(file);
      uploadedMediaIds.push(media.id);
    }
    const { data: res } = await carouselCreate({
      throwOnError: true,
      body: {
        ...data,
        coverImageMediaId: uploadedMediaIds[0],
      },
    });
    return res;
  };

  return {
    submit,
    form,
  };
};
