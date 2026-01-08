"use client";

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

  // 그래프를 위한 최소/최대 온도 계산
  const temps = forecasts.map((f) => f.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1; // 0으로 나누는 것 방지

  // 그래프 영역 설정 (여백 확대)
  const graphHeight = 220;
  const graphWidth = forecasts.length * 100;
  const padding = 60;
  const chartWidth = Math.max(graphWidth, 600);

  // 온도를 그래프 좌표로 변환
  const getYPosition = (temp: number) => {
    const normalized = (temp - minTemp) / tempRange;
    return graphHeight - normalized * graphHeight;
  };

  // 직선 경로 생성
  const pathData = forecasts
    .map((forecast, index) => {
      const x =
        padding +
        (index * (chartWidth - padding * 2)) / (forecasts.length - 1 || 1);
      const y = padding + getYPosition(forecast.temp);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className={cn("w-full", className)}>
      <h3 className="mb-4 text-sm font-medium text-foreground">
        시간대별 기온
      </h3>
      <div className="relative w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={graphHeight + padding * 2}
          className="w-full"
          viewBox={`0 0 ${chartWidth} ${graphHeight + padding * 2}`}
        >
          {/* 그리드 라인 (더 연한 색상) */}
          <defs>
            <pattern
              id="grid"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted/30"
              />
            </pattern>
          </defs>
          <rect
            width={chartWidth}
            height={graphHeight + padding * 2}
            fill="url(#grid)"
          />

          {/* 온도 라인 */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 온도 점 및 라벨 */}
          {forecasts.map((forecast, index) => {
            const x =
              padding +
              (index * (chartWidth - padding * 2)) /
                (forecasts.length - 1 || 1);
            const y = padding + getYPosition(forecast.temp);

            return (
              <g key={`${forecast.time}-${index}`}>
                {/* 온도 점 */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="currentColor"
                  className="text-primary"
                />

                {/* 온도 라벨 (간격 확대) */}
                <text
                  x={x}
                  y={y - 16}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                >
                  {forecast.temp}°
                </text>

                {/* 시간 라벨 (간격 확대) */}
                <text
                  x={x}
                  y={graphHeight + padding + 28}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {forecast.time}
                </text>
              </g>
            );
          })}

          {/* Y축 최소/최대 온도 라벨 */}
          <text
            x={10}
            y={padding + 5}
            className="text-xs fill-muted-foreground"
          >
            {maxTemp}°
          </text>
          <text
            x={10}
            y={graphHeight + padding - 5}
            className="text-xs fill-muted-foreground"
          >
            {minTemp}°
          </text>
        </svg>
      </div>
    </div>
  );
}
