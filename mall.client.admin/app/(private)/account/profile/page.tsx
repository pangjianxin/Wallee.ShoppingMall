import { NextPage } from "next";
import AccountProfile from "@/components/account/profile";
import { client } from "@/hey-api/client";
import { profileGet } from "@/openapi";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Page: NextPage = async () => {
  const { data: profile } = await profileGet({ client });
  return (
    <div className={cn("container mx-auto p-2")}>
      <AccountProfile profile={profile} />
    </div>
  );
};

Page.displayName = "AccountProfilePage";

export default Page;
