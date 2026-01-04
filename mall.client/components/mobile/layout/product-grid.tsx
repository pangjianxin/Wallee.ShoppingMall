import { ProductCard } from "@/components/mobile/layout/product-card";

const products = [
  {
    id: "1",
    name: "北欧风陶瓷餐盘套装",
    price: 189,
    originalPrice: 259,
    jdPrice: 249,
    image: "/images/placeholder1.jpg",
    category: "餐具",
    isNew: true,
  },
  {
    id: "2",
    name: "竹制厨房收纳架",
    price: 128,
    jdPrice: 158,
    image: "/images/placeholder2.jpg",
    category: "收纳",
  },
  {
    id: "3",
    name: "日式简约玻璃茶壶",
    price: 95,
    jdPrice: 118,
    image: "/images/placeholder3.jpg",
    category: "茶具",
  },
  {
    id: "4",
    name: "棉麻桌布餐垫",
    price: 68,
    originalPrice: 98,
    jdPrice: 88,
    image: "/images/placeholder1.jpg",
    category: "布艺",
  },
  {
    id: "5",
    name: "手工编织收纳篮",
    price: 158,
    jdPrice: 198,
    image: "/images/placeholder2.jpg",
    category: "收纳",
    isNew: true,
  },
  {
    id: "6",
    name: "复古铜质花瓶",
    price: 215,
    jdPrice: 268,
    image: "/images/placeholder3.jpg",
    category: "装饰",
  },
  {
    id: "7",
    name: "环保硅胶保鲜盖",
    price: 45,
    jdPrice: 59,
    image: "/images/placeholder1.jpg",
    category: "厨房",
  },
  {
    id: "8",
    name: "木质调味罐套装",
    price: 138,
    originalPrice: 178,
    jdPrice: 168,
    image: "/images/placeholder2.jpg",
    category: "厨房",
  },
  {
    id: "9",
    name: "大理石纹托盘",
    price: 108,
    jdPrice: 138,
    image: "/images/placeholder3.jpg",
    category: "餐具",
  },
  {
    id: "10",
    name: "亚麻抱枕套",
    price: 58,
    jdPrice: 78,
    image: "/images/placeholder1.jpg",
    category: "布艺",
  },
  {
    id: "11",
    name: "玻璃密封储物罐",
    price: 88,
    jdPrice: 108,
    image: "/images/placeholder2.jpg",
    category: "收纳",
  },
  {
    id: "12",
    name: "陶瓷香薰蜡烛",
    price: 118,
    jdPrice: 148,
    image: "/images/placeholder3.jpg",
    category: "装饰",
    isNew: true,
  },
];

export function ProductGrid() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          共 {products.length} 件商品
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
