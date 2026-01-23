"use client";
import { use } from "react";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Badge } from "@/components/ui/badge";
import { ProductImageCarousel } from "@/components/products/image-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type Props = {
  entity: Promise<WalleeMallProductsDtosProductDto>;
};

const FC: React.FC<Props> = ({ entity }) => {
  const product = use(entity);
  const currency = product.currency || "¥";

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_3fr]">
        {/* 商品图片 */}
        <ProductImageCarousel
          covers={product?.productCovers || []}
          badge={<Badge className="text-[10px] sm:text-xs">促销</Badge>}
          imageUrlPrefix={process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}
        />

        {/* 商品信息 */}
        <div className="flex flex-1 flex-col gap-4 h-full">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {product.name || "未命名商品"}
              </h1>
              {product.brand && (
                <p className="mt-1 text-sm text-muted-foreground">
                  品牌: {product.brand}
                </p>
              )}
            </div>
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "在售" : "下架"}
            </Badge>
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          )}

          {/* 价格信息 */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {currency}
              {product.jdPrice?.toFixed(2) ?? "0.00"}
            </span>
            {product.originalPrice &&
              product.originalPrice > (product.jdPrice || 0) && (
                <span className="text-lg text-muted-foreground line-through">
                  {currency}
                  {product.originalPrice.toFixed(2)}
                </span>
              )}
            {product.discountRate !== undefined && product.discountRate < 1 && (
              <Badge variant="destructive">
                {(product.discountRate * 10).toFixed(1)}折
              </Badge>
            )}
          </div>

          {/* 其他信息 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>销量: {product.salesCount ?? 0}</span>
            <span>排序: {product.sortOrder ?? 0}</span>
            {product.skus && product.skus.length > 0 && (
              <span>SKU数量: {product.skus.length}</span>
            )}
          </div>

          <div className="flex-1"></div>
          <div className="flex justify-end gap-2">
            <Button>
              <Link href={`/product-posts/create?productId=${product.id}`}>
                新增内容
              </Link>
            </Button>{" "}
            <Button>新增轮播</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

FC.displayName = "ProductDetail";

export default FC;
