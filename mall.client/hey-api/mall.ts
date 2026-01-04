import type { CreateClientConfig } from "@/openapi/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
  const isServer = typeof window === "undefined";

  // On the server, always call the cluster-internal API to avoid DNS/egress issues.
  // In the browser, use a relative base so requests go through our Next.js Route Handlers
  // (e.g. /api/**) where we attach auth and proxy to the internal service.
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_APP_URL
    : ""; // relative for browser

  return {
    ...config,
    throwOnError: true,
    baseUrl,
  };
};
