import { ProductGrid } from "@/components/mobile/products/product-grid";
import { NextPage } from "next";
const Page: NextPage = () => {
  return <ProductGrid products={[]} />;
};
Page.displayName = "ShopPage";
export default Page;
