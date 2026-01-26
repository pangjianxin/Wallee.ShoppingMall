import { Card } from "@/components/ui/card";
import Image from "next/image";
export function LifestyleSection() {
  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center font-serif text-3xl font-semibold text-foreground">
        生活美学
      </h3>
      <p className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-muted-foreground">
        在日常的点滴中，发现生活的仪式感
      </p>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Card className="group cursor-pointer overflow-hidden border-border">
          <div className="relative aspect-4/3 overflow-hidden md:aspect-video">
            <Image
              src="/images/placeholder3.jpg"
              alt="早餐时光"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="100%"
              fill
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
              <h4 className="mb-2 font-serif text-2xl font-semibold">
                悠然早餐时光
              </h4>
              <p className="text-sm leading-relaxed text-background/90">
                用心准备的每一餐，都是对生活的热爱
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:gap-6">
          <Card className="group cursor-pointer overflow-hidden border-border">
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src="/images/placeholder3.jpg"
                alt="工作空间"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="100%"
                fill
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <h4 className="mb-1 font-serif text-xl font-semibold">
                  理想工作角落
                </h4>
                <p className="text-sm text-background/90">
                  专注与放松的平衡之地
                </p>
              </div>
            </div>
          </Card>

          <Card className="group cursor-pointer overflow-hidden border-border">
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src="/images/placeholder3.jpg"
                alt="下午茶"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="100%"
                fill
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <h4 className="mb-1 font-serif text-xl font-semibold">
                  惬意下午茶
                </h4>
                <p className="text-sm text-background/90">给自己一段慢时光</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
