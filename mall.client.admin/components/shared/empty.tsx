"use client";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Folder, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EmptyState({
  title,
  description,
  children,
  icon,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon || <Folder />}</EmptyMedia>
        <EmptyTitle>{title || "没有记录"}</EmptyTitle>
        <EmptyDescription>
          {description || "当前搜索条件下没有数据记录。请调整筛选条件后重试。"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {children && children}
        <Button
          variant={"link"}
          onClick={router.back}
          className="text-muted-foreground"
        >
          <ArrowLeft />
          返回上一页
        </Button>
      </EmptyContent>
    </Empty>
  );
}
