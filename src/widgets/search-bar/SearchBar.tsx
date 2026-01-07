"use client";

import { LocationSearchInput } from "@features/location-search";
import type { ParsedLocation } from "@shared/lib/korea-districts";
import { cn } from "@shared/lib/cn";

interface SearchBarProps {
  onSelectLocation: (location: ParsedLocation) => void;
  className?: string;
}

export default function SearchBar({
  onSelectLocation,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <LocationSearchInput
        onSelect={onSelectLocation}
        placeholder="장소를 검색하세요 (예: 서울, 종로구, 청운동)"
      />
    </div>
  );
}
