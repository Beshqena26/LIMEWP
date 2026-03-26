"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

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

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  engine: string;
  collation: string;
}

const MOCK_TABLES: TableInfo[] = [
  { name: "wp_posts", rows: 1247, size: "45.2 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_postmeta", rows: 28456, size: "82.1 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_options", rows: 892, size: "12.4 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_users", rows: 24, size: "0.1 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_usermeta", rows: 456, size: "2.8 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_comments", rows: 89, size: "1.2 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_commentmeta", rows: 134, size: "0.5 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_terms", rows: 45, size: "0.1 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_term_relationships", rows: 1089, size: "0.8 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_term_taxonomy", rows: 45, size: "0.1 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_woocommerce_sessions", rows: 234, size: "8.5 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
  { name: "wp_wc_orders", rows: 567, size: "15.3 MB", engine: "InnoDB", collation: "utf8mb4_unicode_ci" },
];

const INITIAL_QUERY_HISTORY = [
  "SELECT COUNT(*) FROM wp_posts WHERE post_status = 'publish'",
  "SELECT option_name, option_value FROM wp_options WHERE autoload = 'yes' LIMIT 10",
  "DELETE FROM wp_postmeta WHERE meta_key = '_edit_lock'",
  "OPTIMIZE TABLE wp_posts, wp_postmeta, wp_options",
];

const SIZE_HISTORY = [
  { week: "Week 1", size: 142 },
  { week: "Week 2", size: 148 },
  { week: "Week 3", size: 151 },
  { week: "Week 4", size: 155 },
];

/* ────────────── helpers ────────────── */

function generatePassword(length = 24): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Parse size strings like "245 MB" or "1.2 GB" into MB */
function parseSizeMB(size: string): number {
  const match = size.match(/([\d.]+)\s*(MB|GB|KB)/i);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "GB") return val * 1024;
  if (unit === "KB") return val / 1024;
  return val;
}

function formatSizeMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
  return `${Math.round(mb)} MB`;
}

/* ────────────── icons ────────────── */

const SpinnerIcon = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

/* ────────────── SVG paths ────────────── */

const ICON_PATHS = {
  database: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
  chartBar: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  tableGrid: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125",
  clock: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
  cogInner: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  wrench: "M11.42 15.17l-5.6-5.6a2.002 2.002 0 010-2.83l.17-.17a2.002 2.002 0 012.83 0l5.6 5.6m-5 5l5.6 5.6a2.002 2.002 0 002.83 0l.17-.17a2.002 2.002 0 000-2.83l-5.6-5.6m-5 5l-1.42-1.42m12.42-12.42l1.42 1.42",
  checkCircle: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  play: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z",
  commandLine: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
  link: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.552a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.57",
  arrowTopRight: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
} as const;

/* ────────────── component ────────────── */

