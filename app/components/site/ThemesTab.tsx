"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { THEMES, THEME_COLOR_MAP, MARKETPLACE_THEMES, type Theme } from "@/data/site/themes";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface ThemesTabProps {
  siteId: string;
}

export function ThemesTab({ siteId }: ThemesTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [themes, setThemes] = useState<Theme[]>(THEMES);
  const [activateTarget, setActivateTarget] = useState<Theme | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);
  const [customizeTarget, setCustomizeTarget] = useState<Theme | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installTab, setInstallTab] = useState<"browse" | "upload">("browse");
  const [installing, setInstalling] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleActivate = useCallback(async () => {
    if (!activateTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setThemes((prev) => prev.map((t) => ({ ...t, active: t.id === activateTarget.id })));
    setActionLoading(false);
    setActivateTarget(null);
    showToast.success(`${activateTarget.name} activated`);
  }, [activateTarget]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setThemes((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setActionLoading(false);
    setDeleteTarget(null);
    showToast.success(`${deleteTarget.name} deleted`);
  }, [deleteTarget]);

  const handleCustomizeSave = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setActionLoading(false);
    setCustomizeTarget(null);
    showToast.success("Theme customization saved");
  }, []);

  const handleInstallTheme = useCallback(async (id: string, name: string) => {
    setInstalling(id);
    await new Promise((r) => setTimeout(r, 2000));
    const newTheme: Theme = {
      id, name, version: "1.0.0", active: false,
      gradient: "from-sky-600 via-blue-600 to-indigo-600",
      image: MARKETPLACE_THEMES.find((t) => t.id === id)?.image || "",
      author: MARKETPLACE_THEMES.find((t) => t.id === id)?.author || "",
      description: MARKETPLACE_THEMES.find((t) => t.id === id)?.description || "",
      lastUpdated: "Just now", color: MARKETPLACE_THEMES.find((t) => t.id === id)?.color || "sky",
    };
    setThemes((prev) => [...prev, newTheme]);
    setInstalling(null);
    setShowInstallModal(false);
    showToast.success(`${name} installed`);
  }, []);

  const handleUpdateTheme = useCallback(async (theme: Theme) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setThemes((prev) => prev.map((t) => t.id === theme.id ? { ...t, version: theme.updateAvailable!, updateAvailable: undefined, lastUpdated: "Just now" } : t));
    setActionLoading(false);
    showToast.success(`${theme.name} updated to v${theme.updateAvailable}`);
  }, []);

  // Escape key + body lock for modals
  useEffect(() => {
    if (!customizeTarget && !showInstallModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setCustomizeTarget(null); setShowInstallModal(false); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [customizeTarget, showInstallModal]);

  /* ── styles ── */
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Installed Themes</h2>
          <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{themes.length} themes installed</p>
        </div>
        <button
          onClick={() => { setShowInstallModal(true); setInstallTab("browse"); }}
          className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Install Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {themes.map((theme) => {
          const colors = THEME_COLOR_MAP[theme.color] || THEME_COLOR_MAP.emerald;
          return (
            <div
              key={theme.id}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isLight
                  ? theme.active
                    ? "bg-white border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-slate-200/50"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : theme.active
                    ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-black/20"
                    : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
              }`}
            >
              {/* Theme Preview Image */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={theme.image}
                  alt={`${theme.name} preview`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay for readability */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent`} />

                {/* Active badge */}
                {theme.active && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Active
                    </span>
                  </div>
                )}

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <button
                    onClick={() => showToast.info(`Previewing ${theme.name}...`)}
                    aria-label="Preview theme"
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  {theme.active && (
                    <button
                      onClick={() => setCustomizeTarget(theme)}
                      aria-label="Customize theme"
                      className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold text-[15px] leading-tight ${isLight ? "text-slate-800" : "text-slate-100"}`}>{theme.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex-shrink-0`}>
                    v{theme.version}
                  </span>
                </div>

                {theme.updateAvailable && (
                  <button
                    onClick={() => handleUpdateTheme(theme)}
                    className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-500 text-xs font-medium hover:bg-amber-500/15 transition-colors"
                  >
                    <span>Update available: v{theme.updateAvailable}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                    </svg>
                  </button>
                )}

                <p className={`text-xs mb-3 line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{theme.description}</p>

                <div className={`flex items-center gap-3 mb-4 text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {theme.author}
                  </div>
                  <span className={isLight ? "text-slate-300" : "text-slate-600"}>&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {theme.lastUpdated}
                  </div>
                </div>

                {/* Actions */}
                {theme.active ? (
                  <button
                    onClick={() => setCustomizeTarget(theme)}
                    className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                    Customize
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActivateTarget(theme)}
                      className={`flex-1 h-9 rounded-xl text-sm font-medium transition-all ring-1 flex items-center justify-center gap-1.5 ${
                        isLight
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200"
                          : "bg-[var(--bg-elevated)]/70 text-slate-200 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Activate
                    </button>
                    <button
                      onClick={() => setDeleteTarget(theme)}
                      aria-label={`Delete ${theme.name}`}
                      className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════ Activate Confirm ═══════════ */}
      <ConfirmDialog
        open={!!activateTarget}
        onClose={() => setActivateTarget(null)}
        onConfirm={handleActivate}
        title={`Activate ${activateTarget?.name}?`}
        message="This will deactivate the current theme and activate the selected one. Your site's appearance will change immediately."
        confirmText="Activate Theme"
        variant="info"
        isLoading={actionLoading}
      />

      {/* ═══════════ Delete Confirm ═══════════ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.name}?`}
        message="This will permanently remove the theme and all its customizations. This action cannot be undone."
        confirmText="Delete Theme"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* ═══════════ Customize Modal ═══════════ */}
      {customizeTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setCustomizeTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="customize-theme-title">
            <h3 id="customize-theme-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Customize {customizeTarget.name}
            </h3>

            <div className="space-y-4">
              {/* Site Title */}
              <div>
                <label htmlFor="theme-site-title" className={labelClass}>Site Title</label>
                <input id="theme-site-title" type="text" defaultValue={siteId} className={`${inputClass} mt-1.5`} />
              </div>

              {/* Tagline */}
              <div>
                <label htmlFor="theme-tagline" className={labelClass}>Tagline</label>
                <input id="theme-tagline" type="text" defaultValue="Just another WordPress site" placeholder="Your site's tagline" className={`${inputClass} mt-1.5`} />
              </div>

              {/* Primary Color */}
              <div>
                <label htmlFor="theme-color" className={labelClass}>Primary Color</label>
                <div className="flex items-center gap-3 mt-1.5">
                  <input id="theme-color" type="color" defaultValue="#10b981" className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                  <input type="text" defaultValue="#10b981" className={`${inputClass} font-mono flex-1`} />
                </div>
              </div>

              {/* Layout */}
              <div>
                <label htmlFor="theme-layout" className={labelClass}>Layout</label>
                <div className="relative mt-1.5">
                  <select id="theme-layout" defaultValue="boxed" className={`${inputClass} appearance-none`}>
                    <option value="full-width">Full Width</option>
                    <option value="boxed">Boxed</option>
                    <option value="framed">Framed</option>
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Custom CSS */}
              <div>
                <label htmlFor="theme-css" className={labelClass}>Custom CSS</label>
                <textarea
                  id="theme-css"
                  defaultValue=""
                  placeholder="/* Add your custom styles here */"
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-3 text-xs font-mono font-medium outline-none transition-colors resize-y min-h-[80px] mt-1.5 ${
                    isLight
                      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400 placeholder:text-slate-400"
                      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)] placeholder:text-slate-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setCustomizeTarget(null)}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCustomizeSave}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {actionLoading ? <>{spinner} Saving…</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Theme Modal */}
      {showInstallModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !installing && setShowInstallModal(false)} aria-hidden="true" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
            isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
          }`} role="dialog" aria-modal="true" aria-labelledby="install-theme-title">
            <h3 id="install-theme-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Install Theme
            </h3>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-5">
              {(["browse", "upload"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInstallTab(tab)}
                  className={`px-4 h-9 rounded-xl text-sm font-medium transition-all ${
                    installTab === tab
                      ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                      : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  {tab === "browse" ? "Browse Themes" : "Upload .zip"}
                </button>
              ))}
            </div>

            {installTab === "browse" ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {MARKETPLACE_THEMES.filter((mt) => !themes.some((t) => t.id === mt.id)).map((mt) => {
                  const colors = THEME_COLOR_MAP[mt.color] || THEME_COLOR_MAP.emerald;
                  const isInstalling = installing === mt.id;
                  return (
                    <div key={mt.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                      isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}>
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={mt.image} alt={mt.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>{mt.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{mt.installs}</span>
                        </div>
                        <p className={`text-xs truncate ${isLight ? "text-slate-500" : "text-slate-400"}`}>{mt.author}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(mt.rating) ? "text-amber-400" : "text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className={`text-[10px] ml-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{mt.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInstallTheme(mt.id, mt.name)}
                        disabled={!!installing}
                        className={`h-8 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
                          isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)]"
                        }`}
                      >
                        {isInstalling ? <>{spinner} Installing</> : "Install"}
                      </button>
                    </div>
                  );
                })}
                {MARKETPLACE_THEMES.filter((mt) => !themes.some((t) => t.id === mt.id)).length === 0 && (
                  <p className={`text-sm text-center py-8 ${isLight ? "text-slate-400" : "text-slate-500"}`}>All marketplace themes are already installed</p>
                )}
              </div>
            ) : (
              <div>
                <div className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  isLight ? "border-slate-300 hover:border-slate-400 bg-slate-50" : "border-[var(--border-primary)] hover:border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"
                }`}>
                  <svg className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    Drop your theme .zip here
                  </p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    or click to browse files
                  </p>
                </div>
                <button
                  onClick={() => { showToast.info("Upload functionality coming soon"); }}
                  className={`w-full mt-4 h-10 rounded-xl text-sm font-medium transition-colors ${
                    isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)]"
                  }`}
                >
                  Upload Theme
                </button>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowInstallModal(false)}
                disabled={!!installing}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
