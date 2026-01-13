"use client";
import { useState, FC } from "react";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInWithCredentials } from "@/lib/auth-client";
import { VerificationCodeImage } from "@/components/captcha/captcha-code";
import { Label } from "@/components/ui/label";
import { schema, type FormValues } from "@/hooks/account/login-form-validator";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_username_or_password: "用户名或密码不存在或输入错误",
  invalid_captcha: "图形验证码错误，请刷新后重新输入",
  invalid_grant: "登录失败，请检查用户名、密码或图形验证码",
};
type Props = {
  returnUrl?: string;
};

const Login: FC<Props> = ({ returnUrl }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    errorCode ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.invalid_grant : null
  );

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      captchaid: "",
      captchacode: "",
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
        // Redirect is handled by signInWithCredentials
      }
    } catch {
      setError("登录过程中发生错误，请稍后再试");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="fixed inset-0 z-0">
        <NextImage
          src={`/images/bg.jpg`}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-white/10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-[220px] h-80px">
            <NextImage
              src="/images/logo.png"
              alt="Kanegi Logo"
              width={220}
              height={80}
              className="object-contain dark:invert"
            />
          </div>
          <h1 className="text-2xl font-medium text-white">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p className="text-white/80 text-sm">用户登录</p>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/20 border-red-500/50 text-white"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-white">
                      登录用户名
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20"
                        placeholder="请输入用户名"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-white">
                      用户密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20"
                        placeholder="请输入密码"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label>验证码</Label>
              <div className="flex items-start gap-4 bg-white/20 border-white/20 rounded-md p-4">
                <FormField
                  control={form.control}
                  name="captchacode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="请输入验证码"
                          {...field}
                          className="bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 h-[60px]"
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
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  处理中...
                </span>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  登录
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
