"use client";
import { type FC, type HTMLAttributes } from "react";
import type React from "react";
import { ModeToggle } from "@/components/theme/toggle-mode";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

interface TopNavProps extends HTMLAttributes<HTMLElement> {
  sidebarTrigger?: React.ReactNode;
}

export const NavTop: FC<TopNavProps> = ({ sidebarTrigger }) => {
  const { data: sessionData, isPending } = useSession();
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full h-[64px] bg-linear-to-br from-slate-500 via-blue-900 to-slate-900 text-white"
    >
      <div className="flex items-center justify-between h-[64px] px-4 md:px-6">
        {/* 左侧：Logo 和 Sidebar Trigger */}
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <div className="relative aspect-square w-8 h-8">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              fill
              className="object-contain"
              sizes="100%"
            />
          </div>

          <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        </div>

        {/* 右侧：主题切换按钮和移动端菜单 */}

        <div className="flex items-center space-x-2">
          {status === "authenticated" && (
            <span className="hidden md:inline-block mr-4">
              欢迎，{session.user?.name}
            </span>
          )}
          {sidebarTrigger}
          <ModeToggle />
        </div>
      </div>
    </motion.nav>
  );
};
