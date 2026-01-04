"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme/toggle-mode";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

type ActionItemBase = {
  icon: React.ReactNode | (() => React.ReactNode);
  label?: string; // 可选的标签，用于辅助功能
  onClick?: () => void; // 可选的点击处理器
};

type ButtonActionItem = ActionItemBase & {
  href?: never;
};

type LinkActionItem = ActionItemBase & {
  href: string;
  onClick?: never;
};

type ActionItem = ButtonActionItem | LinkActionItem;

interface FloatingActionButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  items?: ActionItem[];
}

export function FloatingActionButton({
  position = "bottom-right",
  items,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // 当路由变化时，关闭菜单
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // 默认菜单项（如果没有传入 items）
  const defaultActionItems: ActionItem[] = [
    {
      icon: () => <ThemeToggle renderAsIcon={true} />,
      label: "切换主题",
    },
  ];

  // 使用传入的 items 或使用默认项
  const actionItems = items || defaultActionItems;

  // 处理按钮点击 - 显示 toast 提示（如果有 label）
  const handleActionClick = (item: ActionItem) => {
    if (item.label && !("href" in item)) {
      toast.success(item.label, {
        duration: 2000,
      });
    }
    if ("onClick" in item && item.onClick) {
      item.onClick();
    }
  };

  // 处理链接导航
  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Map position to Tailwind classes
  const positionClasses = {
    "bottom-right": "bottom-18 right-4",
    "bottom-left": "bottom-18 left-4",
    "top-right": "top-16 right-4",
    "top-left": "top-16 left-4",
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position])}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 right-0 flex flex-col-reverse gap-2 items-center"
          >
            {actionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: index * 0.05 },
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: { delay: index * 0.05 },
                }}
              >
                {item.href ? (
                  <Button
                    onClick={() => handleLinkClick(item.href)}
                    title={item.label}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg",
                      "hover:bg-primary/90 transition-colors"
                    )}
                  >
                    {typeof item.icon === "function" ? item.icon() : item.icon}
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    title={item.label}
                    onClick={() => handleActionClick(item)}
                    className="size-9 rounded-full shadow-lg"
                  >
                    {typeof item.icon === "function" ? item.icon() : item.icon}
                  </Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={toggleOpen}
        className={cn(
          "size-9 rounded-full shadow-lg transition-transform",
          isOpen
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.div>
      </Button>
    </div>
  );
}
