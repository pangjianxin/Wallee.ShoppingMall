"use client";

import { ShoppingCart, Heart, MessageCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addItemToCart } from "@/actions/carts";
import { Spinner } from "@/components/ui/spinner";

interface BottomActionBarProps {
  onBuyNow: () => void;
  onToggleFavorite?: () => void;
  onContact?: () => void;
  isFavorite?: boolean;
  cartCount?: number;
  disabled?: boolean;
  selectedSkuId?: string;
}

export function BottomActionBar({
  onBuyNow,
  onToggleFavorite,
  onContact,
  selectedSkuId,
  isFavorite = false,
  disabled = false,
}: BottomActionBarProps) {
  const [cartState, formAction, isPending] = useActionState(addItemToCart, {
    status: "idle",
    message: "",
  });

  useEffect(() => {
    if (cartState.status === "idle") {
      return;
    }

    if (cartState.status === "error") {
      toast.error(cartState.message ?? "加入失败，请重试");
      return;
    }

    toast.success(cartState.message ?? "已加入购物车");
  }, [cartState]);
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
                isFavorite ? "fill-sale text-sale" : "text-muted-foreground",
              )}
            />
            <span className="text-[10px] text-muted-foreground">收藏</span>
          </button>

          <form action={formAction}>
            <input
              type="hidden"
              id="skuId"
              name="skuId"
              value={selectedSkuId ?? ""}
            />
            <input type="hidden" id="quantity" name="quantity" value={1} />
            {isPending ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="relative flex flex-col items-center gap-1"
                aria-label="购物车"
              >
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  购物车
                </span>
              </button>
            )}
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-1 gap-2 justify-end">
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