export function DatabaseTab({ siteId }: { siteId: string }) {
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

  // Table Browser
  const [browsingDb, setBrowsingDb] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>(MOCK_TABLES);
  const [tableSearch, setTableSearch] = useState("");
  const [emptyTableTarget, setEmptyTableTarget] = useState<string | null>(null);
  const [dropTableTarget, setDropTableTarget] = useState<string | null>(null);

  // Query Runner
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<{ type: "select" | "other"; data?: Record<string, string>[]; message?: string } | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>(INITIAL_QUERY_HISTORY);

  // Bulk operations loading
  const [optimizingAll, setOptimizingAll] = useState(false);
  const [repairingAll, setRepairingAll] = useState(false);
  const [checkingAll, setCheckingAll] = useState(false);

  // Scheduled backups
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("daily");
  const [backupRetention, setBackupRetention] = useState("14");
  const [savingBackupSettings, setSavingBackupSettings] = useState(false);
  const [backingUpNow, setBackingUpNow] = useState(false);

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

  // Table actions
  const handleOptimizeTable = useCallback((tableName: string) => {
    showToast.info(`Optimizing ${tableName}...`);
    setTimeout(() => showToast.success(`Table "${tableName}" optimized successfully`), 1200);
  }, []);

  const handleRepairTable = useCallback((tableName: string) => {
    showToast.info(`Repairing ${tableName}...`);
    setTimeout(() => showToast.success(`Table "${tableName}" repaired successfully`), 1200);
  }, []);

  const handleEmptyTable = useCallback(() => {
    if (!emptyTableTarget) return;
    setTables((prev) => prev.map((t) => t.name === emptyTableTarget ? { ...t, rows: 0, size: "0.0 MB" } : t));
    showToast.success(`Table "${emptyTableTarget}" emptied`);
    setEmptyTableTarget(null);
  }, [emptyTableTarget]);

  const handleDropTable = useCallback(() => {
    if (!dropTableTarget) return;
    setTables((prev) => prev.filter((t) => t.name !== dropTableTarget));
    showToast.success(`Table "${dropTableTarget}" dropped`);
    setDropTableTarget(null);
  }, [dropTableTarget]);

  // Bulk operations
  const handleOptimizeAll = useCallback(async () => {
    setOptimizingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOptimizingAll(false);
    showToast.success("12 tables optimized, saved 45.2 MB");
  }, []);

  const handleRepairAll = useCallback(async () => {
    setRepairingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setRepairingAll(false);
    showToast.success("12 tables checked, 0 issues found");
  }, []);

  const handleCheckAll = useCallback(async () => {
    setCheckingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setCheckingAll(false);
    showToast.success("All tables are healthy");
  }, []);

  // Query runner
  const handleExecuteQuery = useCallback(async () => {
    if (!sqlQuery.trim()) {
      showToast.error("Enter a SQL query");
      return;
    }
    setQueryRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    setQueryRunning(false);

    // Add to history (keep last 5, no duplicates)
    setQueryHistory((prev) => {
      const filtered = prev.filter((q) => q !== sqlQuery.trim());
      return [sqlQuery.trim(), ...filtered].slice(0, 5);
    });

    const upper = sqlQuery.trim().toUpperCase();
    if (upper.startsWith("SELECT")) {
      setQueryResult({
        type: "select",
        data: [
          { id: "1", post_title: "Hello World", post_status: "publish", post_date: "2025-12-01" },
          { id: "2", post_title: "Sample Page", post_status: "publish", post_date: "2025-12-05" },
          { id: "3", post_title: "Privacy Policy", post_status: "draft", post_date: "2025-12-10" },
          { id: "4", post_title: "WooCommerce Shop", post_status: "publish", post_date: "2026-01-15" },
          { id: "5", post_title: "My Account", post_status: "publish", post_date: "2026-01-20" },
        ],
      });
    } else {
      const affected = Math.floor(Math.random() * 50) + 1;
      setQueryResult({
        type: "other",
        message: `Query executed successfully. ${affected} rows affected.`,
      });
    }
  }, [sqlQuery]);

  // Scheduled backup actions
  const handleSaveBackupSettings = useCallback(async () => {
    setSavingBackupSettings(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSavingBackupSettings(false);
    showToast.success("Backup settings saved");
  }, []);

  const handleBackupNow = useCallback(async () => {
    setBackingUpNow(true);
    await new Promise((r) => setTimeout(r, 2000));
    setBackingUpNow(false);
    showToast.success("Database backup completed");
  }, []);

  /* ── computed stats ── */
  const totalDatabases = databases.length;
  const totalSizeMB = databases.reduce((sum, db) => sum + parseSizeMB(db.size), 0);
  const totalTables = databases.reduce((sum, db) => sum + db.tables, 0);
  const mostRecentBackup = databases.length > 0
    ? databases.reduce((best, db) => {
        // Simple heuristic: "Just now" < "2 hours ago" < "1 day ago" < "3 days ago" < "Never"
        const order = ["Just now", "2 hours ago", "1 day ago", "3 days ago", "Never"];
        const bestIdx = order.indexOf(best);
        const dbIdx = order.indexOf(db.lastBackup);
        return dbIdx !== -1 && (bestIdx === -1 || dbIdx < bestIdx) ? db.lastBackup : best;
      }, databases[0].lastBackup)
    : "Never";

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

  const selectClass = `h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors appearance-none cursor-pointer ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const secondaryBtnClass = `h-9 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
    isLight
      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
      : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
  }`;

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const maxBarSize = Math.max(...SIZE_HISTORY.map((s) => s.size));

  /* ── Section heading helper ── */
  const SectionHeading = ({ iconPath, iconColor, title }: { iconPath: string; iconColor: { bg: string; text: string }; title: string }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-lg ${iconColor.bg} flex items-center justify-center`}>
        <svg className={`w-4 h-4 ${iconColor.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</h3>
    </div>
  );

  /* ── Connection info field colors ── */
  const connectionFieldColors = [
    { bg: "bg-teal-500/10", text: "text-teal-500" },
    { bg: "bg-sky-500/10", text: "text-sky-500" },
    { bg: "bg-violet-500/10", text: "text-violet-500" },
    { bg: "bg-amber-500/10", text: "text-amber-500" },
  ];

  return (
    <>
      {/* ───────── 1. Page Header ───────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className={secondaryBtnClass}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Import
          </button>
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
      </div>

      {/* ───────── 2. Stats Strip ───────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Databases",
            value: String(totalDatabases),
            iconPath: ICON_PATHS.database,
            color: { bg: "bg-amber-500/10", text: "text-amber-500" },
          },
          {
            label: "Total Size",
            value: formatSizeMB(totalSizeMB),
            iconPath: ICON_PATHS.chartBar,
            color: { bg: "bg-violet-500/10", text: "text-violet-500" },
          },
          {
            label: "Total Tables",
            value: String(totalTables),
            iconPath: ICON_PATHS.tableGrid,
            color: { bg: "bg-sky-500/10", text: "text-sky-500" },
          },
          {
            label: "Last Backup",
            value: mostRecentBackup,
            iconPath: ICON_PATHS.clock,
            color: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
          },
        ].map((stat) => (
          <div key={stat.label} className={`${cardClass} p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.color.bg} flex items-center justify-center`}>
                <svg className={`w-4.5 h-4.5 ${stat.color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
                </svg>
              </div>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {stat.value}
            </p>
            <p className={`text-xs font-medium mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ───────── 3. Databases Table (with Maintenance Bar inside) ───────── */}
      <div className={`${cardClass} mb-8 overflow-hidden`}>
        {/* Maintenance Bar — compact, inside the table card */}
        <div className={`px-6 py-4 flex flex-wrap items-center gap-3 border-b ${
          isLight ? "border-slate-200 bg-slate-50/50" : "border-[var(--border-tertiary)] bg-white/[0.02]"
        }`}>
          <div className="flex items-center gap-2 mr-1">
            <div className="w-6 h-6 rounded-md bg-violet-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.cog} />
                <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.cogInner} />
              </svg>
            </div>
            <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
              Maintenance
            </span>
          </div>
          <button
            onClick={handleOptimizeAll}
            disabled={optimizingAll}
            className={`${secondaryBtnClass} disabled:opacity-60`}
          >
            {optimizingAll ? SpinnerIcon : (
              <div className="w-5 h-5 rounded-md bg-violet-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.cog} />
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.cogInner} />
                </svg>
              </div>
            )}
            Optimize All
          </button>
          <button
            onClick={handleRepairAll}
            disabled={repairingAll}
            className={`${secondaryBtnClass} disabled:opacity-60`}
          >
            {repairingAll ? SpinnerIcon : (
              <div className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.wrench} />
                </svg>
              </div>
            )}
            Repair All
          </button>
          <button
            onClick={handleCheckAll}
            disabled={checkingAll}
            className={`${secondaryBtnClass} disabled:opacity-60`}
          >
            {checkingAll ? SpinnerIcon : (
              <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.checkCircle} />
                </svg>
              </div>
            )}
            Check All
          </button>
        </div>

        {/* Table */}
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
              {databases.map((db) => (
                <tr
                  key={db.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isLight
                      ? "border-slate-100 hover:bg-slate-50"
                      : "border-[var(--border-tertiary)] hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.database} />
                        </svg>
                      </div>
                      <button
                        onClick={() => { setBrowsingDb(browsingDb === db.name ? null : db.name); setTableSearch(""); setTables(MOCK_TABLES); }}
                        className={`text-sm font-semibold font-mono transition-colors ${isLight ? "text-slate-800 hover:text-slate-600" : "text-slate-100 hover:text-white"} underline decoration-dotted underline-offset-4`}
                        title="Browse tables"
                      >
                        {db.name}
                      </button>
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setBrowsingDb(browsingDb === db.name ? null : db.name); setTableSearch(""); setTables(MOCK_TABLES); }}
                        className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          isLight
                            ? "hover:bg-slate-100 text-slate-600"
                            : "hover:bg-[var(--bg-elevated)] text-slate-400"
                        }`}
                        title="Browse Tables"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.tableGrid} />
                        </svg>
                        Browse
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────── Table Browser (inline, after table) ───────── */}
      {browsingDb && (
        <div className={`${cardClass} mb-8 overflow-hidden`}>
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.tableGrid} />
                  </svg>
                </div>
                <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Tables in{" "}
                  <span className="font-mono">{browsingDb}</span>
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-400"
                }`}>
                  {filteredTables.length} tables
                </span>
              </div>
              <button
                onClick={() => setBrowsingDb(null)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                  isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search tables..."
              className={`${inputClass} mb-4`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                  {["Table Name", "Rows", "Size", "Engine", "Actions"].map((col) => (
                    <th
                      key={col}
                      className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-3 ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTables.map((table) => (
                  <tr
                    key={table.name}
                    className={`border-b last:border-b-0 transition-colors ${
                      isLight
                        ? "border-slate-100 hover:bg-slate-50"
                        : "border-[var(--border-tertiary)] hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-6 py-3">
                      <span className={`text-sm font-mono font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {table.name}
                      </span>
                    </td>
                    <td className={`px-6 py-3 text-sm tabular-nums ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                      {table.rows.toLocaleString()}
                    </td>
                    <td className={`px-6 py-3 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                      {table.size}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        table.engine === "InnoDB"
                          ? isLight
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-emerald-500/10 text-emerald-400"
                          : isLight
                            ? "bg-amber-100 text-amber-700"
                            : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {table.engine}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOptimizeTable(table.name)}
                          className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? "hover:bg-sky-50 text-sky-600"
                              : "hover:bg-sky-500/10 text-sky-400"
                          }`}
                          title="Optimize"
                        >
                          Optimize
                        </button>
                        <button
                          onClick={() => handleRepairTable(table.name)}
                          className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? "hover:bg-amber-50 text-amber-600"
                              : "hover:bg-amber-500/10 text-amber-400"
                          }`}
                          title="Repair"
                        >
                          Repair
                        </button>
                        <button
                          onClick={() => setEmptyTableTarget(table.name)}
                          className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? "hover:bg-orange-50 text-orange-600"
                              : "hover:bg-orange-500/10 text-orange-400"
                          }`}
                          title="Empty"
                        >
                          Empty
                        </button>
                        <button
                          onClick={() => setDropTableTarget(table.name)}
                          className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? "hover:bg-red-50 text-red-600"
                              : "hover:bg-red-500/10 text-red-400"
                          }`}
                          title="Drop"
                        >
                          Drop
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTables.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-6 py-8 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      No tables matching &quot;{tableSearch}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────── 5. Query Runner ───────── */}
      <div className={`${cardClass} mb-8 overflow-hidden`}>
        <div className="p-6">
          <SectionHeading
            iconPath={ICON_PATHS.commandLine}
            iconColor={{ bg: "bg-sky-500/10", text: "text-sky-500" }}
            title="Query Runner"
          />

          {/* Warning callout */}
          <div className={`rounded-xl px-4 py-3 mb-4 flex items-start gap-3 ${
            isLight ? "bg-amber-50 border border-amber-200" : "bg-amber-500/5 border border-amber-500/20"
          }`}>
            <svg className="w-5 h-5 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className={`text-sm ${isLight ? "text-amber-800" : "text-amber-400"}`}>
              Be careful with DELETE/DROP queries. Changes cannot be undone.
            </p>
          </div>

          {/* SQL textarea */}
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter SQL query..."
            rows={4}
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono outline-none transition-colors resize-y ${
              isLight
                ? "bg-slate-900 border-slate-700 text-emerald-400 placeholder-slate-500"
                : "bg-[#0d1117] border-[var(--border-tertiary)] text-emerald-400 placeholder-slate-600"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleExecuteQuery();
              }
            }}
          />
          <div className="flex items-center justify-between mt-3">
            <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              Press Ctrl+Enter to execute
            </p>
            <button
              onClick={handleExecuteQuery}
              disabled={queryRunning || !sqlQuery.trim()}
              className={`h-9 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              {queryRunning ? <>{SpinnerIcon} Running...</> : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.play} />
                  </svg>
                  Execute Query
                </>
              )}
            </button>
          </div>

          {/* Query history */}
          {queryHistory.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs font-medium mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Recent queries
              </p>
              <div className="flex flex-wrap gap-2">
                {queryHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setSqlQuery(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono truncate max-w-[300px] transition-colors border ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                        : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-400 hover:text-slate-200 hover:border-[var(--border-primary)]"
                    }`}
                    title={q}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query results */}
          {queryResult && (
            <div className="mt-5">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Results
              </p>
              {queryResult.type === "select" && queryResult.data ? (
                <div className="overflow-x-auto">
                  <table className={`w-full text-sm rounded-xl overflow-hidden border ${
                    isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
                  }`}>
                    <thead>
                      <tr className={isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}>
                        {Object.keys(queryResult.data[0]).map((col) => (
                          <th key={col} className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-2.5 ${
                            isLight ? "text-slate-500" : "text-slate-400"
                          }`}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.data.map((row, i) => (
                        <tr key={i} className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                          {Object.values(row).map((val, j) => (
                            <td key={j} className={`px-4 py-2 font-mono text-xs ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className={`text-xs mt-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    {queryResult.data.length} rows returned
                  </p>
                </div>
              ) : (
                <div className={`rounded-xl px-4 py-3 ${
                  isLight ? "bg-emerald-50 border border-emerald-200" : "bg-emerald-500/5 border border-emerald-500/20"
                }`}>
                  <p className={`text-sm font-medium ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                    {queryResult.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ───────── 6. Two-column: Connection Info + phpMyAdmin ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Connection Info Card */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              iconPath={ICON_PATHS.link}
              iconColor={{ bg: "bg-teal-500/10", text: "text-teal-500" }}
              title="Connection Information"
            />
            <div className="space-y-3">
              {CONNECTION_INFO.map((item, idx) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${connectionFieldColors[idx % connectionFieldColors.length].bg.replace('/10', '')} ${connectionFieldColors[idx % connectionFieldColors.length].text}`}>
                      <div className={`w-2 h-2 rounded-full ${connectionFieldColors[idx % connectionFieldColors.length].bg.replace('bg-', 'bg-').replace('/10', '')}`} />
                    </div>
                    <div>
                      <p className={labelClass}>{item.label}</p>
                      <p className={`text-sm font-mono font-medium mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {item.value}
                      </p>
                    </div>
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

        {/* phpMyAdmin Card */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS.arrowTopRight} />
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
      </div>

      {/* ───────── 7. Two-column: Database Size History + Scheduled Backups ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Database Size History */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              iconPath={ICON_PATHS.chartBar}
              iconColor={{ bg: "bg-indigo-500/10", text: "text-indigo-500" }}
              title="Database Size History"
            />
            <div className="flex items-baseline gap-3 mb-1">
              <span className={`text-3xl font-bold tabular-nums ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                155 MB
              </span>
              <span className={`text-sm font-medium ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>
                +12.4 MB this month
              </span>
            </div>
            <p className={`text-xs mb-5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              Current database size (last 30 days)
            </p>
            <div className="space-y-3">
              {SIZE_HISTORY.map((item) => {
                const pct = (item.size / maxBarSize) * 100;
                const isCurrent = item === SIZE_HISTORY[SIZE_HISTORY.length - 1];
                return (
                  <div key={item.week} className="flex items-center gap-3">
                    <span className={`text-xs w-16 shrink-0 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {item.week}
                    </span>
                    <div className={`flex-1 h-7 rounded-lg overflow-hidden ${isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
                      <div
                        className={`h-full rounded-lg transition-all ${
                          isCurrent
                            ? accent.progress || "bg-emerald-500"
                            : isLight
                              ? "bg-slate-300"
                              : "bg-slate-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-xs w-14 text-right tabular-nums font-semibold ${
                      isCurrent
                        ? isLight ? "text-slate-800" : "text-slate-100"
                        : isLight ? "text-slate-500" : "text-slate-400"
                    }`}>
                      {item.size} MB
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scheduled Database Backups */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              iconPath={ICON_PATHS.shield}
              iconColor={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }}
              title="Scheduled Database Backups"
            />

            {/* Enable toggle */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Enable automated database backups
                </p>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Automatic backups keep your data safe
                </p>
              </div>
              <Toggle enabled={autoBackupEnabled} onChange={setAutoBackupEnabled} />
            </div>

            {autoBackupEnabled && (
              <div className="space-y-4">
                {/* Schedule */}
                <div>
                  <label className={labelClass}>Schedule</label>
                  <select
                    value={backupSchedule}
                    onChange={(e) => setBackupSchedule(e.target.value)}
                    className={`${selectClass} w-full mt-1.5`}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Retention */}
                <div>
                  <label className={labelClass}>Retention</label>
                  <select
                    value={backupRetention}
                    onChange={(e) => setBackupRetention(e.target.value)}
                    className={`${selectClass} w-full mt-1.5`}
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>

                {/* Last backup status */}
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <div>
                    <p className={labelClass}>Last backup</p>
                    <p className={`text-sm font-medium mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      2 hours ago
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    Success
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleBackupNow}
                    disabled={backingUpNow}
                    className={`${secondaryBtnClass} disabled:opacity-60`}
                  >
                    {backingUpNow ? <>{SpinnerIcon} Backing up...</> : "Backup Now"}
                  </button>
                  <button
                    onClick={handleSaveBackupSettings}
                    disabled={savingBackupSettings}
                    className={`h-9 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
                  >
                    {savingBackupSettings ? <>{SpinnerIcon} Saving...</> : "Save Settings"}
                  </button>
                </div>
              </div>
            )}
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
                {creating ? <>{SpinnerIcon} Creating...</> : "Create"}
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
                {importing ? <>{SpinnerIcon} Importing...</> : "Import"}
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

      {/* ── Empty Table Confirm Dialog ── */}
      <ConfirmDialog
        open={!!emptyTableTarget}
        onClose={() => setEmptyTableTarget(null)}
        onConfirm={handleEmptyTable}
        title={`Empty "${emptyTableTarget}"?`}
        message="All rows in this table will be permanently deleted. The table structure will be preserved."
        confirmText="Empty Table"
        variant="warning"
      />

      {/* ── Drop Table Confirm Dialog ── */}
      <ConfirmDialog
        open={!!dropTableTarget}
        onClose={() => setDropTableTarget(null)}
        onConfirm={handleDropTable}
        title={`Drop "${dropTableTarget}"?`}
        message="This table and all its data will be permanently removed. This action cannot be undone."
        confirmText="Drop Table"
        variant="danger"
        requireTypedConfirmation="DROP"
      />
    </>
  );
}

export default function DatabaseManagementPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <AppShell>
      <Link href={`/site?name=${encodeURIComponent(siteId)}`} className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Back to {decodeURIComponent(siteId)}
      </Link>
      <DatabaseTab siteId={siteId} />
    </AppShell>
  );
}
