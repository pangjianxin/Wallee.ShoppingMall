import type { Metadata } from "next";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "忘记密码 - 联系管理员",
  description: "忘记密码？请联系管理员重置您的密码",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">忘记密码？</CardTitle>
            <CardDescription className="text-base">
              请联系管理员重置您的密码
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                出于安全考虑，密码重置需要管理员协助完成。请通过以下方式联系管理员：
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-md bg-background border">
                  <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      管理员邮箱
                    </p>
                    <a
                      href="mailto:343516704@qq.com"
                      className="text-sm font-medium text-primary hover:underline break-all"
                    >
                      343516704@qq.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                请在邮件中提供您的用户名或注册邮箱，管理员会尽快为您处理密码重置请求。
              </p>

              <Link href="/account/login" className="block">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回登录
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          记得密码？{" "}
          <Link
            href="/account/login"
            className="text-primary hover:underline font-medium"
          >
            立即登录
          </Link>
        </p>
      </div>
    </main>
  );
}
