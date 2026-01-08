import { z } from "zod";
import {
  OpenMeteoResponseSchema,
  type OpenMeteoResponse,
} from "./schemas/open-meteo.schemas";
import {
  WeatherDataSchema,
  type WeatherData,
  type HourlyForecast,
  type Coordinates,
} from "./schemas/weather.schemas";
import {
  mapWeatherCodeToIcon,
  mapWeatherCodeToDescription,
} from "@shared/utils/weather-code-mapper";

const API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Open-Meteo API 호출
 * @param lat 위도
 * @param lon 경도
 * @returns Open-Meteo API 응답
 */
async function fetchOpenMeteoAPI(
  lat: number,
  lon: number
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: "temperature_2m,weathercode,relativehumidity_2m,windspeed_10m",
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    past_days: "1", // 어제부터 데이터 확보 (오늘 0시 이후 포함)
  });

  const response = await fetch(`${API_BASE_URL}?${params}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("해당 장소의 날씨 정보를 찾을 수 없습니다.");
    }
    throw new Error(
      `날씨 정보를 가져오는데 실패했습니다. (${response.status})`
    );
  }

  const data = await response.json();

  // 스키마 검증
  try {
    return OpenMeteoResponseSchema.parse(data);
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

/**
 * 시간대별 예보 데이터 포맷
 * @param data Open-Meteo API 응답
 * @returns 시간대별 예보 배열
 */
function formatHourlyForecast(data: OpenMeteoResponse): HourlyForecast[] {
  const now = new Date();

  // 현재 시각 이후의 항목만 필터링
  const futureHours = data.hourly.time
    .map((time, index) => {
      const itemDate = new Date(time);
      return {
        time: itemDate,
        temp: data.hourly.temperature_2m[index],
        weathercode: data.hourly.weathercode[index],
      };
    })
    .filter((item) => item.time >= now)
    .slice(0, 8); // 8개 슬롯

  // 야간 여부 판단 (18시~6시)
  const isNight = (date: Date) => {
    const hour = date.getHours();
    return hour >= 18 || hour < 6;
  };

  return futureHours.map((item) => ({
    time: item.time.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    temp: Math.round(item.temp),
    icon: mapWeatherCodeToIcon(item.weathercode, isNight(item.time)),
    description: mapWeatherCodeToDescription(item.weathercode),
  }));
}

/**
 * 날씨 데이터 조회
 * @param coordinates 좌표
 * @param locationName 위치 이름 (선택사항, Open-Meteo는 위치 이름을 제공하지 않음)
 * @returns 날씨 데이터
 */
export async function getWeatherData(
  coordinates: Coordinates,
  locationName?: string
): Promise<WeatherData> {
  const data = await fetchOpenMeteoAPI(coordinates.lat, coordinates.lon);

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. 오늘 날짜의 최저/최고 기온 (Daily 데이터 우선)
  const todayDateString = today.toISOString().split("T")[0];
  const todayIndex = data.daily.time.findIndex((t) => t === todayDateString);

  let tempMin: number;
  let tempMax: number;

  if (todayIndex !== -1) {
    // Daily 데이터에서 오늘 날짜의 최저/최고 기온 사용
    tempMin = data.daily.temperature_2m_min[todayIndex];
    tempMax = data.daily.temperature_2m_max[todayIndex];
  } else {
    // Daily 데이터가 없는 경우 Hourly 데이터에서 계산
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayHourlyTemps = data.hourly.time
      .map((time, index) => ({
        time: new Date(time),
        temp: data.hourly.temperature_2m[index],
      }))
      .filter((item) => item.time >= today && item.time < tomorrow)
      .map((item) => item.temp);

    if (todayHourlyTemps.length > 0) {
      tempMin = Math.min(...todayHourlyTemps);
      tempMax = Math.max(...todayHourlyTemps);
    } else {
      // Fallback: 현재 온도 사용
      const currentIndex = data.hourly.time.findIndex(
        (t) => new Date(t) >= now
      );
      const currentTemp = data.hourly.temperature_2m[currentIndex] || 0;
      tempMin = currentTemp;
      tempMax = currentTemp;
    }
  }

  // 2. 현재 날씨 정보
  const currentIndex = data.hourly.time.findIndex((t) => new Date(t) >= now);
  const currentTemp = data.hourly.temperature_2m[currentIndex] || 0;
  const currentWeatherCode = data.hourly.weathercode[currentIndex] || 0;
  const currentHumidity = data.hourly.relativehumidity_2m[currentIndex] || 0;
  const currentWindSpeed = data.hourly.windspeed_10m[currentIndex] || 0;

  // 야간 여부 판단
  const currentHour = now.getHours();
  const isCurrentNight = currentHour >= 18 || currentHour < 6;

  // 3. 시간대별 예보
  const hourlyForecast = formatHourlyForecast(data);

  // 4. location name은 외부에서 제공받거나 좌표로 표시
  const finalLocationName =
    locationName ||
    `${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}`;

  const weatherData: WeatherData = {
    location: finalLocationName,
    coordinates: {
      lat: data.latitude,
      lon: data.longitude,
    },
    current: {
      temp: Math.round(currentTemp),
      feelsLike: Math.round(currentTemp), // Open-Meteo는 체감온도 미제공
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      humidity: Math.round(currentHumidity),
      description: mapWeatherCodeToDescription(currentWeatherCode),
      icon: mapWeatherCodeToIcon(currentWeatherCode, isCurrentNight),
      windSpeed: currentWindSpeed,
    },
    hourlyForecast,
  };

  // 최종 데이터 검증
  return WeatherDataSchema.parse(weatherData);
}
