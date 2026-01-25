"use client";
import { use } from "react";
import Link from "next/link";
import {
  WalleeMallCmsDtosPostDto,
  WalleeMallProductsDtosProductDto,
  WalleeMallTagsDtosTagDto,
  WalleeMallCarouselsDtosCarouselDto,
} from "@/openapi";
import { ProductImageGallery } from "@/components/products/image-gallery";
import { SkuInfo } from "@/components/products/detail/skus";
import { PermissionButton } from "@/components/auth/permission-button";
import { ProductCarousels } from "./carousels";
import { ProductTags } from "./tags";
import { ProductInformation } from "./information";
import { ProductPosts } from "./posts";
import { ReactNode } from "react";
import { ExpandableContainer } from "@/components/shared/expandable-container";
import CreateProductCarousel from "@/components/carousels/create";

export type SectionCardProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const SectionCard = ({ title, actions, children }: SectionCardProps) => (
  <div className="rounded-lg border bg-background p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {actions}
    </div>
    {children}
  </div>
);

type Props = {
  entity: Promise<WalleeMallProductsDtosProductDto>;
  productPosts?: Promise<WalleeMallCmsDtosPostDto[]>;
  relativeTags?: Promise<WalleeMallTagsDtosTagDto[]>;
  productCarousels?: Promise<WalleeMallCarouselsDtosCarouselDto[]>;
};

const Detail: React.FC<Props> = ({
  entity,
  productPosts,
  productCarousels,
  relativeTags,
}) => {
  const product = use(entity);
  const posts = productPosts ? use(productPosts) : [];
  const carousels = productCarousels ? use(productCarousels) : [];
  const tags = relativeTags ? use(relativeTags) : [];
  const productId = product.id;

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <SectionCard
            title="商品图片"
            actions={
              productId ? (
                <PermissionButton
                  asChild
                  size="sm"
                  variant="outline"
                  permission="Mall.Product.Update"
                >
                  <Link href={`/products/${productId}/update`}>编辑</Link>
                </PermissionButton>
              ) : null
            }
          >
            <ProductImageGallery images={product?.productCovers || []} />
          </SectionCard>

          <SectionCard
            title={`商品内容${posts.length > 0 ? `(${posts.length}个)` : ""}`}
            actions={
              <PermissionButton
                asChild
                size="sm"
                variant="outline"
                permission="Mall.Product.Update"
              >
                <Link href={`/posts/create?productId=${productId}`}>创建</Link>
              </PermissionButton>
            }
          >
            <ExpandableContainer allowCollapse collapsedMaxHeight={600}>
              <ProductPosts posts={posts} productId={productId} />
            </ExpandableContainer>
          </SectionCard>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <SectionCard
            title="基础信息"
            actions={
              productId ? (
                <PermissionButton
                  asChild
                  size="sm"
                  variant="outline"
                  permission="Mall.Product.Update"
                >
                  <Link href={`/products/${productId}/update`}>编辑</Link>
                </PermissionButton>
              ) : null
            }
          >
            <ProductInformation product={product} />
          </SectionCard>

          <SectionCard
            title="商品标签"
            actions={
              productId ? (
                <PermissionButton
                  asChild
                  size="sm"
                  variant="outline"
                  permission="Mall.Product.Update"
                >
                  <Link href={`/tags/product/${productId}`}>编辑</Link>
                </PermissionButton>
              ) : null
            }
          >
            <ProductTags tags={tags} />
          </SectionCard>

          <SectionCard
            title="SKU信息"
            actions={
              productId ? (
                <PermissionButton
                  asChild
                  size="sm"
                  variant="outline"
                  permission="Mall.Product.Update"
                >
                  <Link href={`/products/${productId}/update-skus`}>
                    管理SKU
                  </Link>
                </PermissionButton>
              ) : null
            }
          >
            <SkuInfo skus={product.skus || []} />
          </SectionCard>
          <SectionCard
            title="商品轮播图"
            actions={
              <div className="flex justify-end">
                <CreateProductCarousel product={product} />
              </div>
            }
          >
            <ProductCarousels carousels={carousels} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

Detail.displayName = "ProductDetail";

export default Detail;
