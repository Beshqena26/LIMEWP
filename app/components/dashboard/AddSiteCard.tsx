"use client";

import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";

export function AddSiteCard() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Link
      href="/new-site"
      className={`group relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center hover:-translate-y-px hover:shadow-lg ${
        isLight
          ? "bg-white border-slate-300 hover:border-emerald-400 hover:shadow-emerald-500/10"
          : "bg-[var(--bg-elevated)]/30 border-[var(--border-primary)] hover:border-emerald-500/50 hover:shadow-emerald-500/10"
      }`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.03] to-sky-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex flex-col items-center justify-center py-8">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span className={`font-semibold text-sm mb-1 transition-colors ${
          isLight ? "text-slate-800 group-hover:text-emerald-600" : "text-slate-200 group-hover:text-emerald-400"
        }`}>
          Add New Site
        </span>
        <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          Create or migrate a website
        </span>
      </div>
    </Link>
  );
}
