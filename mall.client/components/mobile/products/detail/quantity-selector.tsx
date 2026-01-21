"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity = 99,
  onQuantityChange,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="rounded-lg bg-card px-3 py-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-foreground">购买数量</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg bg-transparent"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="减少数量"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[40px] text-center text-base font-medium text-foreground">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg bg-transparent"
            onClick={increase}
            disabled={quantity >= maxQuantity}
            aria-label="增加数量"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {maxQuantity > 0 && maxQuantity < 99 && (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          限购 {maxQuantity} 件
        </p>
      )}
    </div>
  );
}
