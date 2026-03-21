"use client";

import { ReactNode } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-4",
          isLight ? "bg-slate-100" : "bg-[var(--bg-overlay)]"
        )}
      >
        <div className={cn("w-6 h-6", isLight ? "text-slate-400" : "text-slate-500")}>
          {icon}
        </div>
      </div>

      <h3
        className={cn(
          "text-lg font-semibold mb-1.5",
          isLight ? "text-slate-800" : "text-slate-100"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "text-sm max-w-xs",
          isLight ? "text-slate-500" : "text-slate-400"
        )}
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
