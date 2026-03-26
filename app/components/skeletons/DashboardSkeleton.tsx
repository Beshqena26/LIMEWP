"use client";

import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/lib/context/ThemeContext";

const shimmer = "skeleton-shimmer";

function CardContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <div className={cn(
      "relative rounded-2xl border overflow-hidden",
      isLight
        ? "bg-white border-slate-200"
        : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]",
      className
    )}>
      {children}
    </div>
  );
}

function SiteCardSkeleton() {
  return (
    <CardContainer className="h-full">
      <div className="p-5 space-y-4">
        {/* Header: avatar + name + status */}
        <div className="flex items-center gap-3">
          <div className={cn(shimmer, "w-10 h-10 rounded-xl shrink-0")} />
          <div className="flex-1 space-y-2">
            <div className={cn(shimmer, "h-4 w-2/3 rounded-md")} />
            <div className={cn(shimmer, "h-3 w-1/2 rounded-md")} />
          </div>
          <div className={cn(shimmer, "w-16 h-6 rounded-full")} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className={cn(shimmer, "h-2.5 w-2/3 rounded-md")} />
              <div className={cn(shimmer, "h-5 w-full rounded-md")} />
            </div>
          ))}
        </div>

        {/* Bars: CPU + Memory */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className={cn(shimmer, "h-2.5 w-12 rounded-md")} />
            <div className={cn(shimmer, "h-2 w-full rounded-full")} />
          </div>
          <div className="space-y-1.5">
            <div className={cn(shimmer, "h-2.5 w-16 rounded-md")} />
            <div className={cn(shimmer, "h-2 w-full rounded-full")} />
          </div>
        </div>
      </div>
    </CardContainer>
  );
}

function OverviewCardSkeleton() {
  return (
    <CardContainer className="h-full">
      <div className="p-6 space-y-5">
        {/* Title */}
        <div className={cn(shimmer, "h-5 w-1/3 rounded-md")} />
        {/* Chart area */}
        <div className={cn(shimmer, "h-40 w-full rounded-xl")} />
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className={cn(shimmer, "h-2.5 w-2/3 rounded-md")} />
              <div className={cn(shimmer, "h-4 w-1/2 rounded-md")} />
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className={cn(shimmer, "w-9 h-9 rounded-full shrink-0")} />
      <div className="flex-1 space-y-2">
        <div className={cn(shimmer, "h-3.5 w-3/4 rounded-md")} />
        <div className={cn(shimmer, "h-2.5 w-1/2 rounded-md")} />
      </div>
      <div className={cn(shimmer, "h-5 w-14 rounded-full")} />
    </div>
  );
}

export function DashboardSkeleton() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="space-y-8">
      {/* SiteGrid skeleton */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className={cn(shimmer, "h-5 w-28 rounded-md")} />
          <div className={cn(shimmer, "h-5 w-8 rounded-full")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <SiteCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className={cn(shimmer, "h-5 w-32 rounded-md")} />

      {/* Performance + Security 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
      </div>

      {/* Activity Feed */}
      <CardContainer>
        <div className="p-6">
          <div className={cn(shimmer, "h-5 w-36 rounded-md mb-4")} />
          <div className={cn(
            "divide-y",
            isLight ? "divide-slate-100" : "divide-white/[0.04]"
          )}>
            {[0, 1, 2, 3, 4].map((i) => (
              <ActivityRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </CardContainer>
    </div>
  );
}
