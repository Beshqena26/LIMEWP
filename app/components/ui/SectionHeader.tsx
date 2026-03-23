"use client";

import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";
import { useTheme } from "@/lib/context/ThemeContext";

interface SectionHeaderProps {
  title: string;
  icon?: string;
  iconColor?: string;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, icon, iconColor = "emerald", count, action, className }: SectionHeaderProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = icon ? getColorClasses(iconColor) : null;

  return (
    <div className={cn("flex items-center justify-between mb-5", className)}>
      <div className="flex items-center gap-2">
        {icon && colors && (
          <svg aria-hidden="true" className={cn("w-5 h-5", isLight ? "text-slate-500" : colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        )}
        <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</h2>
        {count !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-md ${
            isLight ? "text-slate-700 bg-slate-100" : "text-slate-400 bg-[var(--bg-elevated)]"
          }`}>{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}
