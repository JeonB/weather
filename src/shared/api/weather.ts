import { z } from "zod";
import {
  CurrentWeatherResponseSchema,
  ForecastResponseSchema,
  WeatherDataSchema,
  type CurrentWeatherResponse,
  type ForecastResponse,
  type WeatherData,
  type HourlyForecast,
  type Coordinates,
} from "./schemas/weather.schemas";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// 전역 API 호출 카운터 및 throttle 관리
let apiCallCount = 0;
let apiCallWindowStart = Date.now();
const API_CALL_LIMIT = 50; // 1분에 50회로 제한 (안전 마진)
const API_WINDOW_MS = 60000; // 1분

async function fetchWeatherAPI<T>(
  endpoint: string,
  params: Record<string, string>,
  schema?: z.ZodSchema<T>
): Promise<T> {
  // Rate limiting 체크
  const now = Date.now();
  if (now - apiCallWindowStart > API_WINDOW_MS) {
    // 새로운 윈도우 시작
    apiCallCount = 0;
    apiCallWindowStart = now;
  }

  if (apiCallCount >= API_CALL_LIMIT) {
    throw new Error("API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
  }

  apiCallCount++;

  if (!API_KEY) {
    throw new Error("OpenWeatherMap API 키가 설정되지 않았습니다.");
  }

  const searchParams = new URLSearchParams({
    ...params,
    appid: API_KEY,
    units: "metric",
    lang: "kr",
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}?${searchParams}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("해당 장소의 정보가 제공되지 않습니다.");
    }
    if (response.status === 429) {
      // 429 에러 시 카운터를 최대로 설정하여 추가 호출 방지
      apiCallCount = API_CALL_LIMIT;
    }
    throw new Error(
      `날씨 정보를 가져오는데 실패했습니다. (${response.status})`
    );
  }

  const data = await response.json();

  // 스키마가 제공된 경우 검증
  if (schema) {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `API 응답 형식이 올바르지 않습니다: ${error.issues
            .map((issue) => issue.message)
            .join(", ")}`
        );
      }
      throw error;
    }
  }

  return data;
}

export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> {
  return fetchWeatherAPI<CurrentWeatherResponse>(
    "/weather",
    {
      lat: lat.toString(),
      lon: lon.toString(),
    },

    CurrentWeatherResponseSchema
  );
}

export async function getForecastByCoords(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  return fetchWeatherAPI<ForecastResponse>(
    "/forecast",
    {
      lat: lat.toString(),
      lon: lon.toString(),
    },
    ForecastResponseSchema
  );
}

function formatHourlyForecast(
  forecastResponse: ForecastResponse
): HourlyForecast[] {
  const now = new Date();
  // 현재 시각 이후의 항목만 필터링
  const futureItems = forecastResponse.list.filter(
    (item) => item.dt * 1000 >= now.getTime()
  );

  // 3시간 간격 8개 슬롯 선택 (현재 포함, 다음날 포함 가능)
  const slots = futureItems.slice(0, 8);

  return slots.map<HourlyForecast>((item) => {
    const itemDate = new Date(item.dt * 1000);
    return {
      time: itemDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0]?.icon || "01d",
      description: item.weather[0]?.description || "",
    };
  });
}

export async function getWeatherData(
  coordinates: Coordinates
): Promise<WeatherData> {
  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCoords(coordinates.lat, coordinates.lon),
    getForecastByCoords(coordinates.lat, coordinates.lon),
  ]);

  // 24시간 예보 데이터 생성
  const hourlyForecast = formatHourlyForecast(forecast);

  const weatherData = {
    location: currentWeather.name,
    coordinates: {
      lat: currentWeather.coord.lat,
      lon: currentWeather.coord.lon,
    },
    current: {
      temp: Math.round(currentWeather.main.temp),
      feelsLike: Math.round(currentWeather.main.feels_like),
      tempMin: Math.round(currentWeather.main.temp_min),
      tempMax: Math.round(currentWeather.main.temp_max),
      humidity: currentWeather.main.humidity,
      description: currentWeather.weather[0]?.description || "",
      icon: currentWeather.weather[0]?.icon || "01d",
      windSpeed: currentWeather.wind.speed,
    },
    hourlyForecast,
  };

  // 최종 데이터 검증
  return WeatherDataSchema.parse(weatherData);
}
