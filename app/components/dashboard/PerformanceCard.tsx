"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";

interface PerformanceMetric {
  label: string;
  value: string;
  subValue?: string;
  percentage?: number;
  trend?: "up" | "down" | "stable";
}

interface Suggestion {
  label: string;
  description: string;
  impact: "high" | "medium" | "low";
  icon: string;
}

interface PerformanceCardProps {
  onViewDetails?: () => void;
}

export function PerformanceCard({ onViewDetails }: PerformanceCardProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const metrics: PerformanceMetric[] = [
    { label: "Uptime", value: "99.98%", subValue: "Last 30 days", percentage: 99.98, trend: "up" },
    { label: "Avg Response", value: "142ms", subValue: "↓ 12ms from last week", percentage: 85, trend: "up" },
    { label: "Page Speed", value: "94", subValue: "Performance score", percentage: 94, trend: "stable" },
    { label: "Requests", value: "24.5K", subValue: "Today", percentage: 72, trend: "up" },
  ];

  const suggestions: Suggestion[] = [
    {
      label: "Optimize Images",
      description: "3 images can be compressed to save 420KB",
      impact: "high",
      icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    },
    {
      label: "Minify CSS & JS",
      description: "Reduce file sizes by removing whitespace",
      impact: "medium",
      icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    },
  ];

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden h-full flex flex-col",
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    )}>
      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b flex items-center justify-between",
        isLight ? "border-zinc-200" : "border-[#27272A]"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            isLight ? "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200" : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
          )}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <h3 className={cn("text-sm font-semibold", isLight ? "text-zinc-800" : "text-zinc-100")}>
              Performance
            </h3>
            <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>
              Site health metrics
            </p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
            isLight
              ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          )}
        >
          View Details
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                "rounded-xl p-4 transition-all",
                isLight
                  ? "bg-zinc-50 hover:bg-zinc-100"
                  : "bg-zinc-800/30 hover:bg-zinc-800/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-xs font-medium", isLight ? "text-zinc-500" : "text-zinc-500")}>
                  {metric.label}
                </span>
                {metric.trend && (
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center",
                    isLight ? "bg-zinc-200" : "bg-zinc-700"
                  )}>
                    {metric.trend === "up" && (
                      <svg className={cn("w-3 h-3", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    )}
                    {metric.trend === "down" && (
                      <svg className={cn("w-3 h-3", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    )}
                    {metric.trend === "stable" && (
                      <svg className={cn("w-3 h-3", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                      </svg>
                    )}
                  </span>
                )}
              </div>
              <div className={cn("text-xl font-bold mb-1", isLight ? "text-zinc-800" : "text-zinc-100")}>
                {metric.value}
              </div>
              {metric.subValue && (
                <div className={cn("text-[11px]", isLight ? "text-zinc-400" : "text-zinc-500")}>
                  {metric.subValue}
                </div>
              )}
              {metric.percentage !== undefined && (
                <div className="mt-3">
                  <div className={cn(
                    "h-1.5 rounded-full overflow-hidden",
                    isLight ? "bg-zinc-200" : "bg-zinc-700"
                  )}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isLight ? "bg-zinc-600" : "bg-zinc-400"
                      )}
                      style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className={cn(
          "mt-4 pt-4 border-t",
          isLight ? "border-zinc-100" : "border-zinc-800"
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-xs font-semibold", isLight ? "text-zinc-700" : "text-zinc-300")}>
              Suggestions
            </span>
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-md",
              isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-800 text-zinc-400"
            )}>
              {suggestions.length} items
            </span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group",
                  isLight ? "hover:bg-zinc-50" : "hover:bg-zinc-800/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  isLight ? "bg-zinc-100 group-hover:bg-zinc-200" : "bg-zinc-800 group-hover:bg-zinc-700"
                )}>
                  <svg
                    className={cn("w-4 h-4", isLight ? "text-zinc-500" : "text-zinc-400")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={suggestion.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-xs font-medium", isLight ? "text-zinc-700" : "text-zinc-200")}>
                    {suggestion.label}
                  </div>
                  <div className={cn("text-[11px] truncate", isLight ? "text-zinc-400" : "text-zinc-500")}>
                    {suggestion.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                    suggestion.impact === "high"
                      ? isLight
                        ? "bg-zinc-200 text-zinc-700"
                        : "bg-zinc-700 text-zinc-200"
                      : isLight
                      ? "bg-zinc-100 text-zinc-500"
                      : "bg-zinc-800 text-zinc-400"
                  )}>
                    {suggestion.impact}
                  </span>
                  <svg
                    className={cn(
                      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={cn(
          "mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
          isLight ? "border-zinc-100" : "border-zinc-800"
        )}>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                isLight ? "bg-zinc-500" : "bg-zinc-400"
              )} />
              <span className={cn("text-xs whitespace-nowrap", isLight ? "text-zinc-600" : "text-zinc-400")}>
                CDN Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                isLight ? "bg-zinc-500" : "bg-zinc-400"
              )} />
              <span className={cn("text-xs whitespace-nowrap", isLight ? "text-zinc-600" : "text-zinc-400")}>
                Redis Cache
              </span>
            </div>
          </div>
          <button className={cn(
            "text-xs font-medium flex items-center gap-1 transition-colors flex-shrink-0",
            isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-500 hover:text-zinc-300"
          )}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
