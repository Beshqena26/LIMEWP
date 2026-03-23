"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { Chip } from "@heroui/react";
import { Toggle } from "@/app/components/ui/Toggle";
import { showToast } from "@/lib/toast";
import { cacheStats, cacheColorMap, cachingOptions } from "@/data/site/caching";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface CachingTabProps {
  siteId: string;
}

const TTL_OPTIONS = ["1h", "6h", "12h", "24h", "7d"] as const;

const DEFAULT_EXCLUSIONS = ["/cart", "/checkout", "/my-account", "/wp-admin/*"];

export function CachingTab({ siteId }: CachingTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [cachingToggles, setCachingToggles] = useState<Record<string, boolean>>({ edge: true, fullPage: true, object: false, cdn: true });
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [warming, setWarming] = useState(false);

  // Purge URL
  const [purgeUrl, setPurgeUrl] = useState("");
  const [purging, setPurging] = useState(false);

  // Exclusions
  const [exclusions, setExclusions] = useState<string[]>(DEFAULT_EXCLUSIONS);
  const [showExclusionModal, setShowExclusionModal] = useState(false);
  const [newExclusion, setNewExclusion] = useState("");

  // TTL
  const [ttlSettings, setTtlSettings] = useState<Record<string, string>>({ edge: "24h", fullPage: "6h", object: "1h", cdn: "7d" });
  const [showTtlModal, setShowTtlModal] = useState(false);

  const toggleCaching = (key: string) => {
    const newState = !cachingToggles[key];
    setCachingToggles((prev) => ({ ...prev, [key]: newState }));
    showToast.success(`${cachingOptions.find((o) => o.key === key)?.label} ${newState ? "enabled" : "disabled"}`);
  };

  const handleClearAll = useCallback(async () => {
    setClearingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setClearingAll(false);
    setShowClearAllConfirm(false);
    showToast.success("All caches cleared successfully");
  }, []);

  const handlePurgeUrl = useCallback(async () => {
    if (!purgeUrl.trim()) { showToast.error("Enter a URL to purge"); return; }
    setPurging(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPurging(false);
    showToast.success(`Cache purged for ${purgeUrl}`);
    setPurgeUrl("");
  }, [purgeUrl]);

  const handleWarmup = useCallback(async () => {
    setWarming(true);
    await new Promise((r) => setTimeout(r, 3000));
    setWarming(false);
    showToast.success("Cache warmup complete — 24 pages preloaded");
  }, []);

  const handleAddExclusion = useCallback(() => {
    if (!newExclusion.trim()) { showToast.error("Enter a URL pattern"); return; }
    if (exclusions.includes(newExclusion.trim())) { showToast.error("Pattern already exists"); return; }
    setExclusions((prev) => [...prev, newExclusion.trim()]);
    setNewExclusion("");
    showToast.success("Exclusion added");
  }, [newExclusion, exclusions]);

  const handleRemoveExclusion = useCallback((url: string) => {
    setExclusions((prev) => prev.filter((e) => e !== url));
    showToast.success("Exclusion removed");
  }, []);

  const handleSaveTtl = useCallback(() => {
    setShowTtlModal(false);
    showToast.success("TTL settings saved");
  }, []);

  // Modal escape + body lock
  useEffect(() => {
    const anyModal = showExclusionModal || showTtlModal;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowExclusionModal(false); setShowTtlModal(false); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [showExclusionModal, showTtlModal]);

  /* ── styles ── */
  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <>
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cacheStats.map((stat) => {
            const colors = cacheColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={stat.icon} /></svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Cache Configuration</h3>
            <Chip size="sm" classNames={{ base: "bg-emerald-500/10 border-0", content: "text-emerald-400 font-semibold text-[10px]" }}>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />All systems active</span>
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowTtlModal(true)} className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              TTL
            </button>
            <button onClick={() => setShowExclusionModal(true)} className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              Exclusions
            </button>
            <button onClick={() => setShowClearAllConfirm(true)} className={`h-9 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-lg flex items-center gap-1.5 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Clear All
            </button>
          </div>
        </div>

        {/* Purge URL + Warmup */}
        <div className={`${cardClass} p-5 mb-5`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="purge-url" className={labelClass}>Purge Specific URL</label>
              <div className="flex gap-2 mt-1.5">
                <input id="purge-url" type="text" value={purgeUrl} onChange={(e) => setPurgeUrl(e.target.value)} placeholder="https://example.com/page-to-purge" className={inputClass} />
                <button onClick={handlePurgeUrl} disabled={purging} className={`h-10 px-4 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 flex-shrink-0 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                  {purging ? spinner : "Purge"}
                </button>
              </div>
            </div>
            <div className="sm:border-l sm:pl-3 flex items-end ${isLight ? 'border-slate-200' : 'border-[var(--border-tertiary)]'}">
              <button onClick={handleWarmup} disabled={warming} className={`h-10 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border disabled:opacity-60 ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
                {warming ? (
                  <>{spinner} Warming up...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
                    Warmup Cache
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Caching Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cachingOptions.map((item) => {
            const colors = cacheColorMap[item.color];
            const isOn = cachingToggles[item.key];
            return (
              <div key={item.key} className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 ${
                isLight
                  ? isOn ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-slate-200/50" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                  : `bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] ${isOn ? colors.activeBorder : colors.border} hover:border-[var(--border-primary)] hover:shadow-lg hover:shadow-black/20`
              }`}>
                {isOn && <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70`} />}
                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
                        {isOn && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`} />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-[15px] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{item.label}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isOn ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20"}`}>{isOn ? "Active" : "Inactive"}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"}`}>TTL: {ttlSettings[item.key]}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-500"}`}>{item.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={isOn} onChange={() => toggleCaching(item.key)} />
                  </div>
                  {isOn && (
                    <div className={`flex items-center gap-4 pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Hit rate:</span>
                        <span className={`text-xs font-semibold ${colors.text}`}>{item.hitRate}</span>
                      </div>
                      <div className={`w-px h-4 ${isLight ? "bg-slate-300" : "bg-[var(--border-primary)]"}`} />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Objects:</span>
                        <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>{item.objects}</span>
                      </div>
                      <div className="ml-auto">
                        <button onClick={() => showToast.success(`Cache cleared for ${item.label}`)} className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all ring-1 flex items-center gap-1.5 ${isLight ? "bg-slate-100 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 ring-slate-200 hover:ring-rose-500/30" : "bg-[var(--bg-elevated)]/70 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 ring-[var(--border-primary)] hover:ring-rose-500/30"}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════ Clear All Confirm ═══════ */}
      <ConfirmDialog
        open={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear all caches?"
        message="This will purge all cached content across Edge, Full Page, Object, and CDN caches. Your site may be temporarily slower while caches rebuild."
        confirmText="Clear All Caches"
        variant="warning"
        isLoading={clearingAll}
      />

      {/* ═══════ Cache Exclusions Modal ═══════ */}
      {showExclusionModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowExclusionModal(false)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="exclusion-modal-title">
            <h3 id="exclusion-modal-title" className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Cache Exclusions</h3>
            <p className={`text-xs mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>URLs matching these patterns will never be cached</p>

            <div className="space-y-4">
              {/* Add new */}
              <div className="flex gap-2">
                <input type="text" value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} placeholder="/path-to-exclude" className={`${inputClass} font-mono text-xs`} onKeyDown={(e) => { if (e.key === "Enter") handleAddExclusion(); }} />
                <button onClick={handleAddExclusion} className={`h-10 px-4 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex-shrink-0 ${accent.button} ${accent.buttonHover}`}>Add</button>
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {exclusions.map((url) => (
                  <div key={url} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`}>
                    <span className={`text-xs font-mono ${isLight ? "text-slate-700" : "text-slate-300"}`}>{url}</span>
                    <button onClick={() => handleRemoveExclusion(url)} aria-label={`Remove ${url}`} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-red-50 hover:text-red-500" : "text-slate-500 hover:bg-red-500/10 hover:text-red-400"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {exclusions.length === 0 && <p className={`text-xs text-center py-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}>No exclusions configured</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setShowExclusionModal(false)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TTL Settings Modal ═══════ */}
      {showTtlModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowTtlModal(false)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="ttl-modal-title">
            <h3 id="ttl-modal-title" className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Cache TTL Settings</h3>
            <p className={`text-xs mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>How long cached content stays valid before expiring</p>

            <div className="space-y-5">
              {cachingOptions.map((item) => (
                <div key={item.key}>
                  <label className={`text-sm font-medium block mb-2 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{item.label}</label>
                  <div className={`inline-flex rounded-xl p-1 ${isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"}`}>
                    {TTL_OPTIONS.map((opt) => (
                      <button key={opt} onClick={() => setTtlSettings((prev) => ({ ...prev, [item.key]: opt }))} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        ttlSettings[item.key] === opt ? `${accent.activeBg} ${accent.text}` : isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                      }`}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowTtlModal(false)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>Cancel</button>
              <button onClick={handleSaveTtl} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>Save TTL</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
