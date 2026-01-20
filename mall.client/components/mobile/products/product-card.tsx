"use client";
import { cn } from "@/lib/utils";
import type { WalleeMallProductsDtosProductDto } from "@/openapi";
import { ProductImageCarousel } from "./product-image-carousel";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductCardProps {
  product: WalleeMallProductsDtosProductDto;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discountRate = product.discountRate ?? 1;
  const hasDiscount = discountRate < 1;
  const discountPrice =
    hasDiscount && product.originalPrice
      ? product.originalPrice * discountRate
      : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <ProductImageCarousel
        covers={product.productCovers || []}
        badge={
          hasDiscount ? (
            <Badge variant="destructive" className="text-[10px] sm:text-xs">
              折扣
            </Badge>
          ) : undefined
        }
      />

      <div className="space-y-2.5 p-2 sm:p-3">
        {(product.brand || product.jdPrice) && (
          <div className="flex items-center gap-2">
            {product.brand && (
              <span className="max-w-[60%] truncate rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {product.brand}
              </span>
            )}
            {product.jdPrice && (
              <span className="ml-auto text-[10px] text-muted-foreground">
                京东价 ¥{product.jdPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground sm:text-sm">
          {product.name || "商品名称"}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-destructive">
            ¥
            {hasDiscount && discountPrice
              ? discountPrice.toFixed(2)
              : product.originalPrice?.toFixed(2) || "0.00"}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              ¥{product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.salesCount !== undefined && product.salesCount > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              已售 {product.salesCount}
            </span>
          )}
        </div>

        {product.shortDescription && (
          <p className="line-clamp-1 text-[11px] text-muted-foreground">
            {product.shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
