"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface RouteGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  redirectTo?: string;
  showForbidden?: boolean;
}

export function RouteGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  redirectTo = "/dashboard",
  showForbidden = true,
}: RouteGuardProps) {
  const router = useRouter();
  const {
    user,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    if (showForbidden) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Empty>
            <EmptyMedia>
              <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>访问被拒绝</EmptyTitle>
              <EmptyDescription>您没有访问此页面的权限</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>咨询管理员以获取帮助和更多信息</EmptyContent>
          </Empty>
        </div>
      );
    } else {
      router.push(redirectTo);
      return null;
    }
  }

  return <>{children}</>;
}
