import { NextPage } from "next";
import { productGet } from "@/openapi";
import { client } from "@/hey-api/client";
import UpdateProductTags from "@/components/products/update-tags";
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

  return <UpdateProductTags product={product} />;
};

Page.displayName = "UpdateProductTagsPage";

export default Page;
