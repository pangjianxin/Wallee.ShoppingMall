import { LucideIcon } from "lucide-react";
// 权限相关的类型定义
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface UserPermissions {
  permissions: string[];
  roles: string[];
}

// 扩展菜单项类型，添加权限字段
export interface MenuItemWithPermissions {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  permissions?: string[]; // 访问此菜单需要的权限列表
  requireAllPermissions?: boolean; // 是否需要所有权限（默认true），false表示只需要其中一个
  items?: MenuItemWithPermissions[];
  type?: string;
  slug?: string;
}
