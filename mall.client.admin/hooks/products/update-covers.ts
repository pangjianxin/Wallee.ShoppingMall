import {
  productUpdateCovers,
  WalleeMallProductsDtosProductCoverDto,
  WalleeMallProductsDtosProductDto,
} from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMedia } from "@/hooks/medias/use-media";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const useUpdateProductCovers = ({
  entity,
}: {
  entity: WalleeMallProductsDtosProductDto;
}) => {
  const { uploadMedia } = useMedia();
  const schema = z.object({
    productCovers: z.array(z.custom<WalleeMallProductsDtosProductCoverDto>()),
    // 新上传的封面文件
    newCovers: z
      .array(z.custom<File>())
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
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
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

    await productUpdateCovers({
      path: { id: entity.id as string },
      body: {
        productCovers: [
          ...data.productCovers.map((cover) => cover.mallMediaId as string),
          ...(uploadedMediaIds as string[]),
        ],
      },
      throwOnError: true,
    });
  };

  return { form, submit };
};
