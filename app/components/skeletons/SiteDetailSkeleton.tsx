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

export function SiteDetailSkeleton() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div>
      {/* Site Header Card */}
      <CardContainer className="mb-6">
        <div className="p-6">
          {/* Top row: icon + text + buttons */}
          <div className="flex items-center gap-4">
            {/* Site icon */}
            <div className={cn(shimmer, "w-16 h-16 rounded-2xl shrink-0")} />

            {/* Site name, url, badges */}
            <div className="flex-1 space-y-2">
              <div className={cn(shimmer, "h-6 w-48 rounded-md")} />
              <div className={cn(shimmer, "h-3 w-32 rounded-md")} />
              <div className="flex items-center gap-2">
                <div className={cn(shimmer, "h-5 w-16 rounded-full")} />
                <div className={cn(shimmer, "h-5 w-16 rounded-full")} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <div className={cn(shimmer, "h-10 w-24 rounded-xl")} />
              <div className={cn(shimmer, "h-10 w-24 rounded-xl")} />
              <div className={cn(shimmer, "h-10 w-24 rounded-xl")} />
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className={cn(
            "flex items-center gap-4 mt-4 pt-4 border-t",
            isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"
          )}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(shimmer, "h-3 w-20 rounded-md")} />
                {i < 5 && (
                  <div className={cn(
                    "w-px h-4",
                    isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]/50"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContainer>

      {/* Tab content area */}
      <CardContainer>
        <div className="p-6">
          {/* Section title */}
          <div className={cn(shimmer, "h-5 w-40 rounded-md mb-6")} />

          {/* Circular progress items */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={cn(shimmer, "w-20 h-20 rounded-full")} />
                <div className={cn(shimmer, "h-3 w-16 rounded-md")} />
              </div>
            ))}
          </div>

          {/* Performance grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className={cn(shimmer, "w-8 h-8 rounded-lg")} />
                <div className="space-y-2">
                  <div className={cn(shimmer, "h-3 w-2/3 rounded-md")} />
                  <div className={cn(shimmer, "h-4 w-1/2 rounded-md")} />
                </div>
              </div>
            ))}
          </div>

          {/* Server details grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className={cn(shimmer, "h-3 w-20 rounded-md")} />
                <div className={cn(shimmer, "h-4 w-28 rounded-md")} />
              </div>
            ))}
          </div>
        </div>
      </CardContainer>
    </div>
  );
}
