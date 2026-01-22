import { NextPage } from "next";
import AccountProfile from "@/components/mobile/identity/profile";
import { client } from "@/hey-api/client";
import { profileGet } from "@/openapi";
import { cn } from "@/lib/utils";
import { MobilePageHeader } from "@/components/mobile/sections/page-header";

const Page: NextPage = async () => {
  const { data: profile } = await profileGet({ client });
  return (
    <div className={cn("container mx-auto p-2")}>
      <MobilePageHeader title="用户信息" subtitle="账户信息维护及密码管理" />
      <AccountProfile profile={profile} />
    </div>
  );
};

Page.displayName = "MobileAccountProfilePage";

export default Page;
