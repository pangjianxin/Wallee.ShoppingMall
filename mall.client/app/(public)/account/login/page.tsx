import Login from "@/components/mobile/account/login";
import { SearchParams } from "nuqs/server";
import { NextPage } from "next";

type Props = {
  searchParams?: Promise<SearchParams>;
};

const Page: NextPage<Props> = async ({ searchParams }) => {
  const search = await searchParams;
  return (
    <>
      <Login cb={(search?.["cb"] as string) || undefined} />
    </>
  );
};

Page.displayName = "LoginPage";

export default Page;
