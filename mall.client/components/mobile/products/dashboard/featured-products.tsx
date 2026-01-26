import { Button } from "@/components/ui/button";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { use } from "react";
import { ProductCard } from "@/components/mobile/products/product-card";

type Props = {
  productsPromise: Promise<
    WalleeMallProductsDtosProductDto[] | null | undefined
  >;
};

export function FeaturedProducts({ productsPromise }: Props) {
  const products = use(productsPromise);

  return (
    <section className="container py-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-serif text-3xl font-semibold text-foreground">
          热门推荐
        </h3>
        <Button variant="ghost" className="text-sm text-muted-foreground">
          查看更多 →
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {products?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
