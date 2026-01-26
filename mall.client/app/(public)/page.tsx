import { CategoryGrid } from "@/components/mobile/products/dashboard/category-grid";
import { FeaturedProducts } from "@/components/mobile/products/dashboard/featured-products";
import { LifestyleSection } from "@/components/mobile/products/dashboard/life-style-section";
import { client } from "@/hey-api/client";
import { productGetList } from "@/openapi";
import { carouselGetList } from "@/openapi";
import { NextPage } from "next";
import { FC, Suspense } from "react";
import { SkeletonCard } from "@/components/shared/skeleton";
import Carousels from "@/components/mobile/products/dashboard/carousels";

export const dynamic = "force-dynamic";

const Page: NextPage = () => {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <Wrapper />
    </Suspense>
  );
};

const Wrapper: FC = async () => {
  const productsPromise = productGetList({
    client,
    throwOnError: true,
    query: {
      SkipCount: 0,
      MaxResultCount: 8,
    },
  }).then(({ data }) => data.items);

  const carouselsPromise = carouselGetList({
    client,
    throwOnError: true,
    query: {
      SkipCount: 0,
      MaxResultCount: 8,
    },
  }).then(({ data }) => data.items);
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Carousels carouselsPromise={carouselsPromise} />
      <FeaturedProducts productsPromise={productsPromise} />
      <CategoryGrid />
      <LifestyleSection />
    </div>
  );
};

Page.displayName = "HomePage";

export default Page;
