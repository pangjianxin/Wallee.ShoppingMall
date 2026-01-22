import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import UserMenu from "@/components/shared/user-menu";

export const MobileHeader: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          生活集
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <UserMenu size="sm" />
        </div>
      </div>
    </header>
  );
};
