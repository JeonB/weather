# Weather App

한국 지역의 날씨 정보를 조회할 수 있는 웹 애플리케이션입니다.

## 프로젝트 실행 방법

### 필수 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm, yarn
- OpenWeatherMap API 키 ([무료 발급](https://openweathermap.org/api))

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
# .env.local 파일을 생성하고 다음 내용을 추가하세요:
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인할 수 있습니다.

## 구현한 기능

### 1. 현재 위치 기반 날씨 조회
- 앱 첫 진입 시 브라우저 Geolocation API를 통해 사용자 위치 감지
- 현재 위치의 날씨 정보 자동 표시

### 2. 날씨 정보 표시
- 현재 기온, 체감 온도
- 당일 최저/최고 기온
- 습도, 풍속
- 시간대별 기온 예보 (3시간 간격)
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

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16.1.1 (App Router) |
| UI Library | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| API | OpenWeatherMap API |
| Package Manager | pnpm |

## 기술적 의사결정 및 이유

### 1. Feature Sliced Design (FSD) 아키텍처
- **선택 이유**: 코드의 명확한 구조화와 유지보수성 향상
- **장점**:
  - 레이어 간 의존성 규칙으로 순환 참조 방지
  - 기능 단위로 코드 분리하여 확장성 확보
  - 팀 협업 시 코드 위치 예측 가능

### 2. OpenWeatherMap API 선택
- **선택 이유**: 공공데이터포털 대비 더 간단한 인증 및 사용법
- **장점**:
  - 명확한 API 문서
  - Geocoding API를 통한 한글 지역명 → 좌표 변환
  - 무료 티어로 충분한 API 호출량 제공

### 3. Next.js App Router
- **선택 이유**: 최신 Next.js 기능 활용 및 서버 컴포넌트 지원
- **장점**:
  - 서버 컴포넌트로 초기 로딩 성능 향상
  - 파일 기반 라우팅으로 직관적인 구조
  - 내장 최적화 기능 (이미지, 폰트 등)

### 4. Tailwind CSS + shadcn/ui
- **선택 이유**: 빠른 개발과 일관된 디자인 시스템
- **장점**:
  - 유틸리티 우선 접근으로 빠른 스타일링
  - shadcn/ui의 접근성 높은 컴포넌트
  - 반응형 디자인 구현 용이

### 5. localStorage를 통한 즐겨찾기 저장
- **선택 이유**: 서버 없이 간단한 데이터 영속성 확보
- **장점**:
  - 별도 백엔드 불필요
  - 즉각적인 데이터 저장/조회
  - 브라우저 간 독립적 동작

## 프로젝트 구조 (FSD)

```
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

## 라이선스

MIT
