"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEventBus } from "@/stores/event-bus";

interface NearbySearchProps {
  name: string;
  lat: number;
  lng: number;
  className?: string;
}

const PRESET_TYPES = [
  "企业",
  "政府",
  "事业单位",
  "学校",
  "医院",
  "银行",
  "餐饮",
];

export function AmapAroundSearch({
  name,
  lat,
  lng,
  className,
}: NearbySearchProps) {
  const [searchType, setSearchType] = React.useState("企业");
  const [searchRadius, setSearchRadius] = React.useState("500");
  const [maxResults, setMaxResults] = React.useState("20");
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const publish = useEventBus((state) => state.publish);
  const filteredTypes = PRESET_TYPES.filter((type) =>
    type.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSearchType(value);
    setInputValue("");
    setOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setSearchType(inputValue.trim());
      setInputValue("");
      setOpen(false);
    }
  };

  const handleAroundSearch = () => {
    const prompt = `在${name}(坐标:[lng:${lng.toFixed(6)},lat:${lat.toFixed(
      6
    )}]),半径${searchRadius}米范围内搜索${searchType}，最多返回${maxResults}条结果`;
    publish("chatPrefill", prompt);
  };

  return (
    <div className={cn("w-[200px] border bg-background text-xs", className)}>
      <div className="px-2 py-1.5 bg-muted/50 border-b flex items-center justify-between">
        <span className="truncate font-medium flex-1" title={name}>
          {name || "未知"}
        </span>
        <span className="text-[10px] text-muted-foreground ml-1 shrink-0">
          周边搜索
        </span>
      </div>

      <div className="p-1.5 space-y-1.5">
        <div className="flex gap-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-7 justify-between text-xs px-2 bg-transparent"
              >
                <span className="truncate">{searchType}</span>
                <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0" align="start">
              <Input
                placeholder="输入或选择..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="h-7 text-xs border-0 border-b rounded-none focus-visible:ring-0"
                autoFocus
              />
              <div className="max-h-[120px] overflow-y-auto p-0.5">
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSelect(type)}
                      className={cn(
                        "flex items-center w-full px-2 py-1 text-xs rounded hover:bg-muted",
                        searchType === type && "bg-muted"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-1 h-3 w-3",
                          searchType === type ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {type}
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-1 text-xs text-muted-foreground">
                    回车添加
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={handleAroundSearch}
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex gap-1">
          <div className="relative flex-1">
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              className="h-7 pl-2 pr-5 text-xs"
              value={searchRadius}
              onChange={(e) => setSearchRadius(e.target.value)}
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
              米
            </span>
          </div>
          <div className="relative flex-1">
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              className="h-7 pl-2 pr-5 text-xs"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
              条
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
