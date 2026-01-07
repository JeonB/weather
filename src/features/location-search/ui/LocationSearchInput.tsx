"use client";

import { useRef, useEffect, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@shared/lib/cn";
import { useLocationSearch } from "../model/useLocationSearch";
import type { ParsedLocation } from "@shared/lib/korea-districts";

interface LocationSearchInputProps {
  onSelect: (location: ParsedLocation) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationSearchInput({
  onSelect,
  placeholder = "장소를 검색하세요 (예: 서울, 종로구, 청운동)",
  className,
}: LocationSearchInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, results, isOpen, setIsOpen, selectLocation } =
    useLocationSearch(onSelect);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (location: ParsedLocation) => {
    selectLocation(location);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        type="text"
        name="location-search"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => query.trim().length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-lg overflow-hidden">
          <ScrollArea className="max-h-[300px] w-full">
            <ul className="py-1">
              {results.map((location) => (
                <li key={location.fullName}>
                  <button
                    type="button"
                    onClick={() => handleSelect(location)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors"
                  >
                    <span className="font-medium">{location.displayName}</span>
                    {location.district && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        {location.city}
                        {location.dong && ` ${location.district}`}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-3 shadow-lg">
          <p className="text-sm text-muted-foreground text-center">
            검색 결과가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
