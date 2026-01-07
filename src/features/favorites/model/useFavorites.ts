'use client';

import { useState, useEffect } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteAlias,
  updateFavoriteCoordinates,
  isFavorite,
  canAddMoreFavorites,
  type FavoriteLocation,
} from '@shared/lib/storage';
import type { Coordinates } from '@shared/api/weather.types';

interface UseFavoritesReturn {
  favorites: FavoriteLocation[];
  addToFavorites: (fullName: string, displayName: string, coordinates?: Coordinates | null) => boolean;
  removeFromFavorites: (id: string) => boolean;
  updateAlias: (id: string, alias: string | null) => boolean;
  updateCoordinates: (id: string, coordinates: Coordinates) => boolean;
  isFavoriteLocation: (fullName: string) => boolean;
  canAddMore: boolean;
  refresh: () => void;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [canAddMore, setCanAddMore] = useState(true);

  function refresh() {
    setFavorites(getFavorites());
    setCanAddMore(canAddMoreFavorites());
  }

  useEffect(() => {
    refresh();
  }, []);

  function addToFavorites(fullName: string, displayName: string, coordinates: Coordinates | null = null): boolean {
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

