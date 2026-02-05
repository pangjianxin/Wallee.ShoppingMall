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
import { FC, useState } from "react";
import { useCreateProduct } from "@/hooks/products/create";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const Create: FC = () => {
  const [open, setOpen] = useState(false);
  const { form, submit } = useCreateProduct();
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
          router.refresh();
        },
      }
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          添加商品
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="create-product-form">
          <DialogContent
            className="sm:max-w-lg sm:max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-normal">
                添加商品
              </DialogTitle>
              <DialogDescription>
                商品信息填写完整后，点击提交按钮即可创建商品。
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
                      <Input
                        {...field}
                        type="text"
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>取消</Button>
              </DialogClose>
              <Button
                type="submit"
                form="create-product-form"
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

export default Create;
