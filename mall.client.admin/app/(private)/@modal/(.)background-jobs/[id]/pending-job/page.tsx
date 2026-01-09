import PendingJob from "@/components/background-jobs/pending-job";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { backgroundJobGet } from "@/openapi";
type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;

  const { data } = await backgroundJobGet({ path: { id }, client });

  return <PendingJob entity={data!} />;
};

Page.displayName = "AdminBackgroundJobsPendingJobPage";

export default Page;
