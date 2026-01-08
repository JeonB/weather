import type { Coordinates } from "@shared/api/weather.types";

/**
 * Nominatim (OpenStreetMap) API를 사용한 역지오코딩
 * 무료, API 키 불필요
 * https://nominatim.org/release-docs/develop/api/Reverse/
 */
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<string | null> {
  try {
    // Nominatim API 호출 (무료, API 키 불필요)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&format=json&addressdetails=1&accept-language=ko`,
      {
        headers: {
          "User-Agent": "WeatherApp/1.0", // Nominatim은 User-Agent 필수
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || !data.address) {
      return null;
    }

    const address = data.address;

    if (address.suburb) {
      return address.city + " " + address.borough + " " + address.suburb;
    }
    if (address.borough) {
      return address.city + " " + address.borough;
    }
    if (address.city) {
      return address.city;
    }

    return address.city || null;
  } catch {
    return null;
  }
}
