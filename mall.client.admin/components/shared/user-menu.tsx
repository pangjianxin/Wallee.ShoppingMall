"use client";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size: "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
};
const UserMenu: FC<Props> = ({ className, size = "sm" }) => {
  const { data: sessionData, isPending } = useSession();
  const router = useRouter();
  const handleSignin = () => {
    router.push(`/account/login`);
  };
  //redirectTo: "/"
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/account/login";
        },
      },
    });
  };

  const isAuthenticated = !!sessionData?.user;

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={size} className={cn(className)}>
            <span className="inline">
              {sessionData?.user?.name?.substring(0, 10)}
            </span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel> {sessionData?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/identity/profile`);
              }}
            >
              账户设置
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              退出登录
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleSignin}
      variant={"default"}
      className={cn("", className)}
      size={size}
    >
      <span className="hidden sm:inline">账户登录</span>
      <span className="sm:hidden">登录</span>
    </Button>
  );
};

export default UserMenu;
