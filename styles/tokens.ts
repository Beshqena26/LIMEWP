export type AccentName = "emerald" | "sky" | "violet" | "amber" | "pink";

interface TokenPair {
  dark: string;
  light: string;
}

export const TOKENS: Record<string, TokenPair> = {
  // ─── Backgrounds ───
  "bg-primary":   { dark: "#0f1117", light: "#f0f2f5" },
  "bg-secondary": { dark: "#1e2130", light: "#f4f5f7" },
  "bg-tertiary":  { dark: "#161923", light: "#ebedf1" },
  "bg-elevated":  { dark: "#1a1d27", light: "#ffffff" },
  "bg-overlay":   { dark: "#282b3a", light: "#e8eaef" },
  "bg-inverse":   { dark: "#f1f5f9", light: "#0f172a" },
  "bg-input":     { dark: "#1e2130", light: "#f4f5f7" },
  "bg-hover":     { dark: "#222537", light: "#ecedf0" },

  // ─── Text ───
  "text-primary":   { dark: "#f1f5f9", light: "#0f172a" },
  "text-secondary": { dark: "#cbd5e1", light: "#475569" },
  "text-tertiary":  { dark: "#64748b", light: "#94a3b8" },
  "text-disabled":  { dark: "#475569", light: "#cbd5e1" },
  "text-inverse":   { dark: "#0f1117", light: "#f1f5f9" },

  // ─── Borders ───
  "border-primary":   { dark: "#334155", light: "#cbd5e1" },
  "border-secondary": { dark: "#1e293b", light: "#e2e8f0" },
  "border-tertiary":  { dark: "#282b3a", light: "#e8eaef" },
  "border-focus":     { dark: "#475569", light: "#94a3b8" },

  // ─── Status ───
  "success":        { dark: "#22c55e", light: "#16a34a" },
  "success-bg":     { dark: "rgba(34,197,94,0.1)", light: "rgba(22,163,74,0.08)" },
  "success-border": { dark: "rgba(34,197,94,0.2)", light: "rgba(22,163,74,0.15)" },
  "warning":        { dark: "#f59e0b", light: "#d97706" },
  "warning-bg":     { dark: "rgba(245,158,11,0.1)", light: "rgba(217,119,6,0.08)" },
  "warning-border": { dark: "rgba(245,158,11,0.2)", light: "rgba(217,119,6,0.15)" },
  "error":          { dark: "#ef4444", light: "#dc2626" },
  "error-bg":       { dark: "rgba(239,68,68,0.1)", light: "rgba(220,38,38,0.06)" },
  "error-border":   { dark: "rgba(239,68,68,0.2)", light: "rgba(220,38,38,0.15)" },
  "info":           { dark: "#3b82f6", light: "#2563eb" },
  "info-bg":        { dark: "rgba(59,130,246,0.1)", light: "rgba(37,99,235,0.06)" },
  "info-border":    { dark: "rgba(59,130,246,0.2)", light: "rgba(37,99,235,0.15)" },

  // ─── Scrollbar ───
  "scrollbar-thumb":       { dark: "#475569", light: "#94a3b8" },
  "scrollbar-thumb-hover": { dark: "#64748b", light: "#64748b" },

  // ─── Shadows ───
  "shadow-sm": { dark: "0 1px 2px rgba(0,0,0,.3), 0 1px 3px rgba(0,0,0,.15)", light: "0 1px 2px rgba(0,0,0,.05)" },
  "shadow-md": { dark: "0 4px 8px rgba(0,0,0,.3), 0 2px 4px rgba(0,0,0,.2)", light: "0 4px 6px -1px rgba(0,0,0,.07)" },
  "shadow-lg": { dark: "0 12px 40px rgba(0,0,0,.4), 0 4px 12px rgba(0,0,0,.3)", light: "0 10px 15px -3px rgba(0,0,0,.08)" },

  // ─── Radius ───
  "radius-sm":   { dark: "4px",    light: "4px" },
  "radius-md":   { dark: "8px",    light: "8px" },
  "radius-lg":   { dark: "12px",   light: "12px" },
  "radius-xl":   { dark: "16px",   light: "16px" },
  "radius-full": { dark: "9999px", light: "9999px" },

  // ─── Gradients ───
  "gradient-card-from": { dark: "#1e2130", light: "#ffffff" },
  "gradient-card-to":   { dark: "#181b28", light: "#f4f5f7" },

  // ─── Glow ───
  "glow":              { dark: "0 0 60px rgba(16,185,129,.1)", light: "0 0 60px rgba(6,150,105,.12)" },
  "glow-color":        { dark: "rgba(16,185,129,.12)", light: "rgba(5,150,105,.08)" },
  "glow-color-strong": { dark: "rgba(16,185,129,.25)", light: "rgba(5,150,105,.18)" },

  // ─── Glass ───
  "glass":        { dark: "rgba(15,17,23,.7)", light: "rgba(255,255,255,.7)" },
  "glass-border": { dark: "rgba(255,255,255,.06)", light: "rgba(255,255,255,.5)" },
};

export const ACCENT_TOKENS: Record<AccentName, { base: string; hover: string; muted: string }> = {
  emerald: { base: "#10b981", hover: "#34d399", muted: "#059669" },
  sky:     { base: "#0ea5e9", hover: "#38bdf8", muted: "#0284c7" },
  violet:  { base: "#8b5cf6", hover: "#a78bfa", muted: "#7c3aed" },
  amber:   { base: "#f59e0b", hover: "#fbbf24", muted: "#d97706" },
  pink:    { base: "#ec4899", hover: "#f472b6", muted: "#db2777" },
};

export function getTokenValues(mode: "dark" | "light"): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(TOKENS)) {
    result[`--${key}`] = val[mode];
  }
  return result;
}
