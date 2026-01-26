"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserIcon, KeyIcon } from "lucide-react";
import { schema, type FormValues } from "@/hooks/account/login-form-validator";
import { VerificationCodeImage } from "../captcha/captcha-code";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithCredentials } from "@/lib/auth-client";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_username_or_password: "用户名或密码不存在或输入错误",
  invalid_captcha: "图形验证码错误，请刷新后重新输入",
  invalid_grant: "登录失败，请检查用户名、密码或图形验证码",
};
type Props = {
  cb?: string;
};

const Login: FC<Props> = ({ cb }: Props) => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const redirectUrl = cb || searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState<string | null>(
    errorCode
      ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.invalid_grant
      : null,
  );
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      captchaid: "",
      captchacode: "",
      remember: false,
    },
  });

  // Handle credentials login
  const onSubmit = async (data: FormValues) => {
    setError(null);

    try {
      const result = await signInWithCredentials({
        username: data.username,
        password: data.password,
        captchaid: data.captchaid,
        captchacode: data.captchacode,
      });

      if (result.error) {
        setError(ERROR_MESSAGES[result.error] || ERROR_MESSAGES.invalid_grant);
      } else if (result.success) {
        // 登录成功，重定向到回调地址或首页
        router.push(redirectUrl);
      }
    } catch {
      setError("登录过程中发生错误，请稍后再试");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left side - Brand section */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 p-8 flex-col justify-center items-center text-white">
        <div className="max-w-md space-y-6 text-center">
          <div className="mb-8">
            <div className="relative size-22 mx-auto mb-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="100%"
                loading="eager"
                className="object-contain bg-primary"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-xl text-blue-100">
              {process.env.NEXT_PUBLIC_APP_ENG_NAME}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full min-h-screen lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile brand section */}
          <div className="lg:hidden text-center mb-6">
            <div className="relative size-22 mx-auto mb-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="100%"
                loading="eager"
                className="object-contain bg-primary"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {process.env.NEXT_PUBLIC_APP_ENG_NAME}
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="bg-red-500/20 border-red-500/50 text-white"
            >
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        登录用户名
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          <UserIcon size={18} />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="pl-10 h-11 sm:h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="请输入用户名"
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                      </div>
                      <div className="min-h-20px">
                        <FormMessage className="text-xs sm:text-sm text-red-500 dark:text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        用户密码
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          <KeyIcon size={18} />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="pl-10 h-11 sm:h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="请输入密码"
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                      </div>
                      <div className="min-h-20px">
                        <FormMessage className="text-xs sm:text-sm text-red-500 dark:text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label>验证码</Label>
                  <div className="flex items-start gap-4 border-white/20 rounded-md">
                    <FormField
                      control={form.control}
                      name="captchacode"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="请输入验证码"
                              {...field}
                              className="bg-white/20 focus:ring-black/20 h-[60px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="captchaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VerificationCodeImage
                              onChange={(v) => field.onChange(v)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 xs:gap-0 pt-2">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.formState.isSubmitting}
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                        >
                          记住我
                        </label>
                      </div>
                    )}
                  />

                  <Link
                    href="/account/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline text-center sm:text-right"
                  >
                    忘记密码?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "登录中..." : "登录"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
