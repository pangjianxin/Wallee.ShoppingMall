import {
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings2,
  UserCog,
} from "lucide-react";
import type { MenuItemWithPermissions } from "@/types/permissions";

export const teams = [
  {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    logo: GalleryVerticalEnd,
    plan: process.env.NEXT_PUBLIC_ENG_APP_NAME,
  },
];

export const navMain: MenuItemWithPermissions[] = [
  {
    title: "仪表盘",
    url: "#",
    icon: LayoutDashboard,
    isActive: false,
    permissions: [], // 需要仪表盘查看权限
    items: [
      {
        title: "网站首页",
        url: "/",
        permissions: [],
      },
    ],
  },
  {
    title: "身份认证管理",
    url: "#",
    icon: UserCog,
    isActive: true,
    permissions: [],
    requireAllPermissions: false, // 只需要其中一个权限即可
    items: [
      {
        title: "用户信息",
        url: "/identity/users",
        permissions: ["AbpIdentity.Users"],
      },
      {
        title: "机构信息",
        url: "/identity/organization-units",
        permissions: ["AbpIdentity.OrganizationUnit"],
      },
      {
        title: "角色信息",
        url: "/identity/roles",
        permissions: ["AbpIdentity.Roles"],
      },
    ],
  },
  {
    title: "系统管理",
    url: "#",
    icon: Settings2,
    isActive: false,
    permissions: [],
    requireAllPermissions: false, // 只需要其中一个权限即可
    items: [
      {
        title: "邮箱设置",
        url: "/settings/email-settings",
        permissions: ["SettingManagement.Emailing"],
      },
      {
        title: "审计日志",
        url: "/audit-logs",
        permissions: ["OrgMap.AuditLog"],
      },
      {
        title: "后台任务",
        url: "/background-jobs",
        permissions: ["OrgMap.BackgroundJob"],
      },
    ],
  },
];

export const projects = [
  {
    name: "登录/注销",
    url: "/login",
    icon: Frame,
  },
];
