"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./item";
import type { WalleeMallCartsDtosCartDto } from "@/openapi";
import { ActionBar } from "./action-bar";

interface CartListProps {
  cart: WalleeMallCartsDtosCartDto;
}

export function CartList({ cart }: CartListProps) {
  const items = cart.items ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-base mb-6">购物车是空的</p>
        <Button>去逛逛</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-background border-b border-border py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">购物车 ({items.length})</h1>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="flex-1 overflow-auto  py-4">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItem
              item={item}
              key={`${item.id}|${item.skuId}|${item.quantity}|${item.isSelected}`}
            />
          ))}
        </div>
      </div>
      {/* 底部操作栏 */}
      <ActionBar cart={cart} />
    </div>
  );
}
