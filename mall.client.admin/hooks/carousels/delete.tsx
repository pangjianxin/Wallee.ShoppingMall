import { carouselDelete } from "@/openapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const useDeleteCarousel = ({ id }: { id?: string }) => {
  const schema = z.object({
    id: z.string(),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: id || "",
    },
  });

  const submit: SubmitHandler<FormValue> = async (data) => {
    await carouselDelete({
      throwOnError: true,
      path: { id: data.id },
    });
  };

  return {
    submit,
    form,
  };
};
