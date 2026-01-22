import { UpdateProductPost } from "@/components/product-posts/update";
import { NextPage } from "next";
import { productPostGet } from "@/openapi";
import { client } from "@/hey-api/client";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: productPost } = await productPostGet({
    throwOnError: true,
    client,
    path: { id },
  });

  return <UpdateProductPost post={productPost} />;
};

Page.displayName = "ProductPostUpdatePage";

export default Page;
