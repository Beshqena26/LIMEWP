"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "../components/AppShell";
import {
  DashboardHeader,
  PromoBanner,
  SiteGrid,
  ActivityFeed,
  UpgradeModal,
  ActivityDetailModal,
  PerformanceCard,
  SecurityCard,
} from "../components/dashboard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { DashboardSkeleton } from "../components/skeletons";
import { DASHBOARD_SITES, DASHBOARD_ACTIVITIES, type DashboardSite, type DashboardActivity } from "@/data/dashboard";
import { createRoute, ROUTES } from "@/config/routes";
import { useSimulatedLoading } from "@/hooks";
import { showToast } from "@/lib/toast";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

const QUICK_STATS = [
  {
    label: "Total Visitors",
    value: "12,847",
    change: "+8.2%",
    positive: true,
    icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
    color: "emerald",
  },
  {
    label: "Bandwidth Used",
    value: "48.3 GB",
    change: "of 500 GB",
    positive: true,
    icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
    color: "sky",
  },
  {
    label: "Avg Uptime",
    value: "99.97%",
    change: "Last 30 days",
    positive: true,
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "violet",
  },
  {
    label: "Storage",
    value: "4.2 GB",
    change: "of 50 GB",
    positive: true,
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75",
    color: "amber",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Create Site",
    icon: "M12 4.5v15m7.5-7.5h-15",
    action: "create",
  },
  {
    label: "Run Backup",
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375",
    action: "backup",
  },
  {
    label: "Clear All Cache",
    icon: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
    action: "cache",
  },
  {
    label: "Check SSL",
    icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    action: "ssl",
  },
];

const CHECKLIST = [
  { label: "Create your first site", done: true },
  { label: "Point your domain", done: true },
  { label: "Install SSL certificate", done: true },
  { label: "Configure automatic backups", done: false },
  { label: "Set up email forwarding", done: false },
  { label: "Enable CDN", done: false },
];

const SITE_HEALTH = [
  { name: "limewp.com", score: 88 },
  { name: "supernova.guru", score: 92 },
];

function getHealthColor(score: number) {
  if (score >= 90) return "emerald";
  if (score >= 70) return "amber";
  return "rose";
}

export default function DashboardPage() {
  const router = useRouter();
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<DashboardActivity | null>(null);
  const [isActivityDetailOpen, setIsActivityDetailOpen] = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  const { data: sites, isLoading: sitesLoading } = useSimulatedLoading(() => DASHBOARD_SITES);
  const { data: activities, isLoading: activitiesLoading } = useSimulatedLoading(() => DASHBOARD_ACTIVITIES);
  const isLoading = sitesLoading || activitiesLoading;

  const handleRefresh = () => {
    showToast.success("Dashboard refreshed");
  };

  const handleVisitSite = (site: DashboardSite) => {
    window.open(site.url, "_blank");
  };

  const handleManageSite = (site: DashboardSite) => {
    router.push(createRoute.site(site.name));
  };

  const handleViewAllActivity = () => {
    router.push(ROUTES.ACTIVITY);
  };

  const handleViewActivityDetails = (activity: DashboardActivity) => {
    setSelectedActivity(activity);
    setIsActivityDetailOpen(true);
  };

  const handleGoToActivitySite = (activity: DashboardActivity) => {
    window.open(`https://${activity.site}`, "_blank");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        router.push(ROUTES.NEW_SITE);
        break;
      case "backup":
        showToast.success("Backup started for all sites");
        break;
      case "cache":
        showToast.success("Cache cleared across all sites");
        break;
      case "ssl":
        showToast.info("SSL check started...");
        break;
    }
  };

  const completedCount = CHECKLIST.filter((item) => item.done).length;
  const totalCount = CHECKLIST.length;
  const progressPct = (completedCount / totalCount) * 100;

  return (
    <AppShell>
      <DashboardHeader
        userName="Lime"
        onRefresh={handleRefresh}
      />

      <PromoBanner onUpgrade={() => setIsUpgradeOpen(true)} />

      {/* Getting Started Checklist — only for new users */}
      {!checklistDismissed && (
        <div
          className={`relative border rounded-2xl p-6 mb-8 overflow-hidden transition-all duration-300 ${
            isLight
              ? "bg-white border-slate-200"
              : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
          }`}
        >
          <button
            onClick={() => setChecklistDismissed(true)}
            className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
              isLight
                ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            }`}
            aria-label="Dismiss checklist"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center justify-between mb-4 pr-8">
            <h3
              className={`text-lg font-semibold ${
                isLight ? "text-slate-900" : "text-[var(--text-primary)]"
              }`}
            >
              Getting Started
            </h3>
            <span
              className={`text-sm ${
                isLight ? "text-slate-500" : "text-[var(--text-secondary)]"
              }`}
            >
              {completedCount}/{totalCount} completed
            </span>
          </div>

          {/* Progress bar */}
          <div
            className={`w-full h-2 rounded-full mb-5 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-tertiary)]"
            }`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-500 ${accent.bg}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.done ? (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                      isLight ? "border-slate-300" : "border-[var(--border-secondary)]"
                    }`}
                  />
                )}
                <span
                  className={`text-sm ${
                    item.done
                      ? isLight
                        ? "text-slate-400 line-through"
                        : "text-[var(--text-tertiary)] line-through"
                      : isLight
                      ? "text-slate-700"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* MY SITES — priority #1 */}
          <SiteGrid
            sites={sites!}
            onVisitSite={handleVisitSite}
            onManageSite={handleManageSite}
          />

          {/* Performance & Security 2-Column Layout */}
          <SectionHeader title="Site Overview" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <PerformanceCard />
            <SecurityCard onRunScan={() => showToast.info("Security scan started")} />
          </div>

          <ActivityFeed
            activities={activities!}
            onViewAll={handleViewAllActivity}
            onViewDetails={handleViewActivityDetails}
            onGoToSite={handleGoToActivitySite}
          />
        </>
      )}

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      <ActivityDetailModal
        isOpen={isActivityDetailOpen}
        onClose={() => setIsActivityDetailOpen(false)}
        activity={selectedActivity}
        onGoToSite={() => selectedActivity && handleGoToActivitySite(selectedActivity)}
      />
    </AppShell>
  );
}
