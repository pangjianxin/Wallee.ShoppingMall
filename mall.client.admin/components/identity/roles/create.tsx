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
import { useCreateRole } from "@/hooks/identity/roles/create-role";
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
import { toast } from "sonner";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { roleGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { useQueryClient } from "@tanstack/react-query";

const Create: FC = () => {
  const [open, setOpen] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { form, submit } = useCreateRole();

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await submit(data);
      toast.success("操作成功", { richColors: true });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: [roleGetListQueryKey()],
      });
    } catch (e: any) {
      toast.error(parseVoloAbpError(e), { richColors: true });
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="crete-role-form">
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>创建角色</DialogTitle>
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
              <Button type="submit" form="crete-role-form">
                提交
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default Create;
