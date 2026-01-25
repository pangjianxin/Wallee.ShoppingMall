"use client";
import { VoloAbpAccountProfileDto } from "@/openapi";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateAccountProfile } from "@/hooks/account/update-account-profile";
import { useUpdateAccountPassword } from "@/hooks/account/update-account-password";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";

type Props = {
  profile: VoloAbpAccountProfileDto | undefined;
};

const AccountComponent: FC<Props> = ({ profile }) => {
  const { form: profileForm, onSubmit: profileOnSubmit } =
    useUpdateAccountProfile(profile!);

  const { form: changePasswordForm, onSubmit: changePasswordOnSubmit } =
    useUpdateAccountPassword();

  const handleProfileSubmit = profileForm.handleSubmit(async (data) => {
    await profileOnSubmit(data);
    toast.success("账户已更新成功", {
      description: "提示",
      richColors: true,
    });
  });

  const handleChangePasswordSubmit = changePasswordForm.handleSubmit(
    async (data) => {
      await changePasswordOnSubmit(data);
      toast.success("密码已更新成功", {
        description: "提示",
        richColors: true,
      });
    }
  );

  return (
    <>
      <Tabs defaultValue="account" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">账户信息</TabsTrigger>
          <TabsTrigger value="password">密码信息</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Form {...profileForm}>
            <form onSubmit={handleProfileSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>账户信息</CardTitle>
                  <CardDescription>
                    如需修改您的账户信息,请在此处进行更改。
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  <div className="flex-1 gap-2">
                    <FormField
                      control={profileForm.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>登录用户名</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            登录用户名用于登录时的输入的用户名
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 gap-2">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>邮箱</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            您的邮箱号码用于接收系统通知等信息
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 gap-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>用户名</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            用户名用于在系统中显示的名称
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 gap-2">
                    <FormField
                      control={profileForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>手机号</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            手机号码用于短信登录等功能
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1 gap-2">
                    <FormField
                      control={profileForm.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>用户昵称</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            用户昵称用于在系统中显示的昵称
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
                    loading={profileForm.formState.isSubmitting}
                    disabled={!profileForm.formState.isValid}
                  >
                    提交
                  </LoadingButton>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="password">
          <Form {...changePasswordForm}>
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
                      control={changePasswordForm.control}
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
                      control={changePasswordForm.control}
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
                      control={changePasswordForm.control}
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
                    loading={changePasswordForm.formState.isSubmitting}
                    disabled={!changePasswordForm.formState.isValid}
                  >
                    修改密码
                  </LoadingButton>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AccountComponent;
