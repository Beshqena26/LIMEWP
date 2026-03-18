"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor = "emerald" | "sky" | "violet" | "amber" | "pink";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "dark" | "light";
  accentColor: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS: Record<AccentColor, { primary: string; primaryLight: string; primaryDark: string }> = {
  emerald: {
    primary: "#10b981",
    primaryLight: "#34d399",
    primaryDark: "#059669",
  },
  sky: {
    primary: "#0ea5e9",
    primaryLight: "#38bdf8",
    primaryDark: "#0284c7",
  },
  violet: {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
  },
  amber: {
    primary: "#f59e0b",
    primaryLight: "#fbbf24",
    primaryDark: "#d97706",
  },
  pink: {
    primary: "#ec4899",
    primaryLight: "#f472b6",
    primaryDark: "#db2777",
  },
};

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

  // Apply theme to document
  const applyTheme = useCallback((mode: ThemeMode) => {
    const resolved = mode === "system" ? getSystemTheme() : mode;
    setResolvedTheme(resolved);

    const root = document.documentElement;

    if (resolved === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      // Light mode — landing page colors
      root.style.setProperty("--bg-main", "#f0f2f5");
      root.style.setProperty("--bg-card", "#f4f5f7");
      root.style.setProperty("--bg-sidebar", "#ebedf1");
      root.style.setProperty("--bg-sidebar-hover", "#e8eaef");
      root.style.setProperty("--bg-elevated", "#ffffff");
      root.style.setProperty("--bg-input", "#f4f5f7");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-tertiary", "#94a3b8");
      root.style.setProperty("--text-sidebar", "#475569");
      root.style.setProperty("--text-sidebar-active", "#0f172a");
      root.style.setProperty("--border", "#cbd5e1");
      root.style.setProperty("--border-light", "#e2e8f0");
      root.style.setProperty("--scrollbar-thumb", "#94a3b8");
      root.style.setProperty("--scrollbar-thumb-hover", "#64748b");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      // Dark mode — landing page colors
      root.style.setProperty("--bg-main", "#0f1117");
      root.style.setProperty("--bg-card", "#1e2130");
      root.style.setProperty("--bg-sidebar", "#161923");
      root.style.setProperty("--bg-sidebar-hover", "#282b3a");
      root.style.setProperty("--bg-elevated", "#1a1d27");
      root.style.setProperty("--bg-input", "#1e2130");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--text-tertiary", "#64748b");
      root.style.setProperty("--text-sidebar", "#cbd5e1");
      root.style.setProperty("--text-sidebar-active", "#ffffff");
      root.style.setProperty("--border", "#334155");
      root.style.setProperty("--border-light", "#1e293b");
      root.style.setProperty("--scrollbar-thumb", "#475569");
      root.style.setProperty("--scrollbar-thumb-hover", "#64748b");
    }
  }, [getSystemTheme]);

  // Apply accent color to document
  const applyAccentColor = useCallback((color: AccentColor) => {
    const colors = ACCENT_COLORS[color];
    const root = document.documentElement;

    root.style.setProperty("--accent", colors.primary);
    root.style.setProperty("--accent-light", colors.primaryLight);
    root.style.setProperty("--accent-dark", colors.primaryDark);
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
