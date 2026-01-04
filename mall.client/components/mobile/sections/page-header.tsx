"use client";

import type React from "react";

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  rightChildren?: React.ReactNode;
  children?: React.ReactNode;
}

export function MobilePageHeader({
  title,
  subtitle,
  rightChildren,
  children,
}: MobilePageHeaderProps) {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold leading-tight text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightChildren}
      </div>

      {children && <div className="pb-3 pt-1">{children}</div>}
    </header>
  );
}
