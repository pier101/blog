"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Panel, Pill, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatDisplayDate, type PostSummary } from "@/lib/post-meta";

type GlobalSearchProps = {
  posts: PostSummary[];
};

const SEARCH_MODAL_DURATION = 200;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function GlobalSearch({ posts }: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const closeTimeoutRef = useRef<number | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const isModalMounted = open || closing;
  const filteredPosts =
    normalizedQuery.length === 0
      ? posts.slice(0, 7)
      : posts
          .filter((post) => {
            return (
              post.title.toLowerCase().includes(normalizedQuery) ||
              post.excerpt.toLowerCase().includes(normalizedQuery) ||
              post.category.toLowerCase().includes(normalizedQuery) ||
              post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
            );
          })
          .slice(0, 7);

  const clearPendingMotion = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openSearch = useCallback(() => {
    clearPendingMotion();
    setClosing(false);
    setOpen(true);
  }, [clearPendingMotion]);

  const closeSearch = useCallback(
    ({
      clearQuery = true,
      immediate = false,
    }: {
      clearQuery?: boolean;
      immediate?: boolean;
    } = {}) => {
      clearPendingMotion();

      if (!open && !closing) {
        if (clearQuery) {
          setQuery("");
        }

        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const exitDuration = immediate || prefersReducedMotion ? 0 : SEARCH_MODAL_DURATION;

      if (exitDuration === 0) {
        setOpen(false);
        setClosing(false);

        if (clearQuery) {
          setQuery("");
        }

        return;
      }

      setOpen(false);
      setClosing(true);
      closeTimeoutRef.current = window.setTimeout(() => {
        setClosing(false);
        closeTimeoutRef.current = null;

        if (clearQuery) {
          setQuery("");
        }
      }, exitDuration);
    },
    [clearPendingMotion, closing, open]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isModalMounted &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearch, isModalMounted, openSearch]);

  useEffect(() => {
    return () => {
      clearPendingMotion();
    };
  }, [clearPendingMotion]);

  const handleSubmitFirstResult = () => {
    const firstResult = filteredPosts[0];

    if (!firstResult) {
      return;
    }

    closeSearch({ immediate: true });
    router.push(`/posts/${firstResult.slug}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-card transition hover:border-accent hover:text-foreground-strong sm:h-11 sm:w-auto sm:min-w-[6rem] sm:gap-2.5 sm:px-3"
        aria-label="포스트 검색 열기"
      >
        <span
          className="flex items-center justify-center text-[1.02rem] leading-none sm:text-[1.04rem]"
          aria-hidden="true"
        >
          <IoSearch />
        </span>
        <span
          className="hidden h-6 items-center gap-1 rounded-pill border border-panel-border bg-surface-soft px-2.5 font-mono text-label-sm leading-none tracking-label-tight text-quiet sm:inline-flex"
          aria-hidden="true"
        >
          <kbd className="leading-none">⌘</kbd>
          <kbd className="leading-none">K</kbd>
        </span>
      </button>

      {isModalMounted ? (
        <div
          className={cn(
            "fixed inset-0 z-[60] bg-background/55 px-4 pt-20 backdrop-blur-sm sm:px-6 sm:pt-24 motion-reduce:animate-none",
            closing
              ? "animate-[search-modal-fade-out_200ms_cubic-bezier(0.25,1,0.5,1)_both]"
              : "animate-[search-modal-fade-in_200ms_cubic-bezier(0.25,1,0.5,1)_both]"
          )}
          onClick={() => closeSearch()}
        >
          <div
            className={cn(
              "mx-auto max-w-[40rem] motion-reduce:animate-none",
              closing
                ? "animate-[search-modal-fade-out_200ms_cubic-bezier(0.25,1,0.5,1)_both]"
                : "animate-[search-modal-fade-in_200ms_cubic-bezier(0.25,1,0.5,1)_both]"
            )}
          >
            <Panel
              border="panel"
              className="p-3 sm:p-4"
              radius="panel"
              shadow="panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-2 pb-3">
                <p className="text-body-xs text-muted-foreground">제목, 요약, 태그로 빠르게 찾기</p>
                <p className="font-mono text-label-sm tracking-label-tight text-quiet-2">ESC</p>
              </div>

              <div className="relative">
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base text-quiet-2"
                  aria-hidden="true"
                >
                  <IoSearch />
                </span>
                <TextField
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSubmitFirstResult();
                    }
                  }}
                  className="pl-11"
                  placeholder="글 제목, 요약, 태그 검색"
                />
              </div>

              <div className="mt-3 max-h-[min(60vh,36rem)] overflow-y-auto">
                {filteredPosts.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredPosts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          onClick={() => closeSearch({ immediate: true })}
                          className="block rounded-card border border-transparent px-3 py-3 transition hover:border-panel-border hover:bg-surface-soft"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <Pill size="sm">{post.category}</Pill>
                            <span className="text-body-xs text-quiet-2">{formatDisplayDate(post.date)}</span>
                          </div>
                          <h3 className="mt-3 text-title-sm font-semibold tracking-title text-foreground-strong">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-body-xs leading-6 text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Panel className="px-4 py-6 text-sm leading-7 text-muted-foreground" radius="card" tone="soft">
                    검색 결과가 없습니다. 다른 키워드로 다시 찾아보세요.
                  </Panel>
                )}
              </div>
            </Panel>
          </div>
        </div>
      ) : null}
    </>
  );
}
