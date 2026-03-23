"use client";

import { Avatar } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import type { DashboardActivity } from "@/data/dashboard";

interface ActivityItemProps {
  activity: DashboardActivity;
  isFirst?: boolean;
  isLast?: boolean;
  onViewDetails?: () => void;
  onGoToSite?: () => void;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: string; badge: string; dot: string }> = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20", dot: "bg-emerald-400" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-500", badge: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20", dot: "bg-amber-400" },
  update: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-500", badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20", dot: "bg-violet-400" },
  info: { bg: "bg-sky-500/10", text: "text-sky-400", icon: "text-sky-500", badge: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20", dot: "bg-sky-400" },
  error: { bg: "bg-rose-500/10", text: "text-rose-400", icon: "text-rose-500", badge: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20", dot: "bg-rose-400" },
};

export function ActivityItem({ activity, isFirst, isLast, onViewDetails, onGoToSite }: ActivityItemProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const typeColor = TYPE_COLORS[activity.color] || TYPE_COLORS.info;

  return (
    <div
      onClick={onViewDetails}
      className={`group relative flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4 transition-all cursor-pointer ${
        isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
      }`}
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className={`hidden sm:block absolute left-[39px] top-[60px] w-px h-[calc(100%-24px)] ${
          isLight ? "bg-slate-100" : "bg-[var(--border-tertiary)]/50"
        }`} />
      )}

      {/* Activity Icon — colored by type */}
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ring-1 ${
          isLight
            ? `${typeColor.bg} ring-transparent`
            : `${typeColor.bg} ring-transparent`
        }`}>
          <svg className={`w-5 h-5 ${typeColor.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={activity.icon} />
          </svg>
        </div>
        {isFirst && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${typeColor.dot} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${typeColor.dot} ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`} />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium transition-colors ${
            isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"
          }`}>
            {activity.action}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${typeColor.badge}`}>
            {activity.typeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Avatar
              name={activity.siteInitials}
              size="sm"
              classNames={{
                base: `w-4 h-4 bg-gradient-to-br ${activity.siteGradient} ring-1 ring-white/10`,
                name: "text-[7px] font-bold text-white",
              }}
            />
            <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>{activity.site}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className={`flex items-center gap-1.5 text-[11px] flex-shrink-0 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activity.time}
          </div>
          <span className={`hidden sm:inline ${isLight ? "text-slate-300" : "text-slate-600"}`}>&bull;</span>
          <span className={`text-[11px] truncate ${isLight ? "text-slate-500" : "text-slate-500"}`}>{activity.details}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 pt-1 flex-shrink-0 md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0 transition-all">
        <button onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }} aria-label="View details" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)]"
        }`}>
          <svg className={`w-4 h-4 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onGoToSite?.(); }} aria-label="Go to site" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)]"
        }`}>
          <svg className={`w-4 h-4 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </button>
      </div>
    </div>
  );
}
