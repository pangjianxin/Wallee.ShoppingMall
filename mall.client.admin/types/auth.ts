import type { User } from "@/types/auth-types";

export type AuthContextType = {
  user?: User;
  permissions: { [key: string]: boolean };
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isLoading: boolean;
  logout: () => void;
};
