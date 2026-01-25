"use client";

import Image from "next/image";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WalleeMallProductsDtosProductCoverDto } from "@/openapi";

type Props = {
  images: WalleeMallProductsDtosProductCoverDto[];
  className?: string;
};

export const ProductImageGallery: FC<Props> = ({ images, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const visibleThumbnails = 5;
  const canScrollUp = thumbnailStartIndex > 0;
  const canScrollDown = thumbnailStartIndex + visibleThumbnails < images.length;

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const scrollThumbnailsUp = () => {
    if (canScrollUp) {
      setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const scrollThumbnailsDown = () => {
    if (canScrollDown) {
      setThumbnailStartIndex((prev) =>
        Math.min(images.length - visibleThumbnails, prev + 1),
      );
    }
  };

  const visibleImages = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + visibleThumbnails,
  );

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative aspect-square w-full bg-muted shadow-2xl rounded-lg", className)}>
        <Image
          src="/placeholder.svg?height=600&width=600"
          alt="暂无图片"
          className="object-cover p-1"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Left Thumbnail Column */}
      <div className="flex w-20 shrink-0 flex-col gap-2">
        {/* Scroll Up Button */}
        {images.length > visibleThumbnails && (
          <button
            onClick={scrollThumbnailsUp}
            disabled={!canScrollUp}
            className={cn(
              "flex h-6 w-full items-center justify-center rounded transition-colors",
              canScrollUp
                ? "bg-muted hover:bg-muted/80 text-foreground"
                : "text-muted-foreground/30 cursor-not-allowed",
            )}
            aria-label="向上滚动"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}

        {/* Thumbnail List */}
        <div className="flex flex-col gap-2">
          {visibleImages.map((image, visibleIndex) => {
            const actualIndex = thumbnailStartIndex + visibleIndex;
            return (
              <button
                key={image.mallMediaId}
                onClick={() => handleThumbnailClick(actualIndex)}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded border-2 transition-all shadow-sm",
                  actualIndex === currentIndex
                    ? "border-primary ring-1 ring-primary"
                    : "border-transparent hover:border-muted-foreground/30",
                )}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${image.mallMediaId}`}
                  alt={`商品图片 ${actualIndex + 1}`}
                  className="object-cover"
                  fill
                  sizes="80px"
                />
              
              </button>
            );
          })}
        </div>

        {/* Scroll Down Button */}
        {images.length > visibleThumbnails && (
          <button
            onClick={scrollThumbnailsDown}
            disabled={!canScrollDown}
            className={cn(
              "flex h-6 w-full items-center justify-center rounded transition-colors",
              canScrollDown
                ? "bg-muted hover:bg-muted/80 text-foreground"
                : "text-muted-foreground/30 cursor-not-allowed",
            )}
            aria-label="向下滚动"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 overflow-hidden rounded-lg bg-muted shadow-sm">
        <div className="relative aspect-square w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${images[currentIndex].mallMediaId}`}
            alt={`商品图片 ${currentIndex + 1}`}
            className="object-cover transition-opacity duration-300"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};
