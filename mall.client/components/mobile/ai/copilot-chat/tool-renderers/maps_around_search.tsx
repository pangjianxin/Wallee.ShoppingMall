import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MapPin, Navigation, CircleDot, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContentChunk = {
  type?: string;
  text?: string;
};

type RawPoi = {
  id?: string;
  name?: string;
  address?: string | null;
  typecode?: string | null;
  photo?: string | null;
};

type Poi = {
  id: string;
  name: string;
  address: string;
  typecode?: string | null;
  photo?: string | null;
};

type MapsAroundSearchPayload = {
  pois?: RawPoi[] | null;
};

interface AroundSearchResultProps {
  args?: Record<string, unknown>;
  result: unknown;
  onPoiClick?: (poiId: string) => void;
}

const deepParseJsonString = (value: string): unknown => {
  let current: unknown = value;

  // Some tool responses double-encode JSON; keep parsing until it stabilizes.
  while (typeof current === "string") {
    try {
      current = JSON.parse(current);
    } catch {
      return null;
    }
  }

  return current;
};

const normalizePois = (rawPois: unknown): RawPoi[] => {
  if (!Array.isArray(rawPois)) {
    return [];
  }

  return rawPois.filter(
    (poi): poi is RawPoi => typeof poi === "object" && poi !== null
  );
};

const pickPois = (payload: unknown): Poi[] => {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "pois" in payload
  ) {
    const normalized = normalizePois((payload as MapsAroundSearchPayload).pois);
    return normalized
      .filter((poi): poi is Required<Pick<RawPoi, "id" | "name">> & RawPoi => {
        return typeof poi.id === "string" && typeof poi.name === "string";
      })
      .map((poi) => ({
        id: poi.id,
        name: poi.name,
        address: poi.address ?? "暂无地址",
        typecode: poi.typecode ?? "",
        photo: poi.photo ?? null,
      }));
  }

  return [];
};

const parseAroundSearchResult = (content: unknown): Poi[] => {
  if (typeof content === "string") {
    const parsedString = deepParseJsonString(content);
    if (parsedString) {
      return parseAroundSearchResult(parsedString);
    }
    return [];
  }

  const directPois = pickPois(content);
  if (directPois.length) {
    return directPois;
  }

  if (content && typeof content === "object" && !Array.isArray(content)) {
    const maybeText = (content as { text?: unknown }).text;
    if (typeof maybeText === "string") {
      const parsedText = deepParseJsonString(maybeText);
      if (parsedText) {
        return parseAroundSearchResult(parsedText);
      }
    }

    if (Array.isArray((content as { content?: unknown }).content)) {
      return parseAroundSearchResult(
        (content as { content?: unknown }).content
      );
    }
  }

  if (!Array.isArray(content)) {
    return [];
  }

  const textChunk = content.find(
    (chunk): chunk is ContentChunk =>
      typeof chunk === "object" &&
      chunk !== null &&
      typeof (chunk as ContentChunk).text === "string"
  );

  if (!textChunk?.text) {
    return [];
  }

  const parsed = deepParseJsonString(textChunk.text);
  return pickPois(parsed);
};

const formatTypeLabels = (typecode?: string | null) => {
  if (!typecode) {
    return [] as string[];
  }

  const unique = new Set(
    typecode
      .split("|")
      .map((code) => code.trim())
      .filter(Boolean)
  );

  return Array.from(unique);
};

const formatRadius = (radius?: string) => {
  if (!radius) {
    return "";
  }

  const numericRadius = Number.parseFloat(radius);
  if (Number.isFinite(numericRadius)) {
    return `${numericRadius} 米`;
  }

  return radius;
};

export function AroundSearchResult({
  args,
  result,
  onPoiClick,
}: AroundSearchResultProps) {
  const pois = parseAroundSearchResult(result);
  const keywords = typeof args?.keywords === "string" ? args.keywords : "";
  const location = typeof args?.location === "string" ? args.location : "";
  const radius = typeof args?.radius === "string" ? args.radius : "";

  if (!pois.length) {
    return (
      <div className="bg-amber-50 text-amber-900 p-4 rounded-lg text-sm">
        未能找到
        {keywords ? `「${keywords}」` : "该关键词"}{" "}
        附近的兴趣点，请尝试更换关键词或扩大搜索半径。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border/60 bg-card/70 p-3 text-sm space-y-1.5">
        {keywords && (
          <p>
            <span className="text-muted-foreground">关键词：</span>
            <span className="font-medium text-foreground">{keywords}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {location && (
            <span className="flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" />
              {location}
            </span>
          )}
          {radius && (
            <span className="flex items-center gap-1">
              <CircleDot className="h-3.5 w-3.5" />
              {formatRadius(radius)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {pois.map((poi) => (
          <Card key={poi.id} className="p-2 border border-border/60 bg-card/90">
            {/* 第一行：图片 + 标题 + 标签 */}
            <div className="flex items-center gap-2">
              {poi.photo ? (
                <Image
                  src={poi.photo || "/placeholder.svg"}
                  alt={poi.name}
                  width={32}
                  height={32}
                  sizes="32px"
                  unoptimized
                  className="size-16 rounded object-cover border border-border/60 shrink-0"
                />
              ) : (
                <div className="size-16 rounded border border-dashed border-border/60 flex items-center justify-center bg-muted/30 shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                    {poi.name}
                  </span>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => onPoiClick?.(poi.id)}
                  >
                    <List />
                  </Button>
                </div>
                {formatTypeLabels(poi.typecode).length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] uppercase tracking-wide shrink-0 px-1.5 py-0"
                  >
                    {formatTypeLabels(poi.typecode)[0]}
                  </Badge>
                )}
              </div>
            </div>
            {/* 第二行：地址 */}
            <div className="flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs text-muted-foreground mt-1 line-clamp-1 min-w-0 flex-1">
                {poi.address}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
