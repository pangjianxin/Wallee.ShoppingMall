import UpdateProduct from "@/components/products/update";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { productGet } from "@/openapi";
type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: product } = await productGet({ client, path: { id } });
  return <UpdateProduct entity={product!} />;
};
Page.displayName = "ProductUpdatePage";
export default Page;
