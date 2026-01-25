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
  WalleeMallCmsDtosPostDto,
  WalleeMallProductsDtosProductDto,
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
import { useUpdateProductPost } from "@/hooks/posts/update";
import { executeOperation } from "@/lib/execute-operation";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/shared/editor/dynamic-editor";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/card";
import { ExpandableContainer } from "@/components/shared/expandable-container";

type Props = {
  post: WalleeMallCmsDtosPostDto;
  product?: WalleeMallProductsDtosProductDto;
};
export const UpdatePost: FC<Props> = ({ post, product }) => {
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
            className="min-w-[600px] max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>更新商品内容</DialogTitle>
              <DialogDescription>填写以下信息以更新商品内容</DialogDescription>
            </DialogHeader>
            {product && (
              <ExpandableContainer allowCollapse={true}>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">关联商品信息</h3>
                  <ProductCard product={product} />
                </div>
              </ExpandableContainer>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品标题</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="内容标题" />
                  </FormControl>
                  <FormDescription>标题可选</FormDescription>
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
