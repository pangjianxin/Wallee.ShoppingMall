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
import { useDeleteCarousel } from "@/hooks/carousels/delete";
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
import { WalleeMallCarouselsDtosCarouselDto } from "@/openapi";

type Props = {
  carousel?: WalleeMallCarouselsDtosCarouselDto;
};

const Delete: FC<Props> = ({ carousel }) => {
  const [open, setOpen] = useState(true);
  const controlRef = useRef(null);
  const { form, submit } = useDeleteCarousel({ id: carousel?.id });
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
                删除轮播图_{carousel?.title ?? ""}
              </DialogTitle>
              <DialogDescription>
                轮播图信息填写完整后，点击提交按钮即可删除轮播图。
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
