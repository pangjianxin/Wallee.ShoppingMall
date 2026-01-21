"use client";
import { Shield, Truck, RotateCcw, Clock } from "lucide-react";

export function ProductServices() {
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
    <div className="rounded-lg bg-card px-3 py-4">
      <div className="flex items-center justify-between">
        {services.map((service, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <service.icon className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">
              {service.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
