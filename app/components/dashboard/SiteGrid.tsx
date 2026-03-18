"use client";

import { SiteCard } from "./SiteCard";
import { AddSiteCard } from "./AddSiteCard";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { DashboardSite } from "@/data/dashboard";

interface SiteGridProps {
  sites: DashboardSite[];
  onVisitSite?: (site: DashboardSite) => void;
  onManageSite?: (site: DashboardSite) => void;
}

export function SiteGrid({ sites, onVisitSite, onManageSite }: SiteGridProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className={cn(
            "text-lg font-semibold",
            isLight ? "text-zinc-900" : "text-zinc-100"
          )}>
            Your Sites
          </h2>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-md",
            isLight ? "bg-zinc-100 text-zinc-600" : "bg-zinc-800 text-zinc-400"
          )}>
            {sites.length}
          </span>
        </div>
      </div>

      {/* Site Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <SiteCard
            key={site.name}
            site={site}
            onVisit={() => onVisitSite?.(site)}
            onManage={() => onManageSite?.(site)}
          />
        ))}
        <AddSiteCard />
      </div>
    </div>
  );
}
