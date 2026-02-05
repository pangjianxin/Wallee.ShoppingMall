"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Clock } from "lucide-react";
import type {
  WalleeMallProductsDtosProductSkuDto,
  WalleeMallProductsDtosProductSkuAttributeDto,
} from "@/openapi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <ScrollArea className="w-full rounded-md border whitespace-nowrap">
      {attributes.map((attr, index) => (
        <Badge key={index} variant="secondary" className="text-xs font-normal">
          {attr.key}: {attr.value}
        </Badge>
      ))}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
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
  const hasDiscount = sku.discountText && sku.discountText !== "NONE";
  const hasSkuId = Boolean(sku.jdSkuId);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-dotted">
      {hasDiscount && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {sku.discountText}
        </div>
      )}
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            {hasSkuId ? (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  {sku.jdSkuId}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">未设置SKU</span>
            )}
          </div>

          {/* SKU Code */}

          {/* Attributes */}
          <SkuAttributes attributes={sku.attributes} />

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            {sku.jdPrice ? (
              <>
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(sku.jdPrice, "CNY")}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(sku.originalPrice, "CNY")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {formatPrice(sku.originalPrice, "CNY")}
              </span>
            )}
          </div>

          {/* Footer: Stock & Date */}
          <div className="flex items-center justify-between border-t pt-2">
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
