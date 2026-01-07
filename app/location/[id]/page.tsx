'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WeatherDisplay } from '@widgets/weather-display';
import { parseLocationName, getLocationForWeatherSearch } from '@shared/lib/korea-districts';
import { useGeocoding } from '@shared/api/hooks/useGeocoding';
import { useFavorites } from '@features/favorites';

interface LocationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = use(params);
  const locationFullName = decodeURIComponent(resolvedParams.id);
  const parsedLocation = parseLocationName(locationFullName);
  const searchQuery = getLocationForWeatherSearch(parsedLocation);

  const { isFavoriteLocation } = useFavorites();
  const isFavorite = isFavoriteLocation(locationFullName);

  const {
    data: coordinates,
    isPending: isLoading,
    error: queryError,
  } = useGeocoding(searchQuery);

  const error = queryError?.message || null;

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <header className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              홈으로
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {parsedLocation.displayName}
            </h1>
            {isFavorite && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <svg
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  즐겨찾기
                </span>
              </div>
            )}
          </div>
          {parsedLocation.district && (
            <p className="text-muted-foreground mt-1">
              {parsedLocation.city}
              {parsedLocation.dong && ` ${parsedLocation.district}`}
            </p>
          )}
        </header>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">날씨 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="rounded-full bg-destructive/10 p-4 inline-block mb-4">
              <svg
                className="h-8 w-8 text-destructive"
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
            <p className="text-destructive font-medium text-lg">{error}</p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                다른 장소 검색하기
              </Button>
            </Link>
          </div>
        )}

        {/* 날씨 정보 */}
        {coordinates && !isLoading && !error && (
          <WeatherDisplay
            coordinates={coordinates}
            locationName={parsedLocation.displayName}
            locationFullName={locationFullName}
            showFavoriteButton
          />
        )}
      </div>
    </div>
  );
}

