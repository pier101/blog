export type ThemeMode = "light" | "dark";

export const themeStorageKey = "paper-trail-theme";
export const appearanceChangeEvent = "paper-trail-appearance-change";

export function resolveTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  const rootTheme = document.documentElement.dataset.theme;

  if (rootTheme === "light" || rootTheme === "dark") {
    return rootTheme;
  }

  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "light";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(appearanceChangeEvent));
}

export function subscribeAppearance(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(appearanceChangeEvent, handleChange);

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(appearanceChangeEvent, handleChange);

    if (typeof mediaQuery.removeEventListener === "function") {
      mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
  };
}
