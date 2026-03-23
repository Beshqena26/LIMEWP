"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Avatar } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import {
  ADDONS,
  ADDON_CATEGORIES,
  TIER_STYLES,
  type Addon,
  type AddonCategory,
  type AddonTier,
} from "@/data/site/addons";

export function AddonsTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [addons, setAddons] = useState<Addon[]>(ADDONS);
  const [activeCategory, setActiveCategory] = useState<"all" | AddonCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | AddonTier>("all");
  const [detailAddon, setDetailAddon] = useState<Addon | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uninstallTarget, setUninstallTarget] = useState<Addon | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "features" | "info">("overview");

  /* ── derived ── */
  const installedCount = useMemo(() => addons.filter((a) => a.status !== "available").length, [addons]);
  const activeCount = useMemo(() => addons.filter((a) => a.status === "active").length, [addons]);

  const filteredAddons = useMemo(() => {
    return addons.filter((a) => {
      if (activeCategory !== "all" && a.category !== activeCategory) return false;
      if (tierFilter !== "all" && a.tier !== tierFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [addons, activeCategory, tierFilter, searchQuery]);

  /* ── handlers ── */
  const handleInstall = useCallback(async (addon: Addon) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAddons((prev) => prev.map((a) => (a.id === addon.id ? { ...a, status: "installed" as const } : a)));
    setDetailAddon((prev) => (prev?.id === addon.id ? { ...prev, status: "installed" as const } : prev));
    setActionLoading(false);
    showToast.success(`${addon.name} installed`);
  }, []);

  const handleActivate = useCallback(async (addon: Addon) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAddons((prev) => prev.map((a) => (a.id === addon.id ? { ...a, status: "active" as const } : a)));
    setDetailAddon((prev) => (prev?.id === addon.id ? { ...prev, status: "active" as const } : prev));
    setActionLoading(false);
    showToast.success(`${addon.name} activated`);
  }, []);

  const handleDeactivate = useCallback(async (addon: Addon) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setAddons((prev) => prev.map((a) => (a.id === addon.id ? { ...a, status: "installed" as const } : a)));
    setDetailAddon((prev) => (prev?.id === addon.id ? { ...prev, status: "installed" as const } : prev));
    setActionLoading(false);
    showToast.success(`${addon.name} deactivated`);
  }, []);

  const handleUninstall = useCallback(async () => {
    if (!uninstallTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAddons((prev) => prev.map((a) => (a.id === uninstallTarget.id ? { ...a, status: "available" as const } : a)));
    setDetailAddon((prev) => (prev?.id === uninstallTarget.id ? { ...prev, status: "available" as const } : prev));
    setActionLoading(false);
    setUninstallTarget(null);
    showToast.success(`${uninstallTarget.name} removed`);
  }, [uninstallTarget]);

  /* ── escape key + body scroll lock ── */
  useEffect(() => {
    if (!detailAddon) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailAddon(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [detailAddon]);

  /* ── styles ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400 placeholder:text-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)] placeholder:text-slate-500"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  /* ── render stars ── */
  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < Math.floor(rating) ? "text-amber-400" : isLight ? "text-slate-300" : "text-slate-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className={`text-[10px] ml-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{rating}</span>
    </div>
  );

  /* ── render action buttons for a given addon ── */
  const renderActions = (addon: Addon, compact = false) => {
    const btnH = compact ? "h-8 text-xs" : "h-9 text-sm";
    if (addon.status === "available") {
      return (
        <button
          onClick={() => handleInstall(addon)}
          disabled={actionLoading}
          className={`w-full ${btnH} px-4 rounded-xl text-white font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
        >
          {actionLoading ? <>{spinner} Installing...</> : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
              </svg>
              Install
            </>
          )}
        </button>
      );
    }
    if (addon.status === "installed") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleActivate(addon)}
            disabled={actionLoading}
            className={`flex-1 ${btnH} px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 ring-1 ring-emerald-500/20`}
          >
            {actionLoading ? <>{spinner} Activating...</> : "Activate"}
          </button>
          <button
            onClick={() => setUninstallTarget(addon)}
            disabled={actionLoading}
            aria-label={`Remove ${addon.name}`}
            className={`${btnH} px-3 rounded-xl font-medium transition-colors ${
              isLight ? "text-slate-500 hover:text-rose-500 hover:bg-rose-50" : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            }`}
          >
            Remove
          </button>
        </div>
      );
    }
    // active
    return (
      <div className="flex gap-2">
        <button
          onClick={() => showToast.info(`Opening ${addon.name} settings...`)}
          disabled={actionLoading}
          className={`flex-1 ${btnH} px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 ring-1 ${
            isLight
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200"
              : "bg-[var(--bg-elevated)]/70 text-slate-200 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
          }`}
        >
          Configure
        </button>
        <button
          onClick={() => handleDeactivate(addon)}
          disabled={actionLoading}
          className={`${btnH} px-3 rounded-xl font-medium transition-colors ${
            isLight ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
          }`}
        >
          Deactivate
        </button>
      </div>
    );
  };

  /* ── get the latest addon state (for detail modal) ── */
  const currentDetailAddon = useMemo(() => {
    if (!detailAddon) return null;
    return addons.find((a) => a.id === detailAddon.id) || detailAddon;
  }, [detailAddon, addons]);

  return (
    <>
      {/* ═══════════ Header ═══════════ */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Add-ons</h2>
          <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {installedCount} installed, {activeCount} active
          </p>
        </div>
      </div>

      {/* ═══════════ Search + Filters ═══════════ */}
      <div className={`${cardClass} p-5 mb-5`}>
        {/* Search */}
        <div className="relative mb-4">
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="addon-search"
            type="text"
            placeholder="Search add-ons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Category Pills */}
        <div className="mb-3">
          <p className={`${labelClass} mb-2`}>Category</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 h-8 rounded-xl text-xs font-medium transition-all ${
                activeCategory === "all"
                  ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                  : isLight
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-400 hover:bg-[var(--bg-elevated)]"
              }`}
            >
              All
            </button>
            {ADDON_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 h-8 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.value
                    ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                    : isLight
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                </svg>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Pills */}
        <div>
          <p className={`${labelClass} mb-2`}>Tier</p>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "free", "pro", "enterprise"] as const).map((tier) => {
              const style = tier !== "all" ? TIER_STYLES[tier] : null;
              return (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 h-8 rounded-xl text-xs font-medium transition-all ${
                    tierFilter === tier
                      ? tier === "all"
                        ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                        : `${style!.bg} ${style!.text} ring-1 ${style!.ring}`
                      : isLight
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  {tier === "all" ? "All" : TIER_STYLES[tier].label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════ Addon Grid ═══════════ */}
      {filteredAddons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAddons.map((addon) => {
            const tier = TIER_STYLES[addon.tier];
            return (
              <div
                key={addon.id}
                className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isLight
                    ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                    : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
                }`}
              >
                {/* Gradient stripe */}
                <div className={`h-2 bg-gradient-to-r ${addon.gradient}`} />

                <div className="p-5">
                  {/* Icon + Name + Tier + Status */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar
                      name={addon.icon ? undefined : addon.name.slice(0, 2)}
                      icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d={addon.icon} />
                        </svg>
                      }
                      classNames={{
                        base: `w-12 h-12 shrink-0 bg-gradient-to-br ${addon.gradient}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-[15px] leading-tight truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {addon.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${tier.bg} ${tier.text} ${tier.ring}`}>
                          {tier.label}
                        </span>
                        {addon.status === "active" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold ring-1 ring-emerald-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            Active
                          </span>
                        )}
                        {addon.status === "installed" && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${
                            isLight ? "bg-slate-100 text-slate-500 ring-slate-200" : "bg-slate-500/10 text-slate-400 ring-slate-500/20"
                          }`}>
                            Installed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className={`text-sm font-bold ${addon.price === "Free" ? "text-emerald-500" : isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {addon.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-xs mb-3 line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>
                    {addon.description}
                  </p>

                  {/* Rating + Installs */}
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(addon.rating)}
                    <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {addon.installs} installs
                    </span>
                  </div>

                  {/* Author */}
                  <p className={`text-[11px] mb-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    by {addon.author}
                  </p>

                  {/* Action Buttons */}
                  {renderActions(addon, true)}

                  {/* Details link */}
                  <button
                    onClick={() => { setDetailAddon(addon); setDetailTab("overview"); }}
                    className={`w-full mt-3 text-center text-xs font-medium transition-colors ${
                      isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ═══════════ Empty State ═══════════ */
        <div className={`${cardClass} p-12 text-center`}>
          <svg
            className={`w-12 h-12 mx-auto mb-4 ${isLight ? "text-slate-300" : "text-slate-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>No add-ons found</p>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* ═══════════ Detail Modal ═══════════ */}
      {currentDetailAddon && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setDetailAddon(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="addon-detail-title">
            {/* Gradient Header */}
            <div className={`h-16 bg-gradient-to-r ${currentDetailAddon.gradient} relative`}>
              <button
                onClick={() => setDetailAddon(null)}
                aria-label="Close dialog"
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Icon + Name + Tier + Price */}
              <div className="flex items-start gap-4 -mt-10 mb-5">
                <Avatar
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={currentDetailAddon.icon} />
                    </svg>
                  }
                  classNames={{
                    base: `w-16 h-16 shrink-0 bg-gradient-to-br ${currentDetailAddon.gradient} ring-4 ${isLight ? "ring-white" : "ring-[var(--bg-primary)]"} shadow-lg`,
                  }}
                />
                <div className="pt-6 flex-1 min-w-0">
                  <h3 id="addon-detail-title" className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {currentDetailAddon.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${TIER_STYLES[currentDetailAddon.tier].bg} ${TIER_STYLES[currentDetailAddon.tier].text} ${TIER_STYLES[currentDetailAddon.tier].ring}`}>
                      {TIER_STYLES[currentDetailAddon.tier].label}
                    </span>
                    <span className={`text-sm font-bold ${currentDetailAddon.price === "Free" ? "text-emerald-500" : isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {currentDetailAddon.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className={`flex gap-1 mb-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {(["overview", "features", "info"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px capitalize ${
                      detailTab === tab
                        ? `${accent.text} border-current`
                        : `border-transparent ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[160px]">
                {detailTab === "overview" && (
                  <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {currentDetailAddon.longDescription}
                  </p>
                )}

                {detailTab === "features" && (
                  <ul className="space-y-2.5">
                    {currentDetailAddon.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {detailTab === "info" && (
                  <div className="space-y-3">
                    {[
                      { label: "Version", value: currentDetailAddon.version },
                      { label: "Author", value: currentDetailAddon.author },
                      {
                        label: "Category",
                        value: ADDON_CATEGORIES.find((c) => c.value === currentDetailAddon.category)?.label || currentDetailAddon.category,
                      },
                      { label: "Installs", value: currentDetailAddon.installs },
                    ].map((item) => (
                      <div key={item.label} className={`flex items-center justify-between py-2 border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                        <span className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>{item.label}</span>
                        <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{item.value}</span>
                      </div>
                    ))}
                    <div className={`flex items-center justify-between py-2`}>
                      <span className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Rating</span>
                      <div>{renderStars(currentDetailAddon.rating)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className={`mt-5 pt-5 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {renderActions(currentDetailAddon)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Uninstall Confirm ═══════════ */}
      <ConfirmDialog
        open={!!uninstallTarget}
        onClose={() => setUninstallTarget(null)}
        onConfirm={handleUninstall}
        title={`Remove ${uninstallTarget?.name}?`}
        message="This will uninstall the add-on and remove all its data. You can reinstall it later from the add-ons store."
        confirmText="Remove Add-on"
        variant="danger"
        isLoading={actionLoading}
      />
    </>
  );
}
