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

export async function getCurrentWeatherByCity(
  cityName: string
): Promise<CurrentWeatherResponse> {
  return fetchWeatherAPI<CurrentWeatherResponse>(
    "/weather",
    {
      q: cityName,
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

export async function getForecastByCity(
  cityName: string
): Promise<ForecastResponse> {
  return fetchWeatherAPI<ForecastResponse>(
    "/forecast",
    {
      q: cityName,
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
    hourlyForecast: formatHourlyForecast(forecast),
  };

  // 최종 데이터 검증
  return WeatherDataSchema.parse(weatherData);
}

export async function getWeatherDataByLocationName(
  locationName: string
): Promise<WeatherData> {
  // 한국 지역명을 영문 또는 좌표로 변환하여 검색
  // OpenWeatherMap은 한글 도시명 검색이 제한적이므로 Geocoding API 사용
  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    locationName
  )},KR&limit=1&appid=${API_KEY}`;

  const geoResponse = await fetch(geocodingUrl);
  if (!geoResponse.ok) {
    throw new Error("해당 장소의 정보가 제공되지 않습니다.");
  }

  const geoData = await geoResponse.json();
  if (!geoData || geoData.length === 0) {
    throw new Error("해당 장소의 정보가 제공되지 않습니다.");
  }

  const { lat, lon } = geoData[0];
  return getWeatherData({ lat, lon });
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
