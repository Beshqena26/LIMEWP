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

function UsageStatSkeleton() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-2",
      isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
    )}>
      <div className={cn(shimmer, "w-8 h-8 rounded-lg")} />
      <div className={cn(shimmer, "h-3 w-16 rounded-md")} />
      <div className={cn(shimmer, "h-5 w-20 rounded-md")} />
      <div className={cn(shimmer, "h-1.5 w-full rounded-full")} />
    </div>
  );
}

function PaymentCardSkeleton() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <div className={cn(
      "rounded-xl border-2 p-5 space-y-3",
      isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(shimmer, "w-11 h-11 rounded-xl shrink-0")} />
        <div className="flex-1 space-y-2">
          <div className={cn(shimmer, "h-4 w-24 rounded-md")} />
          <div className={cn(shimmer, "h-3 w-32 rounded-md")} />
        </div>
      </div>
      <div className={cn(shimmer, "h-3 w-full rounded-md")} />
    </div>
  );
}

export function BillingSkeleton() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="space-y-8">
      {/* Subscription Card */}
      <CardContainer>
        <div className="p-6 space-y-6">
          {/* Top row: title + price */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className={cn(shimmer, "h-6 w-36 rounded-md")} />
              <div className={cn(shimmer, "h-3 w-48 rounded-md")} />
            </div>
            <div className="text-right space-y-2">
              <div className={cn(shimmer, "h-8 w-16 rounded-md")} />
              <div className={cn(shimmer, "h-3 w-20 rounded-md")} />
            </div>
          </div>

          {/* Usage stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <UsageStatSkeleton key={i} />
            ))}
          </div>

          {/* Bottom divider + row */}
          <div className={cn(
            "border-t pt-5",
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(shimmer, "w-10 h-10 rounded-xl shrink-0")} />
              <div className="flex-1 space-y-2">
                <div className={cn(shimmer, "h-4 w-40 rounded-md")} />
                <div className={cn(shimmer, "h-3 w-56 rounded-md")} />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className={cn(shimmer, "h-9 w-24 rounded-xl")} />
                <div className={cn(shimmer, "h-9 w-24 rounded-xl")} />
              </div>
            </div>
          </div>
        </div>
      </CardContainer>

      {/* Payment Methods section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className={cn(shimmer, "h-5 w-40 rounded-md")} />
          <div className={cn(shimmer, "h-9 w-44 rounded-xl")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <PaymentCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <CardContainer>
        <div className="p-6">
          <div className={cn(shimmer, "h-5 w-36 rounded-md mb-5")} />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
                )}>
                  {[20, 24, 16, 20, 16, 12].map((w, i) => (
                    <th key={i} className="pb-3 pr-4 text-left">
                      <div className={cn(shimmer, `h-3 w-${w} rounded-md`)} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y",
                isLight ? "divide-slate-100" : "divide-white/[0.04]"
              )}>
                {[0, 1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {[24, 28, 16, 20, 14, 16].map((w, i) => (
                      <td key={i} className="py-3 pr-4">
                        <div className={cn(shimmer, `h-3 w-${w} rounded-md`)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContainer>
    </div>
  );
}
