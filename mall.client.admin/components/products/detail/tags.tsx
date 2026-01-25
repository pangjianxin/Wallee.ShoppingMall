import { WalleeMallTagsDtosTagDto } from "@/openapi";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  tags: WalleeMallTagsDtosTagDto[];
};
export const ProductTags: FC<Props> = ({ tags }) => {
  if (tags && tags.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name || tag.normalizedName || "未命名"}
          </Badge>
        ))}
      </div>
    );
  }
  return <p className="text-sm text-muted-foreground">暂无标签</p>;
};
