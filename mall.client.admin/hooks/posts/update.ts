import {
  postUpdate,
  WalleeMallCmsDtosPostDto,
} from "@/openapi";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useUpdateProductPost = ({
  post,
}: {
  post: WalleeMallCmsDtosPostDto;
}) => {
  const schema = z.object({
    title: z.string().optional(),
    content: z.string().min(1, { message: "内容不能为空" }),
  });
  type FormValue = z.infer<typeof schema>;
  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post.title || "",
      content: post.content || "",
    },
  });
  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await postUpdate({
      path: { id: post.id as string },
      throwOnError: true,
      body: {
        ...data,
      },
    });
    return res;
  };

  return { form, submit };
};
