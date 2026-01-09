interface DecodedJWT {
  // 标准 JWT 声明
  iss?: string; // Issuer
  exp: number; // Expiration time
  iat?: number; // Issued at
  aud?: string; // Audience
  jti?: string; // JWT ID
  scope?: string; // 授权范围

  // 用户身份信息
  sub: string; // Subject (User ID)
  preferred_username: string; // 首选用户名
  unique_name: string; // 唯一用户名
  given_name: string; // 名字
  family_name?: string; // 姓氏
  email?: string; // 邮箱
  phone_number?: string; // 电话号码
  // 权限和角色
  role: string | string[]; // 角色，可以是单个字符串或数组

  // 组织单位信息
  organization_unit_code?: string; // 组织单位代码
  organization_unit_id?: string; // 组织单位 ID

  supplier_id?: string; // 供应商 ID

  // OpenID Connect 扩展字段
  phone_number_verified?: string | boolean; // 电话号码是否已验证
  email_verified?: string | boolean; // 邮箱是否已验证
  oi_prst?: string; // OpenID Connect 呈现
  oi_au_id?: string; // OpenID Connect 授权 ID
  client_id?: string; // 客户端 ID
  oi_tkn_id?: string; // OpenID Connect Token ID

  // 允许其他自定义字段
  [key: string]: any;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    user?: User;
  }

  interface User {
    id: string;
    roles?: string | string[];
    username: string;
    name?: string;
    surname?: string | null;
    organization_unit_code?: string;
    organization_unit_id?: string;
    supplier_id?: string;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    roles?: string | string[];
    organization_unit_code?: string;
    organization_unit_id?: string;
    supplier_id?: string;
    [key: string]: any;
  }
}

export type { DecodedJWT };
