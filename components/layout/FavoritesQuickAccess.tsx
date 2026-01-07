'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@features/favorites';
import { cn } from '@shared/lib/cn';

export default function FavoritesQuickAccess() {
  const { favorites } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-primary hover:bg-primary/90"
          aria-label="즐겨찾기 빠른 접근"
        >
          <svg
            className="h-6 w-6 fill-yellow-400 text-yellow-400"
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
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-16 right-0 w-64 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm">즐겨찾기</h3>
              </div>
              <div className="p-2">
                {favorites.map((favorite) => {
                  const locationId = encodeURIComponent(favorite.fullName);
                  const displayName = favorite.alias || favorite.displayName;
                  return (
                    <Link
                      key={favorite.id}
                      href={`/location/${locationId}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                        <span className="truncate">{displayName}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

