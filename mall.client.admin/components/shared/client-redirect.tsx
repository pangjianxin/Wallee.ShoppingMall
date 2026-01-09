"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/shared/loading";

interface ClientRedirectProps {
  to: string;
  replace?: boolean;
  message?: string;
  delayMs?: number; // 可选：延迟跳转，用于更稳定显示 Loading
}

export default function ClientRedirect({ to, replace = true, message, delayMs = 0 }: ClientRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      if (replace) router.replace(to);
      else router.push(to);
    }, delayMs);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [to, replace, delayMs, router]);

  return <LoadingState title={message || "正在跳转，请稍候..."} />;
}
