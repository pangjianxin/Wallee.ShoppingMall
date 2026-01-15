// Types for session
export interface User {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  roles?: string[];
}

export interface AuthSession {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
}

export interface ExtendedSessionData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
}

export interface ExtendedUserData {
  id: string;
  name: string;
  username?: string;
  email: string;
  roles?: string[];
}

export interface ExtendedAccountData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
}

// Types for custom credentials plugin
export interface UserData {
  email: string;
  name?: string;
  username?: string;
  roles?: string[];
  [key: string]: any;
}

export interface AccountData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number | Date;
  [key: string]: any;
}

export interface CallbackResult {
  email?: string;
  name?: string;
  username?: string;
  roles?: string[];
  session?: AccountData;
  onSignIn?: (
    userData: UserData,
    user: any,
    account: any
  ) => UserData | Promise<UserData>;
  onSignUp?: (userData: UserData) => UserData | Promise<UserData>;
  onLinkAccount?: (user: any) => AccountData | Promise<AccountData>;
  [key: string]: any;
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

  // 组织单位信息（JWT中可能包含，但当前系统不使用）
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

export type AuthContextType = {
  user?: User;
  permissions: { [key: string]: boolean };
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isLoading: boolean;
  logout: () => void;
};
