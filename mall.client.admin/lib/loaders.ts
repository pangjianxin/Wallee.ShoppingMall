import { createLoader, parseAsString } from "nuqs/server";

export const productIdParams = {
  productId: parseAsString,
};
export const productIdLoader = createLoader(productIdParams);

