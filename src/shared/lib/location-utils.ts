import type { Coordinates } from "@shared/api/weather.types";

/**
 * 좌표를 역지오코딩하여 한국 지역명을 가져옵니다
 */
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const location = data[0];

    // 한국 지역인 경우 한글 지역명 우선 사용
    if (location.country === "KR") {
      // state가 있으면 (시/도) state, city가 있으면 city, 없으면 name 사용
      if (location.state) {
        return location.state;
      }
      if (location.local_names?.ko) {
        return location.local_names.ko;
      }
      if (location.name) {
        return location.name;
      }
    }

    // 한국이 아니면 name 사용
    return location.name || null;
  } catch {
    return null;
  }
}

