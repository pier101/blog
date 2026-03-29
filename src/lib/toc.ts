export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripInlineMarkdown(value: string) {
  return value
    .replace(/\s+#+\s*$/, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\{[^}]+\}/g, "")
    .replace(/[*_~]/g, "")
    .trim();
}

export function slugifyHeading(value: string) {
  const normalized = stripInlineMarkdown(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || "section";
}

function createUniqueHeadingId(text: string, counts: Map<string, number>) {
  const baseId = slugifyHeading(text);
  const nextCount = (counts.get(baseId) ?? 0) + 1;

  counts.set(baseId, nextCount);

  return nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
}

export function extractTocFromMdx(source: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const slugCounts = new Map<string, number>();
  const lines = source.split(/\r?\n/);
  let inCodeFence = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (/^(```|~~~)/.test(trimmedLine)) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    const match = /^(#{2,3})\s+(.*)$/.exec(trimmedLine);

    if (!match) {
      continue;
    }

    const text = stripInlineMarkdown(match[2]);

    if (!text) {
      continue;
    }

    headings.push({
      id: createUniqueHeadingId(text, slugCounts),
      text,
      level: match[1].length as 2 | 3,
    });
  }

  return headings;
}
