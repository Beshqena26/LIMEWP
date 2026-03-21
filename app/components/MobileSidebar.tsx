"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTES, createRoute } from "@/config/routes";
import { NAV_GROUPS, SITES_DATA, NAV_ICONS } from "@/config/navigation";
import { useTheme } from "@/lib/context/ThemeContext";

const ACCENT_STYLES = {
  emerald: { activeBg: "bg-emerald-500/10", activeRing: "ring-emerald-500/20", text: "text-emerald-500", hoverBg: "hover:bg-emerald-500/10", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
  sky: { activeBg: "bg-sky-500/10", activeRing: "ring-sky-500/20", text: "text-sky-500", hoverBg: "hover:bg-sky-500/10", gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20" },
  violet: { activeBg: "bg-violet-500/10", activeRing: "ring-violet-500/20", text: "text-violet-500", hoverBg: "hover:bg-violet-500/10", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
  amber: { activeBg: "bg-amber-500/10", activeRing: "ring-amber-500/20", text: "text-amber-500", hoverBg: "hover:bg-amber-500/10", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20" },
  pink: { activeBg: "bg-pink-500/10", activeRing: "ring-pink-500/20", text: "text-pink-500", hoverBg: "hover:bg-pink-500/10", gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20" },
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme, accentColor, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, searchParams, onClose]);

  // Body scroll lock + Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEsc);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  const activeSiteName = searchParams.get("name");
  const isOnSitePage = pathname === ROUTES.SITE;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[280px] max-w-[85vw] flex flex-col transition-transform duration-200 ease-out border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-[var(--bg-primary)] border-white/[0.06]"
        }`}
      >
        {/* Header */}
        <div className={`h-16 px-5 flex items-center justify-between border-b shrink-0 ${
          isLight ? "border-slate-200" : "border-white/[0.04]"
        }`}>
          <Link href={ROUTES.DASHBOARD} className="group">
            <Image
              src="/limewp-logo.svg"
              alt="LimeWP"
              width={120}
              height={32}
              className={`group-hover:opacity-90 transition-opacity ${isLight ? "brightness-0" : ""}`}
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className={`w-9 h-9 min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center transition-all ${
              isLight
                ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                : "text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Overview Nav */}
          <div className="px-4 pt-4">
            <div className="pb-2">
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                Overview
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_GROUPS[0].items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? `${accent.activeBg} ${accent.text} ring-1 ${accent.activeRing}`
                        : isLight
                        ? `text-slate-600 ${accent.hoverBg}`
                        : `text-slate-400 ${accent.hoverBg}`
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sites */}
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${isLight ? "text-slate-500" : "text-slate-500"}`}>
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
              <Link
                href={ROUTES.NEW_SITE}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ring-1 ${
                  isLight
                    ? `${accent.activeBg} ${accent.text} ${accent.activeRing}`
                    : `${accent.activeBg} ${accent.text} ${accent.activeRing}`
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={NAV_ICONS.plus} />
                </svg>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {SITES_DATA.map((site) => {
                const isActive = isOnSitePage && activeSiteName === site.name;
                return (
                  <Link
                    key={site.name}
                    href={createRoute.site(site.name)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ring-1 ${
                      isActive
                        ? isLight
                          ? `bg-slate-50 ${accent.activeRing} shadow-sm`
                          : `bg-[var(--bg-elevated)] ${accent.activeRing}`
                        : isLight
                        ? "ring-slate-200/60 hover:bg-slate-50"
                        : "ring-transparent hover:bg-[var(--bg-elevated)]/70"
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${site.gradient} flex items-center justify-center ring-2 ${
                        isLight ? "ring-black/[0.04] shadow-md shadow-slate-200/80" : "ring-transparent shadow-lg shadow-black/30"
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d={site.icon} />
                        </svg>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${isLight ? "border-white" : "border-[var(--bg-primary)]"} ${
                          site.status === "online" ? (isLight ? "bg-slate-500" : "bg-slate-400") : "bg-slate-500"
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] font-semibold truncate ${
                        isActive
                          ? isLight ? "text-slate-900" : "text-white"
                          : isLight ? "text-slate-700" : "text-slate-300"
                      }`}>
                        {site.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-medium ${isActive ? accent.text : isLight ? "text-slate-600" : "text-slate-500"}`}>
                          {site.visits} visits
                        </span>
                        <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                        <span className="text-[10px] font-medium text-slate-500 capitalize flex items-center gap-1">
                          {site.status === "online" && <span className={`w-1 h-1 rounded-full ${isLight ? "bg-slate-500" : "bg-slate-400"}`} />}
                          {site.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Operations */}
          {NAV_GROUPS.slice(1).map((group) => (
            <div key={group.label} className="px-4 mt-4">
              <div className="pb-2">
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  {group.label}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? `${accent.activeBg} ${accent.text} ring-1 ${accent.activeRing}`
                          : isLight
                          ? `text-slate-600 ${accent.hoverBg}`
                          : `text-slate-400 ${accent.hoverBg}`
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isActive
                            ? `${accent.activeBg} ${accent.text}`
                            : "bg-violet-500/10 text-violet-500"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Theme Toggle */}
        <div className={`shrink-0 px-4 py-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.04]"}`}>
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isLight
                ? "text-slate-600 hover:bg-slate-100"
                : "text-slate-400 hover:bg-[var(--bg-elevated)]"
            }`}
          >
            {isLight ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
            <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
          </button>

          {/* Upgrade CTA */}
          <Link
            href={ROUTES.BILLING}
            className={`mt-2 flex items-center justify-center gap-2 w-full text-[12px] font-semibold text-white bg-gradient-to-r ${accent.gradient} px-4 py-2.5 rounded-xl transition-all shadow-lg ${accent.shadow}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d={NAV_ICONS.sparkles} />
            </svg>
            Upgrade to Pro
          </Link>
        </div>
      </aside>
    </>
  );
}
