"use client";

import { useState, useEffect } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteAlias,
  updateFavoriteCoordinates,
  isFavorite,
  canAddMoreFavorites,
  type FavoriteLocation,
} from "@shared/lib/storage";
import type { Coordinates } from "@shared/api/weather.types";

interface UseFavoritesReturn {
  favorites: FavoriteLocation[];
  addToFavorites: (
    fullName: string,
    displayName: string,
    coordinates?: Coordinates | null
  ) => boolean;
  removeFromFavorites: (id: string) => boolean;
  updateAlias: (id: string, alias: string | null) => boolean;
  updateCoordinates: (id: string, coordinates: Coordinates) => boolean;
  isFavoriteLocation: (fullName: string) => boolean;
  canAddMore: boolean;
  refresh: () => void;
}

export function useFavorites(): UseFavoritesReturn {
  // 서버/클라이언트 하이드레이션 일치를 위해 초기값은 빈 배열
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [canAddMore, setCanAddMore] = useState(true);

  // 클라이언트에서만 localStorage에서 데이터 로드
  // localStorage는 브라우저 API이므로 클라이언트에서만 접근 가능
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(getFavorites());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanAddMore(canAddMoreFavorites());
  }, []);

  function refresh() {
    setFavorites(getFavorites());
    setCanAddMore(canAddMoreFavorites());
  }

  function addToFavorites(
    fullName: string,
    displayName: string,
    coordinates: Coordinates | null = null
  ): boolean {
    const result = addFavorite(fullName, displayName, coordinates);
    if (result) {
      refresh();
      return true;
    }
    return false;
  }

  function removeFromFavorites(id: string): boolean {
    const result = removeFavorite(id);
    if (result) {
      refresh();
      return true;
    }
    return false;
  }

  function updateAlias(id: string, alias: string | null): boolean {
    const result = updateFavoriteAlias(id, alias);
    if (result) {
      refresh();
      return true;
    }
    return false;
  }

  function updateCoordinates(id: string, coordinates: Coordinates): boolean {
    const result = updateFavoriteCoordinates(id, coordinates);
    if (result) {
      refresh();
      return true;
    }
    return false;
  }

  function isFavoriteLocation(fullName: string): boolean {
    return isFavorite(fullName);
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    updateAlias,
    updateCoordinates,
    isFavoriteLocation,
    canAddMore,
    refresh,
  };
}
