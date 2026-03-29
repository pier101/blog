"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TocHeading } from "@/lib/toc";

type PostTocProps = {
  headings: TocHeading[];
};

const tocActiveOffset = 156;

export function PostToc({ headings }: PostTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const updateState = () => {
      const viewportHeight = window.innerHeight;
      const activeLine = Math.min(Math.max(viewportHeight * 0.28, tocActiveOffset), 280);

      const headingElements = headings
        .map((heading) => {
          const element = document.getElementById(heading.id);

          if (!element) {
            return null;
          }

          return {
            id: heading.id,
            top: element.getBoundingClientRect().top,
          };
        })
        .filter((heading): heading is { id: string; top: number } => heading !== null);

      let nextActiveId = headingElements[0]?.id ?? headings[0]?.id ?? "";

      const passedHeadings = headingElements.filter((heading) => heading.top <= activeLine);

      if (passedHeadings.length > 0) {
        nextActiveId = passedHeadings[passedHeadings.length - 1].id;
      } else {
        const isNearPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
        const visibleHeadings = headingElements.filter((heading) => heading.top < viewportHeight - 120);

        if (isNearPageEnd && visibleHeadings.length > 0) {
          nextActiveId = visibleHeadings[visibleHeadings.length - 1].id;
        }
      }

      setActiveId((current) => {
        return current === nextActiveId ? current : nextActiveId;
      });
    };

    let frameId = 0;

    const requestUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateState();
      });
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="pointer-events-none fixed left-[calc(50%+24.75rem)] top-28 z-30 hidden min-[1180px]:block">
      <div className="pointer-events-auto">
        <nav aria-label="이 글의 목차" className="w-[10.75rem] xl:w-[11.5rem]">
          <p className="pl-3 text-label-xs tracking-label-wide text-quiet-2">Contents</p>
          <ol className="mt-4 border-l border-border pl-1.5">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;

              return (
                <li key={heading.id} className={cn("group relative min-w-0", heading.level === 3 && "ml-1.5")}>
                  <span
                    className={cn(
                      "absolute left-[-0.42rem] top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full border transition duration-200 motion-reduce:transition-none",
                      isActive
                        ? "scale-100 border-background bg-accent"
                        : "scale-90 border-border bg-surface-muted group-hover:scale-100 group-hover:border-accent-soft group-hover:bg-accent-soft"
                    )}
                    aria-hidden="true"
                  />
                  <a
                    href={`#${heading.id}`}
                    title={heading.text}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();

                      const target = document.getElementById(heading.id);

                      if (!target) {
                        return;
                      }

                      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                      target.scrollIntoView({
                        block: "start",
                        behavior: prefersReducedMotion ? "auto" : "smooth",
                      });
                      window.history.replaceState(null, "", `#${heading.id}`);
                    }}
                    className={cn(
                      "toc-link relative block w-full min-w-0 overflow-hidden rounded-r-2xl py-1.5 pl-4 pr-2.5 text-[13px] leading-5 transition duration-200 motion-reduce:transition-none",
                      isActive ? "toc-link-active" : "toc-link-inactive"
                    )}
                  >
                    <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{heading.text}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
