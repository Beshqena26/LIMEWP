"use client";

import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES } from "@/config/routes";

interface DashboardHeaderProps {
  userName: string;
  onRefresh?: () => void;
}

export function DashboardHeader({ userName, onRefresh }: DashboardHeaderProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2 ${
          isLight ? "from-slate-800 to-slate-600" : "from-slate-100 to-slate-300"
        }`}>Welcome back, {userName}</h1>
        <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ring-1 inline-flex items-center gap-2 shadow-sm ${
          isLight
            ? "text-emerald-800 bg-emerald-50 ring-emerald-200"
            : "text-emerald-300 bg-emerald-500/10 ring-emerald-500/20"
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? "bg-emerald-500" : "bg-emerald-400"}`}></span>
          </span>
          All systems online
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          aria-label="Refresh dashboard"
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all group flex-shrink-0 ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 border-transparent hover:border-slate-200"
              : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] border-transparent hover:border-[var(--border-primary)]"
          }`}
        >
          <svg className={`w-5 h-5 transition-colors ${
            isLight ? "text-slate-500 group-hover:text-slate-700" : "text-slate-400 group-hover:text-slate-200"
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </button>
        <Link
          href={ROUTES.MIGRATE}
          className={`font-semibold text-sm transition-all gap-2 rounded-xl h-10 px-3 sm:px-4 flex items-center border ${
            isLight
              ? "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              : "bg-[var(--bg-elevated)] text-slate-300 border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <span className="hidden sm:inline">Migrate</span>
        </Link>
        <Link
          href={ROUTES.NEW_SITE}
          className={`font-semibold text-sm shadow-lg transition-all gap-2 rounded-xl h-10 px-3 sm:px-4 flex items-center ${
            isLight
              ? "bg-slate-800 text-white hover:bg-slate-700 shadow-slate-500/20"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-slate-500/10"
          }`}
        >
          <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-white/20" : "bg-slate-900/30"}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="hidden sm:inline">Add New Site</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </div>
  );
}
