"use client";

import { useSyncExternalStore } from "react";
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

interface FavoritesSnapshot {
  favorites: FavoriteLocation[];
  canAddMore: boolean;
}

const listeners = new Set<() => void>();
const defaultSnapshot: FavoritesSnapshot = { favorites: [], canAddMore: true };
let cachedSnapshot: FavoritesSnapshot = defaultSnapshot;

function safeGetFavorites(): FavoriteLocation[] {
  if (typeof window === "undefined") return [];
  return getFavorites();
}

function computeSnapshot(): FavoritesSnapshot {
  return {
    favorites: safeGetFavorites(),
    canAddMore: typeof window === "undefined" ? true : canAddMoreFavorites(),
  };
}

function areSnapshotsEqual(
  a: FavoritesSnapshot,
  b: FavoritesSnapshot
): boolean {
  if (a.canAddMore !== b.canAddMore) return false;
  if (a.favorites.length !== b.favorites.length) return false;
  for (let i = 0; i < a.favorites.length; i += 1) {
    const prev = a.favorites[i];
    const next = b.favorites[i];
    if (
      prev.id !== next.id ||
      prev.fullName !== next.fullName ||
      prev.displayName !== next.displayName ||
      prev.alias !== next.alias ||
      prev.coordinates?.lat !== next.coordinates?.lat ||
      prev.coordinates?.lon !== next.coordinates?.lon
    ) {
      return false;
    }
  }
  return true;
}

function updateCachedSnapshot(): FavoritesSnapshot {
  const nextSnapshot = computeSnapshot();
  if (!areSnapshotsEqual(cachedSnapshot, nextSnapshot)) {
    cachedSnapshot = nextSnapshot;
  }
  return cachedSnapshot;
}

function getSnapshot(): FavoritesSnapshot {
  if (typeof window === "undefined") {
    return cachedSnapshot;
  }
  return updateCachedSnapshot();
}

function getServerSnapshot(): FavoritesSnapshot {
  return defaultSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  updateCachedSnapshot();
  listeners.forEach((listener) => listener());
}

export function useFavorites(): UseFavoritesReturn {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => typeof window !== "undefined",
    () => false
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    () => (isHydrated ? getSnapshot() : defaultSnapshot),
    getServerSnapshot
  );

  function refresh() {
    emit();
  }

  function addToFavorites(
    fullName: string,
    displayName: string,
    coordinates: Coordinates | null = null
  ): boolean {
    const result = addFavorite(fullName, displayName, coordinates);
    if (result) {
      emit();
      return true;
    }
    return false;
  }

  function removeFromFavorites(id: string): boolean {
    const result = removeFavorite(id);
    if (result) {
      emit();
      return true;
    }
    return false;
  }

  function updateAlias(id: string, alias: string | null): boolean {
    const result = updateFavoriteAlias(id, alias);
    if (result) {
      emit();
      return true;
    }
    return false;
  }

  function updateCoordinates(id: string, coordinates: Coordinates): boolean {
    const result = updateFavoriteCoordinates(id, coordinates);
    if (result) {
      emit();
      return true;
    }
    return false;
  }

  function isFavoriteLocation(fullName: string): boolean {
    return isFavorite(fullName);
  }

  return {
    favorites: snapshot.favorites,
    addToFavorites,
    removeFromFavorites,
    updateAlias,
    updateCoordinates,
    isFavoriteLocation,
    canAddMore: snapshot.canAddMore,
    refresh,
  };
}
