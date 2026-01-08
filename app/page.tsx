"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { SearchBar } from "@widgets/search-bar";
import { FavoritesList } from "@widgets/favorites-list";
import { WeatherDisplay } from "@widgets/weather-display";
import { useGeolocation } from "@features/geolocation";
import { useReverseGeocoding } from "@shared/api/hooks/useReverseGeocoding";
import type { ParsedLocation } from "@shared/lib/korea-districts";

export default function HomePage() {
  const router = useRouter();

  const {
    coordinates: geoCoordinates,
    isLoading: geoLoading,
    error: geoError,
  } = useGeolocation();

  // 좌표에서 지역명 가져오기 (Nominatim API 사용)
  const { data: locationName } = useReverseGeocoding(geoCoordinates, {
    enabled: !!geoCoordinates && !geoLoading,
  });
  function handleSelectLocation(location: ParsedLocation) {
    const encodedLocation = encodeURIComponent(location.fullName);
    router.push(`/location/${encodedLocation}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* 헤더 */}
        <motion.header
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            🌤️ 날씨 앱
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            대한민국 지역의 날씨를 확인하세요
          </p>
        </motion.header>

        {/* 검색 섹션 */}
        <motion.section
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SearchBar
            onSelectLocation={handleSelectLocation}
            className="max-w-xl mx-auto"
          />
        </motion.section>

        <div className="space-y-5">
          {/* 현재 위치 날씨 */}
          {geoLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">
                현재 위치를 확인하는 중...
              </p>
            </div>
          ) : geoError && !geoCoordinates ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">{geoError}</p>
              <p className="text-sm text-muted-foreground">
                장소를 검색하여 날씨를 확인하세요
              </p>
            </div>
          ) : geoCoordinates ? (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <WeatherDisplay
                coordinates={geoCoordinates}
                locationName={locationName || "현재 위치"}
                showFavoriteButton={false}
              />
            </motion.section>
          ) : null}

          {/* 즐겨찾기 섹션 */}
          <motion.section
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <FavoritesList />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
