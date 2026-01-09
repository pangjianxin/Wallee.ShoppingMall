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
import { userDelete, VoloAbpIdentityIdentityUserDto } from "@/openapi";
import { useQueryClient } from "@tanstack/react-query";
import { userGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { toast } from "sonner";
interface Props {
  user: VoloAbpIdentityIdentityUserDto | undefined;
}
const DeleteUser: FC<Props> = ({ user }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleClose = () => {
    setOpen(false);
    router.back();
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await userDelete({
        throwOnError: true,
        path: {
          id: user?.id as string,
        },
      });
      await queryClient.invalidateQueries({ queryKey: userGetListQueryKey() });
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
          <DialogTitle>
            你正在删除{user?.name}({user?.userName})
          </DialogTitle>
          <DialogDescription>该用户删除将无法恢复</DialogDescription>
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

export default DeleteUser;
