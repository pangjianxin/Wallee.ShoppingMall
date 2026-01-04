import { Card } from "@/components/ui/card";
import { Cloud, Wind, CloudRain, Sun, CloudSnow } from "lucide-react";
import { z } from "zod";
const WeatherForecastSchema = z.object({
  date: z.string(),
  week: z.string(),
  dayweather: z.string(),
  nightweather: z.string(),
  daytemp: z.string(),
  nighttemp: z.string(),
  daywind: z.string(),
  nightwind: z.string(),
  daypower: z.string(),
  nightpower: z.string(),
});

const WeatherToolPayloadSchema = z.object({
  city: z.string().optional(),
  forecasts: z.array(WeatherForecastSchema).nullable().optional(),
});

type ForecastData = z.infer<typeof WeatherForecastSchema>;
type WeatherToolPayload = z.infer<typeof WeatherToolPayloadSchema>;

const parseWeatherResult = (result: string): WeatherToolPayload | null => {
  console.log(result);

  const text = result;

  const parseJson = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn("Failed to parse weather result", error);
      return null;
    }
  };

  const parsePayload = (candidate: unknown) => {
    const parsed = WeatherToolPayloadSchema.safeParse(candidate);

    if (parsed.success === true) {
      return parsed.data;
    }
    return null;
  };
  const parsedRoot = parseJson(text) as any;
  const rawPayload = parsedRoot?.text;
  const candidate =
    typeof rawPayload === "string" ? parseJson(rawPayload) : rawPayload;

  return parsePayload(candidate);
};

interface WeatherCardProps {
  args: any;
  result: string;
}

const getWeatherIcon = (weather: string) => {
  if (weather.includes("晴")) return <Sun className="w-8 h-8" />;
  if (weather.includes("雨")) return <CloudRain className="w-8 h-8" />;
  if (weather.includes("雪")) return <CloudSnow className="w-8 h-8" />;
  if (weather.includes("云") || weather.includes("阴"))
    return <Cloud className="w-8 h-8" />;
  return <Sun className="w-8 h-8" />;
};

const getWeekDay = (week: string) => {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `周${days[Number.parseInt(week)] || week}`;
};

export function WeatherCard({ args, result }: WeatherCardProps) {
  const parsed = parseWeatherResult(result);
  const today = parsed?.forecasts?.[0] as ForecastData;
  const city = parsed?.city || (args.city as string) || "未知城市";
  const parsedForecasts = Array.isArray(parsed?.forecasts)
    ? (parsed?.forecasts as ForecastData[])
    : [];

  if (!parsedForecasts.length) {
    return (
      <div className=" bg-rose-100 text-rose-600 p-4 rounded-lg max-w-md">
        暂时无法获取 {city} 的天气信息，请稍后重试。
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-sm bg-linear-to-br from-primary/5 via-background to-accent/10 my-2">
      {/* Header Section */}
      <div className="p-2 md:p-4 bg-primary/10 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
              {city}
            </h1>
            <p className="text-muted-foreground text-xs md:text-base">
              {today.date} {getWeekDay(today.week)}
            </p>
          </div>
          <div className="text-primary shrink-0">
            {getWeatherIcon(today.dayweather)}
          </div>
        </div>

        {/* Current Temperature */}
        <div className="mt-4 md:mt-6 flex items-baseline gap-2">
          <span className="text-5xl md:text-7xl font-bold text-foreground">
            {today.daytemp}°
          </span>
          <span className="text-xl md:text-2xl text-muted-foreground">
            / {today.nighttemp}°
          </span>
        </div>

        {/* Current Weather Info */}
        <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-6 text-xs md:text-base">
          <div className="flex items-center gap-1 md:gap-2 text-foreground">
            <span className="font-medium">{today.dayweather}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-muted-foreground">
            <Wind className="w-3 h-3 md:w-4 md:h-4" />
            <span>
              {today.daywind}风 {today.daypower}级
            </span>
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mt-4">
        {parsedForecasts.map((forecast, index) => (
          <Card
            key={forecast.date}
            className="p-3 md:p-4 bg-card hover:bg-accent/50 transition-colors border-border/50"
          >
            <div className="flex md:flex-col items-center md:text-center md:space-y-3 gap-3 md:gap-0">
              {/* Date */}
              <div className="text-sm text-muted-foreground md:w-auto w-16 shrink-0">
                <div className="font-medium">
                  {index === 0 ? "今天" : `${forecast.date.split("-")[2]}日`}
                </div>
                <div className="text-xs mt-0.5 md:mt-1">
                  {getWeekDay(forecast.week)}
                </div>
              </div>

              {/* Weather Icon */}
              <div className="flex justify-center text-primary shrink-0">
                {getWeatherIcon(forecast.dayweather)}
              </div>

              {/* Weather Description */}
              <div className="text-sm font-medium text-foreground shrink-0 min-w-[3rem]">
                {forecast.dayweather}
              </div>

              {/* Temperature */}
              <div className="text-base md:text-lg font-bold text-foreground shrink-0">
                {forecast.daytemp}°
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}
                  / {forecast.nighttemp}°
                </span>
              </div>

              {/* Wind Info */}
              <div className="text-xs text-muted-foreground flex items-center md:justify-center gap-1 ml-auto md:ml-0">
                <Wind className="w-3 h-3" />
                <span>
                  {forecast.daywind} {forecast.daypower}级
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
