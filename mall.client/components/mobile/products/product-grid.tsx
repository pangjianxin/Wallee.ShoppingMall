import { ProductCard } from "@/components/mobile/products/product-card";
import { WalleeMallProductsDtosProductDto } from "@/openapi";

export function ProductGrid({
  products,
}: {
  products: WalleeMallProductsDtosProductDto[];
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          共 {products.length} 件商品
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
