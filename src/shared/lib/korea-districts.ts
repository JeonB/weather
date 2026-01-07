import koreaDistrictsData from '@/korea_districts.json';

export interface ParsedLocation {
  fullName: string;
  city: string;
  district: string | null;
  dong: string | null;
  displayName: string;
}

// JSON 데이터는 배열 형태의 문자열 (e.g., "서울특별시-종로구-청운동")
const koreaDistricts: string[] = koreaDistrictsData as string[];

export function parseLocationName(fullName: string): ParsedLocation {
  const parts = fullName.split('-');
  const city = parts[0] || fullName;
  const district = parts[1] || null;
  const dong = parts[2] || null;

  // 표시용 이름 생성 (동이 있으면 "구 동", 구만 있으면 "시 구", 시만 있으면 "시")
  let displayName = city;
  if (district) {
    displayName = dong ? `${district} ${dong}` : `${city} ${district}`;
  }

  return {
    fullName,
    city,
    district,
    dong,
    displayName,
  };
}

export function searchLocations(query: string, limit = 20): ParsedLocation[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  const matches = koreaDistricts
    .filter((location) => {
      const normalizedLocation = location.toLowerCase();
      // 하이픈으로 구분된 각 부분에서 검색어 매칭
      const parts = normalizedLocation.split('-');
      return parts.some((part) => part.includes(normalizedQuery));
    })
    .slice(0, limit)
    .map(parseLocationName);

  // 정렬: 시/도 > 구/군 > 동 순서로, 그리고 검색어와 더 정확히 일치하는 것 우선
  return matches.sort((a, b) => {
    // 검색어로 시작하는 항목 우선
    const aStartsWith =
      a.city.toLowerCase().startsWith(normalizedQuery) ||
      (a.district?.toLowerCase().startsWith(normalizedQuery) ?? false) ||
      (a.dong?.toLowerCase().startsWith(normalizedQuery) ?? false);
    const bStartsWith =
      b.city.toLowerCase().startsWith(normalizedQuery) ||
      (b.district?.toLowerCase().startsWith(normalizedQuery) ?? false) ||
      (b.dong?.toLowerCase().startsWith(normalizedQuery) ?? false);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // 레벨 순서: 시 > 구 > 동
    const aLevel = a.dong ? 3 : a.district ? 2 : 1;
    const bLevel = b.dong ? 3 : b.district ? 2 : 1;

    if (aLevel !== bLevel) return aLevel - bLevel;

    return a.fullName.localeCompare(b.fullName, 'ko');
  });
}

export function getLocationForWeatherSearch(location: ParsedLocation): string {
  // OpenWeatherMap 검색에 적합한 형태로 변환
  // 동 단위는 너무 세부적이므로 구 또는 시 단위로 검색
  if (location.district) {
    return `${location.district}, ${location.city}, KR`;
  }
  return `${location.city}, KR`;
}

export function getAllLocations(): ParsedLocation[] {
  return koreaDistricts.map(parseLocationName);
}

