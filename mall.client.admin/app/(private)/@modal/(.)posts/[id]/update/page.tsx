import { UpdatePost } from "@/components/posts/update";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { postGet, productGet } from "@/openapi";
import { productIdLoader } from "@/lib/loaders";
import { SearchParams } from "nuqs/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};
const Page: NextPage<Props> = async ({ params, searchParams }) => {
  const { id } = await params;
  const { productId } = await productIdLoader(searchParams);

  const { data: post } = await postGet({
    throwOnError: true,
    client,
    path: { id: id as string },
  });
  if (productId) {
    const { data: product } = await productGet({
      client,
      throwOnError: true,
      path: { id: productId as string },
    });
    return <UpdatePost post={post!} product={product} />;
  }
  return <UpdatePost post={post!} />;
};
Page.displayName = "PostUpdatePage";

export default Page;
