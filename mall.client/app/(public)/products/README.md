# 服务端数据预取实现说明

本项目现在支持在服务端查询商品数据并传递给客户端组件。实现了两种方案：

## 方案一：使用现有的 parseQueryFromConfig（已实现）

**文件：** `app/(public)/products/page.tsx`

这是当前使用的方案，利用现有的 query-builder 系统：

```tsx
import { parseQueryFromConfig } from "@/lib/query-builder/parser";
import { productQueryConfig, type ProductQuery } from "@/lib/query-builder/config";

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;
  const query = parseQueryFromConfig<ProductQuery>(params, productQueryConfig);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    productGetListOptions(query ? { query } : undefined)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductGrid />
    </HydrationBoundary>
  );
};
```

**优点：**
- 复用现有的 query-builder 配置
- 支持复杂的过滤器和操作符
- 统一的查询配置管理

## 方案二：使用 nuqs searchParamsCache（示例）

**文件：** `app/(public)/products/page.alternative.tsx` 和 `search-params.ts`

这是使用 nuqs 原生 API 的方案，类似你提供的示例：

```tsx
// search-params.ts
export const searchParamsCache = createSearchParamsCache({
  SkipCount: parseAsInteger.withDefault(0),
  MaxResultCount: parseAsInteger.withDefault(20),
  Sorting: parseAsString.withDefault("creationTime desc"),
  "Name.Contains": parseAsString,
});

// page.alternative.tsx
const parsedParams = searchParamsCache.parse(params);
const query = {
  SkipCount: parsedParams.SkipCount,
  MaxResultCount: parsedParams.MaxResultCount,
  Sorting: parsedParams.Sorting,
  ...
};
```

**优点：**
- 更简洁的参数定义
- nuqs 原生 API，类型安全
- 自动验证和默认值

## ProductGrid 组件更新

`components/mobile/products/grid.tsx` 现在支持两种模式：

### 1. 服务端数据预取模式（推荐）

当从服务端页面使用时，数据会在服务端预取并通过 HydrationBoundary 传递：

```tsx
// 在服务端页面
<HydrationBoundary state={dehydrate(queryClient)}>
  <ProductGrid />
</HydrationBoundary>
```

组件会使用 `useSuspenseQuery` 从预取的数据中读取，无需额外请求。

### 2. 客户端查询模式（向后兼容）

如果不提供预取数据，组件会自动切换到客户端查询模式：

```tsx
// 直接使用，会在客户端发起请求
<ProductGrid />
```

## 关键代码改动

### 1. ProductGrid 组件

```tsx
export function ProductGrid({ dataPromise }: ProductGridProps = {}) {
  // 客户端查询
  const clientQuery = useProducts(query, {
    keepPreviousData: true,
    enabled: !dataPromise, // 有服务端数据时禁用
  });

  // 服务端数据
  const serverQuery = dataPromise
    ? useSuspenseQuery({
        ...productGetListOptions(query ? { query } : undefined),
      })
    : null;

  // 选择使用哪个数据源
  const { data, isPending, isError, refetch } = serverQuery || clientQuery;
  // ...
}
```

### 2. 新增 getQueryClient 函数

```tsx
// lib/tanstack-query-provider.tsx
export const getQueryClient = cache(() => new QueryClient());
```

使用 React `cache` 确保在服务端渲染期间使用同一个 QueryClient 实例。

## 如何切换方案

### 使用方案二（searchParamsCache）

1. 将 `page.alternative.tsx` 重命名为 `page.tsx`
2. 根据需要调整 `search-params.ts` 中的参数定义
3. 更新 ProductSearchSheet 组件使用相同的参数名

### 继续使用方案一（当前方案）

无需任何改动，当前实现已经完整可用。

## 性能优势

- ✅ 服务端数据预取，减少客户端请求
- ✅ 支持 Streaming SSR 和 Suspense
- ✅ 自动的数据脱水（dehydration）和再水化（hydration）
- ✅ URL 参数变化时自动重新查询
- ✅ 保留客户端查询的即时反馈能力

## 注意事项

1. **认证状态：** 确保服务端组件能正确获取用户认证状态
2. **缓存策略：** 可以调整 QueryClient 的默认 staleTime 和 cacheTime
3. **错误处理：** 服务端错误会在客户端通过 error boundary 捕获
4. **SEO：** 数据在服务端渲染，有利于 SEO
