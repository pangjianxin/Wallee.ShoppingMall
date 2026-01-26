import { NextPage } from "next";
import { carouselGet } from "@/openapi";
import { SkeletonCard } from "@/components/shared/skeleton";
import { FC, Suspense } from "react";
import CarouselDetail from "@/components/mobile/carousels/detail";
import { client } from "@/hey-api/client";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: NextPage<Props> = async ({ params }) => {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <Wrapper {...{ params }}></Wrapper>
    </Suspense>
  );
};

const Wrapper: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const carousel = carouselGet({ client, path: { id } }).then(
    (res) => res.data,
  );

  return <CarouselDetail carouselPromise={carousel} />;
};

Page.displayName = "CarouselPrivateDetailPage";

export default Page;
