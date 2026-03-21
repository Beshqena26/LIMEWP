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

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Card 1: Profile settings */}
      <CardContainer>
        <div className="p-6">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className={cn(shimmer, "h-5 w-40 rounded-md")} />
            <div className={cn(shimmer, "h-3 w-64 rounded-md")} />
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className={cn(shimmer, "w-20 h-20 rounded-full")} />
            <div className="flex items-center gap-2">
              <div className={cn(shimmer, "h-8 w-20 rounded-xl")} />
              <div className={cn(shimmer, "h-8 w-20 rounded-xl")} />
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className={cn(shimmer, "h-3 w-20 rounded-md")} />
                <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
              </div>
            ))}
          </div>
        </div>
      </CardContainer>

      {/* Card 2: Preferences */}
      <CardContainer>
        <div className="p-6">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className={cn(shimmer, "h-5 w-32 rounded-md")} />
            <div className={cn(shimmer, "h-3 w-48 rounded-md")} />
          </div>

          {/* Select fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className={cn(shimmer, "h-3 w-24 rounded-md")} />
              <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
            </div>
            <div className="space-y-2">
              <div className={cn(shimmer, "h-3 w-24 rounded-md")} />
              <div className={cn(shimmer, "h-10 w-full rounded-xl")} />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <div className={cn(shimmer, "h-10 w-32 rounded-xl")} />
          </div>
        </div>
      </CardContainer>
    </div>
  );
}
