import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailSettingsUpdate,
  VoloAbpSettingManagementEmailSettingsDto,
} from "@/openapi";
export const useUpdateEmailSettings = ({
  settings,
}: {
  settings: VoloAbpSettingManagementEmailSettingsDto;
}) => {
  const schema = z.object({
    smtpHost: z.string().min(1, "SMTP主机必须"),
    smtpPort: z
      .number()
      .min(1, "SMTP端口必须")
      .max(65535, "SMTP端口必须在1到65535之间"),
    smtpUserName: z.string().min(1, "SMTP用户名必须"),
    smtpPassword: z.string().min(1, "SMTP密码必须"),
    smtpDomain: z.string().optional(),
    smtpEnableSsl: z.boolean().optional(),
    smtpUseDefaultCredentials: z.boolean().optional(),
    defaultFromAddress: z.string().min(1, "发件人地址是必需的"),
    defaultFromDisplayName: z.string().min(1, "发件人显示名称是必需的"),
  });

  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    defaultValues: {
      smtpHost: settings.smtpHost || "",
      smtpPort: settings.smtpPort || 465,
      smtpUserName: settings.smtpUserName || "",
      smtpPassword: settings.smtpPassword || "",
      smtpDomain: settings.smtpDomain || undefined,
      smtpEnableSsl: settings.smtpEnableSsl || false,
      smtpUseDefaultCredentials: settings.smtpUseDefaultCredentials || false,
      defaultFromAddress: settings.defaultFromAddress || "",
      defaultFromDisplayName: settings.defaultFromDisplayName || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValue) => {
    await emailSettingsUpdate({
      body: data,
    });
  };

  return {
    form,
    onSubmit,
  };
};
