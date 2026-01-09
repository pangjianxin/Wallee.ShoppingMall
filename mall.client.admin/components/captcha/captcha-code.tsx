"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useGenerateCaptcha } from "@/hooks/captcha/use-captcha";

interface VerificationCodeImageProps {
  onChange: (captchaKey: string | undefined) => void;
}

export function VerificationCodeImage({
  onChange,
}: VerificationCodeImageProps) {
  const { data, isLoading, refetch } = useGenerateCaptcha();

  // Pass the captchaKey to the parent component whenever it changes
  useEffect(() => {
    if (data?.captchaId) {
      onChange(data.captchaId);
    }
  }, [data, onChange]);

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div
      className="relative h-[60px] w-[160px] cursor-pointer overflow-hidden rounded border"
      onClick={handleRefresh}
      title="点击刷新验证码"
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Image
          src={data?.captchaBase64Image || ""}
          alt="验证码"
          fill
          sizes="100%"
          className="object-contain"
          unoptimized
        />
      )}
    </div>
  );
}
