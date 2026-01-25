import { UpdatePost } from "@/components/posts/update";
import { NextPage } from "next";
import { postGet } from "@/openapi";
import { client } from "@/hey-api/client";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: post } = await postGet({
    throwOnError: true,
    client,
    path: { id },
  });

  return <UpdatePost post={post} />;
};

Page.displayName = "PostUpdatePage";
export default Page;
