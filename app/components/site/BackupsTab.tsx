"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { backupStats, backupColorMap, backups as INITIAL_BACKUPS, type Backup } from "@/data/site/backups";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface BackupsTabProps {
  siteId: string;
}

export function BackupsTab({ siteId }: BackupsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [backupList, setBackupList] = useState<Backup[]>(INITIAL_BACKUPS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backupType, setBackupType] = useState<"full" | "database" | "files">("full");
  const [creating, setCreating] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<Backup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Backup | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Settings state
  const [schedule, setSchedule] = useState<"daily" | "weekly" | "manual">("daily");
  const [retention, setRetention] = useState("30");

  /* ── handlers ── */

  const handleCreateBackup = useCallback(async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 3000));
    const nameMap = { full: "Full Site Backup", database: "Database Only", files: "Files Only" };
    const includesMap = { full: ["Files", "Database", "Media"], database: ["Database"], files: ["Files", "Media"] };
    const sizeMap = { full: "860 MB", database: "124 MB", files: "736 MB" };
    const now = new Date();
    const newBackup: Backup = {
      id: `bkp-${Date.now()}`,
      name: nameMap[backupType],
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      size: sizeMap[backupType],
      type: "manual",
      status: "completed",
      includes: includesMap[backupType],
      color: backupType === "full" ? "emerald" : backupType === "database" ? "violet" : "sky",
    };
    setBackupList((prev) => [newBackup, ...prev]);
    setCreating(false);
    setShowCreateModal(false);
    showToast.success(`${nameMap[backupType]} created successfully`);
  }, [backupType]);

  const handleRestore = useCallback(async () => {
    if (!restoreTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 3000));
    setActionLoading(false);
    setRestoreTarget(null);
    showToast.success(`Site restored from ${restoreTarget.name} (${restoreTarget.date})`);
  }, [restoreTarget]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setBackupList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setActionLoading(false);
    setDeleteTarget(null);
    showToast.success("Backup deleted");
  }, [deleteTarget]);

  const handleDownload = useCallback((backup: Backup) => {
    showToast.success(`Downloading ${backup.name} (${backup.size})...`);
  }, []);

  const handleSaveSettings = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setActionLoading(false);
    setShowSettingsModal(false);
    showToast.success("Backup settings saved");
  }, []);

  // Escape + body lock
  useEffect(() => {
    const anyModal = showCreateModal || showSettingsModal;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowCreateModal(false); setShowSettingsModal(false); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [showCreateModal, showSettingsModal]);

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

  const storageUsed = 2.4;
  const storageTotal = 10;
  const storagePct = (storageUsed / storageTotal) * 100;

  return (
    <>
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {backupStats.map((stat) => {
            const colors = backupColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={stat.icon} /></svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.label === "Storage Used" ? `${storageUsed} GB` : stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  {stat.label === "Storage Used" ? (
                    <div className="mt-2">
                      <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                        <div className={`h-full rounded-full transition-all ${storagePct > 80 ? "bg-rose-500" : storagePct > 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${storagePct}%` }} />
                      </div>
                      <p className={`text-[10px] mt-1 ${colors.text}`}>of {storageTotal} GB</p>
                    </div>
                  ) : (
                    <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Backup History</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">{backupList.length} backups</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettingsModal(true)} className={`h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
              isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              </svg>
              Settings
            </button>
            <button onClick={() => setShowCreateModal(true)} className={`h-9 px-4 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m8-8H4" /></svg>
              Create Backup
            </button>
          </div>
        </div>

        {/* Backup Cards */}
        <div className="space-y-3">
          {backupList.map((backup, index) => {
            const colors = backupColorMap[backup.color] || backupColorMap.emerald;
            const isLatest = index === 0;
            return (
              <div key={backup.id} className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isLight
                  ? isLatest ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-slate-200/50" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : isLatest ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-black/20" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
              }`}>
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50`} />
                <div className="relative p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                        {backup.type === "automatic" ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                        )}
                      </div>
                      {isLatest && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`} />
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`font-semibold text-[15px] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{backup.name}</span>
                        {isLatest && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Latest</span>}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${backup.type === "automatic" ? "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20" : "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20"}`}>{backup.type}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                          {backup.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {backup.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>
                          <span className="font-mono">{backup.size}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] ${isLight ? "text-slate-600" : "text-slate-500"}`}>Includes:</span>
                        <div className="flex gap-1.5">
                          {backup.includes.map((item) => (
                            <span key={item} className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${isLight ? "text-slate-500 bg-slate-100 ring-slate-200" : "text-slate-400 bg-[var(--bg-elevated)] ring-[var(--border-primary)]"}`}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => setRestoreTarget(backup)} aria-label="Restore backup" className="h-9 px-3.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all ring-1 ring-emerald-500/20 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                        Restore
                      </button>
                      <button onClick={() => handleDownload(backup)} aria-label="Download backup" className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${isLight ? "bg-slate-100 hover:bg-slate-200 ring-slate-200" : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"}`}>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(backup)} aria-label="Delete backup" className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${isLight ? "bg-slate-100 hover:bg-rose-50 ring-slate-200 hover:ring-rose-500/30" : "bg-[var(--bg-elevated)]/70 hover:bg-rose-500/10 ring-[var(--border-primary)] hover:ring-rose-500/30"}`}>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════ Create Backup Modal ═══════ */}
      {showCreateModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !creating && setShowCreateModal(false)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="create-backup-title">
            <h3 id="create-backup-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Create Backup</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Backup Type</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {([["full", "Full Site", "Files + Database + Media"], ["database", "Database", "Database tables only"], ["files", "Files Only", "WP files + Media"]] as const).map(([value, label, desc]) => (
                    <button key={value} onClick={() => setBackupType(value)} className={`p-3 rounded-xl border text-left transition-all ${
                      backupType === value
                        ? `${accent.activeBg} ring-1 ${accent.ring} border-transparent`
                        : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}>
                      <span className={`text-sm font-medium block ${backupType === value ? accent.text : isLight ? "text-slate-700" : "text-slate-200"}`}>{label}</span>
                      <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={`rounded-xl p-3 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"}`}>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Estimated size: <span className="font-semibold">{backupType === "full" ? "~860 MB" : backupType === "database" ? "~124 MB" : "~736 MB"}</span>
                  <br />Storage remaining: <span className="font-semibold">{(storageTotal - storageUsed).toFixed(1)} GB</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowCreateModal(false)} disabled={creating} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>Cancel</button>
              <button onClick={handleCreateBackup} disabled={creating} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                {creating ? <>{spinner} Creating…</> : "Create Backup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Settings Modal ═══════ */}
      {showSettingsModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setShowSettingsModal(false)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="backup-settings-title">
            <h3 id="backup-settings-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Backup Settings</h3>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Auto-Backup Schedule</label>
                <div className={`inline-flex rounded-xl p-1 mt-2 ${isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"}`}>
                  {(["daily", "weekly", "manual"] as const).map((opt) => (
                    <button key={opt} onClick={() => setSchedule(opt)} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${
                      schedule === opt ? `${accent.activeBg} ${accent.text}` : isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                    }`}>{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="retention-period" className={labelClass}>Retention Period</label>
                <div className="relative mt-1.5">
                  <select id="retention-period" value={retention} onChange={(e) => setRetention(e.target.value)} className={`${inputClass} appearance-none`}>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>
              <div className={`rounded-xl p-3 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"}`}>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  {schedule === "daily" ? "Backups run daily at 3:00 AM UTC" : schedule === "weekly" ? "Backups run every Sunday at 3:00 AM UTC" : "No automatic backups. Create backups manually."}<br />
                  Old backups are automatically removed after {retention} days.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowSettingsModal(false)} disabled={actionLoading} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>Cancel</button>
              <button onClick={handleSaveSettings} disabled={actionLoading} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                {actionLoading ? <>{spinner} Saving…</> : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Restore Confirm ═══════ */}
      <ConfirmDialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        title={`Restore from ${restoreTarget?.name}?`}
        message={`This will overwrite your live site with the backup from ${restoreTarget?.date} at ${restoreTarget?.time}. This action cannot be undone. Make sure you have a current backup before proceeding.`}
        confirmText="Restore Site"
        variant="warning"
        isLoading={actionLoading}
      />

      {/* ═══════ Delete Confirm ═══════ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete backup from ${deleteTarget?.date}?`}
        message="This backup will be permanently removed. You cannot undo this action."
        confirmText="Delete Backup"
        variant="danger"
        isLoading={actionLoading}
      />
    </>
  );
}
