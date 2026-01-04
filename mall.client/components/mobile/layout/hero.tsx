import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            让生活回归本质
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
            精心挑选每一件生活好物，用心感受日常的温度与美好
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-full px-8">
              探索商品
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 bg-transparent"
            >
              了解更多
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 pb-8">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-21/9">
          <Image
            src="/images/placeholder3.jpg"
            alt="温馨的居家场景"
            className="object-cover"
            sizes="100%"
            fill
          />
        </div>
      </div>
    </section>
  );
}
