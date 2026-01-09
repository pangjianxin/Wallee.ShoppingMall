"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateRole } from "@/hooks/identity/roles/update-role";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FC, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { roleGetQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { LoadingButton } from "@/components/ui/loading-button";
import { VoloAbpIdentityIdentityRoleDto } from "@/openapi";
import { toast } from "sonner";

interface Props {
  role: VoloAbpIdentityIdentityRoleDto | undefined;
}
const Create: FC<Props> = ({ role }) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  const { form, submit } = useUpdateRole(role!);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      await submit(data);
      toast.success("操作成功", {
        description: "角色更新成功",
        richColors: true,
      });
      await queryClient.invalidateQueries({
        queryKey: roleGetQueryKey({ path: { id: role?.id as string } }),
      });
      handleClose();
    } catch (e: any) {
      toast.error("错误", {
        description: e.error.message,
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="update-role-form">
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>编辑角色</DialogTitle>
              <DialogDescription>
                角色代表能够访问系统功能的一个集合
              </DialogDescription>
            </DialogHeader>
            <div className="grid flex-1 gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色名称</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="角色名称" {...field} />
                    </FormControl>
                    <FormDescription>这里输入角色名称</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>是否公开</FormLabel>
                      <FormDescription>
                        公开角色为用户可以看到的角色
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>是否默认</FormLabel>
                      <FormDescription>
                        默认角色为用户默认携带角色
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => form.reset()}
                >
                  关闭
                </Button>
              </DialogClose>
              <LoadingButton
                loading={loading}
                type="submit"
                form="update-role-form"
                disabled={!form.formState.isValid}
              >
                提交
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default Create;
