"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherCard, HourlyForecast } from "@entities/weather";
import { AddFavoriteButton, useFavorites } from "@features/favorites";
import { useWeatherData } from "@shared/api/hooks/useWeatherData";
import type { Coordinates } from "@shared/api/weather.types";
import { cn } from "@shared/lib/cn";

interface WeatherDisplayProps {
  coordinates: Coordinates | null;
  locationName?: string;
  locationFullName?: string;
  showFavoriteButton?: boolean;
  className?: string;
}

export default function WeatherDisplay({
  coordinates,
  locationName,
  locationFullName,
  showFavoriteButton = false,
  className,
}: WeatherDisplayProps) {
  const {
    data: weather,
    isPending: isLoading,
    error: queryError,
  } = useWeatherData(coordinates, { locationName });

  const {
    addToFavorites,
    removeFromFavorites,
    isFavoriteLocation,
    canAddMore,
    favorites,
  } = useFavorites();

  const displayLocationName =
    locationName ||
    weather?.location ||
    (coordinates ? "위치 확인 중..." : "위치를 선택해주세요");
  const fullName = locationFullName || displayLocationName;
  const isFavorite = isFavoriteLocation(fullName);
  const favoriteItem = favorites.find((f) => f.fullName === fullName);

  function handleAddFavorite() {
    if (coordinates) {
      addToFavorites(fullName, displayLocationName, coordinates);
    }
  }

  function handleRemoveFavorite() {
    if (favoriteItem) {
      removeFromFavorites(favoriteItem.id);
    }
  }

  const error = queryError?.message || null;

  if (!coordinates) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">위치를 선택해주세요</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && coordinates) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-40" />
            <div className="w-full mt-4 border-t pt-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="relative w-full">
                <Skeleton className="h-74 w-full rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-destructive font-medium">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className={cn("", className)}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-6">
            {showFavoriteButton && (
              <motion.div
                className="w-full flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AddFavoriteButton
                  isFavorite={isFavorite}
                  canAdd={canAddMore}
                  onAdd={handleAddFavorite}
                  onRemove={handleRemoveFavorite}
                />
              </motion.div>
            )}

            <motion.div
              key={weather.location}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherCard
                location={displayLocationName}
                temp={weather.current.temp}
                tempMin={weather.current.tempMin}
                tempMax={weather.current.tempMax}
                description={weather.current.description}
                icon={weather.current.icon}
                humidity={weather.current.humidity}
                windSpeed={weather.current.windSpeed}
              />
            </motion.div>

            <motion.div
              className="w-full border-t pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <HourlyForecast forecasts={weather.hourlyForecast} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
