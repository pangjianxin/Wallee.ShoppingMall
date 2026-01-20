"use client";
import { z } from "zod";
import { ProductCard } from "@/components/mobile/products/product-card";
import { WalleeMallProductsDtosProductDto } from "@/openapi";

const ProductCoverSchema = z.object({
  mallMediaId: z.string().optional(),
});

const ProductSchema = z.object({
  id: z.string().optional(),
  creationTime: z.string().optional(),
  creatorId: z.string().nullable().optional(),
  lastModificationTime: z.string().nullable().optional(),
  lastModifierId: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  originalPrice: z.number().nullable().optional(),
  jdPrice: z.number().nullable().optional(),
  discountRate: z.number().optional(),
  currency: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
  salesCount: z.number().optional(),
  productCovers: z.array(ProductCoverSchema).nullable().optional(),
});

const ProductListSchema = z.array(ProductSchema);

const parseProductResult = (
  result: string
): WalleeMallProductsDtosProductDto[] => {
  const parseJson = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn("Failed to parse product result", error);
      return null;
    }
  };

  const parsePayload = (candidate: unknown) => {
    if (Array.isArray(candidate)) {
      const parsed = ProductListSchema.safeParse(candidate);
      return parsed.success ? parsed.data : null;
    }
    if (candidate && typeof candidate === "object") {
      const items = (candidate as { items?: unknown }).items;
      if (Array.isArray(items)) {
        const parsed = ProductListSchema.safeParse(items);
        return parsed.success ? parsed.data : null;
      }
    }
    return null;
  };

  const parsedRoot = parseJson(result) ?? result;
  const rawPayload = (parsedRoot as { text?: unknown })?.text ?? parsedRoot;
  const candidate =
    typeof rawPayload === "string" ? parseJson(rawPayload) : rawPayload;

  return parsePayload(candidate) ?? [];
};

interface ProductSearchProps {
  args: { title?: string };
  result: string;
}

export function ProductsSearch({ args, result }: ProductSearchProps) {
  const products = parseProductResult(result);
  const keyword = args?.title || "商品";

  if (!products.length) {
    return (
      <div className="bg-rose-100 text-rose-600 p-4 rounded-lg max-w-md">
        未找到与 {keyword} 相关的商品，请稍后重试。
      </div>
    );
  }

  return (
    <section className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {keyword} 的商品结果
          </h2>
          <p className="text-xs text-muted-foreground">
            共 {products.length} 件商品
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id || product.name || String(index)}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
