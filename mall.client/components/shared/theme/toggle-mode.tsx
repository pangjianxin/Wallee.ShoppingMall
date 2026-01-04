"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  onThemeChange?: (theme: string) => void;
  renderAsIcon?: boolean;
  className?: string;
}

export function ThemeToggle({
  onThemeChange,
  renderAsIcon = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 在组件挂载后再渲染，避免水合错误
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 循环切换主题的函数
  const cycleTheme = () => {
    let newTheme: string;
    if (theme === "light") {
      newTheme = "dark";
      setTheme(newTheme);
    } else {
      newTheme = "light";
      setTheme(newTheme);
    }

    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  // 如果组件尚未挂载，返回一个占位图标
  if (!mounted) {
    return <div className={cn("w-4 h-4", className)} />;
  }

  // 如果只需要渲染图标
  if (renderAsIcon) {
    // 创建一个包装器，附加点击事件处理器
    return (
      <div onClick={cycleTheme} className={cn("cursor-pointer", className)}>
        {theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </div>
    );
  }

  // 完整组件渲染
  return (
    <div
      className={cn("relative cursor-pointer", className)}
      onClick={cycleTheme}
    >
      {/* Light mode icon */}
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          theme === "light"
            ? "scale-100 rotate-0"
            : "scale-0 rotate-90 absolute"
        )}
      />

      {/* Dark mode icon */}
      <Moon
        className={cn(
          "h-4 w-4 transition-all",
          theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute"
        )}
      />
    </div>
  );
}
