'use client';

import { useQuery } from '@tanstack/react-query';
import type { Coordinates } from '../weather.types';

interface GeocodingResponse {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

interface UseGeocodingOptions {
  enabled?: boolean;
}

export function useGeocoding(
  locationName: string | null,
  options?: UseGeocodingOptions
) {
  return useQuery<Coordinates, Error>({
    queryKey: ['geocoding', locationName],
    queryFn: async () => {
      if (!locationName) {
        throw new Error('위치 이름이 제공되지 않았습니다');
      }

      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('API 키가 설정되지 않았습니다');
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('위치 정보를 가져올 수 없습니다');
      }

      const data = (await response.json()) as GeocodingResponse[];

      if (!data || data.length === 0) {
        throw new Error('해당 장소의 정보가 제공되지 않습니다.');
      }

      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    },
    enabled: options?.enabled !== false && locationName !== null && locationName.trim() !== '',
    staleTime: 10 * 60 * 1000, // 10분 (좌표는 자주 변하지 않음)
  });
}

