"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

// Import from centralized configs
import { ROUTES, createRoute } from "@/config/routes";
import {
  NAV_GROUPS,
  SITES_DATA,
  NAV_ICONS,
  type NavItem,
  type NavGroup,
} from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import { useTheme } from "@/lib/context/ThemeContext";

// Accent color configuration for navigation items
const ACCENT_STYLES = {
  emerald: {
    indicator: "bg-emerald-500",
    indicatorGradient: "from-emerald-400 to-emerald-600",
    activeBg: "bg-emerald-500/10",
    activeBgLight: "from-emerald-50 to-white",
    activeRing: "ring-emerald-500/20",
    activeRing30: "ring-emerald-500/30",
    activeRing50: "ring-emerald-500/50",
    activeShadowLight: "shadow-emerald-100",
    activeShadowIconLight: "shadow-emerald-200/50",
    text: "text-emerald-500",
    hoverBg: "group-hover:bg-emerald-500/10",
    hoverText: "group-hover:text-emerald-500",
    border: "border-emerald-500/20 hover:border-emerald-500/30",
    glow: "from-emerald-500/[0.08]",
    glowCircle: "from-emerald-500/20",
  },
  sky: {
    indicator: "bg-sky-500",
    indicatorGradient: "from-sky-400 to-sky-600",
    activeBg: "bg-sky-500/10",
    activeBgLight: "from-sky-50 to-white",
    activeRing: "ring-sky-500/20",
    activeRing30: "ring-sky-500/30",
    activeRing50: "ring-sky-500/50",
    activeShadowLight: "shadow-sky-100",
    activeShadowIconLight: "shadow-sky-200/50",
    text: "text-sky-500",
    hoverBg: "group-hover:bg-sky-500/10",
    hoverText: "group-hover:text-sky-500",
    border: "border-sky-500/20 hover:border-sky-500/30",
    glow: "from-sky-500/[0.08]",
    glowCircle: "from-sky-500/20",
  },
  violet: {
    indicator: "bg-violet-500",
    indicatorGradient: "from-violet-400 to-violet-600",
    activeBg: "bg-violet-500/10",
    activeBgLight: "from-violet-50 to-white",
    activeRing: "ring-violet-500/20",
    activeRing30: "ring-violet-500/30",
    activeRing50: "ring-violet-500/50",
    activeShadowLight: "shadow-violet-100",
    activeShadowIconLight: "shadow-violet-200/50",
    text: "text-violet-500",
    hoverBg: "group-hover:bg-violet-500/10",
    hoverText: "group-hover:text-violet-500",
    border: "border-violet-500/20 hover:border-violet-500/30",
    glow: "from-violet-500/[0.08]",
    glowCircle: "from-violet-500/20",
  },
  amber: {
    indicator: "bg-amber-500",
    indicatorGradient: "from-amber-400 to-amber-600",
    activeBg: "bg-amber-500/10",
    activeBgLight: "from-amber-50 to-white",
    activeRing: "ring-amber-500/20",
    activeRing30: "ring-amber-500/30",
    activeRing50: "ring-amber-500/50",
    activeShadowLight: "shadow-amber-100",
    activeShadowIconLight: "shadow-amber-200/50",
    text: "text-amber-500",
    hoverBg: "group-hover:bg-amber-500/10",
    hoverText: "group-hover:text-amber-500",
    border: "border-amber-500/20 hover:border-amber-500/30",
    glow: "from-amber-500/[0.08]",
    glowCircle: "from-amber-500/20",
  },
  pink: {
    indicator: "bg-pink-500",
    indicatorGradient: "from-pink-400 to-pink-600",
    activeBg: "bg-pink-500/10",
    activeBgLight: "from-pink-50 to-white",
    activeRing: "ring-pink-500/20",
    activeRing30: "ring-pink-500/30",
    activeRing50: "ring-pink-500/50",
    activeShadowLight: "shadow-pink-100",
    activeShadowIconLight: "shadow-pink-200/50",
    text: "text-pink-500",
    hoverBg: "group-hover:bg-pink-500/10",
    hoverText: "group-hover:text-pink-500",
    border: "border-pink-500/20 hover:border-pink-500/30",
    glow: "from-pink-500/[0.08]",
    glowCircle: "from-pink-500/20",
  },
};

