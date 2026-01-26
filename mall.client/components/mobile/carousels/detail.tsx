"use client";
import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";
import { FC, use } from "react";
import Image from "next/image";
import { Clock, Info } from "lucide-react";
import { Editor } from "@/components/shared/editor/dynamic-editor";
import { format } from "date-fns";
import { ProductCard } from "@/components/mobile/products/card";
import { useProduct } from "@/hooks/products/use-product";

type Props = {
  carouselPromise: Promise<WalleeMallCarouselsDtosCarouselDto | undefined>;
};

const Fc: FC<Props> = ({ carouselPromise }) => {
  const carousel = use(carouselPromise);
  const { data: associatedProduct } = useProduct({
    id: carousel?.productId as string,
  });
  return (
    <div className="flex flex-col gap-2">
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {carousel?.coverImageMediaId ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${carousel.coverImageMediaId}`}
            alt={carousel.title || "轮播图"}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-muted-foreground text-sm">暂无图片</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 px-2 pb-4">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 text-lg">
          {carousel?.title || "无标题"}
        </h3>

        {/* Description */}
        {carousel?.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {carousel.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {format(carousel?.creationTime as string, "yyyy-MM-dd")}
            </span>
          </div>
        </div>
        <Editor value={carousel?.content || ""} />
        {associatedProduct && (
          <div className="pt-4">
            <h4 className="mb-2 font-medium text-foreground">
              <Info className="inline-block h-4 w-4 mr-1" />
              关联商品
            </h4>
            <ProductCard
              product={associatedProduct}
              className="flex flex-row gap-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Fc;
