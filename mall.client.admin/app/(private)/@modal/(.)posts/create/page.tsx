import { CreateProductPost } from "@/components/posts/create";
import { NextPage } from "next";
import { SearchParams } from "nuqs";
import { productIdLoader } from "@/lib/loaders";
import { productGet } from "@/openapi";
import { client } from "@/hey-api/client";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page: NextPage<Props> = async ({ searchParams }) => {
  const { productId } = productIdLoader(await searchParams);

  if (!productId) {
    throw new Error("product information missing");
  }

  const { data: product } = await productGet({
    client: client,
    path: { id: productId as string },
    throwOnError: true,
  });
  return <CreateProductPost product={product} />;
};

Page.displayName = "ProductPostCreatePage";

export default Page;
