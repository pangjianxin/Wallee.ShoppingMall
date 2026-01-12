"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { executeOperation } from "@/lib/execute-operation";
import { useRouter } from "next/navigation";
import { useUpdateTag } from "@/hooks/tags/update";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { TagIcon } from "lucide-react";

type Props = {
  entity: WalleeMallProductsDtosProductDto;
};

const Update: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState(true);
  const { form, submit } = useUpdateTag({ entity });
  const router = useRouter();
  const handleSubmit = form.handleSubmit(async (data) => {
    await executeOperation(
      async () => {
        await submit(data);
      },
      {
        successMessage: "操作成功",
        onSuccess: async () => {
          setOpen(false);
          form.reset();
          router.back();
        },
      }
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (e === false) {
          router.back();
        }
      }}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} id="update-tag-form">
          <DialogContent
            className="sm:max-w-lg sm:max-h-[80vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-normal">
                更新商品
              </DialogTitle>
              <DialogDescription>
                商品信息填写完整后，点击提交按钮即可更新商品。
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签名称</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="text"
                          placeholder="请输入标签名称"
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <InputGroupText>
                            <TagIcon />
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>取消</Button>
              </DialogClose>
              <Button
                type="submit"
                form="update-tag-form"
                variant={"default"}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "提交中..." : "提交"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default Update;
