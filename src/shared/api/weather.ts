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
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 오늘 0시부터 24시까지의 데이터만 필터링
  const todayItems = forecastResponse.list.filter((item) => {
    const itemDate = new Date(item.dt * 1000);
    return itemDate >= today && itemDate < tomorrow;
  });

  // 0시, 3시, 6시, 9시, 12시, 15시, 18시, 21시만 추출 (3시간 간격)
  const hourlySlots = [0, 3, 6, 9, 12, 15, 18, 21];
  const result: HourlyForecast[] = [];

  for (const hour of hourlySlots) {
    const targetTime = new Date(today);
    targetTime.setHours(hour, 0, 0, 0);

    // 해당 시간에 가장 가까운 항목 찾기 (30분 이내)
    const closest = todayItems.reduce((prev, curr) => {
      const currTime = new Date(curr.dt * 1000);
      const prevDiff = Math.abs(prev.dt * 1000 - targetTime.getTime());
      const currDiff = Math.abs(currTime.getTime() - targetTime.getTime());
      return currDiff < prevDiff && currDiff <= 30 * 60 * 1000 ? curr : prev;
    }, todayItems[0]);

    if (closest) {
      const itemTime = new Date(closest.dt * 1000);
      const diff = Math.abs(itemTime.getTime() - targetTime.getTime());
      if (diff <= 30 * 60 * 1000) {
        result.push({
          time: targetTime.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          temp: Math.round(closest.main.temp),
          icon: closest.weather[0]?.icon || "01d",
          description: closest.weather[0]?.description || "",
        });
      }
    }
  }

  return result;
}

export async function getWeatherData(
  coordinates: Coordinates,
  locationName?: string
): Promise<WeatherData> {
  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeatherByCoords(coordinates.lat, coordinates.lon),
    getForecastByCoords(coordinates.lat, coordinates.lon),
  ]);

  // locationName이 제공되지 않으면 reverse geocoding으로 한국 지역명 찾기
  let displayLocationName = locationName || currentWeather.name;

  if (!locationName && API_KEY) {
    try {
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&limit=1&appid=${API_KEY}`;
      const reverseGeoResponse = await fetch(reverseGeoUrl);

      if (reverseGeoResponse.ok) {
        const reverseGeoData = (await reverseGeoResponse.json()) as Array<{
          name: string;
          local_names?: Record<string, string>;
        }>;

        if (reverseGeoData && reverseGeoData.length > 0) {
          // 한국어 이름이 있으면 사용, 없으면 영문 이름 사용
          const koreanName = reverseGeoData[0].local_names?.ko;
          if (koreanName) {
            displayLocationName = koreanName;
          } else {
            // local_names에 ko가 없으면 name 사용 (이미 영문일 수 있음)
            displayLocationName = reverseGeoData[0].name;
          }
        }
      }
    } catch (error) {
      // reverse geocoding 실패 시 원래 이름 사용
      console.warn("Reverse geocoding failed, using API name:", error);
    }
  }

  const weatherData = {
    location: displayLocationName,
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
