import Link from "next/link";
import { Hero } from "@/components/mobile/layout/hero";
import { CategoryGrid } from "@/components/mobile/products/category-grid";
import { FeaturedProducts } from "@/components/mobile/products/featured-products";
import { LifestyleSection } from "@/components/mobile/layout/life-style-section";
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <LifestyleSection />
      <footer className="border-t border-border bg-background py-12 text-center text-muted-foreground dark:bg-black">
        <div className="container mx-auto px-4">
          <p className="mb-4">&copy; 2025 生活集. 用心生活，温暖每一天.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="#" className="hover:text-white">
              隐私政策
            </Link>
            <Link href="#" className="hover:text-white">
              服务条款
            </Link>
            <Link href="#" className="hover:text-white">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
