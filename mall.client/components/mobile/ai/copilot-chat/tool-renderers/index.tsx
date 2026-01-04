import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { WeatherCard } from "@/components/mobile/ai/copilot-chat/tool-renderers/maps_weather";
import { AroundSearchResult } from "@/components/mobile/ai/copilot-chat/tool-renderers/maps_around_search";
import { SearchDetail } from "@/components/mobile/ai/copilot-chat/tool-renderers/maps_search_detail";

const WeatherCardArgsSchema = z.object({
  city: z.string().describe("城市名称").min(1, { message: "城市名称不能为空" }),
});

const AroundSearchArgsSchema = z.object({
  keywords: z.string().describe("搜索关键词").min(1),
  location: z.string().describe("位置").min(1),
  radius: z.string().describe("搜索半径").optional(),
});

const SearchDetailArgsSchema = z.object({
  id: z.string().describe("POI ID").min(1),
});

export const WeatherCardRenderer = defineToolCallRenderer({
  name: "maps_weather",
  agentId: "amap",
  // Cast bridges any zod instance mismatch with the library's expected ZodTypeAny
  args: WeatherCardArgsSchema,
  render: ({ args, result, status }) => {
    if (status !== "complete" || !result) {
      return (
        <div className="bg-[#667eea] text-white p-4 m-2 rounded-lg max-w-md">
          <span className="animate-spin">⚙️ 正在获取天气...</span>
        </div>
      );
    }

    return <WeatherCard args={args} result={result} />;
  },
});

export const AroundSearchRenderer = defineToolCallRenderer({
  name: "maps_around_search",
  agentId: "amap",
  args: AroundSearchArgsSchema,
  render: ({ args, result, status }) => {
    const handlePoiClick = async (poiId: string) => {
      console.log("POI ID clicked:", poiId);
    };

    if (status !== "complete") {
      return (
        <div className="bg-[#667eea] text-white p-4 rounded-lg max-w-md">
          <span className="animate-spin">⚙️ 正在获取周边信息...</span>
        </div>
      );
    }

    return (
      <AroundSearchResult
        args={args}
        result={result}
        onPoiClick={handlePoiClick}
      />
    );
  },
});

export const SearchDetailRenderer = defineToolCallRenderer({
  name: "maps_search_detail",
  agentId: "amap",
  args: SearchDetailArgsSchema,
  render: ({ args, result, status }) => {
    if (status !== "complete") {
      return (
        <div className="bg-[#667eea] text-white p-4 rounded-lg max-w-md">
          <span className="animate-spin">⚙️ 正在获取 POI 详情...</span>
        </div>
      );
    }
    return <SearchDetail args={args} result={result} />;
  },
});
