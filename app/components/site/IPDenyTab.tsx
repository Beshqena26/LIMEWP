"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";
import {
  type BlockedIP,
  type BlockedAttempt,
  type WhitelistedIP,
  type AutoBanRule,
  type BanDuration,
  type BanReason,
  BAN_REASONS,
  BAN_DURATIONS,
  BLOCKED_IPS,
  BLOCKED_ATTEMPTS,
  WHITELISTED_IPS,
  AUTO_BAN_RULES,
  COUNTRY_LIST,
} from "@/data/site/ipdeny";

function countryFlag(code: string) {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65));
}

const REASON_COLORS: Record<BanReason, { bg: string; text: string; ring: string }> = {
  "brute-force": { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20" },
  spam: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  scraping: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  manual: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  "auto-rule": { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
};

const METHOD_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  GET: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  POST: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
};

export function IPDenyTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Data state
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(BLOCKED_IPS);
  const [attempts, setAttempts] = useState<BlockedAttempt[]>(BLOCKED_ATTEMPTS);
  const [whitelist, setWhitelist] = useState<WhitelistedIP[]>(WHITELISTED_IPS);
  const [autoRules, setAutoRules] = useState<AutoBanRule[]>(AUTO_BAN_RULES);

  // UI state
  const [activeTab, setActiveTab] = useState<"blocked" | "attempts" | "whitelist" | "rules">("blocked");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlockedIP | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formIP, setFormIP] = useState("");
  const [formReason, setFormReason] = useState<BanReason>("manual");
  const [formDuration, setFormDuration] = useState<BanDuration>("permanent");
  const [formNote, setFormNote] = useState("");

  // Bulk import state
  const [bulkIPs, setBulkIPs] = useState("");
  const [bulkReason, setBulkReason] = useState<BanReason>("manual");
  const [bulkDuration, setBulkDuration] = useState<BanDuration>("permanent");

  // Whitelist form
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [whitelistIP, setWhitelistIP] = useState("");
  const [whitelistLabel, setWhitelistLabel] = useState("");
  const [whitelistDeleteTarget, setWhitelistDeleteTarget] = useState<WhitelistedIP | null>(null);

  // Country block
  const [blockedCountries, setBlockedCountries] = useState<Set<string>>(new Set());
  const [countrySearch, setCountrySearch] = useState("");

  // Style classes
  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  // Filtered data
  const filteredBlockedIPs = useMemo(() => {
    if (!searchQuery) return blockedIPs;
    const q = searchQuery.toLowerCase();
    return blockedIPs.filter(
      (b) => b.ip.toLowerCase().includes(q) || b.note.toLowerCase().includes(q) || b.country.toLowerCase().includes(q)
    );
  }, [blockedIPs, searchQuery]);

  const filteredAttempts = useMemo(() => {
    if (!searchQuery) return attempts;
    const q = searchQuery.toLowerCase();
    return attempts.filter(
      (a) => a.ip.toLowerCase().includes(q) || a.url.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
    );
  }, [attempts, searchQuery]);

  const filteredWhitelist = useMemo(() => {
    if (!searchQuery) return whitelist;
    const q = searchQuery.toLowerCase();
    return whitelist.filter(
      (w) => w.ip.toLowerCase().includes(q) || w.label.toLowerCase().includes(q)
    );
  }, [whitelist, searchQuery]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRY_LIST;
    const q = countrySearch.toLowerCase();
    return COUNTRY_LIST.filter((c) => c.name.toLowerCase().includes(q));
  }, [countrySearch]);

  // Helpers
  const resetForm = useCallback(() => {
    setFormIP("");
    setFormReason("manual");
    setFormDuration("permanent");
    setFormNote("");
  }, []);

  const openAddModal = useCallback((prefillIP?: string) => {
    resetForm();
    if (prefillIP) setFormIP(prefillIP);
    setShowAddModal(true);
  }, [resetForm]);

  // Actions
  const handleBlockIP = useCallback(() => {
    if (!formIP.trim()) {
      showToast.error("IP address is required");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      const newIP: BlockedIP = {
        id: `b${Date.now()}`,
        ip: formIP.trim(),
        reason: formReason,
        note: formNote,
        hits: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        expiresAt: formDuration === "permanent" ? null : "Calculated on save",
        country: "Unknown",
        countryCode: "XX",
      };
      setBlockedIPs((prev) => [newIP, ...prev]);
      setActionLoading(false);
      setShowAddModal(false);
      resetForm();
      showToast.success(`Blocked ${formIP.trim()}`);
    }, 600);
  }, [formIP, formReason, formDuration, formNote, resetForm]);

  const handleUnblock = useCallback(() => {
    if (!deleteTarget) return;
    setBlockedIPs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast.success(`Unblocked ${deleteTarget.ip}`);
  }, [deleteTarget]);

  const handleBulkImport = useCallback(() => {
    if (!bulkIPs.trim()) {
      showToast.error("Enter at least one IP address");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      const lines = bulkIPs.trim().split("\n").filter((l) => l.trim());
      const newIPs: BlockedIP[] = lines.map((line, i) => ({
        id: `b${Date.now()}-${i}`,
        ip: line.trim(),
        reason: bulkReason,
        note: "Bulk import",
        hits: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        expiresAt: bulkDuration === "permanent" ? null : "Calculated on save",
        country: "Unknown",
        countryCode: "XX",
      }));
      setBlockedIPs((prev) => [...newIPs, ...prev]);
      setActionLoading(false);
      setShowBulkModal(false);
      setBulkIPs("");
      showToast.success(`Blocked ${newIPs.length} IP${newIPs.length !== 1 ? "s" : ""}`);
    }, 600);
  }, [bulkIPs, bulkReason, bulkDuration]);

  const handleAddWhitelist = useCallback(() => {
    if (!whitelistIP.trim()) {
      showToast.error("IP address is required");
      return;
    }
    const newW: WhitelistedIP = {
      id: `w${Date.now()}`,
      ip: whitelistIP.trim(),
      label: whitelistLabel.trim() || "Untitled",
      addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setWhitelist((prev) => [newW, ...prev]);
    setShowWhitelistModal(false);
    setWhitelistIP("");
    setWhitelistLabel("");
    showToast.success(`Added ${whitelistIP.trim()} to whitelist`);
  }, [whitelistIP, whitelistLabel]);

  const handleRemoveWhitelist = useCallback(() => {
    if (!whitelistDeleteTarget) return;
    setWhitelist((prev) => prev.filter((w) => w.id !== whitelistDeleteTarget.id));
    setWhitelistDeleteTarget(null);
    showToast.success("Removed from whitelist");
  }, [whitelistDeleteTarget]);

  const handleToggleRule = useCallback((id: string, enabled: boolean) => {
    setAutoRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    const rule = autoRules.find((r) => r.id === id);
    showToast.success(`${rule?.name ?? "Rule"} ${enabled ? "enabled" : "disabled"}`);
  }, [autoRules]);

  const handleSaveCountries = useCallback(() => {
    setShowCountryModal(false);
    setCountrySearch("");
    showToast.success(`${blockedCountries.size} ${blockedCountries.size === 1 ? "country" : "countries"} blocked`);
  }, [blockedCountries]);

  const toggleCountry = useCallback((country: string) => {
    setBlockedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(country)) {
        next.delete(country);
      } else {
        next.add(country);
      }
      return next;
    });
  }, []);

  // Escape key + body lock for modals
  useEffect(() => {
    const anyModal = showAddModal || showBulkModal || showCountryModal || showWhitelistModal;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
        setShowBulkModal(false);
        setShowCountryModal(false);
        setShowWhitelistModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showAddModal, showBulkModal, showCountryModal, showWhitelistModal]);

  // Reset search on tab change
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const thClass = `text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const trHoverClass = `border-b last:border-b-0 transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)] hover:bg-[var(--bg-primary)]/50"}`;
  const theadRowClass = `border-b ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`;
  const secondaryBtnClass = `h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`;
  const primaryBtnClass = `h-9 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-lg flex items-center gap-1.5 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`;

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>IP Deny Manager</h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {blockedIPs.length} blocked, {attempts.length} blocked today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openAddModal()} className={primaryBtnClass}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Block IP
            </button>
            <button onClick={() => setShowBulkModal(true)} className={secondaryBtnClass}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Bulk Import
            </button>
            <button onClick={() => setShowCountryModal(true)} className={secondaryBtnClass}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Country Block
            </button>
          </div>
        </div>

        {/* Tab pills */}
        <div className={`${cardClass} p-4 mb-5`}>
          <div className="flex gap-1.5 mb-4">
            {([
              { key: "blocked" as const, label: "Blocked IPs", count: blockedIPs.length, icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" },
              { key: "attempts" as const, label: "Blocked Attempts", count: attempts.length, icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z", red: true },
              { key: "whitelist" as const, label: "Whitelist", count: whitelist.length, icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
              { key: "rules" as const, label: "Auto-Ban Rules", count: autoRules.length, icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                    : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  tab.red && tab.key !== (activeTab as string)
                    ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"
                    : activeTab === tab.key
                      ? `${accent.activeBg} ${accent.text}`
                      : isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="ipdeny-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "blocked" ? "Search blocked IPs, notes, countries..." :
                activeTab === "attempts" ? "Search IPs, URLs, countries..." :
                activeTab === "whitelist" ? "Search IPs or labels..." :
                "Search rules..."
              }
              className={`${inputClass} pl-10 font-mono text-xs`}
            />
          </div>
        </div>

        {/* Blocked IPs Table */}
        {activeTab === "blocked" && (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={theadRowClass}>
                    <th className={thClass}>IP Address</th>
                    <th className={thClass}>Reason</th>
                    <th className={`${thClass} hidden lg:table-cell`}>Note</th>
                    <th className={`${thClass} w-16`}>Hits</th>
                    <th className={`${thClass} w-28`}>Blocked</th>
                    <th className={`${thClass} w-28`}>Expires</th>
                    <th className={`${thClass} w-20`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlockedIPs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        {searchQuery ? "No blocked IPs match your search" : "No blocked IPs"}
                      </td>
                    </tr>
                  ) : (
                    filteredBlockedIPs.map((b) => {
                      const rc = REASON_COLORS[b.reason];
                      const isCIDR = b.ip.includes("/");
                      return (
                        <tr key={b.id} className={trHoverClass}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm" aria-hidden="true">{countryFlag(b.countryCode)}</span>
                              <span className={`text-sm font-mono font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{b.ip}</span>
                              {isCIDR && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20">
                                  range
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ring-1 text-[10px] font-bold ${rc.bg} ${rc.text} ${rc.ring}`}>
                              {BAN_REASONS.find((r) => r.value === b.reason)?.label ?? b.reason}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className={`text-xs truncate block max-w-[200px] ${isLight ? "text-slate-500" : "text-slate-400"}`} title={b.note}>
                              {b.note}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                              {b.hits.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{b.createdAt}</span>
                          </td>
                          <td className="px-4 py-3">
                            {b.expiresAt ? (
                              <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{b.expiresAt}</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20">
                                Permanent
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setDeleteTarget(b)}
                              aria-label={`Unblock ${b.ip}`}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-rose-50 hover:text-rose-500" : "text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blocked Attempts Table */}
        {activeTab === "attempts" && (
          <div className={`${cardClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={theadRowClass}>
                    <th className={thClass}>IP</th>
                    <th className={thClass}>URL</th>
                    <th className={`${thClass} w-20`}>Method</th>
                    <th className={`${thClass} w-28`}>Time</th>
                    <th className={`${thClass} w-36`}>Country</th>
                    <th className={`${thClass} w-24`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        {searchQuery ? "No attempts match your search" : "No blocked attempts recorded"}
                      </td>
                    </tr>
                  ) : (
                    filteredAttempts.map((a) => {
                      const mc = METHOD_COLORS[a.method] ?? METHOD_COLORS.GET;
                      return (
                        <tr key={a.id} className={trHoverClass}>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-mono font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{a.ip}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-mono truncate block max-w-[260px] ${isLight ? "text-slate-600" : "text-slate-400"}`} title={a.url}>
                              {a.url}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ring-1 text-[10px] font-bold ${mc.bg} ${mc.text} ${mc.ring}`}>
                              {a.method}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{a.time}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                              <span aria-hidden="true">{countryFlag(a.countryCode)}</span>{" "}{a.country}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openAddModal(a.ip)}
                              aria-label={`Block ${a.ip}`}
                              className={`h-7 px-2.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${isLight ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 ring-1 ring-rose-500/20"}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Block
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Whitelist Table */}
        {activeTab === "whitelist" && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowWhitelistModal(true)} className={primaryBtnClass}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add to Whitelist
              </button>
            </div>
            <div className={`${cardClass} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={theadRowClass}>
                      <th className={thClass}>IP Address</th>
                      <th className={thClass}>Label</th>
                      <th className={`${thClass} w-32`}>Added</th>
                      <th className={`${thClass} w-20`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWhitelist.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {searchQuery ? "No whitelisted IPs match your search" : "No whitelisted IPs"}
                        </td>
                      </tr>
                    ) : (
                      filteredWhitelist.map((w) => (
                        <tr key={w.id} className={trHoverClass}>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-mono font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{w.ip}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>{w.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{w.addedAt}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setWhitelistDeleteTarget(w)}
                              aria-label={`Remove ${w.ip} from whitelist`}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-rose-50 hover:text-rose-500" : "text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Auto-Ban Rules (Cards) */}
        {activeTab === "rules" && (
          <div className="grid gap-4">
            {autoRules.map((rule) => (
              <div key={rule.id} className={`${cardClass} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${rule.enabled ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
                        <svg className={`w-4.5 h-4.5 ${rule.enabled ? "text-emerald-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{rule.name}</h3>
                        <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 ml-12">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-300"}`}>
                        Threshold: {rule.threshold} requests
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-300"}`}>
                        Window: {rule.window}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-300"}`}>
                        Ban: {BAN_DURATIONS.find((d) => d.value === rule.duration)?.label ?? rule.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <Toggle enabled={rule.enabled} onChange={(val) => handleToggleRule(rule.id, val)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block IP Modal */}
      {showAddModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="block-ip-title">
          <div className={modalBackdropClass} onClick={() => setShowAddModal(false)} />
          <div className={modalCardClass}>
            <h3 id="block-ip-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Block IP Address</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="block-ip" className={labelClass}>IP Address</label>
                <input
                  id="block-ip"
                  type="text"
                  value={formIP}
                  onChange={(e) => setFormIP(e.target.value)}
                  placeholder="192.168.1.0 or 192.168.1.0/24"
                  className={`${inputClass} mt-1.5 font-mono`}
                />
              </div>

              <div>
                <label htmlFor="block-reason" className={labelClass}>Reason</label>
                <select
                  id="block-reason"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value as BanReason)}
                  className={`${inputClass} mt-1.5`}
                >
                  {BAN_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className={labelClass}>Duration</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {BAN_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setFormDuration(d.value)}
                      className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                        formDuration === d.value
                          ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                          : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="block-note" className={labelClass}>Note</label>
                <textarea
                  id="block-note"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Optional note..."
                  rows={3}
                  className={`${inputClass} mt-1.5 h-auto py-2 resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className={secondaryBtnClass}>Cancel</button>
              <button onClick={handleBlockIP} disabled={actionLoading} className={`${primaryBtnClass} disabled:opacity-60`}>
                {actionLoading ? spinner : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Block IP
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="bulk-import-title">
          <div className={modalBackdropClass} onClick={() => setShowBulkModal(false)} />
          <div className={modalCardClass}>
            <h3 id="bulk-import-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Bulk Import IPs</h3>

            <div className="space-y-4">
              {/* CSV file upload */}
              <div>
                <label className={labelClass}>Upload CSV File</label>
                <div className={`mt-1.5 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${isLight ? "border-slate-300 hover:border-slate-400 bg-slate-50" : "border-[var(--border-primary)] hover:border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".csv,.txt";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const text = ev.target?.result as string;
                        setBulkIPs((prev) => prev ? prev + "\n" + text.trim() : text.trim());
                        showToast.success(`Loaded ${text.trim().split("\n").length} IPs from ${file.name}`);
                      };
                      reader.readAsText(file);
                    };
                    input.click();
                  }}
                >
                  <svg className={`w-6 h-6 mx-auto mb-2 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  <p className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>Click to upload .csv or .txt</p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>One IP per line, or CSV format: ip,reason,note</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                <div className="flex-1 h-px bg-current" />
                <span className="text-[10px] font-medium">OR PASTE</span>
                <div className="flex-1 h-px bg-current" />
              </div>

              <div>
                <label htmlFor="bulk-ips" className={labelClass}>IP Addresses</label>
                <textarea
                  id="bulk-ips"
                  value={bulkIPs}
                  onChange={(e) => setBulkIPs(e.target.value)}
                  placeholder={"192.168.1.1\n10.0.0.0/24\n172.16.0.5,brute-force,Suspicious activity"}
                  rows={6}
                  className={`${inputClass} mt-1.5 h-auto py-2 resize-none font-mono text-xs`}
                />
              </div>

              <div>
                <label htmlFor="bulk-reason" className={labelClass}>Reason</label>
                <select
                  id="bulk-reason"
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value as BanReason)}
                  className={`${inputClass} mt-1.5`}
                >
                  {BAN_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className={labelClass}>Duration</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {BAN_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setBulkDuration(d.value)}
                      className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                        bulkDuration === d.value
                          ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                          : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowBulkModal(false)} className={secondaryBtnClass}>Cancel</button>
              <button onClick={handleBulkImport} disabled={actionLoading} className={`${primaryBtnClass} disabled:opacity-60`}>
                {actionLoading ? spinner : "Block All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Country Block Modal */}
      {showCountryModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="country-block-title">
          <div className={modalBackdropClass} onClick={() => setShowCountryModal(false)} />
          <div className={modalCardClass}>
            <h3 id="country-block-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Block Countries</h3>

            <div className="mb-3">
              <div className="relative">
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="country-search"
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..."
                  className={`${inputClass} pl-10 text-xs`}
                />
              </div>
            </div>

            <div className={`max-h-64 overflow-y-auto rounded-xl border p-2 space-y-0.5 ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]"}`}>
              {filteredCountries.map((country) => (
                <label
                  key={country.code}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    blockedCountries.has(country.name)
                      ? isLight ? "bg-rose-50" : "bg-rose-500/10"
                      : isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={blockedCountries.has(country.name)}
                    onChange={() => toggleCountry(country.name)}
                    className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-base" aria-hidden="true">{countryFlag(country.code)}</span>
                  <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>{country.name}</span>
                </label>
              ))}
              {filteredCountries.length === 0 && (
                <div className={`px-3 py-6 text-center text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  No countries match your search
                </div>
              )}
            </div>

            {blockedCountries.size > 0 && (
              <p className={`text-xs mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {blockedCountries.size} {blockedCountries.size === 1 ? "country" : "countries"} selected
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowCountryModal(false); setCountrySearch(""); }} className={secondaryBtnClass}>Cancel</button>
              <button onClick={handleSaveCountries} className={primaryBtnClass}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Whitelist Modal */}
      {showWhitelistModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="whitelist-add-title">
          <div className={modalBackdropClass} onClick={() => setShowWhitelistModal(false)} />
          <div className={modalCardClass}>
            <h3 id="whitelist-add-title" className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Add to Whitelist</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="whitelist-ip" className={labelClass}>IP Address</label>
                <input
                  id="whitelist-ip"
                  type="text"
                  value={whitelistIP}
                  onChange={(e) => setWhitelistIP(e.target.value)}
                  placeholder="192.168.1.0 or 192.168.1.0/24"
                  className={`${inputClass} mt-1.5 font-mono`}
                />
              </div>
              <div>
                <label htmlFor="whitelist-label" className={labelClass}>Label</label>
                <input
                  id="whitelist-label"
                  type="text"
                  value={whitelistLabel}
                  onChange={(e) => setWhitelistLabel(e.target.value)}
                  placeholder="e.g. Office IP, CDN Origin"
                  className={`${inputClass} mt-1.5`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowWhitelistModal(false)} className={secondaryBtnClass}>Cancel</button>
              <button onClick={handleAddWhitelist} className={primaryBtnClass}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleUnblock}
        title="Unblock IP"
        message={`Are you sure you want to unblock ${deleteTarget?.ip ?? ""}? This IP will be able to access your site again.`}
        confirmText="Unblock"
        variant="warning"
      />

      {/* Remove from Whitelist Confirm Dialog */}
      <ConfirmDialog
        open={!!whitelistDeleteTarget}
        onClose={() => setWhitelistDeleteTarget(null)}
        onConfirm={handleRemoveWhitelist}
        title="Remove from Whitelist"
        message={`Are you sure you want to remove ${whitelistDeleteTarget?.ip ?? ""} from the whitelist?`}
        confirmText="Remove"
        variant="danger"
      />
    </>
  );
}
