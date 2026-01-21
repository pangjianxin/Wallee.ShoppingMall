"use client";
import { ReactNode, useState } from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { cache } from "react";

function TanstackQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(new QueryClient());

  return (
    <>
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </QueryClientProvider>
    </>
  );
}

/**
 * 获取服务端 QueryClient 实例（使用 React cache 确保单例）
 */
export const getQueryClient = cache(() => new QueryClient());

export { TanstackQueryProvider };
