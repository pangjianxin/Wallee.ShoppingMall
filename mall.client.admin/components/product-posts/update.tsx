"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  WalleeMallCmsProductPostCategory,
  WalleeMallCmsDtosProductPostDto,
} from "@/openapi";
import { FC, useState } from "react";
import {
  Form,
  FormLabel,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useUpdateProductPost } from "@/hooks/product-posts/update";
import { executeOperation } from "@/lib/execute-operation";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/shared/editor/dynamic-editor";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  post: WalleeMallCmsDtosProductPostDto;
};
export const UpdateProductPost: FC<Props> = ({ post }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { form, submit } = useUpdateProductPost({
    post,
  });

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
      },
    );
  });
  return (
    <Form {...form}>
      <form id="create-product-post-form" onSubmit={handleSubmit}>
        <Dialog
          open={open}
          onOpenChange={(e) => {
            setOpen(e);
            if (!e) {
              router.back();
            }
          }}
        >
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="min-w-[800px]"
          >
            <DialogHeader>
              <DialogTitle>更新商品内容</DialogTitle>
              <DialogDescription>填写以下信息以更新商品内容</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品内容类别</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="商品内容类别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(WalleeMallCmsProductPostCategory)
                        .filter(([key]) => isNaN(Number(key)))
                        .map(([key, value]) => (
                          <SelectItem key={value} value={value.toString()}>
                            {key}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>请选择商品内容类别</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品内容</FormLabel>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={field.onChange}
                      readonly={false}
                      className="min-h-[200px] max-h-[50vh] overflow-y-auto p-0 m-0 border border-dotted rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>关闭</Button>
              </DialogClose>
              <Button
                type="submit"
                form="create-product-post-form"
                variant={"default"}
              >
                提交
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};
