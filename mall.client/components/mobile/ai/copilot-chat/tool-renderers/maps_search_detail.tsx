"use client";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Building2, Star, DollarSign } from "lucide-react";
import Image from "next/image";
type ContentChunk = {
  type?: string;
  text?: string;
};

type LocationData = {
  id: string;
  name: string;
  location: string;
  address: string;
  business_area: string;
  city: string;
  type: string;
  alias: string;
  photo: string;
  cost: string;
  rating: string;
};

const isLocationData = (value: unknown): value is LocationData => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.location === "string"
  );
};

const tryParsePayload = (payload: string | null | undefined): LocationData | null => {
  if (!payload) {
    return null;
  }
  try {
    return JSON.parse(payload) as LocationData;
  } catch (error) {
    console.warn("Failed to parse location result payload", error);
    return null;
  }
};

export const parseLocationResult = (content: unknown): LocationData | null => {
  if (!content) {
    return null;
  }

  if (isLocationData(content)) {
    return content;
  }

  if (typeof content === "string") {
    return tryParsePayload(content);
  }

  if (Array.isArray(content)) {
    const textChunk = content.find(
      (chunk): chunk is ContentChunk =>
        typeof chunk === "object" &&
        chunk !== null &&
        typeof (chunk as ContentChunk).text === "string"
    );
    if (textChunk?.text) {
      return tryParsePayload(textChunk.text);
    }
    return null;
  }

  if (typeof content === "object") {
    const maybeText = (content as { text?: unknown }).text;
    if (typeof maybeText === "string") {
      return tryParsePayload(maybeText);
    }
  }

  return null;
};

interface SearchDetailProps {
  args?: Record<string, unknown>;
  result: unknown;
}

const getTypeIcon = (type: string) => {
  if (type.includes("银行") || type.includes("金融"))
    return <Building2 className="w-8 h-8" />;
  if (type.includes("餐饮")) return <Building2 className="w-8 h-8" />;
  if (type.includes("购物")) return <Building2 className="w-8 h-8" />;
  return <Building2 className="w-8 h-8" />;
};

const formatLocation = (location: string) => {
  const [lng, lat] = location.split(",");
  return { lng, lat };
};

const formatType = (type: string) => {
  const parts = type.split(";");
  return parts;
};

export function SearchDetail({ result }: SearchDetailProps) {
  const parsed = useMemo(() => parseLocationResult(result), [result]);

  const coords = useMemo(() => {
    if (!parsed || !parsed.location) {
      return null;
    }
    return formatLocation(parsed.location);
  }, [parsed]);

  const typeParts = useMemo(() => {
    if (!parsed || !parsed.type) {
      return [] as string[];
    }
    return formatType(parsed.type).filter(Boolean);
  }, [parsed]);

  return (
    <>
      {!parsed ? (
        <div className="bg-rose-100 text-rose-600 p-4 rounded-lg max-w-md">
          暂时无法获取地点信息，请稍后重试。
        </div>
      ) : (
        <div className="w-full max-w-2xl overflow-hidden rounded-sm bg-linear-to-br from-primary/5 via-background to-accent/10">
          {/* Header Section */}
          <div className="p-2 md:p-4 bg-primary/10 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
                  {parsed.name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{parsed.city}</span>
                </div>
              </div>
              <div className="text-primary shrink-0">
                {getTypeIcon(parsed.type)}
              </div>
            </div>

            {/* Address */}
            <div className="mt-3 md:mt-4">
              <p className="text-sm md:text-base text-foreground">
                {parsed.address}
              </p>
            </div>

            {/* Type Tags */}
            {typeParts.length > 0 && (
              <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                {typeParts.map((part, index) => (
                  <span
                    key={`${parsed.id}-${index}`}
                    className="px-2 py-1 text-xs md:text-sm bg-accent/70 text-accent-foreground rounded-md"
                  >
                    {part}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-4">
            {/* Photo Card */}
            {parsed.photo && (
              <Card className="p-3 md:p-4 bg-card hover:bg-accent/50 transition-colors border-border/50 col-span-1 md:col-span-2">
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    地点照片
                  </div>
                  <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={parsed.photo || "/images/img-placeholder.png"}
                      alt={parsed.name}
                      className="w-full h-full object-cover"
                      fill
                      sizes="100%"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Location Coordinates */}
            {coords && (
              <Card className="p-3 md:p-4 bg-card hover:bg-accent/50 transition-colors border-border/50">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Navigation className="w-4 h-4" />
                    <span>坐标位置</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-foreground">
                      <span className="text-muted-foreground">经度:</span> {coords.lng}
                    </div>
                    <div className="text-sm text-foreground">
                      <span className="text-muted-foreground">纬度:</span> {coords.lat}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Rating & Cost */}
            <Card className="p-3 md:p-4 bg-card hover:bg-accent/50 transition-colors border-border/50">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>评价信息</span>
                </div>
                <div className="space-y-2">
                  {parsed.rating ? (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-base font-bold text-foreground">
                        {parsed.rating}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">暂无评分</div>
                  )}
                  {parsed.cost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{parsed.cost}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Business Area */}
            {parsed.business_area && (
              <Card className="p-3 md:p-4 bg-card hover:bg-accent/50 transition-colors border-border/50 col-span-1 md:col-span-2">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    商圈
                  </div>
                  <div className="text-base text-foreground">
                    {parsed.business_area}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
