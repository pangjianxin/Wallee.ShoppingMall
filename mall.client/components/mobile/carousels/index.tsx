"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { FC } from "react";
import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";
import Link from "next/link";

type Props = {
  carousels: WalleeMallCarouselsDtosCarouselDto[];
};

export const Carousels: FC<Props> = ({ carousels }) => {
  const imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      {carousels && carousels.length > 0 ? (
        <Carousel
          className="h-full w-full"
          opts={{
            loop: carousels.length > 1,
          }}
          plugins={
            carousels.length > 1
              ? [Autoplay({ delay: 3000, stopOnInteraction: true })]
              : []
          }
          setApi={(api) => {
            if (api) {
              api.on("autoplay:select", () => {});
            }
          }}
        >
          <CarouselContent className="ml-0 h-full">
            {carousels.map((carousel, index) => (
              <CarouselItem key={index} className="relative aspect-video pl-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${carousel.coverImageMediaId}`}
                  alt={`商品图片 ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes={imageSizes}
                  {...(index === 0
                    ? { priority: true }
                    : { loading: "lazy" as const })}
                />
                {carousel.title ? (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-black/40 via-black/20 to-transparent" />
                    <Link
                      href={`/carousels/${carousel.id}`}
                      className="absolute inset-x-0 bottom-0 z-20 px-2 pt-4 text-sm font-medium text-white drop-shadow-md line-clamp-2"
                    >
                      {carousel.title}
                    </Link>
                  </>
                ) : null}
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
    </div>
  );
};
