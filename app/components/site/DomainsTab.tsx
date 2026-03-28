"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { DOMAINS, type Domain } from "@/data/site/domains";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface DomainsTabProps {
  siteId: string;
}

export function DomainsTab({ siteId }: DomainsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [domains, setDomains] = useState<Domain[]>(DOMAINS);

  // Add domain modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Domain | null>(null);

  // Make primary confirm
  const [primaryTarget, setPrimaryTarget] = useState<Domain | null>(null);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{ id: string; text: string } | null>(null);

  // Settings modal
  const [settingsTarget, setSettingsTarget] = useState<Domain | null>(null);

  /* ── handlers ── */

  const handleAddDomain = useCallback(async () => {
    if (!newDomain.trim()) { showToast.error("Domain name is required"); return; }
    if (domains.some((d) => d.domain === newDomain.trim())) { showToast.error("Domain already exists"); return; }
    setAddingDomain(true);
    await new Promise((r) => setTimeout(r, 2000));
    const domain: Domain = {
      domain: newDomain.trim(),
      primary: false,
      ssl: false,
      sslExpiry: "Pending",
      status: "active",
      dnsProvider: "Manual",
    };
    setDomains((prev) => [...prev, domain]);
    setAddingDomain(false);
    setShowAddModal(false);
    setNewDomain("");
    showToast.success(`${domain.domain} added successfully`);
  }, [newDomain, domains]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setDomains((prev) => prev.filter((d) => d.domain !== deleteTarget.domain));
    showToast.success(`${deleteTarget.domain} removed`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  const handleMakePrimary = useCallback(() => {
    if (!primaryTarget) return;
    setDomains((prev) => prev.map((d) => ({ ...d, primary: d.domain === primaryTarget.domain })));
    showToast.success(`${primaryTarget.domain} is now the primary domain`);
    setPrimaryTarget(null);
  }, [primaryTarget]);

  const handleSSLCheck = useCallback((domain: Domain) => {
    showToast.info(`SSL check started for ${domain.domain}...`);
  }, []);

  const handleSettingsSave = useCallback(async () => {
    setAddingDomain(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAddingDomain(false);
    setSettingsTarget(null);
    showToast.success("Domain settings saved");
  }, []);

  // Escape key for modals
  useEffect(() => {
    const anyModal = showAddModal || !!settingsTarget;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowAddModal(false); setSettingsTarget(null); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showAddModal, settingsTarget]);

  useEffect(() => {
    const anyModal = showAddModal || !!settingsTarget;
    if (anyModal) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showAddModal, settingsTarget]);

  /* ── styles ── */

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
  }`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  /* ── tooltip helper ── */
  const actionBtn = (id: string, tip: string, onClick: () => void, icon: string, variant?: "primary" | "danger" | "default") => (
    <div className="relative" style={{ zIndex: tooltip?.id === id ? 60 : "auto" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setTooltip({ id, text: tip })}
        onMouseLeave={() => setTooltip(null)}
        aria-label={tip}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          variant === "primary"
            ? "bg-emerald-500/10 hover:bg-emerald-500/20 ring-1 ring-emerald-500/20"
            : variant === "danger"
              ? isLight ? "bg-slate-100 hover:bg-red-50 hover:text-red-500" : "bg-[var(--bg-elevated)]/70 hover:bg-red-500/10 hover:text-red-400"
              : isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)]"
        }`}
      >
        <svg className={`w-4 h-4 ${variant === "primary" ? "text-emerald-400" : variant === "danger" ? "text-slate-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={icon} />
        </svg>
      </button>
      {tooltip?.id === id && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap z-50 shadow-lg ${
          isLight ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900"
        }`}>
          {tip}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isLight ? "border-t-slate-800" : "border-t-slate-200"
          }`} />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Domains</h2>
          <p className={`text-sm mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{domains.length} domain{domains.length !== 1 ? "s" : ""} connected</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`h-9 px-4 rounded-xl text-white text-sm font-semibold transition-all flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Domain
        </button>
      </div>

      {/* Domains Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      }`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
              {["Domain", "Status", "SSL", "DNS Provider", "SSL Expiry", "Actions"].map((h) => (
                <th key={h} className={`text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.map((row) => (
              <tr key={row.domain} className={`border-b last:border-b-0 transition-colors ${
                isLight ? "border-slate-100 hover:bg-slate-50" : "border-white/[0.04] hover:bg-white/[0.02]"
              }`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{row.domain}</span>
                    {row.primary && (
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"}`}>Primary</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${row.status === "active" ? "text-emerald-500" : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${row.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${row.ssl ? "text-sky-500" : "text-amber-500"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    {row.ssl ? "Secured" : "Pending"}
                  </span>
                </td>
                <td className={`px-5 py-3.5 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>{row.dnsProvider}</td>
                <td className={`px-5 py-3.5 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{row.sslExpiry}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    {/* Settings — gear icon */}
                    <button onClick={() => setSettingsTarget(row)} aria-label={`Settings for ${row.domain}`} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" : "hover:bg-white/[0.06] text-slate-500 hover:text-slate-300"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    {/* SSL — shield check icon */}
                    <button onClick={() => handleSSLCheck(row)} aria-label={`SSL check for ${row.domain}`} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-sky-50 text-sky-500 hover:text-sky-600" : "hover:bg-sky-500/10 text-sky-400 hover:text-sky-300"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </button>
                    {/* Make Primary — star icon */}
                    {!row.primary && (
                      <button onClick={() => setPrimaryTarget(row)} aria-label={`Make ${row.domain} primary`} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600" : "hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                      </button>
                    )}
                    {/* Delete — trash icon */}
                    {!row.primary && (
                      <button onClick={() => setDeleteTarget(row)} aria-label={`Delete ${row.domain}`} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-rose-50 text-rose-400 hover:text-rose-600" : "hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══════════ Add Domain Modal ═══════════ */}
      {showAddModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !addingDomain && setShowAddModal(false)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="add-domain-title">
            <h3 id="add-domain-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Add New Domain
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="new-domain" className={labelClass}>Domain Name</label>
                <input
                  id="new-domain"
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                  className={`${inputClass} mt-1.5`}
                  autoFocus
                />
              </div>

              {/* DNS Instructions */}
              <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"}`}>
                <p className={`text-xs font-semibold mb-2 ${isLight ? "text-slate-700" : "text-slate-200"}`}>DNS Configuration</p>
                <p className={`text-xs mb-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Point your domain to our servers by adding these DNS records:
                </p>
                <div className="space-y-2">
                  <div className={`flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                    <span className={isLight ? "text-slate-500" : "text-slate-400"}>A Record</span>
                    <span className={isLight ? "text-slate-800" : "text-slate-200"}>185.199.108.53</span>
                  </div>
                  <div className={`flex items-center justify-between rounded-lg px-3 py-2 font-mono text-xs ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                    <span className={isLight ? "text-slate-500" : "text-slate-400"}>CNAME</span>
                    <span className={isLight ? "text-slate-800" : "text-slate-200"}>cdn.limewp.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowAddModal(false); setNewDomain(""); }}
                disabled={addingDomain}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDomain}
                disabled={addingDomain}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {addingDomain ? <>{spinner} Adding…</> : "Add Domain"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Domain Settings Modal ═══════════ */}
      {settingsTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !addingDomain && setSettingsTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="domain-settings-title">
            <h3 id="domain-settings-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Settings for {settingsTarget.domain}
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="dns-provider" className={labelClass}>DNS Provider</label>
                <input id="dns-provider" type="text" defaultValue={settingsTarget.dnsProvider} className={`${inputClass} mt-1.5`} />
              </div>
              <div>
                <label htmlFor="redirect-to" className={labelClass}>Redirect to</label>
                <div className="relative mt-1.5">
                  <select id="redirect-to" defaultValue="" className={`${inputClass} appearance-none`}>
                    <option value="">No redirect</option>
                    {domains.filter((d) => d.domain !== settingsTarget.domain).map((d) => (
                      <option key={d.domain} value={d.domain}>{d.domain}</option>
                    ))}
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>SSL Certificate</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Expires {settingsTarget.sslExpiry}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${
                    settingsTarget.ssl ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${settingsTarget.ssl ? "bg-emerald-400" : "bg-amber-400"}`} />
                    {settingsTarget.ssl ? "Active" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setSettingsTarget(null)} disabled={addingDomain} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>
                Cancel
              </button>
              <button onClick={handleSettingsSave} disabled={addingDomain} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                {addingDomain ? <>{spinner} Saving…</> : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Delete Confirm ═══════════ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.domain}?`}
        message="This will remove the domain from your site. DNS records will not be affected."
        confirmText="Delete Domain"
        variant="danger"
      />

      {/* ═══════════ Make Primary Confirm ═══════════ */}
      <ConfirmDialog
        open={!!primaryTarget}
        onClose={() => setPrimaryTarget(null)}
        onConfirm={handleMakePrimary}
        title={`Make ${primaryTarget?.domain} primary?`}
        message="This will change your site's primary domain. All traffic will be redirected to this domain."
        confirmText="Make Primary"
        variant="info"
      />
    </>
  );
}
