"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { WalleeMallProductsDtosProductDto } from "@/openapi";
import Image from "next/image";

interface ProductCardProps {
  product: WalleeMallProductsDtosProductDto;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // 计算折扣价格
  const discountRate = product.discountRate ?? 1;
  const hasDiscount = discountRate < 1;
  const discountPrice =
    hasDiscount && product.originalPrice
      ? product.originalPrice * discountRate
      : null;

  return (
    <Card className={cn("overflow-hidden bg-card", className)}>
      <div className="relative aspect-square bg-muted">
        {product.productCovers && product.productCovers.length > 0 ? (
          <Carousel className="h-full w-full">
            <CarouselContent>
              {product.productCovers.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_PREVIEW_URL}${image.mallMediaId}`}
                    alt={`${product.name || "商品"} - 图片 ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes="100%"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.productCovers.length > 1 && (
              <>
                <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm" />
                <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src="/placeholder.svg?height=300&width=300"
              alt="暂无图片"
              className="object-cover"
              fill
              sizes="100%"
            />
          </div>
        )}

        {/* 折扣标签 */}
        {hasDiscount && (
          <Badge variant="destructive" className="absolute left-3 top-3 z-10">
            {Math.round((1 - discountRate) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* 商品信息区域 */}
      <div className="p-4">
        {/* 品牌 */}
        {product.brand && (
          <p className="mb-1 text-xs text-muted-foreground">{product.brand}</p>
        )}

        {/* 商品名称 */}
        <h3 className="mb-3 line-clamp-2 text-base font-medium leading-snug text-foreground">
          {product.name || "商品名称"}
        </h3>

        {/* 价格区域 */}
        <div className="flex items-end gap-2">
          {/* 折扣价或原价 */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-destructive">
              ¥
              {hasDiscount && discountPrice
                ? discountPrice.toFixed(2)
                : product.originalPrice?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* 原价（有折扣时显示删除线） */}
          {hasDiscount && product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ¥{product.originalPrice.toFixed(2)}
            </span>
          )}

          {/* 京东价 */}
          {product.jdPrice && (
            <span className="ml-auto text-xs text-muted-foreground">
              京东 ¥{product.jdPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* 简短描述 */}
        {product.shortDescription && (
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        {/* 销量 */}
        {product.salesCount !== undefined && product.salesCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            已售 {product.salesCount}
          </p>
        )}
      </div>
    </Card>
  );
}
