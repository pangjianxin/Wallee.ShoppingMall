// Types for session
export interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  roles?: string | string[];
  organization_unit_code?: string;
  organization_unit_id?: string;
  supplier_id?: string;
}

export interface Session {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}

// DecodedJWT type for OpenIddict JWT tokens
export interface DecodedJWT {
  // 标准 JWT 声明
  iss?: string;
  exp: number;
  iat?: number;
  aud?: string;
  jti?: string;
  scope?: string;

  // 用户身份信息
  sub: string;
  preferred_username: string;
  unique_name: string;
  given_name: string;
  family_name?: string;
  email?: string;
  phone_number?: string;

  // 权限和角色
  role: string | string[];

  // 组织单位信息
  organization_unit_code?: string;
  organization_unit_id?: string;
  supplier_id?: string;

  // OpenID Connect 扩展字段
  phone_number_verified?: string | boolean;
  email_verified?: string | boolean;
  oi_prst?: string;
  oi_au_id?: string;
  client_id?: string;
  oi_tkn_id?: string;

  [key: string]: any;
}
