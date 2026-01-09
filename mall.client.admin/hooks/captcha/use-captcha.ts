"use client";
import { useQuery } from "@tanstack/react-query";
import { captchaGenerate } from "@/openapi";
import { captchaGenerateQueryKey } from "@/openapi/@tanstack/react-query.gen";

export function useGenerateCaptcha() {
  return useQuery({
    queryFn: async () => {
      const { data } = await captchaGenerate();
      return data ?? null;
    },
    queryKey: [captchaGenerateQueryKey()],
  });
}
