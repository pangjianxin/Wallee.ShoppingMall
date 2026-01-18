# Wallee 商城管理系统 (Shopping Mall Management System)

## 🔐 身份认证 (Authentication)

本项目使用 **Better-auth** 与后端 ASP.NET Core + OpenIddict 集成实现身份认证。

### 快速开始

1. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local，填入正确的配置值
   ```

2. **查看完整文档**
   - [BETTER_AUTH_GUIDE.md](./BETTER_AUTH_GUIDE.md) - 完整的集成指南
   - [AUTH_MIGRATION.md](./AUTH_MIGRATION.md) - 迁移说明和历史

3. **核心功能**
   - ✅ 用户名/密码/验证码登录
   - ✅ Session 管理（Cookie 存储）
   - ✅ Token 管理（accessToken, refreshToken, idToken）
   - ✅ 用户信息展示（姓名、角色、组织信息）
   - ✅ 权限控制

### 验证身份认证

启动应用后访问：
- 登录页面: `http://localhost:4201/account/login`
- 用户信息显示在页面右上角（登录后）

## BUG
```bash
### NEXTJS 16.0.3
https://github.com/vercel/next.js/issues/86099
```
## 📋 环境配置示例

```env
# OpenID Connect 配置
OPENIDDICT_INTERNAL_ISSUER=http://localhost:44322
OPENIDDICT_EXTERNAL_ISSUER=http://localhost:44322
OPENIDDICT_WELL_KNOWN=http://localhost:44322/.well-known/openid-configuration

# NextAuth 配置
NEXTAUTH_URL=http://localhost:4200
NEXTAUTH_URL_INTERNAL=http://localhost:4200
NEXTAUTH_CLIENT_ID=WorkOrder_App
NEXTAUTH_CLIENT_SECRET=""
NEXTAUTH_SCOPE='openid profile email offline_access WorkOrder'

# 应用配置
NEXT_PUBLIC_API_URL=http://localhost:44322
NEXT_PUBLIC_APP_URL=http://localhost:4200
NEXT_PUBLIC_APP_NAME=包头分行工单系统
NEXT_PUBLIC_APP_ENG_NAME=BAOTOU BRANCH WORK ORDER SYSTEM
NEXT_PUBLIC_MEDIA_DOWNLOAD_URL=/api/work-order/media/download
NEXT_PUBLIC_MEDIA_PREVIEW_URL=/api/work-order/media/preview
```

---

## 🎯 DataStateHandler - 通用状态处理组件

一个强大的 React 组件，用于统一处理数据加载、错误和空状态的显示。

### ✨ 核心优势

- 📉 **代码减少 60%** - 统一处理加载/错误/空状态
- 🎯 **逻辑统一** - 所有页面一致的状态管理
- 🚀 **开发快速** - 3 行代码搞定状态处理
- 🔧 **易于维护** - 集中管理状态逻辑

### 📍 文件位置

```
components/shared/
├── data-state-handler.tsx       ⭐ 主组件
├── data-state-handler.examples.tsx  📚 使用示例
└── data-state-handler.demo.tsx     🎮 交互演示
```

### 🚀 快速开始

#### 1️⃣ 基础列表

```tsx
import { DataStateHandler } from "@/components/shared/data-state-handler";

export const MyList = () => {
  const { data, isLoading, isError, error } = useMyData();

  return (
    <DataStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      isEmpty={data?.items?.length === 0}
      loadingTitle="加载中..."
    >
      <div className="grid gap-4">
        {data?.items?.map(item => <Item key={item.id} item={item} />)}
      </div>
    </DataStateHandler>
  );
};
```

#### 2️⃣ 详情页面

```tsx
<DataStateHandler
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={detail}
  isEmpty={!detail}
  loadingTitle="加载详情..."
>
  <div className="space-y-4">
    <div><label>名称</label><p>{detail?.name}</p></div>
    <div><label>描述</label><p>{detail?.description}</p></div>
  </div>
</DataStateHandler>
```

#### 3️⃣ 带分页的列表

