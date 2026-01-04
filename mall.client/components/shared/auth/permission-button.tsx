"use client";
import type { ReactNode } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface PermissionButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  hideWhenNoPermission?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "sm" | "icon" | "lg" | "default";
  asChild?: boolean;
}

export function PermissionButton({
  children,
  permission,
  permissions = [],
  requireAll = false,
  hideWhenNoPermission = false,
  disabled,
  ...props
}: PermissionButtonProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

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

  if (!hasAccess && hideWhenNoPermission) {
    return null;
  }

  return (
    <Button
      {...props}
      disabled={disabled || !hasAccess}
      size={props.size ?? "default"}
      variant={props.variant ?? "default"}
    >
      {children}
    </Button>
  );
}
