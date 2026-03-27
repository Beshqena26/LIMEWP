"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { plugins as INITIAL_PLUGINS, marketplacePlugins, pluginColorMap, type Plugin } from "@/data/site/plugins";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface PluginsTabProps {
  siteId: string;
}

export function PluginsTab({ siteId }: PluginsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [pluginList, setPluginList] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [deleteTarget, setDeleteTarget] = useState<Plugin | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Plugin | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installTab, setInstallTab] = useState<"browse" | "upload">("browse");
  const [installing, setInstalling] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [settingsTarget, setSettingsTarget] = useState<Plugin | null>(null);

  /* ── handlers ── */

  const handleActivate = useCallback(async (plugin: Plugin) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPluginList((prev) => prev.map((p) => p.id === plugin.id ? { ...p, active: true } : p));
    setActionLoading(false);
    showToast.success(`${plugin.name} activated`);
  }, []);

  const handleDeactivate = useCallback(async () => {
    if (!deactivateTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPluginList((prev) => prev.map((p) => p.id === deactivateTarget.id ? { ...p, active: false } : p));
    setActionLoading(false);
    setDeactivateTarget(null);
    showToast.success(`${deactivateTarget.name} deactivated`);
  }, [deactivateTarget]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPluginList((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setActionLoading(false);
    setDeleteTarget(null);
    showToast.success(`${deleteTarget.name} deleted`);
  }, [deleteTarget]);

  const handleUpdate = useCallback(async (plugin: Plugin) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPluginList((prev) => prev.map((p) => p.id === plugin.id ? { ...p, version: plugin.updateAvailable!, updateAvailable: undefined, lastUpdated: "Just now" } : p));
    setActionLoading(false);
    showToast.success(`${plugin.name} updated to v${plugin.updateAvailable}`);
  }, []);

  const handleInstall = useCallback(async (mp: typeof marketplacePlugins[0]) => {
    setInstalling(mp.id);
    await new Promise((r) => setTimeout(r, 2000));
    const newPlugin: Plugin = {
      id: mp.id, name: mp.name, version: "1.0.0", active: false, autoUpdate: false,
      icon: mp.icon, gradient: mp.gradient, author: mp.author, description: mp.description,
      downloads: mp.downloads, lastUpdated: "Just now", color: mp.color, featured: false,
    };
    setPluginList((prev) => [...prev, newPlugin]);
    setInstalling(null);
    setShowInstallModal(false);
    showToast.success(`${mp.name} installed`);
  }, []);

  const handleSettingsSave = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setActionLoading(false);
    setSettingsTarget(null);
    showToast.success("Plugin settings saved");
  }, []);

  // Escape + body lock
  useEffect(() => {
    const anyModal = showInstallModal || !!settingsTarget;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowInstallModal(false); setSettingsTarget(null); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [showInstallModal, settingsTarget]);

  /* ── styles ── */
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
  }`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const activeCount = pluginList.filter((p) => p.active).length;
  const updatesCount = pluginList.filter((p) => p.updateAvailable).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Plugins</h2>
          <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {pluginList.length} installed, {activeCount} active
            {updatesCount > 0 && <span className="text-amber-500"> &bull; {updatesCount} update{updatesCount > 1 ? "s" : ""} available</span>}
          </p>
        </div>
        <button
          onClick={() => { setShowInstallModal(true); setInstallTab("browse"); }}
          className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Plugin
        </button>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pluginList.map((plugin) => {
          const colors = pluginColorMap[plugin.color] || pluginColorMap.emerald;
          return (
            <div
              key={plugin.id}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-px hover:shadow-lg ${
                isLight
                  ? plugin.active
                    ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                    : "bg-white border-slate-200/70 hover:border-slate-300/50 hover:shadow-slate-200/50"
                  : plugin.active
                    ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
                    : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-white/[0.08] hover:shadow-black/20"
              }`}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${plugin.gradient} rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                    <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${plugin.gradient} ring-2 ring-white/10 flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">{plugin.icon}</span>
                    </div>
                    {plugin.active && (
                      <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 flex items-center justify-center ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-[15px] truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>{plugin.name}</h3>
                      {plugin.featured && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>v{plugin.version}</span>
                      {plugin.active ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md ring-1 ring-emerald-500/20">
                          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md ring-1 ring-slate-500/20">Inactive</span>
                      )}
                      {plugin.autoUpdate && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md ring-1 ring-sky-500/20">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Update banner */}
                {plugin.updateAvailable && (
                  <button
                    onClick={() => handleUpdate(plugin)}
                    className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-500 text-xs font-medium hover:bg-amber-500/15 transition-colors"
                  >
                    <span>Update available: v{plugin.updateAvailable}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" /></svg>
                  </button>
                )}

                <p className={`text-xs mb-4 leading-relaxed line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{plugin.description}</p>

                {/* Meta */}
                <div className={`flex items-center gap-4 mb-4 text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    {plugin.author}
                  </span>
                  <span className={isLight ? "text-slate-300" : "text-slate-600"}>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    {plugin.downloads}
                  </span>
                  <span className={isLight ? "text-slate-300" : "text-slate-600"}>&bull;</span>
                  <span>{plugin.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-2 pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                  {plugin.active ? (
                    <>
                      <button onClick={() => setSettingsTarget(plugin)} className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ring-1 ${
                        isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200" : "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 hover:from-slate-600 hover:to-slate-700 ring-white/5"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                      </button>
                      <button onClick={() => setDeactivateTarget(plugin)} aria-label={`Deactivate ${plugin.name}`} className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all ring-1 ring-amber-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleActivate(plugin)} className="flex-1 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                        Activate
                      </button>
                    </>
                  )}
                  <button onClick={() => setDeleteTarget(plugin)} aria-label={`Delete ${plugin.name}`} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ Deactivate Confirm ═══════ */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title={`Deactivate ${deactivateTarget?.name}?`}
        message="This plugin will be disabled but remain installed. You can reactivate it anytime."
        confirmText="Deactivate"
        variant="warning"
        isLoading={actionLoading}
      />

      {/* ═══════ Delete Confirm ═══════ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.name}?`}
        message={deleteTarget?.active ? "This plugin is currently active. It will be deactivated and permanently removed." : "This will permanently remove the plugin and all its data."}
        confirmText="Delete Plugin"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* ═══════ Settings Modal ═══════ */}
      {settingsTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setSettingsTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="plugin-settings-title">
            <h3 id="plugin-settings-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {settingsTarget.name} Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Auto-update</label>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${settingsTarget.autoUpdate ? "bg-emerald-500/10 text-emerald-400" : isLight ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-400"}`}>
                  {settingsTarget.autoUpdate ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <label htmlFor="plugin-license" className={labelClass}>License Key</label>
                <input id="plugin-license" type="text" placeholder="Enter license key (optional)" className={`${inputClass} mt-1.5`} />
              </div>
              <div>
                <label htmlFor="plugin-config" className={labelClass}>Configuration</label>
                <textarea id="plugin-config" placeholder="Plugin-specific settings..." rows={3} className={`w-full rounded-xl border px-3 py-3 text-sm font-medium outline-none transition-colors resize-y min-h-[80px] mt-1.5 ${
                  isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400 placeholder:text-slate-500" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)] placeholder:text-slate-500"
                }`} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setSettingsTarget(null)} disabled={actionLoading} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>Cancel</button>
              <button onClick={handleSettingsSave} disabled={actionLoading} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                {actionLoading ? <>{spinner} Saving…</> : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Install Plugin Modal ═══════ */}
      {showInstallModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !installing && setShowInstallModal(false)} aria-hidden="true" />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
            isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
          }`} role="dialog" aria-modal="true" aria-labelledby="install-plugin-title">
            <h3 id="install-plugin-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Add Plugin</h3>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-5">
              {(["browse", "upload"] as const).map((tab) => (
                <button key={tab} onClick={() => setInstallTab(tab)} className={`px-4 h-9 rounded-xl text-sm font-medium transition-all ${
                  installTab === tab ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}` : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                }`}>
                  {tab === "browse" ? "Browse Plugins" : "Upload .zip"}
                </button>
              ))}
            </div>

            {installTab === "browse" ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {marketplacePlugins.filter((mp) => !pluginList.some((p) => p.id === mp.id)).map((mp) => {
                  const colors = pluginColorMap[mp.color] || pluginColorMap.emerald;
                  const isInstalling = installing === mp.id;
                  return (
                    <div key={mp.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                      isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${mp.gradient} ring-1 ring-white/10 flex items-center justify-center`}>
                        <span className="text-white text-[10px] font-bold">{mp.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold truncate block ${isLight ? "text-slate-800" : "text-slate-100"}`}>{mp.name}</span>
                        <p className={`text-xs truncate ${isLight ? "text-slate-500" : "text-slate-400"}`}>{mp.author} &bull; {mp.downloads}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(mp.rating) ? "text-amber-400" : "text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => handleInstall(mp)} disabled={!!installing} className={`h-8 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
                        isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)]"
                      }`}>
                        {isInstalling ? <>{spinner} Installing</> : "Install"}
                      </button>
                    </div>
                  );
                })}
                {marketplacePlugins.filter((mp) => !pluginList.some((p) => p.id === mp.id)).length === 0 && (
                  <p className={`text-sm text-center py-8 ${isLight ? "text-slate-400" : "text-slate-500"}`}>All marketplace plugins are already installed</p>
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
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Drop your plugin .zip here</p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>or click to browse files</p>
                </div>
                <button onClick={() => showToast.info("Upload functionality coming soon")} className={`w-full mt-4 h-10 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)]"
                }`}>Upload Plugin</button>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button onClick={() => setShowInstallModal(false)} disabled={!!installing} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
