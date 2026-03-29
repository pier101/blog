# Design System

이 프로젝트는 블로그에 필요한 최소 단위의 디자인 시스템을 `src/components/ui`를 중심으로 운영합니다.

## Goals

- 화면 전반의 톤, 간격, 표면 처리, 타이포를 일관되게 유지합니다.
- 페이지 전용 구현보다 재사용 가능한 primitive를 우선합니다.
- 새로운 UI는 가능한 한 토큰과 primitive 조합으로 만듭니다.

## Tokens

토큰은 [src/app/globals.css](/Users/gimdong-ug/Playground/blog/src/app/globals.css)에 정의합니다.

- Color: `background`, `foreground`, `foreground-strong`, `muted-foreground`, `border`, `surface`, `accent`
- Shadow: `shadow-card`, `shadow-card-hover`, `shadow-panel`
- Radius: `rounded-card`, `rounded-panel`, `rounded-media`, `rounded-pill`
- Typography: `text-label-xs`, `text-label-sm`, `text-body-xs`, `text-body-sm`, `text-title-*`, `text-display-*`
- Tracking: `tracking-label-*`, `tracking-title`, `tracking-display`, `tracking-meta`
- Theme mode: `:root`, `html[data-theme="dark"]`

Tailwind utility로는 `@theme inline`을 통해 아래처럼 사용합니다.

- `bg-surface`
- `text-foreground-strong`
- `border-panel-border`
- `shadow-card`
- `rounded-panel`
- `text-body-sm`
- `tracking-title`

## Primitives

공용 primitive는 [src/components/ui](/Users/gimdong-ug/Playground/blog/src/components/ui)에 둡니다.

- `Panel`: 표면, 보더, 그림자, 라운드의 기본 단위
- `Pill`: 카테고리, 태그, 상태 라벨
- `Eyebrow`: 모노스페이스 보조 라벨
- `TextField`: 검색/입력 필드 기본형

## Usage Rules

- 새 화면을 만들 때는 먼저 primitive 조합으로 표현 가능한지 확인합니다.
- `bg-*`, `text-*`, `border-*`, `shadow-*`는 가능한 한 semantic token utility를 사용합니다.
- `text-[14px]`, `tracking-[0.18em]` 같은 임의 수치보다 `text-body-sm`, `tracking-label-tight` 같은 시스템 토큰을 우선합니다.
- `rounded-[24px]` 같은 임의 수치보다 `rounded-panel` 같은 시스템 토큰을 우선합니다.
- 동일한 스타일이 3회 이상 반복되면 primitive 또는 token 후보로 봅니다.
- 페이지 전용 예외 스타일은 정말 필요한 경우에만 local class로 둡니다.

## Current Scope

현재 시스템은 블로그 홈, 포스트 카드, MDX 본문 보조 컴포넌트, 상세 상단 메타 영역을 커버합니다.

다음에 확장하기 좋은 영역:

- `Button`
- `SectionHeading`
- `EmptyState`
- `MetaList`
