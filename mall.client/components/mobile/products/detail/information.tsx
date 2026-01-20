import { Badge } from "@/components/ui/badge";
import type {
  WalleeMallProductsDtosProductDto,
  WalleeMallTagsDtosTagDto,
} from "@/openapi";

interface ProductInfoProps {
  product: WalleeMallProductsDtosProductDto;
  relativeTags: WalleeMallTagsDtosTagDto[] | undefined;
}

export function ProductInfo({ product, relativeTags }: ProductInfoProps) {
  const {
    name,
    brand,
    shortDescription,
    originalPrice,
    jdPrice,
    discountRate,
    currency = "¥",
    salesCount,
  } = product;

  const hasDiscount =
    discountRate && discountRate < 100 && originalPrice && jdPrice;

  return (
    <div className="bg-card px-4 py-5">
      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-sale">{currency}</span>
          <span className="text-3xl font-bold text-sale">
            {jdPrice?.toFixed(2) || originalPrice?.toFixed(2) || "0.00"}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {currency}
                {originalPrice?.toFixed(2)}
              </span>
              <Badge
                variant="secondary"
                className="bg-sale/10 text-sale text-xs"
              >
                {discountRate}折
              </Badge>
            </>
          )}
        </div>
        {salesCount !== undefined && salesCount > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            已售{" "}
            {salesCount > 10000
              ? `${(salesCount / 10000).toFixed(1)}万`
              : salesCount}
            件
          </p>
        )}
      </div>

      {/* Product Name */}
      <h1 className="mb-2 text-lg font-semibold leading-relaxed text-foreground text-balance">
        {brand && (
          <Badge
            variant="outline"
            className="mr-2 align-middle text-xs font-normal"
          >
            {brand}
          </Badge>
        )}
        {name || "商品名称"}
      </h1>

      {/* Description */}
      {shortDescription && (
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {shortDescription}
        </p>
      )}

      {/* Tags */}
      {relativeTags && relativeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {relativeTags.map((tag, index) => (
            <Badge
              key={tag.id || index}
              variant="secondary"
              className="text-xs"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