function NavLink({ item, isLight, accentColor }: { item: NavItem; isLight: boolean; accentColor: keyof typeof ACCENT_STYLES }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const accent = ACCENT_STYLES[accentColor];

  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isActive
          ? `${accent.activeBg} ring-1 ${accent.activeRing}`
          : `${accent.hoverBg}`
      }`}
    >
        {/* Active indicator */}
        {isActive && (
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r ${accent.indicator}`}
          />
        )}

        {/* Icon container */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            isActive
              ? `${accent.activeBg} ${accent.text} ring-1 ${accent.activeRing}`
              : isLight
              ? `bg-zinc-200/50 text-zinc-500 ${accent.hoverBg} ${accent.hoverText}`
              : `bg-[#27272A]/50 text-zinc-400 ${accent.hoverBg} ${accent.hoverText}`
          }`}
        >
          <svg
            className="w-[18px] h-[18px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={item.icon} />
          </svg>
        </div>

        {/* Label */}
        <span
          className={`text-[13px] font-medium transition-colors ${
            isActive
              ? accent.text
              : isLight
              ? `text-zinc-600 ${accent.hoverText}`
              : `text-zinc-400 ${accent.hoverText}`
          }`}
        >
          {item.label}
        </span>

        {/* Badge */}
        {item.badge && (
          <span
            className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isActive
                ? `${accent.activeBg} ${accent.text}`
                : isLight
                ? `bg-zinc-200 text-zinc-500 ${accent.hoverBg} ${accent.hoverText}`
                : `bg-[#27272A] text-zinc-500 ${accent.hoverBg} ${accent.hoverText}`
            }`}
          >
            {item.badge}
          </span>
        )}

        {/* Hover arrow */}
        <svg
          className={`w-4 h-4 ml-auto transition-all duration-200 ${
            isActive
              ? `${accent.text} opacity-100`
              : isLight
              ? `text-zinc-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ${accent.hoverText}`
              : `text-zinc-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ${accent.hoverText}`
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={NAV_ICONS.chevronRight} />
        </svg>
    </Link>
  );
}

