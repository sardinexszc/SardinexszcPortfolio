"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = theme === "dark";
  const icon = isClient && isDark ? <Sun size={17} strokeWidth={1.7} /> : <Moon size={17} strokeWidth={1.7} />;
  const label = isClient ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme";

  return (
    <button
      type="button"
      aria-label={label}
      className="icon-button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {icon}
    </button>
  );
}
