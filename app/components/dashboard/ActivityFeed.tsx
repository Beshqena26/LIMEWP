"use client";

import { useMemo } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { useTheme } from "@/lib/context/ThemeContext";
import type { DashboardActivity } from "@/data/dashboard";
import { NoActivity } from "../empty-states";

interface ActivityFeedProps {
  activities: DashboardActivity[];
  onViewAll?: () => void;
  onViewDetails?: (activity: DashboardActivity) => void;
  onGoToSite?: (activity: DashboardActivity) => void;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; ring: string; dot: string; label: string }> = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", dot: "bg-emerald-400", label: "Success" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", dot: "bg-amber-400", label: "Warning" },
  update: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", dot: "bg-violet-400", label: "Update" },
  info: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", dot: "bg-sky-400", label: "Info" },
  error: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", dot: "bg-rose-400", label: "Error" },
};

export function ActivityFeed({ activities, onViewAll, onViewDetails, onGoToSite }: ActivityFeedProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Group activities by relative time bucket
  const grouped = useMemo(() => {
    const groups: { label: string; items: DashboardActivity[] }[] = [];
    for (const a of activities) {
      const bucket = a.time.includes("min") || a.time.includes("hour") ? "Today" : a.time.includes("day") ? "This Week" : "Older";
      const existing = groups.find((g) => g.label === bucket);
      if (existing) existing.items.push(a);
      else groups.push({ label: bucket, items: [a] });
    }
    return groups;
  }, [activities]);

  return (
    <div className="mb-10">
      <SectionHeader title="Recent Activity" />
      <div className={`relative rounded-2xl overflow-hidden ${
        isLight
          ? "bg-white border border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
      }`}>
        {activities.length === 0 ? (
          <NoActivity />
        ) : (
          <div>
            {grouped.map((group) => (
              <div key={group.label}>
                {/* Date group header */}
                <div className={`px-6 py-2.5 ${isLight ? "bg-slate-50 border-b border-slate-200" : "bg-[var(--bg-primary)]/50 border-b border-[var(--border-tertiary)]"}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>{group.label}</span>
                </div>

                {/* Items */}
                {group.items.map((activity) => {
                  const style = TYPE_STYLES[activity.color] || TYPE_STYLES.info;
                  return (
                    <div
                      key={activity.action + activity.time}
                      onClick={() => onViewDetails?.(activity)}
                      className={`flex items-start gap-4 px-6 py-4 border-b last:border-b-0 transition-colors cursor-pointer ${
                        isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center pt-1 flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <div className={`w-px flex-1 mt-1 ${isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activity.action}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ring-1 ${style.bg} ${style.text} ${style.ring}`}>{activity.typeLabel}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md ring-1 ring-slate-500/20 bg-slate-500/10 text-slate-400">
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activity.siteGradient}`} />
                            {activity.site}
                          </span>
                        </div>
                        <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>{activity.details}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {activity.time}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); onGoToSite?.(activity); }} className={`text-[11px] font-medium transition-colors ${isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"}`}>
                            Visit site &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={`relative border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <button
            onClick={onViewAll}
            className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors group/btn text-violet-400 hover:text-violet-300"
          >
            <span>View all activity</span>
            <svg aria-hidden="true" className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
