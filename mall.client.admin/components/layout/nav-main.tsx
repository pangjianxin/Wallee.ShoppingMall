"use client";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { navMain } from "@/config/menu";
import { useAuth } from "@/contexts/auth-context";

interface MenuItemWithPermissions {
  title: string;
  url?: string;
  icon?: any;
  isActive?: boolean;
  permissions?: string[];
  requireAllPermissions?: boolean;
  items?: MenuItemWithPermissions[];
  type?: string; // Added type field for CMS items
  slug?: string; // Added slug field for CMS items
}

function hasMenuPermission(
  item: MenuItemWithPermissions,
  hasPermissions: (permissions: string[], requireAll?: boolean) => boolean
): boolean {
  if (!item.permissions || item.permissions.length === 0) {
    return true; // 没有权限要求的菜单项默认可访问
  }

  return hasPermissions(item.permissions, item.requireAllPermissions !== false);
}

export function NavMain() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAllPermissions, hasAnyPermission, isLoading } = useAuth();

  const hasPermissions = (
    permissions: string[],
    requireAll = true
  ): boolean => {
    if (requireAll) {
      return hasAllPermissions(permissions);
    } else {
      return hasAnyPermission(permissions);
    }
  };

  const handleMenuClick = async (item: MenuItemWithPermissions) => {
    router.push(item.url as string);
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">加载菜单权限中...</div>
        </div>
      </SidebarGroup>
    );
  }

  const accessibleNavItems = navMain.filter((item) => {
    // 如果菜单有子菜单，则必须至少有一个子菜单可访问才显示父菜单
    if (item.items && item.items.length > 0) {
      const anySubAccessible = item.items.some((sub) =>
        hasMenuPermission(sub, hasPermissions)
      );
      return anySubAccessible;
    }

    // 如果没有子菜单，则根据父菜单自身的权限决定是否显示
    return hasMenuPermission(item, hasPermissions);
  });

  return (
    <SidebarGroup>
      <SidebarMenu>

        {accessibleNavItems.map((item) => {
          const accessibleSubItems =
            item.items?.filter((subItem) =>
              hasMenuPermission(subItem, hasPermissions)
            ) || [];

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      pathname && item.url && pathname === item.url
                        ? "bg-primary/10 text-primary"
                        : ""
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={
                          pathname && item.url && pathname === item.url
                            ? "text-primary"
                            : ""
                        }
                      />
                    )}
                    <span
                      className={`text-sn font-semibold ${
                        pathname && item.url && pathname === item.url
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                      {accessibleSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className={
                              pathname && pathname === subItem.url
                                ? "bg-primary/10 text-primary"
                                : ""
                            }
                            onClick={() => handleMenuClick(subItem)}
                          >
                            <span
                              className={`text-sm cursor-pointer ${
                                pathname && pathname === subItem.url
                                  ? "text-primary"
                                  : ""
                              }`}
                            >
                              {subItem.title}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
