"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { WalleeMallProductsDtosProductSkuDto } from "@/openapi";

interface SkuSelectorProps {
  skus: WalleeMallProductsDtosProductSkuDto[] | null | undefined;
  onSkuSelect?: (sku: WalleeMallProductsDtosProductSkuDto | null) => void;
  currency?: string;
}

export function SkuSelector({
  skus,
  onSkuSelect,
  currency = "¥",
}: SkuSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Extract unique attribute groups
  const attributeGroups = useMemo(() => {
    if (!skus || skus.length === 0) return [];

    const groups: Record<string, Set<string>> = {};

    skus.forEach((sku) => {
      sku.attributes?.forEach((attr) => {
        if (attr.key && attr.value) {
          if (!groups[attr.key]) {
            groups[attr.key] = new Set();
          }
          groups[attr.key].add(attr.value);
        }
      });
    });

    return Object.entries(groups).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [skus]);

  // Find matching SKU based on selected attributes
  const selectedSku = useMemo(() => {
    if (!skus || attributeGroups.length === 0) return null;

    const selectedCount = Object.keys(selectedAttributes).length;
    if (selectedCount !== attributeGroups.length) return null;

    return (
      skus.find((sku) => {
        return sku.attributes?.every((attr) => {
          if (!attr.key || !attr.value) return true;
          return selectedAttributes[attr.key] === attr.value;
        });
      }) || null
    );
  }, [skus, selectedAttributes, attributeGroups.length]);

  // Check if a specific attribute value is available
  const isAttributeAvailable = (
    attrName: string,
    attrValue: string,
  ): boolean => {
    if (!skus) return false;

    return skus.some((sku) => {
      // Check if this SKU has the attribute we're checking
      const hasAttribute = sku.attributes?.some(
        (attr) => attr.key === attrName && attr.value === attrValue,
      );
      if (!hasAttribute) return false;

      // Check if this SKU matches all other selected attributes
      return Object.entries(selectedAttributes).every(([name, value]) => {
        if (name === attrName) return true;
        return sku.attributes?.some(
          (attr) => attr.key === name && attr.value === value,
        );
      });
    });
  };

  const handleAttributeSelect = (attrName: string, attrValue: string) => {
    const newSelected = { ...selectedAttributes };

    if (newSelected[attrName] === attrValue) {
      delete newSelected[attrName];
    } else {
      newSelected[attrName] = attrValue;
    }

    setSelectedAttributes(newSelected);

    // Notify parent if all attributes are selected
    if (onSkuSelect) {
      if (Object.keys(newSelected).length === attributeGroups.length) {
        const matchedSku = skus?.find((sku) =>
          sku.attributes?.every((attr) => {
            if (!attr.key || !attr.value) return true;
            return newSelected[attr.key] === attr.value;
          }),
        );
        onSkuSelect(matchedSku || null);
      } else {
        onSkuSelect(null);
      }
    }
  };

  if (!skus || skus.length === 0) {
    return null;
  }

  return (
    <div className="bg-card px-4 py-5">
      <h3 className="mb-4 text-base font-medium text-foreground">规格选择</h3>

      {attributeGroups.map((group) => (
        <div key={group.name} className="mb-5 last:mb-0">
          <p className="mb-3 text-sm text-muted-foreground">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const isSelected = selectedAttributes[group.name] === value;
              const isAvailable = isAttributeAvailable(group.name, value);

              return (
                <button
                  key={value}
                  onClick={() =>
                    isAvailable && handleAttributeSelect(group.name, value)
                  }
                  disabled={!isAvailable}
                  className={cn(
                    "relative min-w-[60px] rounded-lg border px-4 py-2.5 text-sm transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : isAvailable
                        ? "border-border bg-card text-foreground hover:border-primary/50"
                        : "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50",
                  )}
                >
                  {value}
                  {isSelected && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected SKU Info */}
      {selectedSku && (
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">已选规格</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {selectedSku.attributes?.map((attr) => attr.value).join(" / ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-sale">
                {currency}
                {selectedSku.jdPrice?.toFixed(2) ||
                  selectedSku.originalPrice?.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                库存: {selectedSku.stockQuantity || 0}件
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
