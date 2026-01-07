// OpenWeatherMap API Response Types
// 타입은 schemas/weather.schemas.ts에서 Zod 스키마로부터 추출됩니다
// 하위 호환성을 위해 여기서 re-export

export type {
  Coordinates,
  WeatherCondition,
  CurrentWeatherResponse,
  ForecastItem,
  ForecastResponse,
  WeatherData,
  HourlyForecast,
} from "./schemas/weather.schemas";

// 앱 전용 에러 타입 (스키마에 없는 타입)
export interface WeatherError {
  message: string;
  code?: number;
}
