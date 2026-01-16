import { ProductCard } from "@/components/mobile/products/product-card";
import {
  VoloAbpApplicationDtosPagedResultDtoOfProductDto,
} from "@/openapi";
import { use } from "react";

type Props = {
  promise: Promise<{
    data?: VoloAbpApplicationDtosPagedResultDtoOfProductDto;
    error: unknown;
    pageCount: number;
  }>;
};

export function ProductGrid({ promise }: Props) {
  const { data: products } = use(promise);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          共 {products?.items?.length || 0} 件商品
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.items?.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>
    </div>
  );
}
