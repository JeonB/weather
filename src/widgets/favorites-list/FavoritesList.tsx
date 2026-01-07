'use client';

import { FavoriteCard, useFavorites } from '@features/favorites';
import { cn } from '@shared/lib/cn';
import { MAX_FAVORITES } from '@shared/lib/storage';

interface FavoritesListProps {
  className?: string;
}

export default function FavoritesList({ className }: FavoritesListProps) {
  const { favorites, removeFromFavorites, updateAlias } = useFavorites();

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">즐겨찾기</h2>
        <span className="text-sm text-muted-foreground">
          {favorites.length}/{MAX_FAVORITES}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/30">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
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
          </div>
          <h3 className="font-medium text-foreground mb-1">즐겨찾기가 비어있습니다</h3>
          <p className="text-sm text-muted-foreground">
            장소를 검색하고 즐겨찾기에 추가해보세요
          </p>
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onRemove={removeFromFavorites}
              onUpdateAlias={updateAlias}
            />
          ))}
        </div>
      )}
    </div>
  );
}

