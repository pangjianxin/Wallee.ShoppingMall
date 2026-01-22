import CreateCarousel from "@/components/carousels/create";
import { NextPage } from "next";

const Page: NextPage = async () => {
  return <CreateCarousel />;
};

Page.displayName = "CarouselCreatePage";

export default Page;
