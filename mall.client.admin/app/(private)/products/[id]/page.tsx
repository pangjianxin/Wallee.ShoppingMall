import { NextPage } from "next";
import { productGet } from "@/openapi";
import { client } from "@/hey-api/client";
import ProductDetail from "@/components/products/detail";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};
const Page: NextPage<Props> = ({ params }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wrapper params={params} />
    </Suspense>
  );
};

const Wrapper: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const promise = productGet({
    throwOnError: true,
    client,
    path: { id },
  }).then((res) => res.data);

  return <ProductDetail entity={promise} />;
};

Page.displayName = "ProductPage";

export default Page;
