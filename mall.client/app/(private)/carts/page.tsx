import { cartGet } from "@/openapi";
import { client } from "@/hey-api/client";
import { NextPage } from "next";
import { CartList } from "@/components/mobile/carts";
export const dynamic = "force-dynamic";
const Page: NextPage = async () => {
  const { data: cart } = await cartGet({
    client,
    throwOnError: true,
  });

  return <CartList cart={cart} />;
};

Page.displayName = "CartPage";

export default Page;
