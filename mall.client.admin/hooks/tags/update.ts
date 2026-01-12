import { tagUpdate, WalleeMallTagsDtosTagDto } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useUpdateTag = ({
  entity,
}: {
  entity: WalleeMallTagsDtosTagDto;
}) => {
  const schema = z.object({
    name: z.string().min(2, { message: "标签名称不能为空" }),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name || "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    const { data: res } = await tagUpdate({
      throwOnError: true,
      path: { id: entity.id as string },
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
