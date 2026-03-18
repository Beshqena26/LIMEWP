"use client";

import { SITE_TABS, SITE_TAB_COLOR_STYLES, type SiteTab } from "@/data/site";
import { useTheme } from "@/lib/context/ThemeContext";

interface SiteTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SiteTabNav({ activeTab, onTabChange }: SiteTabNavProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {SITE_TABS.map((tab) => {
        const isActive = activeTab.toLowerCase() === tab.name.toLowerCase();
        const styles = SITE_TAB_COLOR_STYLES[tab.color] || SITE_TAB_COLOR_STYLES.emerald;

        return (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name.toLowerCase())}
            className={`group relative flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? `${styles.activeBg} ${styles.activeText} ring-1 ${styles.ring}`
                : isLight
                  ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  : "text-zinc-400 hover:bg-[#27272A] hover:text-zinc-200"
            }`}
          >
            <svg
              className={`w-4 h-4 transition-colors ${isActive ? styles.activeText : isLight ? "text-zinc-500 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={tab.icon} />
            </svg>
            {tab.name}
            {tab.badge && (
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                isActive ? `${styles.bg} ${styles.text}` : "bg-amber-500/20 text-amber-400"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
