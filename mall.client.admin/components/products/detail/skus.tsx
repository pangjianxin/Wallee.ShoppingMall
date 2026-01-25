"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Clock } from "lucide-react";
import type {
  WalleeMallProductsDtosProductSkuDto,
  WalleeMallProductsDtosProductSkuAttributeDto,
} from "@/openapi";

interface ProductSkuListProps {
  skus: WalleeMallProductsDtosProductSkuDto[];
  className?: string;
}

function formatPrice(price?: number | null, currency?: string | null): string {
  if (price === undefined || price === null) return "-";
  const currencySymbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : "¥";
  return `${currencySymbol}${price.toFixed(2)}`;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function SkuAttributes({
  attributes,
}: {
  attributes?: WalleeMallProductsDtosProductSkuAttributeDto[] | null;
}) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {attributes.map((attr, index) => (
        <Badge key={index} variant="secondary" className="text-xs font-normal">
          {attr.key}: {attr.value}
        </Badge>
      ))}
    </div>
  );
}

function StockStatus({ quantity }: { quantity?: number }) {
  if (quantity === undefined) return null;

  if (quantity === 0) {
    return (
      <div className="flex items-center gap-1.5 text-destructive">
        <span className="h-2 w-2 rounded-full bg-destructive" />
        <span className="text-sm font-medium">缺货</span>
      </div>
    );
  }

  if (quantity <= 10) {
    return (
      <div className="flex items-center gap-1.5 text-amber-600">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <span className="text-sm font-medium">库存 {quantity}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-emerald-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="text-sm font-medium">库存 {quantity}</span>
    </div>
  );
}

function SkuCard({ sku }: { sku: WalleeMallProductsDtosProductSkuDto }) {
  const hasDiscount = sku.discountRate && sku.discountRate > 0;
  const discountPercentage = hasDiscount
    ? (sku.discountRate! * 100).toFixed(0)
    : null;

  return (
    <div className="group relative overflow-hidden border border-dotted rounded-lg">
      {hasDiscount && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
          -{discountPercentage}%
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {/* SKU Code */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">
              {sku.skuCode || "-"}
            </span>
          </div>

          {/* Attributes */}
          <SkuAttributes attributes={sku.attributes} />

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            {sku.jdPrice ? (
              <>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(sku.jdPrice, sku.currency)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(sku.originalPrice, sku.currency)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-foreground">
                {formatPrice(sku.originalPrice, sku.currency)}
              </span>
            )}
          </div>

          {/* Footer: Stock & Date */}
          <div className="flex items-center justify-between border-t pt-3">
            <StockStatus quantity={sku.stockQuantity} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(sku.creationTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkuInfo({ skus, className }: ProductSkuListProps) {
  if (!skus || skus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Package className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">暂无SKU数据</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {skus.map((sku) => (
        <SkuCard key={sku.id} sku={sku} />
      ))}
    </div>
  );
}
