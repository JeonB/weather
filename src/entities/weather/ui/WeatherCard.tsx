"use client";

import { WeatherScene } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface WeatherCardProps {
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  location?: string;
  compact?: boolean;
  className?: string;
}

export default function WeatherCard({
  temp,
  tempMin,
  tempMax,
  description,
  icon,
  humidity,
  windSpeed,
  location,
  compact = false,
  className,
}: WeatherCardProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <WeatherScene icon={icon} size="sm" className="shrink-0" />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{temp}°</span>
          <span className="text-sm text-muted-foreground">
            {tempMin}° / {tempMax}°
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {location && (
        <h2 className="text-xl font-semibold text-foreground">{location}</h2>
      )}

      <div className="flex items-center gap-4">
        <WeatherScene icon={icon} size="lg" className="shrink-0" />
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold tracking-tight">{temp}°</span>
          <span className="text-lg capitalize text-muted-foreground">
            {description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>최저 {tempMin}°</span>
        <span>최고 {tempMax}°</span>
      </div>

      {(humidity !== undefined || windSpeed !== undefined) && (
        <div className="mt-2 flex items-center gap-6 text-sm">
          {humidity !== undefined && (
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
              <span>습도 {humidity}%</span>
            </div>
          )}
          {windSpeed !== undefined && (
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <span>바람 {windSpeed}m/s</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
