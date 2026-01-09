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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseVoloAbpError } from "@/lib/remote-error-parser";
import { usePendingBackgroundJob } from "@/hooks/background-jobs/pending-job";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DatePicker } from "@/components/shared/date-picker";

interface Props {
  entity: WalleeMallBackgroundJobsDtosBackgroundJobRecordDto;
}
const Delete: FC<Props> = ({ entity }) => {
  const [open, setOpen] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { form, submit } = usePendingBackgroundJob({ id: entity.id as string });
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await submit(data);
      await queryClient.invalidateQueries({ queryKey: ["leave-records"] });
      toast.success("休假申请提交成功", { richColors: true });
    } catch (e: any) {
      toast.error(parseVoloAbpError(e), {
        richColors: true,
      });
    }
  });

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>{`${entity.jobName}`}</DialogTitle>
              <DialogDescription>
                调整下次执行时间会影响任务的执行，请谨慎操作
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="nextTryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    下次执行时间
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        field.onChange(date ? date.toISOString() : "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  关闭
                </Button>
              </DialogClose>
              <LoadingButton
                type="submit"
                form="delete-user-form"
                loading={form.formState.isSubmitting}
                onClick={handleSubmit}
              >
                提交
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default Delete;
