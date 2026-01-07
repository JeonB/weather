'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@shared/lib/cn';
import { getWeatherIconUrl } from '@shared/api/weather';
import { useWeatherData } from '@shared/api/hooks/useWeatherData';
import type { FavoriteLocation } from '@shared/lib/storage';
import { EditFavoriteDialog } from './EditFavoriteDialog';

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  onRemove: (id: string) => void;
  onUpdateAlias: (id: string, alias: string | null) => void;
  className?: string;
}

export default function FavoriteCard({
  favorite,
  onRemove,
  onUpdateAlias,
  className,
}: FavoriteCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: weather,
    isPending: isLoading,
    error: queryError,
  } = useWeatherData(favorite.coordinates, {
    enabled: favorite.coordinates !== null,
  });

  const error = favorite.coordinates
    ? queryError?.message || null
    : '좌표 정보가 없습니다';

  const displayName = favorite.alias || favorite.displayName;
  const locationId = encodeURIComponent(favorite.fullName);

  if (isLoading && favorite.coordinates) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('overflow-hidden group relative', className)}>
        <Link href={`/location/${locationId}`} className="block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm truncate pr-2">{displayName}</h3>
            </div>

            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : weather ? (
              <div className="flex items-center gap-3">
                <Image
                  src={getWeatherIconUrl(weather.current.icon)}
                  alt={weather.current.description}
                  width={48}
                  height={48}
                  className="shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{weather.current.temp}°</span>
                  <span className="text-xs text-muted-foreground">
                    {weather.current.tempMin}° / {weather.current.tempMax}°
                  </span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Link>

        {/* 액션 버튼들 */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onRemove(favorite.id);
            }}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </Card>

      <EditFavoriteDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        favorite={favorite}
        onSave={(alias) => {
          onUpdateAlias(favorite.id, alias);
          setIsEditOpen(false);
        }}
      />
    </>
  );
}

