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
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { executeOperation } from "@/lib/execute-operation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateProduct } from "@/hooks/products/update";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

type Props = {
  entity: WalleeMallProductsDtosProductDto;
};

const Update: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState(true);
  const { form, submit } = useUpdateProduct({ entity });
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
      },
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
        <form onSubmit={handleSubmit} id="update-product-form">
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
                    <FormLabel>商品名称</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="请输入商品名称"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品品牌</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="请输入商品品牌"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品简介</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="请输入商品简介" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>显示顺序</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <InputGroupText>序号</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormDescription>
                      数值越小,商品显示越靠前,默认值为1。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-accent/50">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            是否上架此商品
                          </p>
                          <p className="text-muted-foreground text-sm">
                            只有上架的商品才会在前台展示给用户。
                          </p>
                        </div>
                      </Label>
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
                form="update-product-form"
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
