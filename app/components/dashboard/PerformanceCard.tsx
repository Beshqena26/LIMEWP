"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface PerformanceMetric {
  label: string;
  value: string;
  subValue?: string;
  percentage?: number;
  trend?: "up" | "down" | "stable";
  color: "emerald" | "sky" | "violet" | "amber";
  icon: string;
  trendText: string;
  sparkline: number[];
  detailText: string;
}

interface Suggestion {
  id: string;
  label: string;
  description: string;
  impact: "high" | "medium" | "low";
  icon: string;
  toastMessage: string;
  duration: number;
}

interface PerformanceCardProps {
  onViewDetails?: () => void;
}

export function PerformanceCard({ onViewDetails }: PerformanceCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // --- State ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);

  const metrics: PerformanceMetric[] = [
    {
      label: "Uptime",
      value: "99.98%",
      subValue: "Last 30 days",
      percentage: 99.98,
      trend: "up",
      color: "emerald",
      icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
      trendText: "Up 0.01% from last week",
      sparkline: [98, 99, 99.5, 99.9, 99.98],
      detailText: "Zero unplanned downtime in the last 7 days. Maintenance window scheduled for next Tuesday 2-3 AM UTC.",
    },
    {
      label: "Avg Response",
      value: "142ms",
      subValue: "\u2193 12ms from last week",
      percentage: 85,
      trend: "up",
      color: "sky",
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      trendText: "Down 12ms from last week",
      sparkline: [180, 165, 158, 150, 142],
      detailText: "P95 latency is 210ms. Slowest endpoint: /api/search (320ms avg). Consider adding Redis caching.",
    },
    {
      label: "Page Speed",
      value: "94",
      subValue: "Performance score",
      percentage: 94,
      trend: "stable",
      color: "violet",
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
      trendText: "Up 2.3% from last week",
      sparkline: [88, 90, 91, 93, 94],
      detailText: "LCP: 1.2s (Good), FID: 12ms (Good), CLS: 0.04 (Good). Core Web Vitals all passing.",
    },
    {
      label: "Requests",
      value: "24.5K",
      subValue: "Today",
      percentage: 72,
      trend: "up",
      color: "amber",
      icon: "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z",
      trendText: "Up 8% from yesterday",
      sparkline: [19, 21, 22, 23, 24.5],
      detailText: "Peak hour: 2-3 PM with 3.2K requests. Cache hit ratio: 94%. Top page: /blog (8.1K hits).",
    },
  ];

  const suggestions: Suggestion[] = [
    {
      id: "images",
      label: "Optimize Images",
      description: "3 images can be compressed to save 420KB",
      impact: "high",
      icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
      toastMessage: "3 images optimized, saved 420KB",
      duration: 3000,
    },
    {
      id: "minify",
      label: "Minify CSS & JS",
      description: "Reduce file sizes by removing whitespace",
      impact: "medium",
      icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
      toastMessage: "CSS & JS minified successfully",
      duration: 2000,
    },
  ];

  const colorMap = {
    emerald: {
      iconBg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
      iconText: "text-emerald-500",
      barBg: isLight ? "bg-emerald-100" : "bg-emerald-500/20",
      barFill: "bg-emerald-500",
      cardBg: isLight ? "bg-emerald-50/50 hover:bg-emerald-50" : "bg-emerald-500/5 hover:bg-emerald-500/10",
    },
    sky: {
      iconBg: isLight ? "bg-sky-50" : "bg-sky-500/10",
      iconText: "text-sky-500",
      barBg: isLight ? "bg-sky-100" : "bg-sky-500/20",
      barFill: "bg-sky-500",
      cardBg: isLight ? "bg-sky-50/50 hover:bg-sky-50" : "bg-sky-500/5 hover:bg-sky-500/10",
    },
    violet: {
      iconBg: isLight ? "bg-violet-50" : "bg-violet-500/10",
      iconText: "text-violet-500",
      barBg: isLight ? "bg-violet-100" : "bg-violet-500/20",
      barFill: "bg-violet-500",
      cardBg: isLight ? "bg-violet-50/50 hover:bg-violet-50" : "bg-violet-500/5 hover:bg-violet-500/10",
    },
    amber: {
      iconBg: isLight ? "bg-amber-50" : "bg-amber-500/10",
      iconText: "text-amber-500",
      barBg: isLight ? "bg-amber-100" : "bg-amber-500/20",
      barFill: "bg-amber-500",
      cardBg: isLight ? "bg-amber-50/50 hover:bg-amber-50" : "bg-amber-500/5 hover:bg-amber-500/10",
    },
  };

  const impactColors = {
    high: "bg-rose-500/10 text-rose-400",
    medium: "bg-amber-500/10 text-amber-400",
    low: "bg-emerald-500/10 text-emerald-400",
  };

  // --- Modal styles ---
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`;

  // --- Escape key + body scroll lock for detail modal ---
  useEffect(() => {
    if (!showDetailModal) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDetailModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [showDetailModal]);

  // --- Handlers ---
  const handleClearCache = useCallback(() => {
    setClearingCache(true);
    setShowClearConfirm(false);
    setTimeout(() => {
      setClearingCache(false);
      showToast.success("Cache cleared successfully");
    }, 2000);
  }, []);

  const handleOptimizeSuggestion = useCallback((suggestion: Suggestion) => {
    if (optimizing) return;
    setOptimizing(suggestion.id);
    setTimeout(() => {
      setOptimizing(null);
      setCompletedSuggestions((prev) => [...prev, suggestion.id]);
      showToast.success(suggestion.toastMessage);
    }, suggestion.duration);
  }, [optimizing]);

  const handleMetricClick = useCallback((label: string) => {
    setExpandedMetric((prev) => (prev === label ? null : label));
  }, []);

  const visibleSuggestions = suggestions.filter((s) => !completedSuggestions.includes(s.id));

  const Spinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <>
      <div className={cn(
        "rounded-2xl border overflow-hidden h-full flex flex-col",
        isLight
          ? "bg-white border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      )}>
        {/* Header */}
        <div className={cn(
          "px-5 py-4 border-b flex items-center justify-between",
          isLight ? "border-slate-200" : "border-[var(--bg-elevated)]"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h2 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                Performance
              </h2>
              <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                Site health metrics
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetailModal(true)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
              accent.text,
              isLight ? "hover:bg-slate-100" : "hover:bg-slate-800"
            )}
          >
            View Details
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const colors = colorMap[metric.color];
              const isExpanded = expandedMetric === metric.label;
              return (
                <button
                  key={metric.label}
                  type="button"
                  onClick={() => handleMetricClick(metric.label)}
                  className={cn(
                    "rounded-xl p-4 transition-all text-left cursor-pointer",
                    colors.cardBg,
                    isExpanded && "ring-1 ring-inset",
                    isExpanded && (isLight ? "ring-slate-300" : "ring-slate-600")
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-5 h-5 rounded flex items-center justify-center", colors.iconBg)}>
                        <svg className={cn("w-3 h-3", colors.iconText)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={metric.icon} />
                        </svg>
                      </div>
                      <span className={cn("text-xs font-medium", isLight ? "text-slate-500" : "text-slate-500")}>
                        {metric.label}
                      </span>
                    </div>
                    {metric.trend && (
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        metric.trend === "up"
                          ? "bg-emerald-500/10"
                          : metric.trend === "down"
                          ? "bg-rose-500/10"
                          : isLight ? "bg-slate-100" : "bg-slate-700"
                      )}>
                        {metric.trend === "up" && (
                          <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        )}
                        {metric.trend === "down" && (
                          <svg className="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        )}
                        {metric.trend === "stable" && (
                          <svg className={cn("w-3 h-3", isLight ? "text-slate-400" : "text-slate-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  <div className={cn("text-xl font-bold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
                    {metric.value}
                  </div>
                  {metric.subValue && (
                    <div className={cn("text-[11px]", isLight ? "text-slate-400" : "text-slate-500")}>
                      {metric.subValue}
                    </div>
                  )}
                  {metric.percentage !== undefined && (
                    <div className="mt-3">
                      <div className={cn("h-1.5 rounded-full overflow-hidden", colors.barBg)}>
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", colors.barFill)}
                          style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Expanded inline detail */}
                  {isExpanded && (
                    <div className={cn("mt-3 pt-3 border-t text-xs", isLight ? "border-slate-200 text-slate-500" : "border-slate-700 text-slate-400")}>
                      {metric.detailText}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Suggestions */}
          <div className={cn(
            "mt-4 pt-4 border-t",
            isLight ? "border-slate-100" : "border-slate-800"
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className={cn("text-xs font-semibold", isLight ? "text-slate-700" : "text-slate-300")}>
                Suggestions
              </span>
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-md",
                isLight ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-400"
              )}>
                {visibleSuggestions.length} items
              </span>
            </div>
            <div className="space-y-2">
              {visibleSuggestions.length === 0 && (
                <div className={cn("text-xs text-center py-3", isLight ? "text-slate-400" : "text-slate-500")}>
                  All suggestions completed!
                </div>
              )}
              {visibleSuggestions.map((suggestion) => {
                const isProcessing = optimizing === suggestion.id;
                return (
                  <button
                    key={suggestion.label}
                    onClick={() => handleOptimizeSuggestion(suggestion)}
                    disabled={isProcessing || optimizing !== null}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group",
                      isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/30",
                      (isProcessing || optimizing !== null) && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      suggestion.impact === "high"
                        ? "bg-rose-500/10"
                        : suggestion.impact === "medium"
                        ? "bg-amber-500/10"
                        : "bg-emerald-500/10"
                    )}>
                      {isProcessing ? (
                        <Spinner />
                      ) : (
                        <svg
                          className={cn(
                            "w-4 h-4",
                            suggestion.impact === "high"
                              ? "text-rose-400"
                              : suggestion.impact === "medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={suggestion.icon} />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-xs font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                        {isProcessing ? `Optimizing ${suggestion.label}...` : suggestion.label}
                      </div>
                      <div className={cn("text-[11px] truncate", isLight ? "text-slate-400" : "text-slate-500")}>
                        {suggestion.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                        impactColors[suggestion.impact]
                      )}>
                        {suggestion.impact}
                      </span>
                      {!isProcessing && (
                        <svg
                          className={cn(
                            "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                            isLight ? "text-slate-400" : "text-slate-500"
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={cn(
            "mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
            isLight ? "border-slate-100" : "border-slate-800"
          )}>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className={cn("text-xs whitespace-nowrap", isLight ? "text-slate-600" : "text-slate-400")}>
                  CDN Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-sky-500 shadow-sm shadow-sky-500/50" />
                <span className={cn("text-xs whitespace-nowrap", isLight ? "text-slate-600" : "text-slate-400")}>
                  Redis Cache
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={clearingCache}
              className={cn(
                "text-xs font-medium flex items-center gap-1 transition-colors flex-shrink-0",
                accent.text,
                clearingCache && "opacity-60 cursor-not-allowed",
                isLight ? "hover:opacity-80" : "hover:opacity-80"
              )}
            >
              {clearingCache ? (
                <>
                  <Spinner />
                  Clearing...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Clear Cache
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clear Cache Confirm Dialog */}
      <ConfirmDialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCache}
        title="Clear all cache?"
        message="This will clear Redis, CDN, and page cache. Site may be slower temporarily while caches rebuild."
        confirmText="Clear Cache"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Performance Details Modal */}
      {showDetailModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="perf-detail-title">
          <div className={modalBackdropClass} onClick={() => setShowDetailModal(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            {/* Close button */}
            <button
              onClick={() => setShowDetailModal(false)}
              className={cn(
                "absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-slate-800 text-slate-500"
              )}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 id="perf-detail-title" className={cn("text-lg font-semibold mb-5", isLight ? "text-slate-800" : "text-slate-100")}>
              Performance Details
            </h3>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {metrics.map((metric) => {
                const colors = colorMap[metric.color];
                const maxSparkline = Math.max(...metric.sparkline);
                return (
                  <div
                    key={metric.label}
                    className={cn(
                      "rounded-xl p-4",
                      isLight ? "bg-slate-50" : "bg-slate-800/30"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-6 h-6 rounded flex items-center justify-center", colors.iconBg)}>
                        <svg className={cn("w-3.5 h-3.5", colors.iconText)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={metric.icon} />
                        </svg>
                      </div>
                      <span className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                        {metric.label}
                      </span>
                    </div>

                    <div className={cn("text-2xl font-bold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
                      {metric.value}
                    </div>

                    {/* Progress bar */}
                    {metric.percentage !== undefined && (
                      <div className="mb-2">
                        <div className={cn("h-2 rounded-full overflow-hidden", colors.barBg)}>
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", colors.barFill)}
                            style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className={cn("text-xs mb-3", isLight ? "text-emerald-600" : "text-emerald-400")}>
                      {metric.trendText}
                    </div>

                    {/* Sparkline mini bar chart */}
                    <div className="flex items-end gap-1 h-8 mb-3">
                      {metric.sparkline.map((val, i) => (
                        <div
                          key={i}
                          className={cn("flex-1 rounded-sm transition-all", colors.barFill, i === metric.sparkline.length - 1 ? "opacity-100" : "opacity-50")}
                          style={{ height: `${(val / maxSparkline) * 100}%` }}
                          title={`Day ${i + 1}: ${val}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mb-2">
                      {metric.sparkline.map((_, i) => (
                        <span key={i} className={cn("text-[9px] flex-1 text-center", isLight ? "text-slate-400" : "text-slate-600")}>
                          {i === 0 ? "5d ago" : i === metric.sparkline.length - 1 ? "Today" : ""}
                        </span>
                      ))}
                    </div>

                    <div className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                      {metric.detailText}
                    </div>
                  </div>
                );
              })}

              {/* Tips */}
              <div className={cn("rounded-xl p-4", isLight ? "bg-amber-50" : "bg-amber-500/5")}>
                <div className={cn("text-xs font-semibold mb-2", isLight ? "text-amber-700" : "text-amber-400")}>
                  Performance Tips
                </div>
                <ul className={cn("text-xs space-y-1.5", isLight ? "text-amber-600" : "text-amber-400/80")}>
                  <li>Enable Brotli compression for 15-20% smaller assets</li>
                  <li>Defer non-critical JavaScript to improve FCP</li>
                  <li>Use next-gen image formats (WebP/AVIF) for faster loads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
