import Login from "@/components/account/login";
import { NextPage } from "next";
import { SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page: NextPage<Props> = async ({ searchParams }) => {
  const search = await searchParams;
  return <Login cb={search["cb"] as string | undefined} />;
};

Page.displayName = "AccountLoginPage";

export default Page;
