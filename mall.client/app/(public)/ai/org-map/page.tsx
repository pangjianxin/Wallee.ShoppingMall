"use client";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/shared/loading";
const Page: NextPage = () => {
  const OrgMap = dynamic(() => import("@/components/mobile/ai/org-map"), {
    ssr: false,
    loading: () => <Loader title="加载地图中..." />,
  });
  return <OrgMap />;
};
Page.displayName = "OrgMapPage";
export default Page;
