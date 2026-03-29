export type PostMetadata = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  tags: string[];
  readingTime: string;
  thumbnail?: string;
  published?: boolean;
};

export type PostSummary = PostMetadata & {
  slug: string;
};

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
