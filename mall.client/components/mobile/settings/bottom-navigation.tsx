"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/shared/auth/permission-guard";
import { RouteGuard } from "@/components/shared/auth/route-guard";

const NavigationParts = [
  {
    path: "/settings/email-settings",
    text: "邮箱设置",
    permissions: ["SettingManagement.Emailing"],
  },
];

interface CategoryToggleProps {
  className?: string;
}

export default function ManagementBottomNavigation({
  className,
}: CategoryToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handlePathChange = (path: string) => {
    if (pathname.startsWith(path)) {
      return;
    }
    router.push(path);
  };

  return (
    <RouteGuard
      permissions={NavigationParts.flatMap((item) => item.permissions)}
      requireAll={false}
    >
      <div className={cn("sticky w-full max-w-xs mx-auto", className)}>
        <div className="flex items-center justify-center p-1 bg-gray-100 rounded-full">
          {NavigationParts.map((item) => (
            <PermissionGuard
              key={item.path}
              permissions={item.permissions}
              fallback={
                <button
                  key={item.path}
                  disabled
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out",
                    "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60 line-through",
                    "hover:text-gray-400 hover:bg-gray-50 relative"
                  )}
                  title="暂无权限"
                >
                  {item.text}
                </button>
              }
            >
              <button
                key={item.path}
                onClick={() => handlePathChange(item.path)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out",
                  pathname.startsWith(item.path)
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {item.text}
              </button>
            </PermissionGuard>
          ))}
        </div>
      </div>
    </RouteGuard>
  );
}
