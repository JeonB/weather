"use client";

import { motion } from "motion/react";
import { WeatherDisplay } from "@widgets/weather-display";
import { useGeolocation } from "@features/geolocation";

export default function CurrentLocationWeather() {
  const {
    coordinates: geoCoordinates,
    isLoading: geoLoading,
    error: geoError,
  } = useGeolocation();

  if (geoLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">현재 위치를 확인하는 중...</p>
      </div>
    );
  }

  if (geoError && !geoCoordinates) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">{geoError}</p>
        <p className="text-sm text-muted-foreground">
          장소를 검색하여 날씨를 확인하세요
        </p>
      </div>
    );
  }

  if (!geoCoordinates) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <WeatherDisplay coordinates={geoCoordinates} showFavoriteButton={false} />
    </motion.section>
  );
}
