"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { SettingsTab } from "@/data/settings";

// Accent color styles for active menu items
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/5", gradient: "from-emerald-500 to-emerald-600", activeBg: "bg-emerald-500/15" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/5", gradient: "from-sky-500 to-sky-600", activeBg: "bg-sky-500/15" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/5", gradient: "from-violet-500 to-violet-600", activeBg: "bg-violet-500/15" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/5", gradient: "from-amber-500 to-amber-600", activeBg: "bg-amber-500/15" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/5", gradient: "from-pink-500 to-pink-600", activeBg: "bg-pink-500/15" },
};

interface SettingsTabNavProps {
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsTabNav({ tabs, activeTab, onTabChange }: SettingsTabNavProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className="w-64 shrink-0 sticky top-24">
      <div className={cn(
        "relative rounded-2xl border overflow-hidden transition-colors",
        isLight
          ? "bg-white border-zinc-200 shadow-sm"
          : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
      )}>
        {/* Glow effect */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60",
          accent.glow
        )} />

        {/* Header */}
        <div className={cn(
          "relative px-4 py-3 border-b",
          isLight ? "border-zinc-100" : "border-[#27272A]"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              accent.bg
            )}>
              <svg className={cn("w-4 h-4", accent.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className={cn(
                "text-sm font-semibold",
                isLight ? "text-zinc-800" : "text-zinc-100"
              )}>Quick Navigation</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="relative p-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? cn(accent.activeBg, accent.text, "shadow-sm")
                    : isLight
                      ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      : "text-zinc-400 hover:bg-[#27272A] hover:text-zinc-200"
                )}
              >
                {/* Icon Container */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive
                    ? cn(accent.bg, "ring-1", accent.ring, "shadow-sm")
                    : isLight
                      ? "bg-zinc-100 group-hover:bg-zinc-200"
                      : "bg-[#27272A]/50 group-hover:bg-[#27272A]"
                )}>
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={tab.icon} />
                  </svg>
                </div>

                {/* Label */}
                <span className="flex-1 text-left">{tab.label}</span>

                {/* Active Indicator */}
                {isActive && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    `bg-gradient-to-r ${accent.gradient}`
                  )} />
                )}

                {/* Hover Arrow (non-active) */}
                {!isActive && (
                  <svg
                    className={cn(
                      "w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200",
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className={cn(
          "px-4 py-3 border-t",
          isLight ? "border-zinc-100 bg-zinc-50/50" : "border-[#27272A] bg-[#18181B]/50"
        )}>
          <div className="flex items-center gap-2">
            <svg className={cn("w-3.5 h-3.5", isLight ? "text-zinc-400" : "text-zinc-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className={cn("text-[11px]", isLight ? "text-zinc-500" : "text-zinc-500")}>
              Changes save automatically
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
