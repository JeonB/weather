"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@shared/lib/cn";
import WeatherIcon from "@shared/ui/WeatherIcon";
import { useWeatherData } from "@shared/api/hooks/useWeatherData";
import type { FavoriteLocation } from "@shared/lib/storage";
import { EditFavoriteDialog } from "./EditFavoriteDialog";

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
    locationName: favorite.displayName,
  });

  const error = favorite.coordinates
    ? queryError?.message || null
    : "좌표 정보가 없습니다";

  const displayName = favorite.alias || favorite.displayName;
  const secondaryName =
    favorite.alias && favorite.alias.length > 0 ? favorite.displayName : null;
  const locationId = encodeURIComponent(favorite.fullName);

  if (isLoading && favorite.coordinates) {
    return (
      <Card className={cn("overflow-hidden", className)}>
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="h-full group"
      >
        <Card
          className={cn(
            "overflow-hidden relative h-full flex flex-col",
            className
          )}
        >
          <Link
            href={`/location/${locationId}`}
            className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg flex-1"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-center mb-3">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center justify-center">
                    <h3 className="font-semibold text-sm truncate">
                      {displayName}
                    </h3>
                  </div>
                  {secondaryName && (
                    <p className="text-xs text-muted-foreground truncate">
                      {secondaryName}
                    </p>
                  )}
                </div>
              </div>

              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : weather ? (
                <motion.div
                  className="flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <WeatherIcon
                    iconCode={weather.current.icon}
                    size={48}
                    className="shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold leading-tight">
                      {weather.current.temp}°
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {weather.current.tempMin}° / {weather.current.tempMax}°
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      체감 {weather.current.feelsLike}°
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </CardContent>
          </Link>

          {/* 우측 상단 버튼들 */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {/* 데스크톱: 수정/삭제 모두 호버 시 표시 */}
            <div className="hidden lg:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* 모바일: 삭제 버튼만 항상 표시 */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-7 w-7 text-destructive hover:text-destructive"
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

          {/* 모바일: 하단 수정 버튼 */}
          <div className="lg:hidden border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full h-10 rounded-none text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                setIsEditOpen(true);
              }}
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              장소 별칭 수정
            </Button>
          </div>
        </Card>
      </motion.div>

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
