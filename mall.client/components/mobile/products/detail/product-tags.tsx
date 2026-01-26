"use client";
import { Badge } from "@/components/ui/badge";
import { WalleeMallTagsDtosTagDto } from "@/openapi";
import { Shield, Truck, RotateCcw, Clock, ShoppingCart } from "lucide-react";

type Props = {
  tags: WalleeMallTagsDtosTagDto[];
};

export function ProductTags({ tags }: Props) {
  const services = [
    {
      icon: Shield,
      label: "正品保障",
    },
    {
      icon: Truck,
      label: "极速发货",
    },
    {
      icon: RotateCcw,
      label: "七天退换",
    },
    {
      icon: Clock,
      label: "售后无忧",
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">服务保障</div>
        <div className="flex flex-wrap ">
          {services.map((service, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1.5 bg-success/10 text-success"
            >
              <service.icon className="h-3.5 w-3.5" />
              <span>{service.label}</span>
            </Badge>
          ))}
        </div>
      </div>

      {tags?.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-foreground">商品标签</div>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{tag.name}</span>
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
