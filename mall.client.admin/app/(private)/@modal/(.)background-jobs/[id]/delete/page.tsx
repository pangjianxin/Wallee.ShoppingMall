import DeleteBackgroundJob from "@/components/background-jobs/delete";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { backgroundJobGet } from "@/openapi";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;

  const { data } = await backgroundJobGet({ path: { id }, client });

  return <DeleteBackgroundJob entity={data!} />;
};

Page.displayName = "AdminBackgroundJobsDeleteJobPage";

export default Page;
