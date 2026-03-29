"use client";

import { useSyncExternalStore } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { applyTheme, resolveTheme, subscribeAppearance } from "@/lib/appearance";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeAppearance, resolveTheme, () => "light");

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  };

  const icon = theme === "dark" ? <IoSunny /> : <IoMoon />;

  const nextThemeLabel = theme === "dark" ? "라이트" : "다크";

  return (
    <button
      type="button"
      aria-label={`${nextThemeLabel} 모드로 전환`}
      onClick={handleToggle}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-card transition hover:border-accent hover:text-foreground-strong sm:h-11 sm:w-11"
    >
      <span
        className="flex items-center justify-center text-[1.02rem] leading-none sm:text-[1.04rem]"
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
}
