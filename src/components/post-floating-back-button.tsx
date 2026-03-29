"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export function PostFloatingBackButton() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const getReadingProgress = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        return 0;
      }

      return Math.min(Math.max(window.scrollY / totalScrollable, 0), 1);
    };

    const updateState = () => {
      frameId = 0;

      const nextProgress = Number(getReadingProgress().toFixed(3));

      setProgress((current) => {
        return current === nextProgress ? current : nextProgress;
      });
    };

    const requestUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateState);
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
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-4 z-40 px-4 sm:top-6 sm:px-5 lg:px-6">
      <div
        className="mx-auto flex w-full max-w-[1024px] justify-start"
        style={{
          paddingLeft: "max(0px, min(132px, calc((100% - 760px) / 2)))",
        }}
      >
        <Link
          href="/"
          aria-label="글 목록으로 돌아가기"
          className="pointer-events-auto group relative inline-flex h-10 items-center gap-3 overflow-hidden rounded-pill border border-panel-border bg-background/92 px-3.5 text-sm text-foreground-strong shadow-panel backdrop-blur-md transition duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-accent hover:text-foreground-strong supports-[backdrop-filter]:bg-background/80 sm:h-11"
        >
          <span className="hidden items-center gap-0.5 sm:inline-flex">
            <span className="text-base font-semibold tracking-title text-foreground-strong">pier101</span>
            <span className="text-base font-semibold text-accent">.</span>
          </span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
          <span className="flex items-center gap-2">
            <IoArrowBack className="text-[0.95rem] text-muted-foreground transition-colors group-hover:text-foreground-strong" />
            <span className="font-medium">글 목록</span>
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-border/45" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-auto bottom-0 left-0 h-[3px] transition-[width] duration-150 ease-out"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </Link>
      </div>
    </div>
  );
}
