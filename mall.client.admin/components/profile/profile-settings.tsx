"use client";
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
import { VoloAbpAccountProfileDto } from "@/openapi";
import { useProfileSettings } from "@/hooks/profile/use-profile-settings";
import { LoadingButton } from "@/components/ui/loading-button";
import { FC } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useOrganizationUnit } from "@/hooks/identity/organization-units/use-organization-unit";

type ProfileProps = {
  profile: VoloAbpAccountProfileDto;
};

const ProfileSettings: FC<ProfileProps> = ({ profile }) => {
  const { form: profileForm, onSubmit: profileOnSubmit } =
    useProfileSettings(profile);
  const { data } = useSession();
  const { data: orgUnit } = useOrganizationUnit(
    data?.user?.organization_unit_id as string
  );
  const handleProfileSubmit = profileForm.handleSubmit(async (data) => {
    await profileOnSubmit(data);
    toast.success("账户已更新成功", {
      richColors: true,
    });
  });

  return (
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
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>姓名用于在系统中显示的名称</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>员工工号</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    员工工号用于在系统中唯一标识员工
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={profileForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>手机号码用于短信登录等功能</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  );
};

export default ProfileSettings;
