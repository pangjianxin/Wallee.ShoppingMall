"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalleeMallCartsDtosCartItemDto } from "@/openapi";
import { ProductImageCarousel } from "@/components/mobile/products/product-image-carousel";
import { useActionState } from "react";
import {
  removeItemFromCart,
  updateItemQuantity,
  updateItemSelection,
} from "@/actions/carts";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

interface CartItemProps {
  item: WalleeMallCartsDtosCartItemDto;
}

export function CartItem({ item }: CartItemProps) {
  const formatPrice = (price?: number, currency?: string | null) => {
    if (price === undefined) return "¥0.00";
    const currencySymbol = currency === "USD" ? "$" : "¥";
    return `${currencySymbol}${price.toFixed(2)}`;
  };

  const [, removeItemAction, isRemoveItemPending] = useActionState(
    removeItemFromCart,
    {
      status: "idle",
      message: "",
    },
  );

  const [, updateQuantityAction, isUpdateQuantityPending] = useActionState(
    updateItemQuantity,
    {
      status: "idle",
      message: "",
    },
  );

  const [, updateSelectionAction, isUpdateSelectionPending] = useActionState(
    updateItemSelection,
    {
      status: "idle",
      message: "",
    },
  );

  return (
    <div className="flex gap-3 p-4 bg-card rounded-xl border border-border">
      {/* 选择框 */}
      <div className="flex items-center">
        <form action={updateSelectionAction}>
          <input type="hidden" name="itemId" value={item.id} />
          {isUpdateSelectionPending ? (
            <Spinner />
          ) : (
            <Checkbox
              type="submit"
              className="size-6"
              name="isSelected"
              defaultChecked={item.isSelected ?? false}
            />
          )}
        </form>
      </div>

      {/* 商品图片占位符 - 请自行替换 */}
      <div className="w-20 h-20 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
        <ProductImageCarousel
          covers={
            item.productCovers?.map((cover) => ({ mallMediaId: cover })) || []
          }
        />
      </div>

      {/* 商品信息 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
            {item.productName || "未知商品"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            SKU: {item.skuId?.slice(0, 8) || "-"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* 价格 */}
          <span className="text-base font-semibold text-destructive">
            {formatPrice(item.price, item.currency)}
          </span>

          {/* 数量控制 */}
          <div className="flex items-center gap-2">
            <form action={updateQuantityAction}>
              <input type="hidden" name="itemId" value={item.id || ""} />
              <input
                type="hidden"
                name="quantity"
                value={(item.quantity ?? 0) - 1}
              />
              <input
                type="hidden"
                name="stockQuantity"
                value={item.stockQuantity ?? ""}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-transparent"
                disabled={isUpdateQuantityPending || (item.quantity ?? 0) <= 1}
              >
                {isUpdateQuantityPending ? (
                  <Spinner />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
            </form>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity ?? 0}
            </span>
            <form action={updateQuantityAction}>
              <input type="hidden" name="itemId" value={item.id || ""} />
              <input
                type="hidden"
                name="quantity"
                value={(item.quantity ?? 0) + 1}
              />
              <input
                type="hidden"
                name="stockQuantity"
                value={item.stockQuantity ?? ""}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-transparent"
                disabled={
                  isUpdateQuantityPending ||
                  (item.stockQuantity !== undefined &&
                    (item.quantity ?? 0) >= item.stockQuantity)
                }
              >
                {isUpdateQuantityPending ? (
                  <Spinner />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* 库存提示 */}
        {item.stockQuantity !== undefined && item.stockQuantity <= 5 && (
          <p className="text-xs text-orange-500 mt-1">
            仅剩 {item.stockQuantity} 件
          </p>
        )}
      </div>

      {/* 删除按钮 */}
      <form action={removeItemAction}>
        <input type="hidden" name="itemId" value={item.id || ""} />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive self-start -mr-2 -mt-1"
        >
          {isRemoveItemPending ? <Spinner /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
