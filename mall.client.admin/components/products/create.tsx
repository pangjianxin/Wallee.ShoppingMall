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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { CloudUpload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const Create: FC = () => {
  const [open, setOpen] = useState(false);
  const { form, submit } = useCreateProduct();
  const router = useRouter();

  // 将折扣率转换为易读文本
  const getDiscountText = (value: number | undefined) => {
    if (!value) return "未设置";
    if (value === 1) return "不打折";
    const discount = value * 10;
    return `${discount}折`;
  };

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
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品原价</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        readOnly={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品折扣率</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        readOnly={false}
                      />
                    </FormControl>
                    <FormDescription>
                      1表示不打折，0.9表示九折，0.8表示八折，以此类推。当前折扣率：
                      {getDiscountText(field.value)}
                    </FormDescription>
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
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        readOnly={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productCovers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品封面(最多十张)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onValueChange={field.onChange}
                        multiple={true}
                      >
                        <FileUploadDropzone className="flex-col items-center border-dotted">
                          <CloudUpload className="size-8" />
                          <FileUploadTrigger asChild>
                            <Button variant="link" size="sm" className="p-0">
                              拖放文件或选择文件
                            </Button>
                          </FileUploadTrigger>
                        </FileUploadDropzone>
                        <FileUploadList className="max-h-[400px] overflow-y-auto">
                          {field.value?.map((file, index) => (
                            <FileUploadItem
                              key={index}
                              value={file}
                              className="grid grid-cols-[1fr_auto] gap-2 items-center"
                            >
                              <FileUploadItemPreview />
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                >
                                  <X />
                                  <span className="sr-only">删除</span>
                                </Button>
                              </FileUploadItemDelete>
                              <FileUploadItemMetadata className="truncate min-w-0" />
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUpload>
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
