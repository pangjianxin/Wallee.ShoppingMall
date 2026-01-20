import ProductDetail from "@/components/mobile/products/detail";
import { client } from "@/hey-api/client";
import { productGet } from "@/openapi";
import { FC } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const ProductDetailPage: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: product } = await productGet({
    client,
    throwOnError: true,
    path: {
      id: id,
    },
  });
  return <ProductDetail product={product} />;
};
export default ProductDetailPage;
