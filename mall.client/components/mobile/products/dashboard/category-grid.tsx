import { Card } from "@/components/ui/card";
import Image from "next/image";
const categories = [
  { name: "厨房好物", image: "/images/placeholder1.jpg" },
  { name: "居家装饰", image: "/images/placeholder2.jpg" },
  { name: "收纳整理", image: "/images/placeholder3.jpg" },
];

export function CategoryGrid() {
  return (
    <section className="container px-4 py-12 md:py-16">
      <h3 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground">
        精选分类
      </h3>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="100%"
                fill
              />
            </div>
            <div className="p-3 md:p-4">
              <h4 className="text-center text-sm font-medium text-foreground md:text-base">
                {category.name}
              </h4>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
