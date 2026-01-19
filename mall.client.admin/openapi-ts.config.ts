import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

//cre
export default defineConfig([
  {
    input: "http://localhost:44301/swagger/v1/swagger.json",
    output: {
      format: "prettier",
      lint: "eslint",
      path: "openapi",
    },
    parser: {
      transforms: {
        readWrite: {
          enabled: false,
        },
      },
    },
    plugins: [
      ...defaultPlugins,
      { name: "@tanstack/react-query" },
      {
        name: "@hey-api/typescript",
        enums: "typescript",
      },
      { name: "@hey-api/client-next", runtimeConfigPath: "@/hey-api/mall" },
    ],
  },
]);
