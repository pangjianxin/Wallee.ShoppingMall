import type React from "react";
import Footer from "@/components/mobile/layout/footer";
import { MobileHeader } from "@/components/mobile/layout/header";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "生活集 - 品质生活好物",
  description: "精选生活好物，让日常更有温度",
  generator: "wallee",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavBar?: boolean;
  className?: string;
  contentClassName?: string;
}

export default function MobileLayout({
  children,
  showHeader = true,
  showNavBar = true,
  className,
  contentClassName,
}: MobileLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-svh bg-background",
        "relative overflow-hidden",
        className
      )}
    >
      {showHeader && (
        <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="safe-top">
            <MobileHeader />
          </div>
        </div>
      )}

      <main
        className={cn(
          "flex-1 w-full overflow-y-auto overflow-x-hidden overscroll-contain p-2",
          // 若需要底部留白并且显示导航且未显式声明 no-footer-pad，则加 padding-bottom
          showNavBar &&
            !contentClassName?.includes("no-footer-pad") &&
            "pb-(--footer-height)",
          contentClassName
        )}
      >
        {children}
      </main>

      {showNavBar && <FooterWrapper />}
    </div>
  );
}

function FooterWrapper() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t border-border h-(--footer-height)">
      <div className="safe-bottom h-full">
        <Footer />
      </div>
    </div>
  );
}
