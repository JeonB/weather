import { z } from "zod";

// 좌표 스키마
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

// 날씨 조건 스키마
export const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

// 현재 날씨 응답 스키마
export const CurrentWeatherResponseSchema = z.object({
  coord: CoordinatesSchema,
  weather: z.array(WeatherConditionSchema).min(1),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number().optional(),
  wind: z.object({
    speed: z.number(),
    deg: z.number().optional(),
  }),
  clouds: z
    .object({
      all: z.number(),
    })
    .optional(),
  dt: z.number(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number().optional(),
    sunset: z.number().optional(),
  }),
  timezone: z.number().optional(),
  id: z.number().optional(),
  name: z.string(),
  cod: z.number().optional(),
});

// 예보 항목 스키마
export const ForecastItemSchema = z.object({
  dt: z.number(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(WeatherConditionSchema).min(1),
  clouds: z
    .object({
      all: z.number(),
    })
    .optional(),
  wind: z
    .object({
      speed: z.number(),
      deg: z.number().optional(),
    })
    .optional(),
  visibility: z.number().optional(),
  pop: z.number().optional(),
  dt_txt: z.string(),
});

// 예보 응답 스키마
export const ForecastResponseSchema = z.object({
  cod: z.string(),
  message: z.number().optional(),
  cnt: z.number(),
  list: z.array(ForecastItemSchema),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: CoordinatesSchema,
    country: z.string(),
    timezone: z.number().optional(),
    sunrise: z.number().optional(),
    sunset: z.number().optional(),
  }),
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

// Geocoding 응답 스키마
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
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type CurrentWeatherResponse = z.infer<
  typeof CurrentWeatherResponseSchema
>;
export type ForecastItem = z.infer<typeof ForecastItemSchema>;
export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;
