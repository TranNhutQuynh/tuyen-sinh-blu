import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tsbl_theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem(STORAGE_KEY) || getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme]
  );
}
