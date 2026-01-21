import ProductDetail from "@/components/mobile/products/detail";
import { client } from "@/hey-api/client";
import { productGet, productPostGetListByProduct } from "@/openapi";
import { FC } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = async ({ params }) => {
  const { id } = await params;

  const { data: product } = await productGet({
    client,
    throwOnError: true,
    path: {
      id: id,
    },
  });

  const { data: posts } = await productPostGetListByProduct({
    client,
    throwOnError: true,
    path: {
      productId: id,
    },
  });

  return <ProductDetail product={product} posts={posts} />;
};

Page.displayName = "ProductDetailPage";

export default Page;
