import UpdateTag from "@/components/tags/update";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { tagGet } from "@/openapi";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: tag } = await tagGet({
    client,
    path: { id },
    throwOnError: true,
  });
  return <UpdateTag entity={tag} />;
};
Page.displayName = "TagUpdatePage";
export default Page;
