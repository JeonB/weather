"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@widgets/search-bar";
import { FavoritesList } from "@widgets/favorites-list";
import { WeatherDisplay } from "@widgets/weather-display";
import { useGeolocation } from "@features/geolocation";
import type { ParsedLocation } from "@shared/lib/korea-districts";

export default function HomePage() {
  const router = useRouter();
  const {
    coordinates: geoCoordinates,
    isLoading: geoLoading,
    error: geoError,
  } = useGeolocation();

  function handleSelectLocation(location: ParsedLocation) {
    // 상세 페이지로 이동
    const encodedLocation = encodeURIComponent(location.fullName);
    router.push(`/location/${encodedLocation}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* 헤더 */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            🌤️ 날씨 앱
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            대한민국 지역의 날씨를 확인하세요
          </p>
        </header>

        {/* 검색바 */}
        <section className="mb-6 sm:mb-8">
          <SearchBar
            onSelectLocation={handleSelectLocation}
            className="max-w-xl mx-auto"
          />
        </section>

        {/* 현재 위치 날씨 */}
        <section className="mb-6 sm:mb-8">
          {geoLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">
                현재 위치를 확인하는 중...
              </p>
            </div>
          )}

          {geoError && !geoCoordinates && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">{geoError}</p>
              <p className="text-sm text-muted-foreground">
                장소를 검색하여 날씨를 확인하세요
              </p>
            </div>
          )}

          {geoCoordinates && (
            <WeatherDisplay
              coordinates={geoCoordinates}
              showFavoriteButton={false}
            />
          )}
        </section>

        {/* 즐겨찾기 */}
        <section className="mb-6 sm:mb-8">
          <FavoritesList />
        </section>
      </div>
    </div>
  );
}
