"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteAlias,
  updateFavoriteCoordinates,
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

function getInitialFavorites(): FavoriteLocation[] {
  if (typeof window === "undefined") return [];
  return getFavorites();
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] =
    useState<FavoriteLocation[]>(getInitialFavorites);
  const [canAddMore, setCanAddMore] = useState(() => {
    if (typeof window === "undefined") return true;
    return canAddMoreFavorites();
  });

  const loadFavorites = useCallback(() => {
    if (typeof window === "undefined") return;
    const loaded = getFavorites();
    setFavorites(loaded);
    setCanAddMore(canAddMoreFavorites());
  }, []);

  useEffect(() => {
    // localStorage 변경 감지 (다른 탭에서 변경된 경우)
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "weather-app-favorites") {
        loadFavorites();
      }
    }

    // 동일 탭 내 변경 감지 (커스텀 이벤트)
    function handleCustomChange() {
      loadFavorites();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "favorites-changed",
      handleCustomChange as EventListener
    );
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "favorites-changed",
        handleCustomChange as EventListener
      );
    };
  }, [loadFavorites]);

  const refresh = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addToFavorites = useCallback(
    (
      fullName: string,
      displayName: string,
      coordinates: Coordinates | null = null
    ): boolean => {
      const result = addFavorite(fullName, displayName, coordinates);
      if (result) {
        loadFavorites();
        return true;
      }
      return false;
    },
    [loadFavorites]
  );

  const removeFromFavorites = useCallback(
    (id: string): boolean => {
      const result = removeFavorite(id);
      if (result) {
        loadFavorites();
        return true;
      }
      return false;
    },
    [loadFavorites]
  );

  const updateAlias = useCallback(
    (id: string, alias: string | null): boolean => {
      const result = updateFavoriteAlias(id, alias);
      if (result) {
        loadFavorites();
        return true;
      }
      return false;
    },
    [loadFavorites]
  );

  const updateCoordinates = useCallback(
    (id: string, coordinates: Coordinates): boolean => {
      const result = updateFavoriteCoordinates(id, coordinates);
      if (result) {
        loadFavorites();
        return true;
      }
      return false;
    },
    [loadFavorites]
  );

  const isFavoriteLocation = useCallback(
    (fullName: string): boolean => {
      return favorites.some((f) => f.fullName === fullName);
    },
    [favorites]
  );

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
