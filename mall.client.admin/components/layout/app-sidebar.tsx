"use client";
import type * as React from "react";
import { NavMain } from "@/components/layout/nav-main";
import NavUser from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={
          state === "expanded"
            ? `bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white`
            : ""
        }
      >
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="bg-transparent">
        <NavUser />
      </SidebarFooter>
      <SidebarRail className="bg-transparent" />
    </Sidebar>
  );
}
