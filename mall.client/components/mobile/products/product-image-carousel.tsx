import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { WalleeMallProductsDtosProductCoverDto } from "@/openapi";
import { FC, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type Props = {
  covers: WalleeMallProductsDtosProductCoverDto[];
  badge?: React.ReactNode;
};

export const ProductImageCarousel: FC<Props> = ({ covers, badge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
  const onSelect = useCallback((api: any) => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, []);
  const hasMultipleImages = covers && covers.length > 1;

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-muted">
      {covers && covers.length > 0 ? (
        <Carousel
          className="h-full w-full"
          opts={{
            loop: hasMultipleImages as boolean,
          }}
          plugins={
            hasMultipleImages
              ? [Autoplay({ delay: 3000, stopOnInteraction: true })]
              : []
          }
          setApi={(api) => {
            if (api) {
              api.on("select", () => onSelect(api));
            }
          }}
        >
          <CarouselContent className="ml-0 h-full">
            {covers.map((image, index) => (
              <CarouselItem key={index} className="relative aspect-square pl-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_PREVIEW_URL}/${image.mallMediaId}`}
                  alt={`商品图片 ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes={imageSizes}
                  {...(index === 0
                    ? { priority: true }
                    : { loading: "lazy" as const })}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <Image
          src="/placeholder.svg?height=300&width=300"
          alt="暂无图片"
          className="object-cover"
          fill
          sizes={imageSizes}
          loading="lazy"
        />
      )}

      {hasMultipleImages && (
        <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
          {covers.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1 w-1 rounded-full transition-colors",
                index === currentIndex ? "bg-white" : "bg-white/50",
              )}
            />
          ))}
        </div>
      )}

      {badge && (
        <div className="absolute left-1.5 top-1.5 z-10 px-1.5 py-0.5 text-[10px] sm:left-2 sm:top-2 sm:text-xs">
          {badge}
        </div>
      )}
    </div>
  );
};
