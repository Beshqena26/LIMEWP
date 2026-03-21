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

function ActiveServiceCardSkeleton() {
  return (
    <CardContainer>
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn(shimmer, "w-12 h-12 rounded-xl shrink-0")} />
          {/* Text + badges */}
          <div className="flex-1 space-y-2">
            <div className={cn(shimmer, "h-4 w-32 rounded-md")} />
            <div className={cn(shimmer, "h-3 w-48 rounded-md")} />
            <div className="flex items-center gap-2">
              <div className={cn(shimmer, "h-5 w-16 rounded-full")} />
              <div className={cn(shimmer, "h-5 w-16 rounded-full")} />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn(shimmer, "h-9 w-20 rounded-xl")} />
            <div className={cn(shimmer, "h-9 w-20 rounded-xl")} />
          </div>
        </div>
      </div>
    </CardContainer>
  );
}

function SuggestedServiceCardSkeleton() {
  return (
    <CardContainer>
      <div className="p-5 space-y-3">
        <div className={cn(shimmer, "w-12 h-12 rounded-xl")} />
        <div className={cn(shimmer, "h-4 w-28 rounded-md")} />
        <div className="space-y-2">
          <div className={cn(shimmer, "h-3 w-full rounded-md")} />
          <div className={cn(shimmer, "h-3 w-3/4 rounded-md")} />
        </div>
        <div className={cn(shimmer, "h-9 w-full rounded-xl")} />
      </div>
    </CardContainer>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="space-y-10">
      {/* Active Services section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className={cn(shimmer, "h-5 w-36 rounded-md")} />
          <div className={cn(shimmer, "h-5 w-8 rounded-full")} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <ActiveServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Suggested Services section */}
      <div>
        <div className="mb-5">
          <div className={cn(shimmer, "h-5 w-48 rounded-md")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <SuggestedServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
