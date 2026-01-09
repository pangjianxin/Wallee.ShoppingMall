import { createClient } from "@/openapi/client";
import { auth as aAuth } from "@/auth";

export const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  auth: async () => {
    const session = await aAuth();
    return session?.accessToken;
  },
});


