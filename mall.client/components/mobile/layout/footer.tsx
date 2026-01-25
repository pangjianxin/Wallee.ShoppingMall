"use client";
import {
  Home,
  Plus,
  User,
  ShoppingCart,
  ShoppingBag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { PermissionGuard } from "@/components/shared/auth/permission-guard";

const NoAccessFallback = ({ tIcon }: { tIcon?: React.ElementType }) => {
  const Icon = tIcon ?? User;
  return (
    <div className="flex flex-col items-center justify-start pt-3 relative h-full group overflow-hidden transition-colors text-gray-400 cursor-not-allowed">
      <motion.div
        whileTap={{
          scale: 0.85,
          transition: { duration: 0.15 },
        }}
        className="relative"
      >
        <Icon
          className={cn(
            "h-6 w-6 transition-colors",
            "text-destructive group-hover:text-primary",
          )}
          strokeWidth={2}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0, opacity: 0 }}
          whileTap={{
            scale: 2.5,
            opacity: 0.2,
            transition: { duration: 0.3 },
          }}
          className="absolute inset-0 rounded-full bg-primary -z-10"
        />
      </motion.div>
      <span
        className={cn(
          "text-xs absolute bottom-1 transition-all",
          "font-normal text-gray-600",
        )}
      >
        禁用
      </span>
    </div>
  );
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = [
    {
      name: "购物",
      href: "/products",
      icon: ShoppingBag,
      permissions: [],
    },
    {
      name: "智购",
      href: "/products/ai",
      icon: Star,
      permissions: [],
    },
    {
      name: "机构地图",
      href: "/",
      icon: Home,
      isMiddle: true,
      permissions: [],
    },

    {
      name: "购物车",
      href: "/carts",
      icon: ShoppingCart,
      permissions: [],
    },
    {
      name: "我的",
      href: "/account/profile",
      icon: User,
      permissions: [],
    },
  ];

  return (
    <div
      className="relative h-full bg-white border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] overflow-visible isolate contain-size contain-layout"
      data-fixed-footer
    >
      <div className="grid h-full grid-cols-5 mx-auto pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isMiddle) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center group"
                aria-label={item.name}
              >
                <div className="absolute -top-3 flex items-center justify-center size-20 pointer-events-none select-none">
                  <motion.div
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.15 },
                    }}
                    whileHover={{
                      scale: 1.05,
                    }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                    className="relative size-16 bg-white rounded-full 
                              shadow-[0_8px_30px_rgba(16,185,129,0.35),0_4px_15px_rgba(0,0,0,0.1)] 
                              flex items-center justify-center
                              border-2 border-emerald-500/20
                              overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                      <Plus
                        className="h-12 w-12 text-emerald-600"
                        strokeWidth={3}
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-teal-50"></div>

                    {/* Main icon container - now circular */}
                    <div
                      className="relative z-10 w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 
                                  flex items-center justify-center shadow-lg shadow-primary/40"
                    >
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        // animate={{
                        //   rotate: [0, 360],
                        // }}
                        transition={{
                          rotate: {
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                        }}
                        className="relative"
                      >
                        <item.icon
                          className="h-6 w-6 text-white drop-shadow-sm"
                          strokeWidth={2.5}
                        />
                      </motion.div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/40 via-transparent to-transparent"></div>
                    </div>

                    {/* Pulse effect on active - now circular */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-secondary"
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Additional glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-400/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />
                  </motion.div>
                </div>
              </Link>
            );
          }

          return (
            <PermissionGuard
              key={item.name}
              permissions={item.permissions}
              requireAll={false}
              fallback={<NoAccessFallback tIcon={item.icon} />}
            >
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-start pt-3 relative h-full group overflow-hidden transition-colors select-none",
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary",
                )}
              >
                <motion.div
                  whileTap={{
                    scale: 0.85,
                    transition: { duration: 0.15 },
                  }}
                  className="relative"
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-primary",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 0, opacity: 0 }}
                    whileTap={{
                      scale: 2.5,
                      opacity: 0.2,
                      transition: { duration: 0.3 },
                    }}
                    className="absolute inset-0 rounded-full bg-primary -z-10"
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-xs absolute bottom-1 transition-all",
                    isActive
                      ? "font-semibold text-primary"
                      : "font-normal text-gray-600",
                  )}
                >
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 w-1/2 h-0.5 bg-linear-to-r from-primary to-primary/30 rounded-t-full shadow-sm shadow-primary/50"
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                  />
                )}
              </Link>
            </PermissionGuard>
          );
        })}
      </div>
    </div>
  );
}
