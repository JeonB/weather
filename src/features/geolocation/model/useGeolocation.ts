"use client";

import { useEffect, useRef, useState } from "react";
import type { Coordinates } from "@shared/api/weather.types";

interface GeolocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
}

export function useGeolocation(autoRequest = true): UseGeolocationReturn {
  const hasAutoRequestedRef = useRef(false);
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    isSupported: false,
  });

  useEffect(() => {
    const isSupported =
      typeof navigator !== "undefined" && "geolocation" in navigator;
    setState((prev) => ({
      ...prev,
      isSupported,
      error: isSupported
        ? null
        : "이 브라우저는 위치 정보를 지원하지 않습니다.",
    }));
  }, []);

  function requestLocation() {
    if (state.isLoading || !state.isSupported) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 좌표를 소수점 4자리로 반올림하여 미세한 변화 무시 (약 11m 정확도)
        const roundedLat = Math.round(position.coords.latitude * 10000) / 10000;
        const roundedLon =
          Math.round(position.coords.longitude * 10000) / 10000;
        setState({
          coordinates: {
            lat: roundedLat,
            lon: roundedLon,
          },
          isLoading: false,
          error: null,
          isSupported: true,
        });
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5분간 캐시
      }
    );
  }

  // 자동 요청
  useEffect(() => {
    if (
      autoRequest &&
      state.isSupported &&
      !state.coordinates &&
      !state.isLoading &&
      !hasAutoRequestedRef.current
    ) {
      hasAutoRequestedRef.current = true;
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRequest, state.isSupported, state.coordinates, state.isLoading]);

  return {
    ...state,
    requestLocation,
  };
}
