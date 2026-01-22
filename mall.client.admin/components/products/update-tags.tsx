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
import { FC, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TagSelector, TagSelectorRef } from "@/components/tags/selector";

type Props = {
  entity: WalleeMallProductsDtosProductDto;
};

const Update: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState(true);

  const router = useRouter();
  const tagRef = useRef<TagSelectorRef>(null);
  const handleSubmit = async () => {
    if (tagRef.current?.onSubmit) {
      await tagRef.current.onSubmit(entity.id!);
    }
    toast.success("操作成功");
    setOpen(false);
    router.back();
  };

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
      <DialogContent
        className="sm:max-w-lg sm:min-h-[40vh] sm:max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-normal">
            更新商品标签
          </DialogTitle>
          <DialogDescription>
            为商品添加或更新标签，有助于更好地分类和管理商品。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <Label>商品标签</Label>
            <TagSelector ref={tagRef} productId={entity.id!} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>取消</Button>
          </DialogClose>
          <Button
            form="update-product-form"
            variant={"default"}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Update;
