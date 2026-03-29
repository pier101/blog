"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Panel } from "@/components/ui";
import {
  resolveTheme,
  subscribeAppearance,
  type ThemeMode,
} from "@/lib/appearance";

const giscusConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "pier101/blog-comments",
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "R_kgDORzLh8g",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "comments",
  categoryId:
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "DIC_kwDORzLh8s4C5eVs",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: process.env.NEXT_PUBLIC_GISCUS_LANG ?? "ko",
};

function getGiscusTheme(theme: ThemeMode) {
  return theme === "dark" ? "dark_dimmed" : "light";
}

function sendThemeMessage(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame"
  );

  if (!iframe?.src.startsWith("https://giscus.app")) {
    return;
  }

  try {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  } catch {
    // The iframe can still be transitioning from about:blank to giscus.app.
  }
}

function createGiscusScript(theme: string) {
  const script = document.createElement("script");

  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-repo", giscusConfig.repo!);
  script.setAttribute("data-repo-id", giscusConfig.repoId!);
  script.setAttribute("data-category", giscusConfig.category!);
  script.setAttribute("data-category-id", giscusConfig.categoryId!);
  script.setAttribute("data-mapping", giscusConfig.mapping);
  script.setAttribute("data-strict", giscusConfig.strict);
  script.setAttribute("data-reactions-enabled", giscusConfig.reactionsEnabled);
  script.setAttribute("data-emit-metadata", giscusConfig.emitMetadata);
  script.setAttribute("data-input-position", giscusConfig.inputPosition);
  script.setAttribute("data-theme", theme);
  script.setAttribute("data-lang", giscusConfig.lang);

  return script;
}

export function PostComments() {
  const pathname = usePathname();
  const commentsRef = useRef<HTMLDivElement>(null);
  const theme = useSyncExternalStore(
    subscribeAppearance,
    resolveTheme,
    resolveTheme
  );
  const giscusTheme = getGiscusTheme(theme);
  const isConfigured = Boolean(
    giscusConfig.repo &&
      giscusConfig.repoId &&
      giscusConfig.category &&
      giscusConfig.categoryId
  );

  useEffect(() => {
    const container = commentsRef.current;

    if (!container || !isConfigured) {
      return;
    }

    if (container.querySelector("iframe.giscus-frame")) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const target = commentsRef.current;

      if (!target) {
        return;
      }

      target.replaceChildren();
      target.appendChild(createGiscusScript(giscusTheme));
    }, 80);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [giscusTheme, isConfigured, pathname]);

  useEffect(() => {
    const container = commentsRef.current;

    if (!container || !isConfigured) {
      return;
    }

    const syncTheme = () => {
      sendThemeMessage(giscusTheme);
    };

    if (container.querySelector("iframe.giscus-frame")) {
      syncTheme();
      return;
    }

    // giscus inserts its iframe asynchronously, so wait for it before syncing theme.
    const observer = new MutationObserver(() => {
      if (!container.querySelector("iframe.giscus-frame")) {
        return;
      }

      syncTheme();
      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [giscusTheme, isConfigured, pathname]);

  if (!isConfigured) {
    if (process.env.NODE_ENV === "production") {
      return null;
    }

    return (
      <section
        aria-labelledby="post-comments-title"
        className="mt-16 border-t border-border pt-10"
      >
        <Panel
          tone="soft"
          border="panel"
          radius="panel"
          className="mt-6 px-5 py-5"
        ></Panel>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="post-comments-title"
      className="mt-16 border-t border-border pt-10"
    >
      <Panel
        tone="soft"
        border="panel"
        radius="panel"
        className="mt-6 px-3 py-3 sm:px-4 sm:py-4"
      >
        <div ref={commentsRef} className="giscus min-h-[220px]" />
      </Panel>
    </section>
  );
}
