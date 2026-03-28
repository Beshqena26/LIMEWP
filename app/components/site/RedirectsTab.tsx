"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";
import {
  type Redirect,
  type Redirect404,
  type RedirectType,
  REDIRECT_TYPES,
  INITIAL_REDIRECTS,
  INITIAL_404S,
} from "@/data/site/redirects";

const TYPE_COLORS: Record<RedirectType, { bg: string; text: string; ring: string }> = {
  "301": { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  "302": { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  "307": { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
};

export function RedirectsTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // State
  const [redirects, setRedirects] = useState<Redirect[]>(INITIAL_REDIRECTS);
  const [errors404, setErrors404] = useState<Redirect404[]>(INITIAL_404S);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"redirects" | "404s">("redirects");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Redirect | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Redirect | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testUrl, setTestUrl] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formSource, setFormSource] = useState("");
  const [formDest, setFormDest] = useState("");
  const [formType, setFormType] = useState<RedirectType>("301");
  const [formRegex, setFormRegex] = useState(false);

  // Import state
  const [importText, setImportText] = useState("");

  // Derived
  const activeCount = useMemo(() => redirects.filter((r) => r.enabled).length, [redirects]);

  const filteredRedirects = useMemo(() => {
    if (!searchQuery) return redirects;
    const q = searchQuery.toLowerCase();
    return redirects.filter(
      (r) => r.source.toLowerCase().includes(q) || r.destination.toLowerCase().includes(q)
    );
  }, [redirects, searchQuery]);

  // Redirect chain detection
  const redirectChains = useMemo(() => {
    const chains: { start: Redirect; mid: Redirect; end: Redirect }[] = [];
    for (const a of redirects) {
      for (const b of redirects) {
        if (a.id !== b.id && a.destination === b.source) {
          chains.push({ start: a, mid: b, end: b });
        }
      }
    }
    return chains;
  }, [redirects]);

  // Style classes
  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`;

  // Helpers
  const resetForm = useCallback(() => {
    setFormSource("");
    setFormDest("");
    setFormType("301");
    setFormRegex(false);
  }, []);

  const openAdd = useCallback((prefillSource?: string) => {
    resetForm();
    if (prefillSource) setFormSource(prefillSource);
    setEditTarget(null);
    setShowAddModal(true);
  }, [resetForm]);

  const openEdit = useCallback((r: Redirect) => {
    setFormSource(r.source);
    setFormDest(r.destination);
    setFormType(r.type);
    setFormRegex(r.regex);
    setEditTarget(r);
    setShowAddModal(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setEditTarget(null);
    resetForm();
  }, [resetForm]);

  // Actions
  const handleSave = useCallback(() => {
    if (!formSource.trim() || !formDest.trim()) {
      showToast.error("Source and destination are required");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setRedirects((prev) =>
          prev.map((r) =>
            r.id === editTarget.id
              ? { ...r, source: formSource, destination: formDest, type: formType, regex: formRegex }
              : r
          )
        );
        showToast.success("Redirect updated");
      } else {
        const newRedirect: Redirect = {
          id: `r${Date.now()}`,
          source: formSource,
          destination: formDest,
          type: formType,
          hits: 0,
          enabled: true,
          createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          regex: formRegex,
        };
        setRedirects((prev) => [newRedirect, ...prev]);
        showToast.success("Redirect added");
      }
      setActionLoading(false);
      closeAddModal();
    }, 600);
  }, [formSource, formDest, formType, formRegex, editTarget, closeAddModal]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setRedirects((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast.success("Redirect deleted");
  }, [deleteTarget]);

  const handleToggle = useCallback((id: string, enabled: boolean) => {
    setRedirects((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    showToast.success(enabled ? "Redirect enabled" : "Redirect disabled");
  }, []);

  const handleFixChain = useCallback((startId: string, finalDest: string) => {
    setRedirects((prev) => prev.map((r) => (r.id === startId ? { ...r, destination: finalDest } : r)));
    showToast.success("Redirect chain fixed");
  }, []);

  const handleDismiss404 = useCallback((id: string) => {
    setErrors404((prev) => prev.filter((e) => e.id !== id));
    showToast.success("404 dismissed");
  }, []);

  const handleImport = useCallback(() => {
    if (!importText.trim()) {
      showToast.error("No data to import");
      return;
    }
    const lines = importText.trim().split("\n").filter((l) => l.trim());
    let added = 0;
    const newRedirects: Redirect[] = [];
    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        const type = (parts[2] === "302" || parts[2] === "307" ? parts[2] : "301") as RedirectType;
        newRedirects.push({
          id: `r${Date.now()}-${added}`,
          source: parts[0],
          destination: parts[1],
          type,
          hits: 0,
          enabled: true,
          createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          regex: false,
        });
        added++;
      }
    }
    if (added > 0) {
      setRedirects((prev) => [...newRedirects, ...prev]);
      showToast.success(`Imported ${added} redirect${added !== 1 ? "s" : ""}`);
      setShowImportModal(false);
      setImportText("");
    } else {
      showToast.error("No valid redirects found in input");
    }
  }, [importText]);

  const handleTest = useCallback(() => {
    if (!testUrl.trim()) {
      showToast.error("Enter a URL to test");
      return;
    }
    const match = redirects.find((r) => {
      if (!r.enabled) return false;
      if (r.regex) {
        try {
          return new RegExp(r.source).test(testUrl);
        } catch {
          return false;
        }
      }
      return r.source === testUrl;
    });
    if (match) {
      const typeLabel = REDIRECT_TYPES.find((t) => t.value === match.type)?.label ?? match.type;
      setTestResult(`URL ${testUrl} redirects to ${match.destination} (${typeLabel})`);
    } else {
      setTestResult(`No redirect found for this URL`);
    }
  }, [testUrl, redirects]);

  // Escape key handlers for modals
  useEffect(() => {
    if (!showAddModal && !showImportModal && !showTestModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddModal) closeAddModal();
        if (showImportModal) { setShowImportModal(false); setImportText(""); }
        if (showTestModal) { setShowTestModal(false); setTestUrl(""); setTestResult(null); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showAddModal, showImportModal, showTestModal, closeAddModal]);

  // Body scroll lock for modals
  useEffect(() => {
    if (showAddModal || showImportModal || showTestModal) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showAddModal, showImportModal, showTestModal]);

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Redirects</h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {redirects.length} rules, {activeCount} active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAdd()}
              className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 text-white ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Redirect
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Import
            </button>
            <button
              onClick={() => { setShowTestModal(true); setTestUrl(""); setTestResult(null); }}
              className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test
            </button>
          </div>
        </div>

        {/* Tab pills */}
        <div className={`${cardClass} p-4 mb-5`}>
          <div className="flex gap-1.5 mb-4">
            <button
              onClick={() => setActiveTab("redirects")}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === "redirects"
                  ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                  : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Redirect Rules
              <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === "redirects"
                  ? `${accent.activeBg} ${accent.text}`
                  : isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"
              }`}>
                {redirects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("404s")}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === "404s"
                  ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                  : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              404 Monitor
              {errors404.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                  {errors404.length}
                </span>
              )}
            </button>
          </div>

          {/* Search bar (redirects tab only) */}
          {activeTab === "redirects" && (
            <div className="relative">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="redirect-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by source or destination URL..."
                className={`${inputClass} pl-10 font-mono text-xs`}
              />
            </div>
          )}
        </div>

        {/* Redirects Table */}
        {activeTab === "redirects" && (
          <>
            <div className={`${cardClass} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isLight ? "border-slate-200 bg-slate-50" : "border-white/[0.06] bg-white/[0.02]"}`}>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-16 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Enable</th>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Source &rarr; Destination</th>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-20 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Type</th>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-20 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Hits</th>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-32 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Created</th>
                      <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-24 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRedirects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {searchQuery ? "No redirects match your search" : "No redirect rules configured"}
                        </td>
                      </tr>
                    ) : (
                      filteredRedirects.map((r) => {
                        const tc = TYPE_COLORS[r.type];
                        return (
                          <tr
                            key={r.id}
                            className={`border-b last:border-b-0 transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-white/[0.04] hover:bg-white/[0.02]"}`}
                          >
                            <td className="px-4 py-3">
                              <Toggle enabled={r.enabled} onChange={(val) => handleToggle(r.id, val)} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-mono font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{r.source}</span>
                                {r.regex && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                                    regex
                                  </span>
                                )}
                                <svg className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                <span className={`text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>{r.destination}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full ring-1 text-[10px] font-bold ${tc.bg} ${tc.text} ${tc.ring}`}>
                                {r.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                                {r.hits.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{r.createdAt}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEdit(r)}
                                  aria-label="Edit redirect"
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(r)}
                                  aria-label="Delete redirect"
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-rose-50 hover:text-rose-500" : "text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Redirect chain warning */}
            {redirectChains.length > 0 && (
              <div className={`mt-4 rounded-2xl border p-4 ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/5 border-amber-500/20"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold mb-1 ${isLight ? "text-amber-800" : "text-amber-300"}`}>Redirect chain detected</h4>
                    {redirectChains.map((chain) => (
                      <div key={`${chain.start.id}-${chain.mid.id}`} className="flex items-center gap-2 flex-wrap mb-2">
                        <p className={`text-xs font-mono ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                          {chain.start.source} &rarr; {chain.start.destination} &rarr; {chain.mid.destination}
                        </p>
                        <span className={`text-xs ${isLight ? "text-amber-600" : "text-amber-400/70"}`}>
                          Consider updating {chain.start.source} to redirect directly to {chain.mid.destination}.
                        </span>
                        <button
                          onClick={() => handleFixChain(chain.start.id, chain.mid.destination)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 hover:bg-amber-500/20 transition-colors"
                        >
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 404 Monitor Table */}
        {activeTab === "404s" && (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isLight ? "border-slate-200 bg-slate-50" : "border-white/[0.06] bg-white/[0.02]"}`}>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>URL</th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-20 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Hits</th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-32 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Last Seen</th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-36 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Referrer</th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-48 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {errors404.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        No 404 errors recorded
                      </td>
                    </tr>
                  ) : (
                    errors404.map((e) => (
                      <tr
                        key={e.id}
                        className={`border-b last:border-b-0 transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-white/[0.04] hover:bg-white/[0.02]"}`}
                      >
                        <td className="px-4 py-3">
                          <span className={`text-sm font-mono ${isLight ? "text-slate-800" : "text-slate-200"}`}>{e.url}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${e.hits > 100 ? "text-rose-400" : isLight ? "text-slate-700" : "text-slate-300"}`}>
                            {e.hits.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{e.lastSeen}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{e.referrer}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setActiveTab("redirects"); openAdd(e.url); }}
                              className={`h-7 px-2.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 ${accent.activeBg} ${accent.text} ring-1 ${accent.ring} hover:opacity-80`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Create Redirect
                            </button>
                            <button
                              onClick={() => handleDismiss404(e.id)}
                              className={`h-7 px-2.5 rounded-lg text-[10px] font-medium transition-all border ${isLight ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-400 hover:bg-[var(--bg-elevated)]"}`}
                            >
                              Dismiss
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Redirect Modal */}
      {showAddModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={closeAddModal} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="redirect-modal-title"
            className={modalCardClass}
          >
            <h3
              id="redirect-modal-title"
              className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              {editTarget ? "Edit Redirect" : "Add Redirect"}
            </h3>

            <div className="space-y-4">
              {/* Source URL */}
              <div>
                <label htmlFor="redirect-source" className={labelClass}>Source URL</label>
                <input
                  id="redirect-source"
                  type="text"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="/old-url"
                  className={`${inputClass} font-mono mt-1.5`}
                />
              </div>

              {/* Destination URL */}
              <div>
                <label htmlFor="redirect-dest" className={labelClass}>Destination URL</label>
                <input
                  id="redirect-dest"
                  type="text"
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value)}
                  placeholder="/new-url"
                  className={`${inputClass} font-mono mt-1.5`}
                />
              </div>

              {/* Redirect type cards */}
              <div>
                <span className={labelClass}>Redirect Type</span>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {REDIRECT_TYPES.map((rt) => {
                    const selected = formType === rt.value;
                    const tc = TYPE_COLORS[rt.value];
                    return (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => setFormType(rt.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? `${tc.bg} border-current ${tc.text} ring-1 ${tc.ring}`
                            : isLight
                              ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                              : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-400 hover:border-[var(--border-primary)]"
                        }`}
                      >
                        <div className="text-sm font-bold mb-0.5">{rt.label}</div>
                        <div className={`text-[10px] leading-tight ${selected ? "opacity-80" : isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {rt.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regex toggle */}
              <div className="flex items-center justify-between">
                <label htmlFor="redirect-regex" className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Enable regex matching
                </label>
                <Toggle enabled={formRegex} onChange={setFormRegex} />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={closeAddModal}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 text-white ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : editTarget ? "Save Changes" : "Add Redirect"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { setShowImportModal(false); setImportText(""); }} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-modal-title"
            className={modalCardClass}
          >
            <h3
              id="import-modal-title"
              className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              Import Redirects
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="redirect-import" className={labelClass}>CSV Data</label>
                <textarea
                  id="redirect-import"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={"source,destination,type\n/old,/new,301"}
                  rows={8}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none transition-colors resize-none mt-1.5 ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`}
                />
              </div>
              <p className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                One redirect per line: source,destination,type
              </p>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => { setShowImportModal(false); setImportText(""); }}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all text-white ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Redirect Modal */}
      {showTestModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { setShowTestModal(false); setTestUrl(""); setTestResult(null); }} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="test-modal-title"
            className={modalCardClass}
          >
            <h3
              id="test-modal-title"
              className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              Test Redirect
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="test-url" className={labelClass}>URL to test</label>
                <input
                  id="test-url"
                  type="text"
                  value={testUrl}
                  onChange={(e) => { setTestUrl(e.target.value); setTestResult(null); }}
                  placeholder="Enter URL to test"
                  className={`${inputClass} font-mono mt-1.5`}
                />
              </div>
              {testResult !== null && (
                <div className={`p-3 rounded-xl text-sm ${
                  testResult.startsWith("No")
                    ? isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-400"
                    : isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  {testResult}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => { setShowTestModal(false); setTestUrl(""); setTestResult(null); }}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Close
              </button>
              <button
                onClick={handleTest}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all text-white ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete redirect?"
        message={`This will permanently remove the redirect from ${deleteTarget?.source ?? ""} to ${deleteTarget?.destination ?? ""}. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
