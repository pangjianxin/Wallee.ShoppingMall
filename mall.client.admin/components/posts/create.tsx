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
  WalleeMallCmsPostCategory,
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
import { useCreatePost } from "@/hooks/posts/create";
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
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/card";
import { ExpandableContainer } from "../shared/expandable-container";
type Props = {
  product?: WalleeMallProductsDtosProductDto;
};
export const CreateProductPost: FC<Props> = ({ product }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { form, submit } = useCreatePost({
    productId: product?.id as string,
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
            className="min-w-[800px] overflow-y-auto max-h-[90vh]"
          >
            <DialogHeader>
              <DialogTitle>创建商品内容</DialogTitle>
              <DialogDescription>填写以下信息以创建商品内容</DialogDescription>
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
                      {Object.entries(WalleeMallCmsPostCategory)
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
