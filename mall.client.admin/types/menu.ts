import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  permissions?: string[]; // Added permissions field for menu items
  requireAll?: boolean; // Added option to require all permissions
  items?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  url: string;
  type?: string;
  slug?: string;
  permissions?: string[]; // Added permissions field for sub menu items
  requireAll?: boolean; // Added option to require all permissions
}
