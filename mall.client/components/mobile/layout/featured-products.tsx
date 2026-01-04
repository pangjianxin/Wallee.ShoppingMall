import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "手工陶瓷马克杯",
    price: 128,
    originalPrice: 168,
    image: "/images/placeholder3.jpg",
    tag: "热销",
  },
  {
    id: 2,
    name: "北欧简约花瓶",
    price: 88,
    image: "/images/placeholder3.jpg",
    tag: "新品",
  },
  {
    id: 3,
    name: "棉麻桌布",
    price: 158,
    image: "/images/placeholder3.jpg",
  },
  {
    id: 4,
    name: "竹制餐具套装",
    price: 98,
    image: "/images/placeholder3.jpg",
  },
];

export function FeaturedProducts() {
  return (
    <section className="container px-4 py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-serif text-3xl font-semibold text-foreground">
          热门推荐
        </h3>
        <Button variant="ghost" className="text-sm text-muted-foreground">
          查看更多 →
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden">
              {product.tag && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {product.tag}
                </span>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Image
                src={product.image || "/placeholder1.jpg"}
                alt={product.name}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="100%"
                fill
              />
            </div>
            <div className="p-4">
              <h4 className="mb-2 text-sm font-medium leading-snug text-foreground md:text-base">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-primary">
                  ¥{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ¥{product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
