# 查询构建器使用文档

## 📁 文件结构

```
lib/query-builder/          # 通用查询构建器（不包含业务逻辑）
  ├── types.ts              # 类型定义、接口、常量
  ├── parser.ts             # 通用解析器
  ├── index.ts              # 导出文件
  └── config.ts             # 产品特定配置（业务配置）

components/mobile/query-builder/  # 通用查询组件
  ├── search-sheet.tsx      # 通用搜索组件
  └── pagination.tsx        # 移动端分页组件

lib/query-parser.ts         # 旧的解析器（可以删除）
```

## 🎯 设计原则

1. **通用组件分离**：通用的查询构建器不包含任何业务特定的类型（如 Product）
2. **配置驱动**：所有业务特定的配置都在 `config.ts` 中定义
3. **类型安全**：完整的 TypeScript 支持
4. **默认值支持**：三个级别的默认值配置

## 📝 使用指南

### 1. 为新实体创建查询配置

```typescript
// lib/query-builder/configs/order-config.ts
import type { QueryConfig } from "@/lib/query-builder/types";
import type { OrderGetListData } from "@/openapi";

export type OrderQuery = NonNullable<OrderGetListData["query"]>;

export const orderQueryConfig: QueryConfig = {
  fields: [
    {
      name: "OrderNo",
      label: "订单号",
      type: "string",
      operators: ["Eq", "Contains"],
      defaultOperator: "Contains",
    },
    {
      name: "Amount",
      label: "金额",
      type: "number",
      operators: ["Gte", "Lte"],
      defaultOperator: "Gte",
      min: 0,
      step: 0.01,
    },
  ],
  enableSorting: true,
  sortingOptions: [
    { label: "创建时间降序", value: "CreationTime DESC" },
  ],
  defaults: {
    skipCount: 0,
    maxResultCount: 10,
    sorting: "CreationTime DESC",
  },
};
```

### 2. 创建搜索组件

```typescript
// components/mobile/orders/search-sheet.tsx
import { SearchSheet } from "@/components/mobile/query-builder/search-sheet";
import { orderQueryConfig } from "@/lib/query-builder/configs/order-config";

export function OrderSearchSheet({ trigger }: Props) {
  return <SearchSheet config={orderQueryConfig} title="搜索订单" />;
}
```

### 3. 在页面中使用

```typescript
// app/(public)/orders/page.tsx
import { parseQueryFromConfig } from "@/lib/query-builder/parser";
import { orderQueryConfig, type OrderQuery } from "@/lib/query-builder/configs/order-config";

const Wrapper = async ({ searchParams }) => {
  const search = await searchParams;
  const query = parseQueryFromConfig<OrderQuery>(search, orderQueryConfig);
  
  return <OrderGrid query={query} />;
};
```

### 4. 添加分页

```typescript
// components/mobile/orders/grid.tsx
import { MobilePagination } from "@/components/mobile/query-builder/pagination";

export function OrderGrid({ query }) {
  const { data } = useOrders(query);
  
  return (
    <div>
      {/* 列表内容 */}
      <MobilePagination 
        totalCount={data?.totalCount ?? 0}
        pageSize={query?.MaxResultCount}
      />
    </div>
  );
}
```

## ⚙️ 默认值配置

三个级别的默认值优先级：

1. **URL 参数**（最高优先级）
2. **配置默认值**（config.defaults）
3. **全局默认值**（DEFAULT_QUERY_VALUES）

```typescript
// 全局默认值
export const DEFAULT_QUERY_VALUES = {
  skipCount: 0,
  maxResultCount: 20,
  sorting: "",
};

// 配置默认值（覆盖全局）
const config = {
  defaults: {
    skipCount: 0,
    maxResultCount: 10,  // 订单每页显示10条
    sorting: "CreationTime DESC",
  },
};
```

## 🔧 支持的字段类型和操作符

### 字符串类型
- `Eq`, `Not`, `Equals`, `Contains`, `NotContains`
- `StartsWith`, `NotStartsWith`, `EndsWith`, `NotEndsWith`
- `IsNull`, `IsNotNull`, `IsEmpty`, `IsNotEmpty`

### 数字/枚举类型
- `Eq`, `Not`, `Gt`, `Lt`, `Gte`, `Lte`
- `IsNull`, `IsNotNull`

### 布尔类型
- 直接布尔值

## 📱 分页组件

### 完整模式
```tsx
<MobilePagination 
  totalCount={100}
  pageSize={20}
  showInfo={true}  // 显示 "显示第 1-20 条，共 100 条"
/>
```

### 紧凑模式
```tsx
<MobilePagination 
  totalCount={100}
  pageSize={20}
  compact={true}  // 只显示上一页/下一页按钮
/>
```

## 🚀 迁移步骤

如果要从旧的 `query-parser.ts` 迁移到新的查询构建器：

1. 在 `lib/query-builder/config.ts` 中定义你的业务配置
2. 使用 `parseQueryFromConfig` 替换 `parseProductQuery`
3. 删除 `lib/query-parser.ts` 和 `lib/product-query-parser.ts`
4. 在列表组件中添加 `MobilePagination`
