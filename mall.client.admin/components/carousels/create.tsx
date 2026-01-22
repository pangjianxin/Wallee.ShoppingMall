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
import { useCreateCarousel } from "@/hooks/carousels/create";
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
import { Editor } from "@/components/shared/editor/dynamic-editor";
import { WalleeMallProductsDtosProductDto } from "@/openapi";

type Props = {
  product?: WalleeMallProductsDtosProductDto;
};

const Create: FC<Props> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const { form, submit } = useCreateCarousel({ productId: product?.id });
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

  console.log(form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                创建轮播图_{product?.name ?? ""}
              </DialogTitle>
              <DialogDescription>
                轮播图信息填写完整后，点击提交按钮即可创建轮播图。
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轮播图标题</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="请输入轮播图标题"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轮播图简介</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="请输入轮播图简介" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轮播图优先级</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>数值越大，优先级越高</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImageMediaId"
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

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轮播图内容</FormLabel>
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
            </div>
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

export default Create;
