"use client";

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { useAppConfig } from "@/hooks/use-app-config";
import type { AuthContextType } from "@/types/auth";
import type { User } from "@/types/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import { abpApplicationConfigurationGetQueryKey } from "@/openapi/@tanstack/react-query.gen";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: sessionData, isPending: isSessionPending } = useSession();
  const queryClient = useQueryClient();

  const { data: config, isLoading: isConfigLoading } = useAppConfig();

  // Determine authentication status
  const isAuthenticated = !!sessionData?.user;
  const status = isSessionPending
    ? "loading"
    : isAuthenticated
    ? "authenticated"
    : "unauthenticated";

  // 当用户完成登录时，使 appConfig 的缓存失效以刷新配置数据
  useEffect(() => {
    if (status === "authenticated") {
      queryClient.invalidateQueries({
        queryKey: [abpApplicationConfigurationGetQueryKey()],
      });
    }
  }, [status, queryClient]);

  // Derive permissions from config and status instead of using setState in effect
  const permissions = useMemo<{ [key: string]: boolean }>(() => {
    if (status === "unauthenticated") {
      return {};
    }

    if (config && status === "authenticated" && config.auth?.grantedPolicies) {
      return config.auth.grantedPolicies;
    }

    return {};
  }, [config, status]);

  const hasPermission = (permission: string): boolean => {
    return permissions[permission] === true;
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every((permission) => hasPermission(permission));
  };

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/account/login";
        },
      },
    });
  };

  const value: AuthContextType = {
    user: sessionData?.user as User | undefined,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: isConfigLoading || status === "loading",
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
