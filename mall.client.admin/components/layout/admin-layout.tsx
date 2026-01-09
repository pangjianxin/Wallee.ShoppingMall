import type React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { NavTop } from "@/components/layout/nav-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { FC } from "react";
import { AuthProvider } from "@/contexts/auth-context";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-auto h-[calc(100vh-64px)]">
          <NavTop sidebarTrigger={<SidebarTrigger className="ml-2" />}></NavTop>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-2 border min-w-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default AdminLayout;
