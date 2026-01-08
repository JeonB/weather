"use client";

import Image from "next/image";
import { getWeatherIconUrl } from "@shared/api/weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { HourlyForecast as HourlyForecastType } from "@shared/api/weather.types";
import { cn } from "@shared/lib/cn";

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
  className?: string;
}

export default function HourlyForecast({
  forecasts,
  className,
}: HourlyForecastProps) {
  if (forecasts.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground py-4", className)}>
        시간대별 예보 정보가 없습니다
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        오늘의 시간대별 날씨
      </h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {forecasts.map((forecast, index) => (
            <div
              key={`${forecast.time}-${index}`}
              className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3 min-w-[70px]"
            >
              <span className="text-xs text-muted-foreground">
                {forecast.time}
              </span>
              <Image
                src={getWeatherIconUrl(forecast.icon)}
                alt={forecast.description}
                width={40}
                height={40}
              />
              <span className="text-sm font-medium">{forecast.temp}°</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
