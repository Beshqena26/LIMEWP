"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";

interface SecurityItem {
  label: string;
  status: "active" | "warning" | "inactive";
  detail: string;
  icon: string;
  color: "emerald" | "amber" | "violet" | "sky";
}

interface SecurityCardProps {
  onRunScan?: () => void;
  onViewDetails?: () => void;
}

export function SecurityCard({ onRunScan, onViewDetails }: SecurityCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const securityItems: SecurityItem[] = [
    {
      label: "SSL Certificate",
      status: "active",
      detail: "Valid until Dec 2026",
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      color: "emerald",
    },
    {
      label: "Firewall",
      status: "active",
      detail: "18 threats blocked today",
      icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
      color: "amber",
    },
    {
      label: "Malware Scan",
      status: "active",
      detail: "Last scan: 2 hours ago",
      icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
      color: "violet",
    },
    {
      label: "Login Protection",
      status: "active",
      detail: "2FA enabled, 3 failed attempts",
      icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
      color: "sky",
    },
  ];

  const threatStats = {
    blocked: 247,
    scanned: "12.4K",
    score: 98,
  };

  const itemColorMap = {
    emerald: {
      iconBg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
      iconText: "text-emerald-500",
    },
    amber: {
      iconBg: isLight ? "bg-amber-50" : "bg-amber-500/10",
      iconText: "text-amber-500",
    },
    violet: {
      iconBg: isLight ? "bg-violet-50" : "bg-violet-500/10",
      iconText: "text-violet-500",
    },
    sky: {
      iconBg: isLight ? "bg-sky-50" : "bg-sky-500/10",
      iconText: "text-sky-500",
    },
  };

  // Score color: 98 = green
  const scoreStroke = threatStats.score >= 80 ? "stroke-emerald-500" : threatStats.score >= 50 ? "stroke-amber-500" : "stroke-rose-500";
  const scoreTrack = isLight ? "stroke-emerald-100" : "stroke-emerald-500/20";

  return (
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
              Security
            </h2>
            <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
              Protection status
            </p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
            accent.text,
            isLight ? "hover:bg-slate-100" : "hover:bg-slate-800"
          )}
        >
          View Details
        </button>
      </div>

      {/* Security Score */}
      <div className="p-5 flex-1 flex flex-col">
        <div className={cn(
          "rounded-xl p-4 mb-4 flex items-center gap-4",
          isLight ? "bg-slate-50" : "bg-slate-800/30"
        )}>
          <div className="relative">
            <svg className="w-16 h-16 -rotate-90" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                className={scoreTrack}
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                className={scoreStroke}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(threatStats.score / 100) * 176} 176`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-lg font-bold", threatStats.score >= 80 ? "text-emerald-500" : isLight ? "text-slate-800" : "text-slate-100")}>
                {threatStats.score}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className={cn("text-sm font-semibold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
              Security Score
            </div>
            <div className={cn("text-xs mb-2", isLight ? "text-slate-500" : "text-slate-500")}>
              Your site is well protected
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-rose-400">
                  {threatStats.blocked}
                </span>
                <span className={cn("text-[11px]", isLight ? "text-slate-500" : "text-slate-500")}>
                  blocked
                </span>
              </div>
              <span className={isLight ? "text-slate-300" : "text-slate-700"}>|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-sky-400">
                  {threatStats.scanned}
                </span>
                <span className={cn("text-[11px]", isLight ? "text-slate-500" : "text-slate-500")}>
                  scanned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Items */}
        <div className="space-y-2">
          {securityItems.map((item) => {
            const colors = itemColorMap[item.color];
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all",
                  isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  colors.iconBg
                )}>
                  <svg
                    className={cn("w-4 h-4", colors.iconText)}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                    {item.label}
                  </div>
                  <div className={cn("text-xs truncate", isLight ? "text-slate-500" : "text-slate-500")}>
                    {item.detail}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md",
                    item.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : item.status === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-slate-500/10 text-slate-400"
                  )}>
                    {item.status === "active" ? "Active" : item.status === "warning" ? "Warning" : "Off"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className={cn(
          "mt-4 pt-4 border-t",
          isLight ? "border-slate-100" : "border-slate-800"
        )}>
          <button
            onClick={onRunScan}
            className={cn(
              "w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg",
              accent.button,
              accent.buttonHover,
              accent.buttonShadow
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Run Security Scan
          </button>
        </div>
      </div>
    </div>
  );
}
