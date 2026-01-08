"use client";

import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "@shared/lib/location-utils";
import type { Coordinates } from "@shared/api/weather.types";

interface UseReverseGeocodingOptions {
  enabled?: boolean;
}

export function useReverseGeocoding(
  coordinates: Coordinates | null,
  options?: UseReverseGeocodingOptions
) {
  return useQuery<string | null, Error>({
    queryKey: ["reverseGeocoding", coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (!coordinates) {
        return null;
      }
      return reverseGeocode(coordinates);
    },
    enabled:
      options?.enabled !== false &&
      coordinates !== null,
    staleTime: 60 * 60 * 1000, // 1시간 (위치명은 자주 변하지 않음)
  });
}

