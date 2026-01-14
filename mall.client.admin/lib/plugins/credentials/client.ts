/**
 * 客户端 Credentials Plugin
 */

import type { z } from "zod";

export interface CredentialsClientOptions<TSchema extends z.ZodSchema> {
  /**
   * 登录端点路径
   * @default "/sign-in/credentials"
   */
  path?: string;
}

/**
 * 创建客户端 credentials plugin
 */
export function credentialsClient<TUserType = any, TPath extends string = "/sign-in/credentials", TSchema extends z.ZodSchema = z.ZodSchema>() {
  const path = "/sign-in/credentials";
  
  return {
    id: "credentials-client",
    $InferServerPlugin: {} as ReturnType<typeof import("./index").credentials<TSchema>>,
    getActions: ($fetch: any) => {
      return {
        signInCredentials: async (data: z.infer<TSchema>) => {
          return await $fetch(path, {
            method: "POST",
            body: data,
          });
        },
      };
    },
  };
}
