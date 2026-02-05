import ProductUpdateCovers from "@/components/products/update-covers";
import { client } from "@/hey-api/client";
import { productGet } from "@/openapi";
import { NextPage } from "next";
type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;

  const { data: entity } = await productGet({
    path: { id },
    client,
    throwOnError: true,
  });

  return <ProductUpdateCovers entity={entity} />;
};

Page.displayName = "ProductCoversUpdatePage";
export default Page;
