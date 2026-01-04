import Login from "@/components/mobile/account/login";
import { NextPage } from "next";

type Props = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

const Page: NextPage<Props> = async ({ searchParams }) => {
  const search = await searchParams;
  return (
    <>
      <Login callbackUrl={search?.callbackUrl || undefined} />
    </>
  );
};

Page.displayName = "LoginPage";

export default Page;
