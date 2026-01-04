"use client";

import { useUpdateEmailSettings } from "@/hooks/settings/update-email-settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Server, User, Shield } from "lucide-react";
import { VoloAbpSettingManagementEmailSettingsDto } from "@/openapi";
import { MobilePageHeader } from "../sections/page-header";
import { executeOperation } from "@/lib/execute-operation";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

export default function EmailSettings({
  settings,
}: {
  settings: VoloAbpSettingManagementEmailSettingsDto;
}) {
  const { form, onSubmit } = useUpdateEmailSettings({
    settings: settings!,
  });

  const handleSubmit = form.handleSubmit(async (data: any) => {
    await executeOperation(
      async () => {
        await onSubmit(data);
      },
      { successMessage: "邮箱设置已更新" }
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <MobilePageHeader title="邮箱设置" subtitle="系统邮件发送邮箱设置" />
        {/* SMTP 服务器配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              SMTP 服务器配置
            </CardTitle>
            <CardDescription>配置您的 SMTP 服务器连接信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP主机</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="SMTP主机" {...field} />
                    </FormControl>
                    <FormDescription>
                      SMTP主机设置,例如smtp.example.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP端口</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="SMTP端口"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>SMTP端口设置,例如465或587</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP域名</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="SMTP域名" {...field} />
                    </FormControl>
                    <FormDescription>
                      SMTP域名设置,例如example.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="smtpEnableSsl"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium text-slate-700">
                        启用SSL
                      </FormLabel>
                      <FormDescription className="text-xs text-slate-500">
                        使用 SSL/TLS 加密连接
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpUseDefaultCredentials"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium text-slate-700">
                        使用默认凭据
                      </FormLabel>
                      <FormDescription className="text-xs text-slate-500">
                        使用系统默认的身份验证凭据
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 身份验证 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              身份验证
            </CardTitle>
            <CardDescription>配置 SMTP 服务器的登录凭据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="smtpUserName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="用户名" {...field} />
                  </FormControl>
                  <FormDescription>
                    用户名设置,例如user@example.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smtpPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="密码" {...field} />
                  </FormControl>
                  <FormDescription>密码设置,例如yourpassword</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 发件人信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              发件人信息
            </CardTitle>
            <CardDescription>设置邮件的默认发件人信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="defaultFromAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>发件人邮箱地址</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="noreply@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    发件人邮箱地址设置,例如noreply@example.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultFromDisplayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>发件人显示名称</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="noreply@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    发件人显示名称设置,例如您的公司名称
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            重置
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
