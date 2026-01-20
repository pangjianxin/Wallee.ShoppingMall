"use client";
import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import { ProductsSearch } from "@/components/mobile/products/ai/tool-renderers/product-search";
import { z } from "zod";

const ProductSearchSchema = z.object({
  title: z.string().min(1, { message: "商品名称不能为空" }),
});

export const ProductSearchRenderer = defineToolCallRenderer({
  name: "product_search",
  agentId: "products",
  args: ProductSearchSchema as any,
  render: ({ args, result, status }) => {
    if (status !== "complete" || !result) {
      return (
        <div className="bg-[#667eea] text-white p-4 m-2 rounded-lg max-w-md">
          <span className="animate-spin">⚙️ 正在获取商品信息...</span>
        </div>
      );
    }

    return <ProductsSearch args={args} result={result} />;
  },
});
