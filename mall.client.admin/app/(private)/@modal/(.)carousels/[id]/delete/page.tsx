import DeleteCarousel from "@/components/carousels/delete";
import { NextPage } from "next";
import { client } from "@/hey-api/client";
import { carouselGet } from "@/openapi";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: NextPage<Props> = async ({ params }) => {
  const { id } = await params;
  const { data: carousel } = await carouselGet({ client, path: { id } });
  return <DeleteCarousel carousel={carousel!} />;
};

Page.displayName = "CarouselDeletePage";

export default Page;
