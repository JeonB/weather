import type { Coordinates } from "@shared/api/weather.types";

export interface FavoriteLocation {
  id: string;
  fullName: string;
  displayName: string;
  alias: string | null;
  coordinates: Coordinates | null;
  createdAt: number;
}

const FAVORITES_KEY = "weather-app-favorites";
const MAX_FAVORITES = 6;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getFavorites(): FavoriteLocation[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as FavoriteLocation[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteLocation[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // 동일 탭에서도 변경 사항을 즉시 반영하기 위한 커스텀 이벤트 발행
    try {
      window.dispatchEvent(new CustomEvent("favorites-changed"));
    } catch {
      // noop
    }
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

export function addFavorite(
  fullName: string,
  displayName: string,
  coordinates: Coordinates | null = null
): FavoriteLocation | null {
  const favorites = getFavorites();

  if (favorites.length >= MAX_FAVORITES) {
    return null;
  }

  // 중복 체크
  if (favorites.some((f) => f.fullName === fullName)) {
    return null;
  }

  const newFavorite: FavoriteLocation = {
    id: crypto.randomUUID(),
    fullName,
    displayName,
    alias: null,
    coordinates,
    createdAt: Date.now(),
  };

  const updated = [...favorites, newFavorite];
  saveFavorites(updated);

  return newFavorite;
}

export function removeFavorite(id: string): boolean {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.id !== id);

  if (filtered.length === favorites.length) {
    return false;
  }

  saveFavorites(filtered);
  return true;
}

export function updateFavoriteAlias(id: string, alias: string | null): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.id === id);

  if (index === -1) {
    return false;
  }

  favorites[index] = { ...favorites[index], alias };
  saveFavorites(favorites);
  return true;
}

export function updateFavoriteCoordinates(
  id: string,
  coordinates: Coordinates
): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.id === id);

  if (index === -1) {
    return false;
  }

  favorites[index] = { ...favorites[index], coordinates };
  saveFavorites(favorites);
  return true;
}

export function canAddMoreFavorites(): boolean {
  return getFavorites().length < MAX_FAVORITES;
}

export { MAX_FAVORITES };
