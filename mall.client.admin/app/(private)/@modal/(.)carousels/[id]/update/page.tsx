import UpdateCarousel from "@/components/carousels/update";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { carouselGet } from "@/openapi";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: carousel } = await carouselGet({ client, path: { id } });
  return <UpdateCarousel entity={carousel!} />;
};

Page.displayName = "CarouselUpdatePage";

export default Page;
