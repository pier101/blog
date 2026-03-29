"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { Eyebrow, Panel, Pill } from "@/components/ui";
import type { PostSummary } from "@/lib/post-meta";

type HomeFeedProps = {
  posts: PostSummary[];
};

export function HomeFeed({ posts }: HomeFeedProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const mobileCategoriesPanelId = "mobile-categories-panel";
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const currentYear = new Date().getFullYear();

  const filteredPosts = posts.filter((post) => {
    return activeCategory === "All" || post.category === activeCategory;
  });

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setMobileCategoriesExpanded(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
      <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
        <Panel border="panel" className="px-6 py-6 sm:px-6 sm:py-6" radius="panel" shadow="panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Eyebrow className="tracking-label-wide">Archive {currentYear}</Eyebrow>
              <h1 className="mt-2 text-display-md font-semibold tracking-display text-foreground-strong ">
                pier101
                <span className="mr-1 text-accent">.</span>
              </h1>
              <p className="mt-3 max-w-[12rem] text-body-xs leading-6 text-muted-foreground">
                차곡차곡 쌓아두는 <br />
                기술 기록과 설계 메모
              </p>
            </div>
          </div>
          <div className="mt-7">
            <p className="text-body-xs text-muted-foreground">Categories</p>
            <nav className="mt-4 space-y-1">
              {categories.map((category) => {
                const active = category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-media px-3 py-2.5 text-left text-body-sm transition ${
                      active
                        ? "bg-surface-emphasis font-medium text-foreground-strong"
                        : "text-foreground hover:bg-surface-soft"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-accent" : "bg-inactive"}`} />
                    <span>{category}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-12 border-t border-border pt-5">
            <p className="text-label-xs leading-5 text-quiet-3">Copyright {currentYear}. 김동욱 All rights reserved.</p>
          </div>
        </Panel>
      </aside>

      <section className="min-w-0 pb-28 lg:pb-0">
        <div className="pb-5 lg:hidden">
          <Eyebrow className="tracking-label-wide">Archive {currentYear}</Eyebrow>
          <h1 className="mt-2 text-display-md font-semibold tracking-display text-foreground-strong sm:text-display-md">
            pier101
            <span className="ml-1 text-accent">.</span>
          </h1>
          <p className="mt-2 max-w-[22rem] text-body-xs leading-6 text-muted-foreground sm:text-body-sm">
            차곡차곡 쌓아두는 기술 기록과 설계 메모
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pb-3">
          <div>
            <h2 className="mt-2 ml-2 text-display-lg font-semibold leading-none tracking-display-wide text-foreground-strong sm:text-display-2xl">
              <span className="relative isolate inline-block">
                <span className="relative z-10">{activeCategory}</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[0.08em] bottom-[-0.02em] -right-[0.3em] z-0 h-[0.3em] rounded-pill bg-accent/60"
                />
              </span>
            </h2>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <ul className="space-y-4 pt-2 sm:space-y-7">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        ) : (
          <Panel className="px-7 py-8 text-sm leading-7 text-muted-foreground" radius="panel" shadow="panel">
            선택한 카테고리에 맞는 글이 아직 없습니다.
          </Panel>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 sm:px-5 lg:hidden">
        <div className="mx-auto max-w-[1024px]">
          <Panel border="panel" overflow="hidden" radius="panel" shadow="panel">
            <button
              type="button"
              onClick={() => setMobileCategoriesExpanded((expanded) => !expanded)}
              aria-expanded={mobileCategoriesExpanded}
              aria-controls={mobileCategoriesPanelId}
              className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground-strong">{activeCategory}</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3 pl-3">
                <span className="relative block h-3.5 w-3.5 text-foreground-strong" aria-hidden="true">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                      mobileCategoriesExpanded ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
                    }`}
                  />
                </span>
              </div>
            </button>
            <div
              id={mobileCategoriesPanelId}
              aria-hidden={!mobileCategoriesExpanded}
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                mobileCategoriesExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`border-t border-border px-3 py-3 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                    mobileCategoriesExpanded
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <Eyebrow>Categories</Eyebrow>
                  </div>
                  <nav className="flex max-h-[32vh] flex-wrap gap-2 overflow-y-auto">
                    {categories.map((category) => {
                      const active = category === activeCategory;

                      return (
                        <Pill
                          as="button"
                          key={`mobile-${category}`}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          disabled={!mobileCategoriesExpanded}
                          tabIndex={mobileCategoriesExpanded ? 0 : -1}
                          className={active ? "text-white" : ""}
                          size="md"
                          tone={active ? "solid" : "neutral"}
                        >
                          <span>{category}</span>
                        </Pill>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
