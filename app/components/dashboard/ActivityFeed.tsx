"use client";

import { ActivityItem } from "./ActivityItem";
import { SectionHeader } from "../ui/SectionHeader";
import { useTheme } from "@/lib/context/ThemeContext";
import type { DashboardActivity } from "@/data/dashboard";

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
          ? "bg-white border border-zinc-200"
          : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E]"
      }`}>
        <div className={`relative divide-y ${isLight ? "divide-zinc-100" : "divide-[#2A2A2E]"}`}>
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

        {/* Footer with View All */}
        <div className={`relative border-t ${
          isLight ? "border-zinc-200" : "border-[#2A2A2E]"
        }`}>
          <button
            onClick={onViewAll}
            className={`w-full py-3.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors group/btn ${
              isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>View all activity</span>
            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
