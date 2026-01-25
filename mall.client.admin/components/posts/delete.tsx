"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FC, useRef, useState } from "react";
import { useDeletePost } from "@/hooks/posts/delete";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { executeOperation } from "@/lib/execute-operation";
import { useRouter } from "next/navigation";

import { VisuallyHiddenInput } from "@/components/visually-hidden-input";
import { WalleeMallCmsDtosPostDto } from "@/openapi";

type Props = {
  post?: WalleeMallCmsDtosPostDto;
};

const Delete: FC<Props> = ({ post }) => {
  const [open, setOpen] = useState(true);
  const controlRef = useRef(null);
  const { form, submit } = useDeletePost({ id: post?.id });
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
          router.refresh();
        },
      },
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (!e) {
          router.back();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          添加轮播图
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="create-carousel-form">
          <DialogContent
            className="sm:max-w-lg sm:max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-normal">
                删除内容_{post?.title ?? ""}
              </DialogTitle>
              <DialogDescription>
                帖子信息填写完整后，点击提交按钮即可删除内容。
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <VisuallyHiddenInput
                      {...field}
                      control={controlRef.current}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>取消</Button>
              </DialogClose>
              <Button
                type="submit"
                form="create-carousel-form"
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

export default Delete;
