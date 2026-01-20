"use client";

import { ShoppingCart, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomActionBarProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleFavorite?: () => void;
  onContact?: () => void;
  isFavorite?: boolean;
  cartCount?: number;
  disabled?: boolean;
}

export function BottomActionBar({
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  onContact,
  isFavorite = false,
  cartCount = 0,
  disabled = false,
}: BottomActionBarProps) {
  return (
    <div className="fixed bottom-(--footer-height) left-0 right-0 z-50 border-t border-border bg-card px-4 py-3 safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center gap-4">
        {/* Left Side Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onContact}
            className="flex flex-col items-center gap-1"
            aria-label="联系客服"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">客服</span>
          </button>
          
          <button
            onClick={onToggleFavorite}
            className="flex flex-col items-center gap-1"
            aria-label={isFavorite ? "取消收藏" : "收藏"}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-sale text-sale" : "text-muted-foreground"
              )}
            />
            <span className="text-[10px] text-muted-foreground">收藏</span>
          </button>
          
          <button
            onClick={onAddToCart}
            className="relative flex flex-col items-center gap-1"
            aria-label="购物车"
            disabled={disabled}
          >
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">购物车</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sale px-1 text-[10px] font-medium text-sale-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-1 gap-2">
          <Button
            onClick={onAddToCart}
            disabled={disabled}
            variant="outline"
            className="h-11 flex-1 rounded-full border-primary text-primary hover:bg-primary/5 bg-transparent"
          >
            加入购物车
          </Button>
          <Button
            onClick={onBuyNow}
            disabled={disabled}
            className="h-11 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
}
