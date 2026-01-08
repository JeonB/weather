# Weather App

한국 지역의 날씨 정보를 조회할 수 있는 웹 애플리케이션입니다.

## 프로젝트 실행 방법

### 필수 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm, yarn

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 구현한 기능

### 1. 현재 위치 기반 날씨 조회

- 앱 첫 진입 시 브라우저 Geolocation API를 통해 사용자 위치 감지
- 현재 위치의 날씨 정보 자동 표시

### 2. 날씨 정보 표시

- 현재 기온, 체감 온도
- 당일 최저/최고 기온
- 습도, 풍속
- 시간대별 기온 예보 (1시간 간격)
- 날씨 상태 아이콘 및 설명

### 3. 장소 검색

- `korea_districts.json` 데이터를 활용한 대한민국 지역 검색
- 시/도, 구/군, 동 모든 단위로 검색 가능
- 자동완성 기능이 있는 검색 입력
- 검색 결과에서 장소 선택 시 상세 페이지로 이동
- 날씨 정보가 없는 경우 에러 메시지 표시

### 4. 즐겨찾기 기능

- 최대 6개 장소 즐겨찾기 추가/삭제
- 카드 UI로 즐겨찾기 장소 표시
- 각 카드에 현재 날씨, 최저/최고 기온 표시
- 장소 별칭 수정 기능
- 카드 클릭 시 상세 페이지로 이동
- localStorage를 통한 데이터 저장

### 5. 반응형 디자인

- 모바일 우선 설계
- 데스크탑/태블릿/모바일 화면 최적화
- 그리드 레이아웃으로 즐겨찾기 카드 배치

## 기술 스택

| 분류            | 기술                        |
| --------------- | --------------------------- |
| Framework       | Next.js 16.1.1 (App Router) |
| UI Library      | React 19.2.3                |
| Language        | TypeScript 5                |
| Styling         | Tailwind CSS 4              |
| UI Components   | shadcn/ui                   |
| API             | Open-Meteo API              |
| Package Manager | pnpm                        |

## 기술적 의사결정 및 이유

### 1. Open-Meteo API 선택

- **선택 이유**: OpenWeatherMap 무료 플랜은 과거 데이터를 제공하지 않아 오늘 0시부터의 최저/최고 기온을 계산할 수 없었으나, Open-Meteo는 과거 데이터 제공으로 정확한 일별 최저/최고 기온을 무료로 제공
- **장점**:
  - API 키 불필요 (완전 무료)
  - 과거 데이터 제공 (past_days 파라미터)으로 오늘 0시부터 현재까지의 실제 온도 데이터 확보
  - Daily API를 통한 일별 최저/최고 기온 제공
  - Hourly API를 통한 시간대별 상세 예보
  - 호출 제한 없음

### 2. Next.js App Router

- **선택 이유**: 최신 Next.js 기능 활용 및 서버 컴포넌트 지원
- **장점**:
  - 서버 컴포넌트로 초기 로딩 성능 향상
  - 파일 기반 라우팅으로 직관적인 구조
  - 내장 최적화 기능 (이미지, 폰트 등)

### 3. Tailwind CSS + shadcn/ui

- **선택 이유**: 빠른 개발과 일관된 디자인 시스템
- **장점**:
  - 유틸리티 우선 접근으로 빠른 스타일링
  - shadcn/ui의 접근성 높은 컴포넌트
  - 반응형 디자인 구현 용이

### 4. localStorage를 통한 즐겨찾기 저장

- **선택 이유**: 서버 없이 간단한 데이터 영속성 확보
- **장점**:
  - 별도 백엔드 불필요
  - 즉각적인 데이터 저장/조회
  - 브라우저 간 독립적 동작

### 5. Nominatim API 선택 (역지오코딩)

- **선택 이유**: 브라우저 Geolocation API로 얻은 좌표를 지역명으로 변환하기 위해 선택. Open-Meteo는 역지오코딩을 제공하지 않음음
- **장점**:
  - 완전 무료, API 키 불필요
  - OpenStreetMap 기반으로 정확한 지역 정보 제공
  - 한국어 주소 정보 지원 (accept-language=ko)

## 프로젝트 구조 (FSD)

```bash
app/                        # Next.js App Router (라우팅)
├── page.tsx               # 홈 페이지
├── location/[id]/         # 장소 상세 페이지
└── layout.tsx             # 루트 레이아웃

src/
├── shared/                # 재사용 가능한 코드
│   ├── api/              # API 클라이언트
│   └── lib/              # 유틸리티 함수
├── entities/             # 비즈니스 엔티티
│   └── weather/          # 날씨 데이터 모델 및 UI
├── features/             # 사용자 기능
│   ├── location-search/  # 장소 검색
│   ├── favorites/        # 즐겨찾기
│   └── geolocation/      # 위치 감지
└── widgets/              # 복합 UI 블록
    ├── weather-display/  # 날씨 표시
    ├── favorites-list/   # 즐겨찾기 목록
    └── search-bar/       # 검색바

components/ui/             # shadcn/ui 컴포넌트
```
