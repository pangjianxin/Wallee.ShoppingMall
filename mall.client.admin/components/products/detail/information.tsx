import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { FC } from "react";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export const ProductInformation: FC<{
  product: WalleeMallProductsDtosProductDto;
}> = ({ product }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          {product.name || "未命名商品"}
        </h1>
        {product.brand && <Badge>{product.brand}</Badge>}
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "在售" : "下架"}
        </Badge>
      </div>

      {product.shortDescription && (
        <p className="text-muted-foreground">{product.shortDescription}</p>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatMoney(product.defaultJdPrice ?? 0, "CNY")}
        </span>
        {product.defaultOriginalPrice &&
          product.defaultOriginalPrice > (product.defaultJdPrice || 0) && (
            <span className="text-lg text-muted-foreground line-through">
              {formatMoney(product.defaultOriginalPrice, "CNY")}
            </span>
          )}
        {product.discountText !== "NONE" && (
          <Badge variant="destructive">{product.discountText}</Badge>
        )}
      </div>

      <div className="grid gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center justify-between gap-2">
          <span>京东价</span>
          <span className="font-medium text-foreground">
            {formatMoney(product.defaultJdPrice, "CNY")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>原价</span>
          <span className="font-medium text-foreground">
            {formatMoney(product.defaultOriginalPrice, "CNY")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>折扣率</span>
          <span className="font-medium text-foreground">
            {product.discountText !== "NONE" ? product.discountText : "-"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span>币种</span>
          <span className="font-medium text-foreground">{"CNY"}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>销量: {product.salesCount ?? 0}</span>
        <span>排序: {product.sortOrder ?? 0}</span>
        {product.skus && product.skus.length > 0 && (
          <span>SKU数量: {product.skus.length}</span>
        )}
      </div>
    </div>
  );
};
