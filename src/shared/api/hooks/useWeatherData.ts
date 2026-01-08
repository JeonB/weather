"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "../weather";
import type { WeatherData, Coordinates } from "../weather.types";

interface UseWeatherDataOptions {
  enabled?: boolean;
  locationName?: string;
}

export function useWeatherData(
  coordinates: Coordinates | null,
  options?: UseWeatherDataOptions
) {
  return useQuery<WeatherData, Error>({
    queryKey: [
      "weather",
      coordinates?.lat,
      coordinates?.lon,
      options?.locationName,
    ],
    queryFn: () => {
      if (!coordinates) {
        throw new Error("좌표가 제공되지 않았습니다");
      }
      return getWeatherData(coordinates);
    },
    enabled: options?.enabled !== false && coordinates !== null,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
