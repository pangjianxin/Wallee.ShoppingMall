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
import { VoloAbpIdentityIdentityRoleDto } from "@/openapi";
import { useRouter } from "next/navigation";
import { roleDelete } from "@/openapi";
import { useQueryClient } from "@tanstack/react-query";
import { roleGetListQueryKey } from "@/openapi/@tanstack/react-query.gen";
import { toast } from "sonner";
import { parseVoloAbpError } from "@/lib/remote-error-parser";

interface Props {
  role: VoloAbpIdentityIdentityRoleDto;
}
const DeleteUser: FC<Props> = ({ role }) => {
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
      await roleDelete({
        throwOnError: true,
        path: {
          id: role.id as string,
        },
      });
      queryclient.invalidateQueries({
        queryKey: [roleGetListQueryKey()],
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
          <DialogTitle>{role.name}</DialogTitle>
          <DialogDescription>该角色删除将无法恢复</DialogDescription>
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
