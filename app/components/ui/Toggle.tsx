"use client";

import { useTheme } from "@/lib/context/ThemeContext";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 9999,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        backgroundColor: enabled ? "#10b981" : isLight ? "#cbd5e1" : "#475569",
        border: "none",
        padding: 0,
        outline: "none",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 9999,
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease",
          transform: enabled ? "translateX(23px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}
