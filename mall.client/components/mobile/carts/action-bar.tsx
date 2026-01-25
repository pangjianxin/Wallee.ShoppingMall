import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WalleeMallCartsDtosCartDto } from "@/openapi";
import { useActionState } from "react";
import { updateItemSelectedAll } from "@/actions/carts";
import { Spinner } from "@/components/ui/spinner";
type Props = {
  cart: WalleeMallCartsDtosCartDto;
};
export const ActionBar = ({ cart }: Props) => {
  const [, updateItemSelectedAllAction, isUpdateItemSelectionAllPending] =
    useActionState(updateItemSelectedAll, {
      status: "idle",
      message: "",
    });
  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  const items = cart.items ?? [];
  const selectedItems = items.filter((item) => item.isSelected);
  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;
  const hasSelectedItems = selectedItems.length > 0;

  // 计算选中商品的总价
  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + (item.price ?? 0) * (item.quantity ?? 0);
  }, 0);

  // 计算选中商品的总数量
  const totalQuantity = selectedItems.reduce((sum, item) => {
    return sum + (item.quantity ?? 0);
  }, 0);

  return (
    <footer className="sticky bottom-0 bg-card border-t border-border px-4 py-3 safe-area-inset-bottom">
      <div className="flex items-center justify-between gap-4">
        {/* 全选 */}
        <div className="flex items-center gap-2">
          <form action={updateItemSelectedAllAction}>
            {isUpdateItemSelectionAllPending ? (
              <Spinner />
            ) : (
              <Checkbox
                type="submit"
                name="isSelected"
                defaultChecked={isAllSelected ?? false}
                className="h-5 w-5"
              />
            )}
          </form>
          <span className="text-sm text-foreground">全选</span>
        </div>

        {/* 价格信息 */}
        <div className="flex-1 text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-sm text-muted-foreground">合计:</span>
            <span className="text-xl font-bold text-destructive">
              {formatPrice(totalPrice)}
            </span>
          </div>
          {totalQuantity > 0 && (
            <p className="text-xs text-muted-foreground">
              共 {totalQuantity} 件商品
            </p>
          )}
        </div>

        {/* 结算按钮 */}
        <Button size="lg" className="px-6" disabled={!hasSelectedItems}>
          结算 {hasSelectedItems && `(${selectedItems.length})`}
        </Button>
      </div>
    </footer>
  );
};
