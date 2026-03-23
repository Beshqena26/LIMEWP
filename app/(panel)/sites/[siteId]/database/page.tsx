"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

/* ────────────── mock data ────────────── */

interface Database {
  id: string;
  name: string;
  size: string;
  tables: number;
  lastBackup: string;
}

const INITIAL_DATABASES: Database[] = [
  { id: "1", name: "wp_main", size: "245 MB", tables: 42, lastBackup: "2 hours ago" },
  { id: "2", name: "wp_staging", size: "89 MB", tables: 42, lastBackup: "1 day ago" },
  { id: "3", name: "analytics_db", size: "1.2 GB", tables: 15, lastBackup: "3 days ago" },
];

const CONNECTION_INFO = [
  { label: "Host", value: "db.limewp.io" },
  { label: "Port", value: "3306" },
  { label: "Database", value: "wp_main" },
  { label: "Username", value: "wp_user_a3k9" },
];

/* ────────────── helpers ────────────── */

function generatePassword(length = 24): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/* ────────────── icons ────────────── */

const SpinnerIcon = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

/* ────────────── component ────────────── */

export default function DatabaseManagementPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Data
  const [databases, setDatabases] = useState<Database[]>(INITIAL_DATABASES);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Database | null>(null);

  // Create form
  const [newDbName, setNewDbName] = useState("");
  const [newDbUser, setNewDbUser] = useState("");
  const [newDbPass, setNewDbPass] = useState("");
  const [creating, setCreating] = useState(false);

  // Import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actions dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Clipboard
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("Copied to clipboard");
  }, []);

  // Create database
  const handleCreate = useCallback(async () => {
    if (!newDbName.trim() || !newDbUser.trim() || !newDbPass.trim()) {
      showToast.error("All fields are required");
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const db: Database = {
      id: String(Date.now()),
      name: `wp_${newDbName.replace(/^wp_/, "")}`,
      size: "0 MB",
      tables: 0,
      lastBackup: "Never",
    };
    setDatabases((prev) => [...prev, db]);
    setCreating(false);
    setShowCreateModal(false);
    setNewDbName("");
    setNewDbUser("");
    setNewDbPass("");
    showToast.success(`Database "${db.name}" created successfully`);
  }, [newDbName, newDbUser, newDbPass]);

  // Export
  const handleExport = useCallback((db: Database) => {
    setOpenDropdown(null);
    showToast.info("Preparing export...");
    setTimeout(() => {
      showToast.success("Download started");
    }, 2000);
  }, []);

  // Import
  const handleImport = useCallback(async () => {
    if (!importFile) return;
    setImporting(true);
    setImportProgress(0);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300));
      setImportProgress(i);
    }
    setImporting(false);
    setShowImportModal(false);
    setImportFile(null);
    setImportProgress(0);
    showToast.success("Database imported successfully");
  }, [importFile]);

  // Backup
  const handleBackup = useCallback((db: Database) => {
    setOpenDropdown(null);
    showToast.info(`Backing up "${db.name}"...`);
    setTimeout(() => {
      setDatabases((prev) =>
        prev.map((d) => (d.id === db.id ? { ...d, lastBackup: "Just now" } : d))
      );
      showToast.success(`Backup of "${db.name}" completed`);
    }, 2000);
  }, []);

  // Delete
  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setDatabases((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    showToast.success(`Database "${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  // Drop zone handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".sql") || file.name.endsWith(".gz"))) {
      setImportFile(file);
    } else {
      showToast.error("Only .sql and .gz files are accepted");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImportFile(file);
  }, []);

  /* ── shared styles ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Database Management
          </h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            Manage databases for{" "}
            <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {decodeURIComponent(siteId)}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Database
        </button>
      </div>

      {/* Databases Table */}
      <div className={`${cardClass} mb-8 overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {["Name", "Size", "Tables", "Last Backup", "Actions"].map((col) => (
                  <th
                    key={col}
                    className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {databases.map((db, idx) => (
                <tr
                  key={db.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isLight
                      ? "border-slate-100 hover:bg-slate-50"
                      : "border-[var(--border-tertiary)]/50 hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
                      }`}>
                        <svg className={`w-4 h-4 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {db.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                    {db.size}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                    {db.tables}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                    {db.lastBackup}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === db.id ? null : db.id)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                          isLight
                            ? "hover:bg-slate-100 text-slate-500"
                            : "hover:bg-[var(--bg-elevated)] text-slate-400"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      </button>

                      {openDropdown === db.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                          <div className={`absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-xl z-20 py-1 ${
                            isLight
                              ? "bg-white border-slate-200"
                              : "bg-[var(--bg-primary)] border-[var(--border-tertiary)]"
                          }`}>
                            {[
                              { label: "Export", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3", action: () => handleExport(db) },
                              { label: "Import", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5", action: () => { setOpenDropdown(null); setShowImportModal(true); } },
                              { label: "Backup Now", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", action: () => handleBackup(db) },
                            ].map((item) => (
                              <button
                                key={item.label}
                                onClick={item.action}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                                  isLight
                                    ? "text-slate-700 hover:bg-slate-50"
                                    : "text-slate-300 hover:bg-[var(--bg-elevated)]"
                                }`}
                              >
                                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.label}
                              </button>
                            ))}
                            <div className={`my-1 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`} />
                            <button
                              onClick={() => { setOpenDropdown(null); setDeleteTarget(db); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                            >
                              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Section */}
      <h2 className={`text-base font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
        Quick Access
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* phpMyAdmin Button */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              phpMyAdmin
            </h3>
            <p className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Visual database management interface
            </p>
            <button
              onClick={() => showToast.info("Opening phpMyAdmin in a new tab...")}
              className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
              }`}
            >
              Open phpMyAdmin
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Info Card */}
        <div className={cardClass}>
          <div className="p-6">
            <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Connection Information
            </h3>
            <div className="space-y-3">
              {CONNECTION_INFO.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                  }`}
                >
                  <div>
                    <p className={labelClass}>{item.label}</p>
                    <p className={`text-sm font-mono font-medium mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {item.value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.value)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                      isLight
                        ? "hover:bg-slate-200 text-slate-400"
                        : "hover:bg-[var(--bg-elevated)] text-slate-500"
                    }`}
                    title="Copy"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Create Database Modal ── */}
      {showCreateModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !creating && setShowCreateModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="db-create-modal-title">
            <h3 id="db-create-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Create Database
            </h3>

            <div className="space-y-4">
              {/* DB Name */}
              <div>
                <label className={labelClass}>Database Name</label>
                <div className="relative mt-1.5">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono ${
                    isLight ? "text-slate-400" : "text-slate-500"
                  }`}>wp_</span>
                  <input
                    type="text"
                    value={newDbName}
                    onChange={(e) => setNewDbName(e.target.value)}
                    placeholder="database_name"
                    className={`${inputClass} pl-10`}
                    autoFocus
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  value={newDbUser}
                  onChange={(e) => setNewDbUser(e.target.value)}
                  placeholder="db_user"
                  className={`${inputClass} mt-1.5`}
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    value={newDbPass}
                    onChange={(e) => setNewDbPass(e.target.value)}
                    placeholder="Enter or generate password"
                    className={inputClass}
                  />
                  <button
                    onClick={() => setNewDbPass(generatePassword())}
                    className={`h-10 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                      isLight
                        ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-secondary)]"
                    }`}
                    title="Auto-generate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M15.015 4.36V9.35h4.992" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {creating ? <>{SpinnerIcon} Creating…</> : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {showImportModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !importing && setShowImportModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="db-import-modal-title">
            <h3 id="db-import-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Import Database
            </h3>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? isLight
                    ? "border-slate-400 bg-slate-50"
                    : "border-[var(--border-primary)] bg-[var(--bg-elevated)]"
                  : isLight
                    ? "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".sql,.gz"
                className="hidden"
                onChange={handleFileSelect}
              />
              <svg className={`w-8 h-8 mx-auto mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {importFile ? (
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  {importFile.name}
                  <span className={`block text-xs mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    {(importFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </p>
              ) : (
                <>
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    Drag SQL file here or click to browse
                  </p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    .sql and .gz files accepted
                  </p>
                </>
              )}
            </div>

            {/* Progress Bar */}
            {importing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Importing...
                  </span>
                  <span className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    {importProgress}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${accent.progress}`}
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowImportModal(false); setImportFile(null); }}
                disabled={importing}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importFile || importing}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {importing ? <>{SpinnerIcon} Importing…</> : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action cannot be undone. All data in this database will be permanently deleted."
        confirmText="Delete Database"
        variant="danger"
        requireTypedConfirmation="DELETE"
      />
    </AppShell>
  );
}
