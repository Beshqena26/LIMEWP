"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { ACCENT_TOKENS, type AccentName } from "@/styles/tokens";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor = AccentName;

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "dark" | "light";
  accentColor: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "limewp-theme";
const ACCENT_STORAGE_KEY = "limewp-accent";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColorState] = useState<AccentColor>("emerald");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): "dark" | "light" => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  // Apply theme to document — CSS variables come from theme.css classes, not inline styles
  const applyTheme = useCallback((mode: ThemeMode) => {
    const resolved = mode === "system" ? getSystemTheme() : mode;
    setResolvedTheme(resolved);

    const root = document.documentElement;

    if (resolved === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }

  }, [getSystemTheme]);

  // Apply accent color to document — reads from tokens
  const applyAccentColor = useCallback((color: AccentColor) => {
    const colors = ACCENT_TOKENS[color];
    const root = document.documentElement;

    root.style.setProperty("--accent", colors.base);
    root.style.setProperty("--accent-hover", colors.hover);
    root.style.setProperty("--accent-muted", colors.muted);
    // Legacy aliases
    root.style.setProperty("--accent-light", colors.hover);
    root.style.setProperty("--accent-dark", colors.muted);
    root.setAttribute("data-accent", color);
  }, []);

  // Set theme with persistence
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Set accent color with persistence
  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_STORAGE_KEY, color);
    applyAccentColor(color);
  }, [applyAccentColor]);

  // Initialize on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const savedAccent = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null;

    const initialTheme = savedTheme || "dark";
    const initialAccent = savedAccent || "emerald";

    setThemeState(initialTheme);
    setAccentColorState(initialAccent);
    applyTheme(initialTheme);
    applyAccentColor(initialAccent);
    setMounted(true);
  }, [applyTheme, applyAccentColor]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
