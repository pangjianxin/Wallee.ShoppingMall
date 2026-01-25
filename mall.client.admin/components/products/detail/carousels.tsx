import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";
import { FC } from "react";
import { PermissionButton } from "@/components/auth/permission-button";
import Link from "next/link";
import Image from "next/image";
import { Editor } from "@/components/shared/editor/dynamic-editor";

type Props = {
  carousels: WalleeMallCarouselsDtosCarouselDto[];
};
export const ProductCarousels: FC<Props> = ({ carousels }) => {
  return (
    <div className="flex flex-col gap-4">
      {carousels.length === 0 && (
        <p className="text-sm text-muted-foreground">暂无轮播图</p>
      )}
      {carousels.map((carousel) => (
        <div key={carousel.id} className="rounded-md border border-dashed p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="grid sm:grid-cols-[1fr_3fr]">
              <div className="relative aspect-square">
                <Image
                  src={
                    carousel.coverImageMediaId
                      ? `${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${carousel.coverImageMediaId}`
                      : "/placeholder.svg?height=60&width=60"
                  }
                  alt={carousel.title || "轮播图封面"}
                  fill
                  sizes="100%"
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {carousel.title || "未命名轮播图"}
                </h3>
                <h6 className="text-sm font-light text-foreground">
                  {carousel.description || "未命名轮播图"}
                </h6>
                <div className="flex-1"></div>
                <div className="flex gap-2 justify-end">
                  <PermissionButton
                    asChild
                    size="sm"
                    variant="outline"
                    permission="Mall.Carousel.Update"
                  >
                    <Link href={`/carousels/${carousel.id}/update`}>编辑</Link>
                  </PermissionButton>
                  <PermissionButton
                    asChild
                    size="sm"
                    variant="destructive"
                    permission="Mall.Carousel.Delete"
                  >
                    <Link href={`/carousels/${carousel.id}/delete`}>删除</Link>
                  </PermissionButton>
                </div>
              </div>
            </div>
          </div>
          <Editor value={carousel.content || "<p>无内容</p>"} readonly={true} />
        </div>
      ))}
    </div>
  );
};
