import { Separator } from "@/components/ui/separator";
import { FC } from "react";

type Props = {
  title?: string;
};

export const SeparatorWithText: FC<Props> = ({ title }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      {title && (
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};
