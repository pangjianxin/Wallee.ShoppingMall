"use client";

import { useState } from "react";
import { ProductImageCarousel } from "@/components/mobile/products/product-image-carousel";
import { ProductInfo } from "@/components/mobile/products/detail/information";
import { ProductServices } from "@/components/mobile/products/detail/product-service";
import { SkuSelector } from "@/components/mobile/products/detail/sku-selector";
import { QuantitySelector } from "@/components/mobile/products/detail/quantity-selector";
import { BottomActionBar } from "@/components/mobile/products/detail/bottom-action-bar";
import type {
  WalleeMallProductsDtosProductDto,
  WalleeMallProductsDtosProductSkuDto,
  WalleeMallCmsDtosProductPostDto,
} from "@/openapi";
import { Badge } from "@/components/ui/badge";
import { ProductPostTabs } from "@/components/mobile/products/detail/posts";
import { ExpandableContainer } from "@/components/mobile/cms/expandable-container";

type Props = {
  product?: WalleeMallProductsDtosProductDto;
  posts?: WalleeMallCmsDtosProductPostDto[];
};
export default function ProductDetail({ product, posts }: Props) {
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
    <div className="min-h-screen bg-background">
      {/* Image Carousel */}
      <ProductImageCarousel
        covers={product?.productCovers || []}
        badge={<Badge className="text-[10px] sm:text-xs">促销</Badge>}
        imageUrlPrefix={process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}
      />
      {/* Product Info */}
      <ProductInfo product={product!} relativeTags={[{ name: "促销" }]} />
      {/* Services */}
      <ProductServices />
      {/* Product Posts */}
      <ExpandableContainer>
        <ProductPostTabs posts={posts || []} />
      </ExpandableContainer>
      {/* SKU Selector */}
      <SkuSelector
        skus={product?.skus || []}
        onSkuSelect={setSelectedSku}
        currency={product?.currency || "¥"}
      />
      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        maxQuantity={maxQuantity}
        onQuantityChange={setQuantity}
      />
      <div className="h-20 bg-background" />
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
  );
}
