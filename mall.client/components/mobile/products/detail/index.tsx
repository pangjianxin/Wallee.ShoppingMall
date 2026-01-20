"use client";

import { useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { ProductImageCarousel } from "@/components/mobile/products/product-image-carousel";
import { ProductInfo } from "@/components/mobile/products/detail/information";
import { ProductServices } from "@/components/mobile/products/detail/product-service";
import { SkuSelector } from "@/components/mobile/products/detail/sku-selector";
import { QuantitySelector } from "@/components/mobile/products/detail/quantity-selector";
import { BottomActionBar } from "@/components/mobile/products/detail/bottom-action-bar";
import type {
  WalleeMallProductsDtosProductDto,
  WalleeMallProductsDtosProductSkuDto,
} from "@/openapi";
import { Badge } from "@/components/ui/badge";
type Props = {
  product?: WalleeMallProductsDtosProductDto;
};
export default function ProductDetail({ product }: Props) {
  const [selectedSku, setSelectedSku] =
    useState<WalleeMallProductsDtosProductSkuDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  const maxQuantity = selectedSku?.stockQuantity || 99;

  const handleAddToCart = () => {
    if (!selectedSku) {
      alert("请先选择商品规格");
      return;
    }
    setCartCount((prev) => prev + quantity);
    alert(`已将 ${quantity} 件商品加入购物车`);
  };

  const handleBuyNow = () => {
    if (!selectedSku) {
      alert("请先选择商品规格");
      return;
    }
    alert(`立即购买 ${quantity} 件 ${selectedSku.skuCode}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleContact = () => {
    alert("正在连接客服...");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image Carousel */}
      <ProductImageCarousel
        covers={product?.productCovers || []}
        badge={<Badge className="text-[10px] sm:text-xs">促销</Badge>}
      />

      {/* Product Info */}
      <ProductInfo product={product!} relativeTags={[{ name: "促销" }]} />

      {/* Divider */}
      <div className="h-2 bg-background" />

      {/* Services */}
      <ProductServices />

      {/* Divider */}
      <div className="h-2 bg-background" />

      {/* SKU Selector */}
      <SkuSelector
        skus={product?.skus || []}
        onSkuSelect={setSelectedSku}
        currency={product?.currency || "¥"}
      />

      {/* Divider */}
      <div className="h-2 bg-background" />

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        maxQuantity={maxQuantity}
        onQuantityChange={setQuantity}
      />

      {/* Product Details Section */}
      <div className="h-2 bg-background" />
      <div className="bg-card px-4 py-5">
        <h3 className="mb-4 text-base font-medium text-foreground">商品详情</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Apple AirPods Pro 第二代采用全新 H2 芯片，
            带来更智能的降噪功能和更出色的三维声场体验。
          </p>
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80"
              alt="产品展示"
              className="h-full w-full object-cover"
            />
          </div>
          <p>
            自适应通透模式，可根据环境调节降噪效果；
            触控调节音量，操作更便捷；个性化空间音频， 带来更沉浸的听觉享受。
          </p>
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"
              alt="产品功能"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {/* Bottom Action Bar */}
        <BottomActionBar
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleFavorite={handleToggleFavorite}
          onContact={handleContact}
          isFavorite={isFavorite}
          cartCount={cartCount}
          disabled={selectedSku?.stockQuantity === 0}
        />
      </div>
    </div>
  );
}
