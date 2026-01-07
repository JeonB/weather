"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  GeocodingResponseSchema,
  CoordinatesSchema,
  type Coordinates,
} from "../schemas/weather.schemas";

interface UseGeocodingOptions {
  enabled?: boolean;
}

export function useGeocoding(
  locationName: string | null,
  options?: UseGeocodingOptions
) {
  return useQuery<Coordinates, Error>({
    queryKey: ["geocoding", locationName],
    queryFn: async () => {
      if (!locationName) {
        throw new Error("위치 이름이 제공되지 않았습니다");
      }

      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다");
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          locationName
        )}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("위치 정보를 가져올 수 없습니다");
      }

      const data = await response.json();

      // Zod 스키마로 검증
      try {
        const validatedData = GeocodingResponseSchema.parse(data);
        const coordinates = {
          lat: validatedData[0].lat,
          lon: validatedData[0].lon,
        };
        // 좌표도 검증
        return CoordinatesSchema.parse(coordinates);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(
            `위치 정보 형식이 올바르지 않습니다: ${error.issues
              .map((issue) => issue.message)
              .join(", ")}`
          );
        }
        throw new Error("해당 장소의 정보가 제공되지 않습니다.");
      }
    },
    enabled:
      options?.enabled !== false &&
      locationName !== null &&
      locationName.trim() !== "",
    staleTime: 10 * 60 * 1000, // 10분 (좌표는 자주 변하지 않음)
  });
}
