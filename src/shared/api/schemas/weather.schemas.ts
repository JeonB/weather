import { z } from "zod";

/**
 * 앱 내부 날씨 데이터 스키마
 * Open-Meteo API를 사용하지만 앱 내부에서 사용하는 통합 데이터 구조
 */

// 좌표 스키마
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

// 시간별 예보 스키마
export const HourlyForecastSchema = z.object({
  time: z.string(),
  temp: z.number(),
  icon: z.string(),
  description: z.string(),
});

// 앱 내부 날씨 데이터 스키마
export const WeatherDataSchema = z.object({
  location: z.string(),
  coordinates: CoordinatesSchema,
  current: z.object({
    temp: z.number(),
    feelsLike: z.number(),
    tempMin: z.number(),
    tempMax: z.number(),
    humidity: z.number(),
    description: z.string(),
    icon: z.string(),
    windSpeed: z.number(),
  }),
  hourlyForecast: z.array(HourlyForecastSchema),
});

// Geocoding 응답 스키마 (OpenWeather Geocoding API 사용)
export const GeocodingResponseSchema = z
  .array(
    z.object({
      lat: z.number(),
      lon: z.number(),
      name: z.string(),
      country: z.string(),
      state: z.string().optional(),
      local_names: z.record(z.string(), z.string()).optional(),
    })
  )
  .min(1);

// 타입 추출
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;
