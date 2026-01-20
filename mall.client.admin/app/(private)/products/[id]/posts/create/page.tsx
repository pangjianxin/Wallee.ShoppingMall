import { NextPage } from "next";
import { productGet } from "@/openapi";
import { client } from "@/hey-api/client";
import { CreateProductPost } from "@/components/products/create-post";
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

  return <CreateProductPost product={product} />;
};

Page.displayName = "ProductPostsCreatePage";

export default Page;
