'use client';

import { useState } from 'react';
import { searchLocations, type ParsedLocation } from '@shared/lib/korea-districts';

interface UseLocationSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: ParsedLocation[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectLocation: (location: ParsedLocation) => void;
  selectedLocation: ParsedLocation | null;
  clearSelection: () => void;
}

export function useLocationSearch(
  onSelect?: (location: ParsedLocation) => void
): UseLocationSearchReturn {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ParsedLocation | null>(null);

  const results = query.trim().length === 0 ? [] : searchLocations(query, 20);

  function selectLocation(location: ParsedLocation) {
    setSelectedLocation(location);
    setQuery(location.displayName);
    setIsOpen(false);
    onSelect?.(location);
  }

  function clearSelection() {
    setSelectedLocation(null);
    setQuery('');
    setIsOpen(false);
  }

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    selectLocation,
    selectedLocation,
    clearSelection,
  };
}

