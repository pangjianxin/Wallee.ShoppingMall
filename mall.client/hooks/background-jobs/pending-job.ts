import { backgroundJobPending } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const usePendingBackgroundJob = ({ id }: { id: string }) => {
  const schema = z.object({
    nextTryTime: z.string().datetime({ message: "请输入合法的时间" }),
  });
  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    await backgroundJobPending({
      throwOnError: true,
      path: { id },
      body: data,
    });
  };

  return { form, submit };
};
