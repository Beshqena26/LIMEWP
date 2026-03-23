"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const router = useRouter();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<DashboardActivity | null>(null);
  const [isActivityDetailOpen, setIsActivityDetailOpen] = useState(false);

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

  return (
    <AppShell>
      <DashboardHeader
        userName="Lime"
        onRefresh={handleRefresh}
      />

      <PromoBanner onUpgrade={() => setIsUpgradeOpen(true)} />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
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
