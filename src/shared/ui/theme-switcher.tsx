"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
const themes = ["dark", "black", "gray", "light"] as const;
type Theme = (typeof themes)[number];
function getTheme(): Theme {
  const value = localStorage.getItem("pcbuilder-theme") as Theme | null;
  return value && themes.includes(value) ? value : "dark";
}
function subscribe(callback: () => void) {
  window.addEventListener("pcbuilder-theme", callback);
  return () => window.removeEventListener("pcbuilder-theme", callback);
}
function applyTheme(value: Theme) {
  localStorage.setItem("pcbuilder-theme", value);
  document.documentElement.dataset.theme = value;
  window.dispatchEvent(new Event("pcbuilder-theme"));
}
export function ThemeSwitcher() {
  const t = useTranslations("Theme");
  const locale = useLocale();
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = getTheme();
  }, [locale]);
  return (
    <div className="theme-switcher" aria-label={t("label")}>
      {themes.map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => applyTheme(value)}
          className={theme === value ? "active" : ""}
          title={t(value)}
          aria-label={t(value)}
        >
          <i className={`theme-dot ${value}`} />
        </button>
      ))}
    </div>
  );
}
