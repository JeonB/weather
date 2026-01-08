import { z } from "zod";

/**
 * Open-Meteo API 응답 스키마
 * https://open-meteo.com/en/docs
 */

// Hourly 데이터 스키마
export const OpenMeteoHourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
  weathercode: z.array(z.number()),
  relativehumidity_2m: z.array(z.number()),
  windspeed_10m: z.array(z.number()),
});

// Daily 데이터 스키마
export const OpenMeteoDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
});

// Open-Meteo Forecast API 응답 스키마
export const OpenMeteoResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  elevation: z.number().optional(),
  hourly_units: z
    .object({
      time: z.string().optional(),
      temperature_2m: z.string().optional(),
      weathercode: z.string().optional(),
      relativehumidity_2m: z.string().optional(),
      windspeed_10m: z.string().optional(),
    })
    .optional(),
  hourly: OpenMeteoHourlySchema,
  daily_units: z
    .object({
      time: z.string().optional(),
      temperature_2m_max: z.string().optional(),
      temperature_2m_min: z.string().optional(),
    })
    .optional(),
  daily: OpenMeteoDailySchema,
});

// 타입 추출
export type OpenMeteoHourly = z.infer<typeof OpenMeteoHourlySchema>;
export type OpenMeteoDaily = z.infer<typeof OpenMeteoDailySchema>;
export type OpenMeteoResponse = z.infer<typeof OpenMeteoResponseSchema>;
