# Paper Trail

Next.js App Router와 MDX로 구성한 블로그 스타터입니다. 글은 `src/content/posts/*.mdx`에 작성하고, 홈/아카이브/상세 페이지는 해당 MDX 파일의 `metadata`를 기준으로 자동 렌더링됩니다.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `@next/mdx`

## Development

```bash
pnpm dev
pnpm lint
pnpm build
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 확인할 수 있습니다.

## Content Workflow

새 글은 아래 형태로 추가합니다.

```mdx
export const metadata = {
  title: "글 제목",
  excerpt: "짧은 요약",
  category: "Frontend",
  date: "2026-03-28",
  tags: ["mdx", "nextjs"],
  readingTime: "4 min read",
  thumbnail: "/posts/example.svg",
};

# 본문 시작

여기에 글을 작성합니다.
```

`metadata`의 `title`, `excerpt`, `category`, `date`, `tags`, `readingTime`, `thumbnail`은 목록/상세/메타 태그 생성에 사용됩니다.

## Environment Variables

운영 배포 전에는 아래 환경 변수를 설정하는 것을 권장합니다.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- `NEXT_PUBLIC_SITE_URL`
  canonical, Open Graph, Twitter 카드, `robots.txt`, `sitemap.xml`의 기준 도메인입니다.
- `NEXT_PUBLIC_GA_ID`
  GA4 Measurement ID입니다. 없으면 Analytics 스크립트는 로드되지 않습니다.

`NEXT_PUBLIC_SITE_URL`이 비어 있으면 이 프로젝트는 기본적으로 `noindex` 메타를 출력하고 `robots.txt`도 크롤링을 막는 형태로 동작합니다.

## Comment Setup

포스트 하단 댓글은 GitHub Discussions 기반 `giscus`로 동작합니다.

1. 댓글을 연결할 GitHub 저장소에서 Discussions를 활성화합니다.
2. `giscus` GitHub App을 저장소에 설치합니다.
3. 이 프로젝트는 현재 아래 공개 giscus 설정을 기본값으로 내장하고 있습니다.

```bash
repo=pier101/blog-comments
repoId=R_kgDORzLh8g
category=comments
categoryId=DIC_kwDORzLh8s4C5eVs
mapping=pathname
strict=0
reactionsEnabled=1
inputPosition=bottom
lang=ko
```

4. 다른 저장소나 카테고리로 바꾸고 싶을 때만 로컬/배포 환경에서 아래 공개 환경 변수로 덮어씁니다.

```bash
NEXT_PUBLIC_GISCUS_REPO=owner/repository
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOExample
NEXT_PUBLIC_GISCUS_CATEGORY=comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOExample
NEXT_PUBLIC_GISCUS_LANG=ko
```

`repo`, `repoId`, `categoryId`는 giscus 클라이언트 스크립트에도 그대로 노출되는 공개 식별자이므로 비밀값이 아닙니다. 댓글 영역은 각 포스트 상세 페이지 하단에 자동으로 표시됩니다.

## Next Steps

- 새 포스트 추가
- OG 이미지 생성 추가
- RSS 피드와 태그 페이지 확장
