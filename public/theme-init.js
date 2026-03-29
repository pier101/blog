(() => {
  try {
    const storageKey = "paper-trail-theme";
    const storedTheme = window.localStorage.getItem(storageKey);
    const resolvedTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = resolvedTheme;
  } catch {}
})();
