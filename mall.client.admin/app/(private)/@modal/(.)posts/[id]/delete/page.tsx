import DeletePost from "@/components/posts/delete";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { postGet } from "@/openapi";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;

  const { data: post } = await postGet({
    throwOnError: true,
    client,
    path: { id: id as string },
  });

  return <DeletePost post={post!} />;
};
Page.displayName = "PostDeletePage";

export default Page;
