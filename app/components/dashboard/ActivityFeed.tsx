"use client";

import { ActivityItem } from "./ActivityItem";
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

export function ActivityFeed({ activities, onViewAll, onViewDetails, onGoToSite }: ActivityFeedProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="mb-10">
      <SectionHeader
        title="Recent Activity"
      />
      <div className={`relative rounded-2xl overflow-hidden ${
        isLight
          ? "bg-white border border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
      }`}>
        {activities.length === 0 ? (
          <NoActivity />
        ) : (
          <div className={`relative divide-y ${isLight ? "divide-slate-100" : "divide-[var(--border-tertiary)]"}`}>
            {activities.map((activity, index) => (
              <ActivityItem
                key={index}
                activity={activity}
                isFirst={index === 0}
                isLast={index === activities.length - 1}
                onViewDetails={() => onViewDetails?.(activity)}
                onGoToSite={() => onGoToSite?.(activity)}
              />
            ))}
          </div>
        )}

        {/* Footer with View All */}
        <div className={`relative border-t ${
          isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
        }`}>
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
