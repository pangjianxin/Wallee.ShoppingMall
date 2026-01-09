"use client";
import { FC } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { useProfilePassword } from "@/hooks/profile/use-profile-password";
import { toast } from "sonner";

const ChangePassword: FC = () => {
  const { form, onSubmit } = useProfilePassword();
  const handleChangePasswordSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    toast.success("密码已更新成功", {
      richColors: true,
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={handleChangePasswordSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>密码信息</CardTitle>
            <CardDescription>
              在这里修改密码,请注意密码的安全性。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <div className="flex-1 gap-2">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前密码</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      请输入当前账户的密码用于后台校验
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 gap-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      请输入新的密码用于修改账户密码
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 gap-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码确认</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      请再次输入新密码用于确认密码
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              修改密码
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ChangePassword;
