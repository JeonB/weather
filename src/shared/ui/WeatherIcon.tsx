"use client";

import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  CloudFog,
} from "lucide-react";
import { cn } from "@shared/lib/cn";

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({
  iconCode,
  size = 100,
  className,
}: WeatherIconProps) {
  // OpenWeatherMap 아이콘 코드를 날씨 상태로 변환
  // 코드 규칙: 01d -> 맑음(낮), 01n -> 맑음(밤), 02 -> 약간 흐림, 03 -> 흐림, 04 -> 매우 흐림
  // 09 -> 비/소나기, 10 -> 비, 11 -> 천둥번개, 13 -> 눈, 50 -> 안개

  const iconType = iconCode.slice(0, 2);
  const isNight = iconCode.endsWith("n");

  // 조건별 컬러 매핑 (stroke 색)
  const color =
    iconType === "01"
      ? isNight
        ? "#60a5fa" // blue-400
        : "#f59e0b" // amber-500
      : iconType === "02" || iconType === "03"
      ? "#94a3b8" // slate-400
      : iconType === "04"
      ? "#64748b" // slate-500
      : iconType === "09" || iconType === "10"
      ? "#3b82f6" // blue-500
      : iconType === "11"
      ? "#8b5cf6" // violet-500
      : iconType === "13"
      ? "#38bdf8" // sky-400
      : iconType === "50"
      ? "#94a3b8"
      : "#f59e0b";

  // 배경 원 (파스텔)
  const bg =
    iconType === "01"
      ? isNight
        ? "#1e3a8a22"
        : "#fef3c722"
      : iconType === "02" || iconType === "03"
      ? "#e2e8f022"
      : iconType === "04"
      ? "#cbd5e122"
      : iconType === "09" || iconType === "10"
      ? "#dbeafe22"
      : iconType === "11"
      ? "#ede9fe22"
      : iconType === "13"
      ? "#e0f2fe22"
      : "#e2e8f022";

  switch (iconType) {
    case "01": // 맑음
      return (
        <div
          className={cn(
            "rounded-full inline-flex items-center justify-center",
            className
          )}
          style={{ width: size, height: size, background: bg }}
        >
          {isNight ? (
            <Moon size={Math.round(size * 0.75)} stroke={color} />
          ) : (
            <Sun size={Math.round(size * 0.75)} stroke={color} />
          )}
        </div>
      );

    case "02": // 약간 흐림
    case "03": // 흐림
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <Cloud size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    case "04": // 매우 흐림
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <Cloud size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    case "09": // 소나기
    case "10": // 비
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <CloudRain size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    case "11": // 천둥번개
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <CloudLightning size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    case "13": // 눈
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <CloudSnow size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    case "50": // 안개
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          <CloudFog size={Math.round(size * 0.75)} stroke={color} />
        </div>
      );

    default:
      return (
        <div
          className="rounded-full inline-flex items-center justify-center"
          style={{ width: size, height: size, background: bg }}
        >
          {isNight ? (
            <Moon size={Math.round(size * 0.75)} stroke={color} />
          ) : (
            <Sun size={Math.round(size * 0.75)} stroke={color} />
          )}
        </div>
      );
  }
}
