"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePreference = "system" | "light" | "dark";
type Theme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  theme: Theme;
  setPreference: (value: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
// Only an explicit light/dark choice is stored; "system" is the absence of one. The key is new:
// the old "theme" key was written on every first visit, which froze visitors on whatever their
// device showed that day, so those values are deliberately ignored.
export const THEME_STORAGE_KEY = "theme-preference";
const darkQuery = "(prefers-color-scheme: dark)";

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readPreference());
  const [deviceTheme, setDeviceTheme] = useState<Theme>(() => systemTheme());
  const theme = preference === "system" ? deviceTheme : preference;

  // Follow the device live, so an iPad set to automatic appearance turns the site dark at sunset.
  useEffect(() => {
    const media = window.matchMedia(darkQuery);
    const update = () => setDeviceTheme(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    try {
      if (value === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // Storage can be blocked (private mode); the choice still applies for this visit.
    }
  };

  return <ThemeContext.Provider value={{ preference, theme, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