```tsx
<DataStateHandler
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  isEmpty={data?.items?.length === 0}
  loadingTitle="加载中..."
>
  <div>
    <div className="grid gap-4">
      {data?.items?.map(item => <Item key={item.id} item={item} />)}
    </div>
    <Pagination {...paginationProps} />
  </div>
</DataStateHandler>
```

### 📊 Props 说明

| Props | 类型 | 说明 |
|-------|------|------|
| `children` | ReactNode | ✅ 必需 - 正常状态下的内容 |
| `isLoading` | boolean | 加载状态 |
| `isError` | boolean | 错误状态 |
| `error` | any | 错误对象 |
| `data` | T \| null | 数据对象 |
| `isEmpty` | boolean | 是否为空 |
| `loadingTitle` | string | 加载标题 |
| `errorTitle` | string | 错误标题 |
| `errorDescription` | string | 错误描述 |
| `emptyTitle` | string | 空状态标题 |
| `emptyDescription` | string | 空状态描述 |

### 🔄 迁移指南

**之前的代码**
```tsx
{isLoading && <LoadingState title="..." />}
{isError && <ErrorState title={...} />}
{data && !isLoading && <>...</>}
```

**迁移后的代码**
```tsx
<DataStateHandler
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  isEmpty={data?.items?.length === 0}
  loadingTitle="加载中..."
>
  {/* 内容 */}
</DataStateHandler>
```

### 💡 常见用法

#### 自定义错误处理
```tsx
<DataStateHandler
  errorTitle="加载失败"
  errorDescription="请检查网络连接"
  errorContent={
    <Button onClick={() => refetch()}>重新加载</Button>
  }
>
  {/* 内容 */}
</DataStateHandler>
```

#### 自定义空状态
```tsx
<DataStateHandler
  emptyTitle="暂无数据"
  emptyDescription="点击新建项目"
  emptyContent={
    <Button onClick={() => onCreate()}>新建</Button>
  }
>
  {/* 内容 */}
</DataStateHandler>
```

### 📚 查看更多示例

查看 `data-state-handler.examples.tsx` 获取 8 个不同场景的完整示例：
- 基础列表
- 带分页的列表
- 详情页面
- 自定义错误处理
- 自定义空状态
- 搜索结果
- 卡片网格
- 表格显示

### 🎮 交互式演示

在 `data-state-handler.demo.tsx` 中有两个可交互的演示组件：
- `DataStateHandlerDemo` - 状态切换演示
- `RealWorldExample` - 真实场景模拟

在你的页面中导入并使用：
```tsx
import { DataStateHandlerDemo } from "@/components/shared/data-state-handler.demo";

export default function TestPage() {
  return <DataStateHandlerDemo />;
}
```

### ✅ 实际应用示例

查看 `components/mobile/maintenance-issue-defs/management.tsx` 了解如何在真实项目中使用。

---

## 🎯 快速参考

### 状态显示优先级
```
加载中 > 错误 > 空状态 > 正常内容
```

### 最小化配置
```tsx
<DataStateHandler
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  isEmpty={isEmpty}
  loadingTitle="加载中..."
>
  {/* 内容 */}
</DataStateHandler>
```

### 完整配置
```tsx
<DataStateHandler
  isLoading={isLoading}
  isError={isError}
  error={error}
  data={data}
  isEmpty={isEmpty}
  loadingTitle="加载中..."
  errorTitle="错误"
  errorDescription="加载失败"
  errorContent={<Button>重试</Button>}
  emptyTitle="无数据"
  emptyDescription="暂无数据"
  emptyContent={<Button>创建</Button>}
>
  {/* 内容 */}
</DataStateHandler>
```

---

## 📞 问题排查

| 问题 | 解决方案 |
|------|---------|
| 导入找不到组件 | 检查路径：`@/components/shared/data-state-handler` |
| 状态显示不对 | 检查 `isEmpty` 条件是否正确 |
| 样式不符合预期 | 查看源代码或示例文件 |
| 需要自定义内容 | 使用 `errorContent` 和 `emptyContent` props |