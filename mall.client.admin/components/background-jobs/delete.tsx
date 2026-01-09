"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { WalleeMallBackgroundJobsDtosBackgroundJobRecordDto } from "@/openapi";
import { backgroundJobDelete } from "@/openapi";
import { useQueryClient } from "@tanstack/react-query";
import { backgroundJobGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { toast } from "sonner";
import { parseVoloAbpError } from "@/lib/remote-error-parser";

interface Props {
  entity: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto;
}
const Delete: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const queryclient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await backgroundJobDelete({
        throwOnError: true,
        path: {
          id: entity.id as string,
        },
      });
      queryclient.invalidateQueries({
        queryKey: [backgroundJobGetListQueryKey()],
      });
      handleClose();
    } catch (e: any) {
      toast.error(parseVoloAbpError(e), { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{`${entity.jobName}`}</DialogTitle>
          <DialogDescription>
            {`${entity.jobName}`}删除将无法恢复
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              关闭
            </Button>
          </DialogClose>
          <LoadingButton
            type="submit"
            form="delete-user-form"
            loading={loading}
            onClick={handleSubmit}
          >
            提交
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Delete;
