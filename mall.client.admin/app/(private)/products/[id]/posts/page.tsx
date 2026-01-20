import { NextPage } from "next";
import { productPostGetListByProduct, productGet } from "@/openapi";
import { client } from "@/hey-api/client";
import { ProductPostTabs } from "@/components/products/post-tabs";
type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: product } = await productGet({
    throwOnError: true,
    client,
    path: { id },
  });
  const { data: posts } = await productPostGetListByProduct({
    throwOnError: true,
    client,
    path: { productId: id },
  });

  return <ProductPostTabs product={product} posts={posts || []} />;
};

Page.displayName = "ProductPostsPage";

export default Page;
