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
          ? "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
          : "bg-[#1C1C1F]/50 border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#1C1C1F]"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
        isLight
          ? "bg-zinc-100 group-hover:bg-zinc-200"
          : "bg-zinc-800 group-hover:bg-zinc-700"
      )}>
        <svg
          className={cn(
            "w-6 h-6 transition-colors",
            isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-300"
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
        isLight ? "text-zinc-700 group-hover:text-zinc-900" : "text-zinc-300 group-hover:text-zinc-100"
      )}>
        Add New Site
      </span>
      <span className={cn(
        "text-xs transition-colors",
        isLight ? "text-zinc-500" : "text-zinc-500"
      )}>
        Create or migrate a website
      </span>
    </Link>
  );
}
