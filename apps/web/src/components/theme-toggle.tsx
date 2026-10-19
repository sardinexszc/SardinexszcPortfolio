"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeContext, type ThemePreference } from "./theme-provider";

// One button cycles Auto → Light → Dark → Auto. Auto follows the device's appearance setting.
const next: Record<ThemePreference, ThemePreference> = { system: "light", light: "dark", dark: "system" };
const names: Record<ThemePreference, string> = { system: "Auto (matches your device)", light: "Light", dark: "Dark" };

export function ThemeToggle() {
  const { preference, setPreference } = useThemeContext();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const current = isClient ? preference : "system";
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;
  const label = isClient ? `Theme: ${names[current]}. Switch to ${names[next[current]]}` : "Change theme";

  return (
    <button type="button" aria-label={label} title={label} className="icon-button" onClick={() => setPreference(next[current])}>
      <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
    </button>
  );
}
