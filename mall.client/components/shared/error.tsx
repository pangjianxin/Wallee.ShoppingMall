import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Folder, ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorState({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>
        <EmptyTitle>{title || "没有记录"}</EmptyTitle>
        <EmptyDescription>
          {description || "当前搜索条件下没有数据记录。请调整筛选条件后重试。"}
        </EmptyDescription>
      </EmptyHeader>
      {children && (
        <EmptyContent className="flex flex-row items-center gap-2">{children}</EmptyContent>
      )}
      <Button
        variant={"link"}
        onClick={router.back}
        className="text-muted-foreground"
      >
        返回上一页
        <ArrowUpRightIcon />
      </Button>
    </Empty>
  );
}
