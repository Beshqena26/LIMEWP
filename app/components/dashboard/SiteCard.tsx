"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { DashboardSite } from "@/data/dashboard";

interface SiteCardProps {
  site: DashboardSite;
  onVisit?: () => void;
  onManage?: () => void;
}

function getBarColor(value: number) {
  if (value >= 80) return "bg-rose-500";
  if (value >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

function getHealthStyle(health: number) {
  if (health >= 80) return { text: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" };
  if (health >= 60) return { text: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20" };
  return { text: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/20" };
}

export function SiteCard({ site, onVisit, onManage }: SiteCardProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const [animatedCpu, setAnimatedCpu] = useState(site.cpu);
  const [animatedMemory, setAnimatedMemory] = useState(site.memory);

  useEffect(() => {
    const fluctuate = (baseValue: number, range: number = 8) => {
      const change = (Math.random() - 0.5) * range;
      return Math.round(Math.max(0, Math.min(100, baseValue + change)));
    };
    const cpuInterval = setInterval(() => {
      setAnimatedCpu((prev) => prev + (fluctuate(site.cpu, 6) - prev) * 0.3 + (Math.random() - 0.5) * 2);
    }, 800 + Math.random() * 400);
    const memoryInterval = setInterval(() => {
      setAnimatedMemory((prev) => prev + (fluctuate(site.memory, 5) - prev) * 0.25 + (Math.random() - 0.5) * 1.5);
    }, 1200 + Math.random() * 600);
    return () => { clearInterval(cpuInterval); clearInterval(memoryInterval); };
  }, [site.cpu, site.memory]);

  const displayCpu = Math.round(Math.max(0, Math.min(100, animatedCpu)));
  const displayMemory = Math.round(Math.max(0, Math.min(100, animatedMemory)));
  const healthStyle = getHealthStyle(site.health);

  return (
    <div
      onClick={onManage}
      className={cn(
        "group relative rounded-2xl transition-all duration-300 cursor-pointer h-full overflow-hidden hover:-translate-y-px hover:shadow-lg",
        isLight
          ? "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
      )}
    >
      {/* Gradient top stripe */}
      <div className={`h-1 bg-gradient-to-r ${site.gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-105 transition-transform",
              site.gradient
            )}>
              {site.initials}
            </div>
            <div>
              <span className={cn("font-semibold text-sm", isLight ? "text-slate-800" : "text-slate-100")}>{site.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onVisit?.(); }}
                className="flex items-center gap-1 group/link"
              >
                <span className={cn("text-xs transition-colors", isLight ? "text-slate-500 group-hover/link:text-slate-700" : "text-slate-500 group-hover/link:text-slate-300")}>{site.wordpress}</span>
                <svg aria-hidden="true" className={cn("w-3 h-3 transition-colors", isLight ? "text-slate-400 group-hover/link:text-slate-600" : "text-slate-600 group-hover/link:text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>
            </div>
          </div>

          {/* Online badge — colored */}
          <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            Online
          </span>
        </div>

        {/* Stats Grid */}
        <div className={cn("grid grid-cols-3 gap-3 py-3 border-y", isLight ? "border-slate-100" : "border-[var(--border-tertiary)]")}>
          <div>
            <div className={cn("text-[10px] uppercase tracking-wider mb-1", isLight ? "text-slate-400" : "text-slate-500")}>Visits</div>
            <div className={cn("text-sm font-bold tabular-nums", isLight ? "text-slate-800" : "text-slate-100")}>{site.visits}</div>
          </div>
          <div>
            <div className={cn("text-[10px] uppercase tracking-wider mb-1", isLight ? "text-slate-400" : "text-slate-500")}>Storage</div>
            <div className={cn("text-sm font-bold tabular-nums", isLight ? "text-slate-800" : "text-slate-100")}>{site.storage}</div>
          </div>
          <div>
            <div className={cn("text-[10px] uppercase tracking-wider mb-1", isLight ? "text-slate-400" : "text-slate-500")}>Health</div>
            <div className={cn("flex items-center gap-1.5")}>
              <span className={cn("text-sm font-bold tabular-nums", healthStyle.text)}>{site.health}%</span>
              <span className={cn("w-1.5 h-1.5 rounded-full", site.health >= 80 ? "bg-emerald-500" : site.health >= 60 ? "bg-amber-500" : "bg-rose-500")} />
            </div>
          </div>
        </div>

        {/* Resource Usage — colored bars */}
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <span className={cn("text-[11px] w-14 flex-shrink-0 font-medium", isLight ? "text-slate-500" : "text-slate-400")}>CPU</span>
            <div className={cn("flex-1 h-2 rounded-full overflow-hidden", isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]")}>
              <div className={cn("h-full rounded-full transition-all duration-500 ease-out", getBarColor(displayCpu))} style={{ width: `${displayCpu}%` }} />
            </div>
            <span className={cn("text-[11px] tabular-nums w-8 text-right flex-shrink-0 font-semibold", displayCpu >= 80 ? "text-rose-500" : displayCpu >= 60 ? "text-amber-500" : "text-emerald-500")}>{displayCpu}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-[11px] w-14 flex-shrink-0 font-medium", isLight ? "text-slate-500" : "text-slate-400")}>Memory</span>
            <div className={cn("flex-1 h-2 rounded-full overflow-hidden", isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]")}>
              <div className={cn("h-full rounded-full transition-all duration-700 ease-out", getBarColor(displayMemory))} style={{ width: `${displayMemory}%` }} />
            </div>
            <span className={cn("text-[11px] tabular-nums w-8 text-right flex-shrink-0 font-semibold", displayMemory >= 80 ? "text-rose-500" : displayMemory >= 60 ? "text-amber-500" : "text-emerald-500")}>{displayMemory}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
