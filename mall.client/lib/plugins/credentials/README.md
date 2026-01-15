# Custom Credentials Plugin

这是一个基于 [better-auth-credentials-plugin](https://github.com/erickweil/better-auth-credentials-plugin) 简化实现的自定义 credentials 认证插件。

## 为什么创建自定义插件？

1. **最小化依赖**：只包含项目所需的核心功能
2. **简化维护**：代码完全在项目控制之下
3. **定制化**：可以根据具体需求调整实现
4. **与 OpenIddict 完美集成**：专门优化了与 ASP.NET Core + OpenIddict 的集成

## 功能特性

### ✅ 已实现

- **自定义输入验证**：支持任意 Zod schema（用户名、密码、验证码等）
- **灵活的认证回调**：可以与任何外部认证系统集成
- **自动用户注册**：可选的自动注册功能
- **生命周期钩子**：onSignIn, onSignUp, onLinkAccount
- **Token 管理**：支持存储 accessToken, refreshToken, idToken
- **错误处理**：清晰的错误代码和消息

### ❌ 未实现（简化）

- 邮箱验证流程
- 多种认证provider
- 复杂的账户链接逻辑
- 时序攻击防护

## 文件结构

```
lib/plugins/credentials/
├── index.ts      # 服务端插件
├── client.ts     # 客户端插件
└── README.md     # 本文档
```

## 使用方法

### 服务端配置 (lib/auth.ts)

```typescript
import { credentials } from "@/lib/plugins/credentials";
import { z } from "zod";

const inputSchema = z.object({
  username: z.string(),
  password: z.string(),
  captchaid: z.string(),
  captchacode: z.string(),
});

export const auth = betterAuth({
  // ... 其他配置
  plugins: [
    credentials({
      autoSignUp: true,
      inputSchema: inputSchema,
      async callback(ctx, parsed) {
        // 调用外部认证系统
        const response = await fetch("https://your-auth-server/token", {
          method: "POST",
          body: new URLSearchParams({
            username: parsed.username,
            password: parsed.password,
            // ... 其他字段
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error("invalid_credentials");
        }
        
        // 返回用户数据和回调
        return {
          email: data.email,
          name: data.name,
          username: data.username,
          
          onLinkAccount(user) {
            return {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              idToken: data.id_token,
            };
          },
        };
      },
    }),
  ],
});
```

### 客户端配置 (lib/auth-client.ts)

```typescript
import { credentialsClient } from "@/lib/plugins/credentials/client";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [credentialsClient()],
});

// 使用
export async function signInWithCredentials(data) {
  const result = await authClient.signInCredentials(data);
  
  if (result.error) {
    console.error("Login failed:", result.error);
  } else {
    console.log("Login successful:", result.user);
  }
}
```

## API 参考

### CredentialsOptions

```typescript
interface CredentialsOptions<TSchema extends z.ZodSchema> {
  // 输入数据的 Zod schema
  inputSchema: TSchema;
  
  // 认证回调函数
  callback: (ctx, parsed) => Promise<CallbackResult>;
  
  // 是否自动注册新用户 (default: true)
  autoSignUp?: boolean;
  
  // 登录端点路径 (default: "/sign-in/credentials")
  path?: string;
  
  // Provider ID (default: "credentials")
  providerId?: string;
}
```

### CallbackResult

```typescript
interface CallbackResult {
  email?: string;
  name?: string;
  username?: string;
  roles?: string;
  
  // 可选的生命周期钩子
  onSignIn?: (userData, user, account) => UserData | Promise<UserData>;
  onSignUp?: (userData) => UserData | Promise<UserData>;
  onLinkAccount?: (user) => AccountData | Promise<AccountData>;
  
  // 其他自定义字段
  [key: string]: any;
}
```

## 错误代码

- `INVALID_CREDENTIALS`: 认证失败
- `EMAIL_REQUIRED`: 缺少必需的 email 字段
- `UNEXPECTED_ERROR`: 未预期的错误

## 与 OpenIddict 集成示例

参考 `lib/auth.ts` 查看完整的 OpenIddict 集成实现：

1. 调用 `/connect/token` 端点
2. 传递用户名、密码、验证码
3. 解码返回的 JWT token
4. 提取用户信息和角色
5. 存储 access_token, refresh_token, id_token

## 开发说明

### 添加新字段

1. 更新 `inputSchema` 添加新的输入字段
2. 在 `callback` 函数中处理新字段
3. 在 `CallbackResult` 中返回相应的用户数据

### 修改错误处理

在 `callback` 函数中抛出带有特定消息的 Error：

```typescript
if (someCondition) {
  throw new Error("custom_error_code");
}
```

### 调试

插件内部使用 `ctx.context.logger` 记录日志，可以在控制台查看详细的执行过程。

## 参考资料

- [Better-auth 官方文档](https://www.better-auth.com/)
- [原始 credentials plugin](https://github.com/erickweil/better-auth-credentials-plugin)
- [OpenIddict 文档](https://documentation.openiddict.com/)
