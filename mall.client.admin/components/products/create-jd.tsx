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
import { useCreateProductByJdSku } from "@/hooks/products/create-jd";
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
import { useRouter } from "next/navigation";
import Link from "next/link";

const Create: FC = () => {
  const [open, setOpen] = useState(false);
  const { form, submit } = useCreateProductByJdSku();
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
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          添加京东商品
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="create-jd-product-form">
          <DialogContent
            className="sm:max-w-lg sm:max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-normal">
                添加京东商品
              </DialogTitle>
              <DialogDescription>
                只需要添加京东商品SKU，系统会自动抓取商品信息，商品信息填写完整后，点击提交按钮即可创建商品。
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <FormField
                control={form.control}
                name="jdSkuId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>京东商品SKU</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="请输入京东商品SKU(商品编号)"
                      />
                    </FormControl>
                    <FormDescription>
                      <Link
                        href="https://jd.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        京东商品SKU(商品编号)在哪里查看？
                      </Link>
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
                form="create-jd-product-form"
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
