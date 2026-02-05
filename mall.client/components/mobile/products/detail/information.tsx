"use client";
import { Badge } from "@/components/ui/badge";
import type {
  WalleeMallProductsDtosProductDto,
  WalleeMallTagsDtosTagDto,
} from "@/openapi";
import { ProductName } from "@/components/mobile/products/detail/name";
import { ProductShortDescription } from "./short-description";

interface ProductInfoProps {
  product: WalleeMallProductsDtosProductDto;
  relativeTags: WalleeMallTagsDtosTagDto[] | undefined;
}

export function ProductInfo({ product, relativeTags }: ProductInfoProps) {
  const {
    brand,
    shortDescription,
    defaultOriginalPrice,
    defaultJdPrice,
    defaultPrice,
    discountText,
    salesCount,
  } = product;

  const currencySymbolMap: Record<string, string> = {
    CNY: "¥",
    RMB: "¥",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    KRW: "₩",
    HKD: "HK$",
    TWD: "NT$",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    CHF: "CHF",
  };
  const currencySymbol = currencySymbolMap["CNY"];
  const hasDiscount = discountText !== "NONE";

  const savings =
    hasDiscount && (defaultOriginalPrice as number) - (defaultPrice as number);

  return (
    <div className="rounded-lg bg-card px-3 py-4">
      {/* Price Section */}
      <div className="mb-3 space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">
            {hasDiscount ? "折后价" : "售价"}
          </span>
          <span className="text-sm text-sale">{currencySymbol}</span>
          <span className="text-3xl font-bold text-sale">
            {hasDiscount && discountText}
          </span>
          {hasDiscount && discountText && (
            <Badge
              variant="secondary"
              className="bg-sale/10 text-sale text-[10px]"
            >
              {discountText}
            </Badge>
          )}
          {brand && <Badge variant={"outline"}>{brand}</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {hasDiscount && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>原价</span>
              <span className="line-through">
                {currencySymbol}
                {defaultOriginalPrice}
              </span>
            </div>
          )}
          {hasDiscount && savings && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-[10px]"
            >
              省{currencySymbol}
              {savings.toFixed(2)}
            </Badge>
          )}
          {defaultJdPrice && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>京东价</span>
              <span>
                {currencySymbol}
                {defaultJdPrice?.toFixed(2)}
              </span>
            </div>
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

      {/* Name */}
      <ProductName name={product.name as string} />
      {/* Description */}
      {shortDescription && (
        <ProductShortDescription shortDescription={shortDescription} />
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