function SiteItems({ isLight, accentColor }: { isLight: boolean; accentColor: keyof typeof ACCENT_STYLES }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSiteName = searchParams.get("name");
  const isOnSitePage = pathname === ROUTES.SITE;
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className="flex flex-col gap-1.5">
      {SITES_DATA.map((site) => {
        const isActive = isOnSitePage && activeSiteName === site.name;
        return (
          <Link
            key={site.name}
            href={createRoute.site(site.name)}
            className={`relative flex items-center gap-3 px-3 py-3 rounded-xl group cursor-pointer transition-all duration-200 ring-1 ${
              isActive
                ? isLight
                  ? `bg-gradient-to-r ${accent.activeBgLight} ${accent.activeRing30} shadow-sm ${accent.activeShadowLight}`
                  : `bg-gradient-to-r from-[#27272A] to-[#2A2A2E] ${accent.activeRing30}`
                : isLight
                ? "bg-zinc-50/50 ring-zinc-200/60 hover:bg-zinc-100/80 hover:ring-zinc-300/60"
                : "ring-transparent hover:bg-[#27272A]/70"
            }`}
          >
            {isActive && (
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-gradient-to-b ${accent.indicatorGradient} rounded-r`} />
            )}
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${site.gradient} flex items-center justify-center transition-all ring-2 ${
                  isLight
                    ? `shadow-md shadow-zinc-200/80 group-hover:shadow-lg group-hover:shadow-zinc-300/70 ${isActive ? `${accent.activeRing50} ${accent.activeShadowIconLight}` : "ring-black/[0.04] group-hover:scale-105"}`
                    : `shadow-lg shadow-black/30 group-hover:shadow-black/40 ${isActive ? accent.activeRing50 : "ring-transparent group-hover:scale-105"}`
                }`}
              >
                <svg
                  className={`w-4 h-4 ${isLight ? "text-white drop-shadow-sm" : "text-white"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={isLight ? 2 : 1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={site.icon} />
                </svg>
              </div>
              {/* Status dot with pulse */}
              <div className="absolute -bottom-0.5 -right-0.5">
                {site.status === "online" && (
                  <span className={`absolute inset-0 rounded-full animate-ping opacity-40 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`} />
                )}
                <div
                  className={`relative w-2.5 h-2.5 rounded-full border-2 ${isLight ? "border-white" : "border-[#18181B]"} ${
                    site.status === "online" ? (isLight ? "bg-zinc-500" : "bg-zinc-400") : "bg-zinc-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-[12px] font-semibold truncate transition-colors ${
                  isActive
                    ? isLight ? "text-zinc-900" : "text-white"
                    : isLight
                    ? "text-zinc-700 group-hover:text-zinc-900"
                    : "text-zinc-300 group-hover:text-white"
                }`}
              >
                {site.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-medium ${isActive ? accent.text : isLight ? "text-zinc-600" : "text-zinc-500"}`}
                >
                  {site.visits} visits
                </span>
                <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>·</span>
                <span
                  className={`text-[10px] font-medium capitalize flex items-center gap-1 ${
                    isLight ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  {site.status === "online" && (
                    <span className={`w-1 h-1 rounded-full ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`} />
                  )}
                  {site.status}
                </span>
              </div>
            </div>
            <svg
              className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? `${accent.text} opacity-100 translate-x-0`
                  : isLight
                  ? "text-zinc-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                  : "text-zinc-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={NAV_ICONS.chevronRight} />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}

function NavGroupComponent({
  group,
  isOpen,
  onToggle,
  isLight,
  accentColor,
}: {
  group: NavGroup;
  isOpen: boolean;
  onToggle: () => void;
  isLight: boolean;
  accentColor: keyof typeof ACCENT_STYLES;
}) {
  return (
    <div className="px-5">
      <button
        onClick={onToggle}
        className="w-full pt-5 pb-2.5 flex items-center justify-between group/header rounded-lg transition-colors"
      >
        <div className="flex items-center">
          <span className={`text-[10px] uppercase tracking-widest font-semibold transition-colors ${
            isLight
              ? "text-zinc-500 group-hover/header:text-zinc-600"
              : "text-zinc-500 group-hover/header:text-zinc-400"
          }`}>
            {group.label}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-all duration-200 ${isOpen ? "rotate-0" : "-rotate-90"} ${
            isLight
              ? "text-zinc-400 group-hover/header:text-zinc-600"
              : "text-zinc-600 group-hover/header:text-zinc-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={NAV_ICONS.chevronDown} />
        </svg>
      </button>
      <div
        className={`flex flex-col gap-1 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {group.items.map((item) => (
          <NavLink key={item.href} item={item} isLight={isLight} accentColor={accentColor} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    SITE_CONFIG.defaults.expandedGroups
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Get accent-specific classes
  const accentClasses = {
    emerald: { btn: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 ring-emerald-500/20", gradient: "from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500", shadow: "shadow-emerald-500/20 hover:shadow-emerald-500/30" },
    sky: { btn: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 ring-sky-500/20", gradient: "from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500", shadow: "shadow-sky-500/20 hover:shadow-sky-500/30" },
    violet: { btn: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 ring-violet-500/20", gradient: "from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500", shadow: "shadow-violet-500/20 hover:shadow-violet-500/30" },
    amber: { btn: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 ring-amber-500/20", gradient: "from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500", shadow: "shadow-amber-500/20 hover:shadow-amber-500/30" },
    pink: { btn: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 ring-pink-500/20", gradient: "from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500", shadow: "shadow-pink-500/20 hover:shadow-pink-500/30" },
  };

  const accent = accentClasses[accentColor];
  const accentStyle = ACCENT_STYLES[accentColor];

  return (
    <aside className={`fixed top-0 left-0 w-[260px] h-full flex flex-col z-50 border-r transition-colors ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-[#18181B] border-white/[0.06]"
    }`}>
      {/* Logo Header */}
      <div className={`h-16 px-5 flex items-center border-b ${
        isLight ? "border-zinc-200" : "border-white/[0.04]"
      }`}>
        <Link href={ROUTES.DASHBOARD} className="group">
          <Image
            src="/limewp-logo.svg"
            alt="LimeWP"
            width={140}
            height={40}
            className={`group-hover:opacity-90 transition-opacity ${isLight ? "brightness-0" : ""}`}
            priority
          />
        </Link>
      </div>

      {/* Overview Section */}
      <div className="px-5 pt-5">
        <div className="pt-0 pb-2.5 flex items-center">
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${
            isLight ? "text-zinc-500" : "text-zinc-500"
          }`}>
            Overview
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {NAV_GROUPS[0].items.map((item) => (
            <NavLink key={item.href} item={item} isLight={isLight} accentColor={accentColor} />
          ))}
        </div>
      </div>

      {/* Sites Section */}
      <div className="px-5 mt-4">
        <div className="pt-3 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-widest font-semibold ${
              isLight ? "text-zinc-500" : "text-zinc-500"
            }`}>
              My Sites
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ring-1 ${
              isLight
                ? "bg-violet-100 text-violet-600 ring-violet-200"
                : "bg-violet-500/10 text-violet-500 ring-violet-500/20"
            }`}>
              {SITES_DATA.length}
            </span>
          </div>
          <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 ring-1 ${accent.btn}`}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={NAV_ICONS.plus} />
            </svg>
          </button>
        </div>
        <SiteItems isLight={isLight} accentColor={accentColor} />
      </div>

      {/* Navigation Groups (excluding Overview) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {NAV_GROUPS.slice(1).map((group) => (
          <NavGroupComponent
            key={group.label}
            group={group}
            isOpen={expandedGroups[group.label] ?? true}
            onToggle={() => toggleGroup(group.label)}
            isLight={isLight}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* Promotional Section */}
      <div className="px-3 pb-3">
        <div className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
          isLight
            ? "bg-gradient-to-br from-white to-zinc-50 border-zinc-200 hover:border-zinc-300"
            : `bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] ${accentStyle.border}`
        }`}>
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${accentStyle.glow} via-transparent to-transparent opacity-60`} />
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accentStyle.glowCircle} to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform`} />
          <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${accentStyle.glow} to-transparent rounded-full translate-y-1/2 -translate-x-1/2`} />

          <div className="relative">
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 mb-3 ring-1 ${
              isLight
                ? `${accentStyle.activeBg} ${accentStyle.activeRing}`
                : `${accentStyle.activeBg} ${accentStyle.activeRing}`
            }`}>
              <svg
                className={`w-4 h-4 ${accentStyle.text}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={NAV_ICONS.sparkles} />
              </svg>
              <span className={`text-[10px] font-bold ${accentStyle.text} uppercase tracking-wider`}>
                Pro Plan
              </span>
            </div>

            <p className={`text-[14px] font-semibold mb-1 ${isLight ? "text-zinc-900" : "text-white"}`}>
              Unlock Premium
            </p>
            <p className={`text-[11px] mb-4 leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
              Staging, auto-backups, and priority support.
            </p>

            <Link
              href={ROUTES.BILLING}
              className={`group/btn flex items-center justify-center gap-2 w-full text-[12px] font-semibold text-white bg-gradient-to-r ${accent.gradient} px-4 py-2 rounded-xl transition-all shadow-lg ${accent.shadow}`}
            >
              Upgrade Now
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={NAV_ICONS.arrowRight} />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Help Row */}
      <div className="px-3 pb-4">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors group ${
          isLight
            ? "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300"
            : "bg-[#1E1E21]/50 border-[#27272A] hover:border-[#3F3F46]"
        }`}>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 ring-1 ring-sky-500/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={NAV_ICONS.help} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-[12px] ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Need help?</span>
          </div>
          <Link
            href={ROUTES.SUPPORT}
            className="text-[11px] text-sky-500 hover:text-sky-400 font-semibold flex items-center gap-1 transition-colors"
          >
            Support
            <svg
              className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={NAV_ICONS.chevronRight} />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
