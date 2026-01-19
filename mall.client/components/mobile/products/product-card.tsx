"use client";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { WalleeMallProductsDtosProductDto } from "@/openapi";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useState } from "react";

interface ProductCardProps {
  product: WalleeMallProductsDtosProductDto;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const discountRate = product.discountRate ?? 1;
  const hasDiscount = discountRate < 1;
  const discountPrice =
    hasDiscount && product.originalPrice
      ? product.originalPrice * discountRate
      : null;

  const imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

  const onSelect = useCallback((api: any) => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, []);

  const hasMultipleImages =
    product.productCovers && product.productCovers.length > 1;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.productCovers && product.productCovers.length > 0 ? (
          <Carousel
            className="h-full w-full"
            opts={{
              loop: hasMultipleImages as boolean,
            }}
            plugins={
              hasMultipleImages
                ? [Autoplay({ delay: 3000, stopOnInteraction: true })]
                : []
            }
            setApi={(api) => {
              if (api) {
                api.on("select", () => onSelect(api));
              }
            }}
          >
            <CarouselContent className="ml-0 h-full">
              {product.productCovers.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="relative aspect-square pl-0"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_PREVIEW_URL}/${image.mallMediaId}`}
                    alt={`${product.name || "商品"} - 图片 ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes={imageSizes}
                    {...(index === 0
                      ? { priority: true }
                      : { loading: "lazy" as const })}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt="暂无图片"
            className="object-cover"
            fill
            sizes={imageSizes}
            loading="lazy"
          />
        )}

        {hasMultipleImages && (
          <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {product.productCovers!.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1 w-1 rounded-full transition-colors",
                  index === currentIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute left-1.5 top-1.5 z-10 px-1.5 py-0.5 text-[10px] sm:left-2 sm:top-2 sm:text-xs"
          >
            折扣
          </Badge>
        )}
      </div>

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
    </div>
  );
}
