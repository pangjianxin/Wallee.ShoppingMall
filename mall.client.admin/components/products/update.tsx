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
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateProduct } from "@/hooks/products/update";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Label } from "../ui/label";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { getDiscountText } from "@/lib/utils";

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
      }
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
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>¥</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupText>CNY</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
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
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupText>
                            {getDiscountText(field.value)}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormDescription>
                      1表示不打折，0.9表示九折，0.8表示八折，以此类推。
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

              <FormField
                control={form.control}
                name="productCovers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>旧商品封面</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        {field.value && field.value.length > 0 ? (
                          field.value.map((cover, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-md overflow-hidden border group"
                            >
                              <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_PREVIEW_URL}/${cover.mallMediaId}`}
                                alt={`商品封面 ${index + 1}`}
                                className="object-cover"
                                sizes="100%"
                                fill
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newCovers = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newCovers);
                                }}
                              >
                                <X className="size-4" />
                                <span className="sr-only">删除</span>
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground col-span-2">
                            暂无已上传的封面图片
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newCovers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新商品封面(最多十张)</FormLabel>
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
                              拖放文件或选择文件来上传新的商品封面
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
