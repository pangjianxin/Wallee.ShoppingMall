import {
  WalleeMallProductsDtosProductDto,
  WalleeMallProductsDtosProductSkuDto,
} from "@/openapi";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  entity: WalleeMallProductsDtosProductDto;
};

const ProductSku: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>商品 SKU 列表</DialogTitle>
          <DialogDescription>商品名称：{entity.name}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4"></div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSku;
