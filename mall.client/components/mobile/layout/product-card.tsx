import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  jdPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  jdPrice,
  image,
  category,
  isNew,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          sizes="100%"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            新品
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{category}</p>
        <h3 className="mb-2 line-clamp-2 font-medium text-foreground">
          {name}
        </h3>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-primary">
              ¥{price}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ¥{originalPrice}
              </span>
            )}
          </div>
          {jdPrice && (
            <div className="text-xs text-muted-foreground">
              京东价: <span className="font-medium">¥{jdPrice}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
