/**
 * Open-Meteo Weather Code를 아이콘과 설명으로 매핑
 * https://open-meteo.com/en/docs
 */

/**
 * Weather code를 OpenWeather 스타일 아이콘 코드로 변환
 * @param code Open-Meteo weather code
 * @param isNight 야간 여부
 * @returns OpenWeather 스타일 아이콘 코드 (예: "01d", "10n")
 */
export function mapWeatherCodeToIcon(code: number, isNight: boolean): string {
  const suffix = isNight ? "n" : "d";

  // Clear sky
  if (code === 0) {
    return `01${suffix}`;
  }

  // Mainly clear, partly cloudy, and overcast
  if (code === 1) {
    return `02${suffix}`;
  }
  if (code === 2) {
    return `03${suffix}`;
  }
  if (code === 3) {
    return `04${suffix}`;
  }

  // Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return `50${suffix}`;
  }

  // Drizzle: Light, moderate, and dense intensity
  if (code === 51 || code === 53 || code === 55) {
    return `09${suffix}`;
  }

  // Freezing Drizzle: Light and dense intensity
  if (code === 56 || code === 57) {
    return `09${suffix}`;
  }

  // Rain: Slight, moderate and heavy intensity
  if (code === 61 || code === 63 || code === 65) {
    return `10${suffix}`;
  }

  // Freezing Rain: Light and heavy intensity
  if (code === 66 || code === 67) {
    return `10${suffix}`;
  }

  // Snow fall: Slight, moderate, and heavy intensity
  if (code === 71 || code === 73 || code === 75) {
    return `13${suffix}`;
  }

  // Snow grains
  if (code === 77) {
    return `13${suffix}`;
  }

  // Rain showers: Slight, moderate, and violent
  if (code === 80 || code === 81 || code === 82) {
    return `09${suffix}`;
  }

  // Snow showers slight and heavy
  if (code === 85 || code === 86) {
    return `13${suffix}`;
  }

  // Thunderstorm: Slight or moderate
  if (code === 95) {
    return `11${suffix}`;
  }

  // Thunderstorm with slight and heavy hail
  if (code === 96 || code === 99) {
    return `11${suffix}`;
  }

  // Default fallback
  return `01${suffix}`;
}

/**
 * Weather code를 한국어 설명으로 변환
 * @param code Open-Meteo weather code
 * @returns 한국어 날씨 설명
 */
export function mapWeatherCodeToDescription(code: number): string {
  // Clear sky
  if (code === 0) {
    return "맑음";
  }

  // Mainly clear, partly cloudy, and overcast
  if (code === 1) {
    return "대체로 맑음";
  }
  if (code === 2) {
    return "부분적으로 흐림";
  }
  if (code === 3) {
    return "흐림";
  }

  // Fog and depositing rime fog
  if (code === 45) {
    return "안개";
  }
  if (code === 48) {
    return "서리 안개";
  }

  // Drizzle: Light, moderate, and dense intensity
  if (code === 51) {
    return "약한 이슬비";
  }
  if (code === 53) {
    return "이슬비";
  }
  if (code === 55) {
    return "강한 이슬비";
  }

  // Freezing Drizzle: Light and dense intensity
  if (code === 56) {
    return "약한 어는 이슬비";
  }
  if (code === 57) {
    return "어는 이슬비";
  }

  // Rain: Slight, moderate and heavy intensity
  if (code === 61) {
    return "약한 비";
  }
  if (code === 63) {
    return "비";
  }
  if (code === 65) {
    return "강한 비";
  }

  // Freezing Rain: Light and heavy intensity
  if (code === 66) {
    return "약한 어는 비";
  }
  if (code === 67) {
    return "어는 비";
  }

  // Snow fall: Slight, moderate, and heavy intensity
  if (code === 71) {
    return "약한 눈";
  }
  if (code === 73) {
    return "눈";
  }
  if (code === 75) {
    return "강한 눈";
  }

  // Snow grains
  if (code === 77) {
    return "싸락눈";
  }

  // Rain showers: Slight, moderate, and violent
  if (code === 80) {
    return "약한 소나기";
  }
  if (code === 81) {
    return "소나기";
  }
  if (code === 82) {
    return "강한 소나기";
  }

  // Snow showers slight and heavy
  if (code === 85) {
    return "약한 눈보라";
  }
  if (code === 86) {
    return "눈보라";
  }

  // Thunderstorm: Slight or moderate
  if (code === 95) {
    return "천둥번개";
  }

  // Thunderstorm with slight and heavy hail
  if (code === 96) {
    return "약한 우박을 동반한 천둥번개";
  }
  if (code === 99) {
    return "우박을 동반한 천둥번개";
  }

  // Default fallback
  return "알 수 없음";
}
