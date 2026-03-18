"use client";

import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";

export function AddSiteCard() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Link
      href={ROUTES.NEW_SITE}
      className={cn(
        "group relative rounded-xl border-2 border-dashed transition-all duration-200 p-5 flex flex-col items-center justify-center text-center h-full",
        isLight
          ? "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          : "bg-[#1a1d27]/50 border-[#282b3a] hover:border-[#475569] hover:bg-[#1a1d27]"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
        isLight
          ? "bg-slate-100 group-hover:bg-slate-200"
          : "bg-slate-800 group-hover:bg-slate-700"
      )}>
        <svg
          className={cn(
            "w-6 h-6 transition-colors",
            isLight ? "text-slate-400 group-hover:text-slate-600" : "text-slate-500 group-hover:text-slate-300"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <span className={cn(
        "font-semibold text-sm mb-1 transition-colors",
        isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"
      )}>
        Add New Site
      </span>
      <span className={cn(
        "text-xs transition-colors",
        isLight ? "text-slate-500" : "text-slate-500"
      )}>
        Create or migrate a website
      </span>
    </Link>
  );
}
