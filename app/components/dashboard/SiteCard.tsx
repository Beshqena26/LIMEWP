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

export function SiteCard({ site, onVisit, onManage }: SiteCardProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Animated CPU and Memory values
  const [animatedCpu, setAnimatedCpu] = useState(site.cpu);
  const [animatedMemory, setAnimatedMemory] = useState(site.memory);

  useEffect(() => {
    // Function to generate a random fluctuation within a range
    const fluctuate = (baseValue: number, range: number = 8) => {
      const min = Math.max(0, baseValue - range);
      const max = Math.min(100, baseValue + range);
      const change = (Math.random() - 0.5) * range;
      return Math.round(Math.max(min, Math.min(max, baseValue + change)));
    };

    // Update values at random intervals for more natural feel
    const updateCpu = () => {
      setAnimatedCpu(prev => {
        const target = fluctuate(site.cpu, 6);
        // Smooth transition towards target
        return prev + (target - prev) * 0.3 + (Math.random() - 0.5) * 2;
      });
    };

    const updateMemory = () => {
      setAnimatedMemory(prev => {
        const target = fluctuate(site.memory, 5);
        // Smooth transition towards target
        return prev + (target - prev) * 0.25 + (Math.random() - 0.5) * 1.5;
      });
    };

    // Different intervals for CPU and Memory to look more realistic
    const cpuInterval = setInterval(updateCpu, 800 + Math.random() * 400);
    const memoryInterval = setInterval(updateMemory, 1200 + Math.random() * 600);

    return () => {
      clearInterval(cpuInterval);
      clearInterval(memoryInterval);
    };
  }, [site.cpu, site.memory]);

  // Clamp and round values for display
  const displayCpu = Math.round(Math.max(0, Math.min(100, animatedCpu)));
  const displayMemory = Math.round(Math.max(0, Math.min(100, animatedMemory)));

  const healthStatus = site.health >= 80 ? "good" : site.health >= 60 ? "warning" : "critical";
  const healthColors = {
    good: isLight ? "text-slate-700" : "text-slate-300",
    warning: isLight ? "text-slate-600" : "text-slate-400",
    critical: isLight ? "text-slate-500" : "text-slate-500",
  };

  return (
    <div
      onClick={onManage}
      className={cn(
        "group relative rounded-xl transition-all duration-200 p-5 cursor-pointer h-full",
        isLight
          ? "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md"
          : "bg-[#1a1d27] border border-[#282b3a] hover:border-[#475569]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Site Avatar */}
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white",
            site.gradient
          )}>
            {site.initials}
          </div>
          <div>
            <span className={cn(
                "font-semibold text-sm",
                isLight ? "text-slate-900" : "text-slate-100"
              )}>{site.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onVisit?.(); }}
              className="flex items-center gap-1 group/link"
            >
              <span className={cn(
                "text-xs transition-colors",
                isLight ? "text-slate-500 group-hover/link:text-slate-700" : "text-slate-500 group-hover/link:text-slate-300"
              )}>{site.wordpress}</span>
              <svg className={cn(
                "w-3 h-3 transition-colors",
                isLight ? "text-slate-400 group-hover/link:text-slate-600" : "text-slate-600 group-hover/link:text-slate-400"
              )} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </button>
          </div>
        </div>

        {/* Online status badge */}
        <span className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-md",
          isLight ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-500"
        )}>
          Online
        </span>
      </div>

      {/* Stats Grid */}
      <div className={cn(
        "grid grid-cols-3 gap-3 py-3 border-y",
        isLight ? "border-slate-100" : "border-slate-800"
      )}>
        <div>
          <div className={cn(
            "text-[11px] uppercase tracking-wide mb-1",
            isLight ? "text-slate-400" : "text-slate-500"
          )}>Visits</div>
          <div className={cn(
            "text-sm font-semibold tabular-nums",
            isLight ? "text-slate-800" : "text-slate-200"
          )}>{site.visits}</div>
        </div>
        <div>
          <div className={cn(
            "text-[11px] uppercase tracking-wide mb-1",
            isLight ? "text-slate-400" : "text-slate-500"
          )}>Storage</div>
          <div className={cn(
            "text-sm font-semibold tabular-nums",
            isLight ? "text-slate-800" : "text-slate-200"
          )}>{site.storage}</div>
        </div>
        <div>
          <div className={cn(
            "text-[11px] uppercase tracking-wide mb-1",
            isLight ? "text-slate-400" : "text-slate-500"
          )}>Health</div>
          <div className={cn(
            "text-sm font-semibold tabular-nums",
            healthColors[healthStatus]
          )}>{site.health}%</div>
        </div>
      </div>

      {/* Resource Usage - Live animated bars */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs w-12 flex-shrink-0",
            isLight ? "text-slate-500" : "text-slate-500"
          )}>CPU</span>
          <div className={cn(
            "flex-1 h-1.5 rounded-full overflow-hidden",
            isLight ? "bg-slate-100" : "bg-slate-800"
          )}>
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                isLight ? "bg-slate-400" : "bg-slate-500"
              )}
              style={{ width: `${displayCpu}%` }}
            />
          </div>
          <span className={cn(
            "text-xs tabular-nums w-8 text-right flex-shrink-0 transition-all",
            isLight ? "text-slate-600" : "text-slate-400"
          )}>{displayCpu}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs w-12 flex-shrink-0",
            isLight ? "text-slate-500" : "text-slate-500"
          )}>Memory</span>
          <div className={cn(
            "flex-1 h-1.5 rounded-full overflow-hidden",
            isLight ? "bg-slate-100" : "bg-slate-800"
          )}>
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isLight ? "bg-slate-400" : "bg-slate-500"
              )}
              style={{ width: `${displayMemory}%` }}
            />
          </div>
          <span className={cn(
            "text-xs tabular-nums w-8 text-right flex-shrink-0 transition-all",
            isLight ? "text-slate-600" : "text-slate-400"
          )}>{displayMemory}%</span>
        </div>
      </div>

      </div>
  );
}
