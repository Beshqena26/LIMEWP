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
} from "../components/dashboard";
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

const CHECKLIST = [
  { label: "Create your first site", done: true },
  { label: "Point your domain", done: true },
  { label: "Install SSL certificate", done: true },
  { label: "Configure automatic backups", done: false },
  { label: "Set up email forwarding", done: false },
  { label: "Enable CDN", done: false },
];



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

  const completedCount = CHECKLIST.filter((item) => item.done).length;
  const totalCount = CHECKLIST.length;
  const progressPct = (completedCount / totalCount) * 100;

  return (
    <AppShell>
      <DashboardHeader
        userName="Lime"
        onRefresh={handleRefresh}
      />

      {/* Free Trial Banner */}
      <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl mb-6 ${
        isLight
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
          : "bg-gradient-to-r from-emerald-500/[0.08] to-teal-500/[0.08] border border-emerald-500/20"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-emerald-100" : "bg-emerald-500/15"}`}>
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </div>
          <div>
            <span className={`text-sm font-semibold ${isLight ? "text-emerald-800" : "text-emerald-300"}`}>Free Trial — 142 days remaining</span>
            <span className={`text-xs ml-2 ${isLight ? "text-emerald-600" : "text-emerald-400/70"}`}>Your 6-month free hosting is active</span>
          </div>
        </div>
        <Link href="/settings?tab=billing" className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
          isLight ? "text-emerald-700 hover:bg-emerald-100" : "text-emerald-400 hover:bg-emerald-500/10"
        }`}>
          View plan →
        </Link>
      </div>

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

          {/* Analytics Summary */}
          <div className={`flex items-center justify-between px-5 py-4 rounded-2xl border mb-10 ${
            isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
          }`}>
            {QUICK_STATS.map((stat, i) => (
              <div key={stat.label} className={`flex items-center gap-4 ${i > 0 ? `pl-4 border-l ${isLight ? "border-slate-200" : "border-white/[0.08]"}` : ""}`}>
                <div>
                  <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{stat.label}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</span>
                    <span className={`text-xs font-medium ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
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
