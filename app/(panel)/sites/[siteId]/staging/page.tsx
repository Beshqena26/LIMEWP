"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

/* ════════════════════════════ Types ════════════════════════════ */

interface StagingEnv {
  url: string;
  wpAdminUrl: string;
  createdAt: string;
  size: string;
  uptime: string;
  syncStatus: "in-sync" | "out-of-date" | "never-synced";
  lastSynced: string;
}

interface EnvComparison {
  label: string;
  live: string;
  staging: string;
  differs: boolean;
}

interface ChangedFile {
  path: string;
  type: "modified" | "added" | "deleted";
  category: "Themes" | "Plugins" | "Uploads" | "Core" | "Cache";
  sizeChange: string;
}

interface SyncHistoryEntry {
  id: string;
  action: "push" | "pull";
  date: string;
  user: string;
  components: string[];
  status: "success" | "failed";
}

interface CreationStep {
  label: string;
  detail: string;
  done: boolean;
  active: boolean;
}

/* ════════════════════════════ Mock Data ════════════════════════════ */

const STAGING_DATA: StagingEnv = {
  url: "https://staging.flavor-theme.com",
  wpAdminUrl: "https://staging.flavor-theme.com/wp-admin",
  createdAt: "Mar 10, 2026",
  size: "1.8 GB",
  uptime: "14d 6h 32m",
  syncStatus: "out-of-date",
  lastSynced: "Mar 20, 2026 at 14:30",
};

const ENV_COMPARISON: EnvComparison[] = [
  { label: "WordPress Version", live: "6.7.1", staging: "6.7.1", differs: false },
  { label: "PHP Version", live: "8.3.6", staging: "8.2.12", differs: true },
  { label: "Last Modified", live: "2026-03-22", staging: "2026-03-15", differs: true },
  { label: "Active Plugins", live: "12", staging: "10", differs: true },
  { label: "Theme", live: "Flavor Theme 3.2", staging: "Flavor Theme 3.2", differs: false },
  { label: "Database Size", live: "245 MB", staging: "238 MB", differs: true },
];

const CHANGED_FILES: ChangedFile[] = [
  { path: "wp-content/themes/flavor/style.css", type: "modified", category: "Themes", sizeChange: "+2.4 KB" },
  { path: "wp-content/themes/flavor/functions.php", type: "modified", category: "Themes", sizeChange: "+0.8 KB" },
  { path: "wp-content/themes/flavor/header.php", type: "modified", category: "Themes", sizeChange: "+1.1 KB" },
  { path: "wp-content/plugins/woocommerce/includes/class-wc-cart.php", type: "modified", category: "Plugins", sizeChange: "+3.2 KB" },
  { path: "wp-content/plugins/woocommerce/assets/js/frontend/cart.js", type: "modified", category: "Plugins", sizeChange: "+0.5 KB" },
  { path: "wp-content/uploads/2026/03/hero-banner.webp", type: "added", category: "Uploads", sizeChange: "+248 KB" },
  { path: "wp-content/uploads/2026/03/product-shot-01.webp", type: "added", category: "Uploads", sizeChange: "+185 KB" },
  { path: "wp-content/uploads/2026/03/product-shot-02.webp", type: "added", category: "Uploads", sizeChange: "+192 KB" },
  { path: "wp-content/uploads/2026/03/testimonial-avatar.webp", type: "added", category: "Uploads", sizeChange: "+34 KB" },
  { path: "wp-content/cache/object/ae2f.php", type: "deleted", category: "Cache", sizeChange: "-12 KB" },
  { path: "wp-content/cache/object/b3c1.php", type: "deleted", category: "Cache", sizeChange: "-8 KB" },
  { path: "wp-content/cache/page/index.html", type: "deleted", category: "Cache", sizeChange: "-156 KB" },
];

const SYNC_HISTORY: SyncHistoryEntry[] = [
  { id: "sh1", action: "push", date: "Mar 20, 2026 14:30", user: "John Doe", components: ["Files", "Database"], status: "success" },
  { id: "sh2", action: "pull", date: "Mar 15, 2026 09:15", user: "John Doe", components: ["Database"], status: "success" },
  { id: "sh3", action: "push", date: "Mar 10, 2026 16:45", user: "Sarah M.", components: ["Files", "Database", "Media"], status: "failed" },
  { id: "sh4", action: "pull", date: "Mar 8, 2026 11:20", user: "John Doe", components: ["Files", "Database", "Media", "Plugins"], status: "success" },
  { id: "sh5", action: "push", date: "Mar 5, 2026 08:00", user: "Sarah M.", components: ["Themes"], status: "success" },
];

const CREATION_STEPS: { label: string; detail: string }[] = [
  { label: "Cloning files", detail: "2,847 files" },
  { label: "Copying database", detail: "23 tables" },
  { label: "Configuring environment", detail: "URLs & paths" },
  { label: "Disabling emails & search indexing", detail: "Safety settings" },
  { label: "Done!", detail: "Staging is ready" },
];

const PUSH_PULL_STEPS = [
  { label: "Creating backup of destination" },
  { label: "Transferring files", progress: "342/2,847" },
  { label: "Importing database", progress: "15/23 tables" },
  { label: "Updating URLs" },
  { label: "Flushing caches" },
  { label: "Complete!" },
];

/* ════════════════════════════ Helpers ════════════════════════════ */

function getSyncBadge(status: StagingEnv["syncStatus"], isLight: boolean) {
  if (status === "in-sync") return { bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", text: isLight ? "text-emerald-700" : "text-emerald-400", dot: "bg-emerald-400", ring: isLight ? "ring-emerald-200" : "ring-emerald-500/20", label: "In Sync" };
  if (status === "out-of-date") return { bg: isLight ? "bg-amber-50" : "bg-amber-500/10", text: isLight ? "text-amber-700" : "text-amber-400", dot: "bg-amber-400", ring: isLight ? "ring-amber-200" : "ring-amber-500/20", label: "Out of Date" };
  return { bg: isLight ? "bg-slate-100" : "bg-slate-500/10", text: isLight ? "text-slate-600" : "text-slate-400", dot: "bg-slate-400", ring: isLight ? "ring-slate-200" : "ring-slate-500/20", label: "Never Synced" };
}

function getFileTypeBadge(type: ChangedFile["type"], isLight: boolean) {
  if (type === "modified") return { bg: isLight ? "bg-amber-50" : "bg-amber-500/10", text: isLight ? "text-amber-700" : "text-amber-400", dot: "bg-amber-400", label: "Modified" };
  if (type === "added") return { bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", text: isLight ? "text-emerald-700" : "text-emerald-400", dot: "bg-emerald-400", label: "Added" };
  return { bg: isLight ? "bg-rose-50" : "bg-rose-500/10", text: isLight ? "text-rose-700" : "text-rose-400", dot: "bg-rose-400", label: "Deleted" };
}

/* ════════════════════════════ Component ════════════════════════════ */

export function StagingTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  /* ── Core state ── */
  const [hasStaging, setHasStaging] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creationSteps, setCreationSteps] = useState<CreationStep[]>([]);

  /* ── Settings ── */
  const [passwordProtection, setPasswordProtection] = useState(true);
  const [stagingPassword, setStagingPassword] = useState("stg_Abc123Xyz");
  const [showPassword, setShowPassword] = useState(false);
  const [disableEmails, setDisableEmails] = useState(true);
  const [disableIndexing, setDisableIndexing] = useState(true);
  const [autoExpire, setAutoExpire] = useState(false);

  /* ── Push/Pull ── */
  const [syncTab, setSyncTab] = useState<"push" | "pull">("push");
  const [syncFiles, setSyncFiles] = useState(true);
  const [syncDatabase, setSyncDatabase] = useState(true);
  const [syncMedia, setSyncMedia] = useState(true);
  const [syncPlugins, setSyncPlugins] = useState(false);
  const [syncThemes, setSyncThemes] = useState(false);

  /* ── Progress modal ── */
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const [syncProgressAction, setSyncProgressAction] = useState<"push" | "pull">("push");
  const [syncProgressSteps, setSyncProgressSteps] = useState<{ label: string; progress?: string; done: boolean; active: boolean }[]>([]);

  /* ── Preview changes modal ── */
  const [showPreview, setShowPreview] = useState(false);
  const [previewFilter, setPreviewFilter] = useState<"all" | "modified" | "added" | "deleted">("all");

  /* ── Confirm dialogs ── */
  const [showPushConfirm, setShowPushConfirm] = useState(false);
  const [showPullConfirm, setShowPullConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ── Changed files expansion ── */
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ Themes: true, Plugins: true, Uploads: false, Core: false, Cache: false });

  /* ── Staging access ── */
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const stagingUsername = "admin_staging";
  const stagingLoginPassword = "wp_stg_K9mX2pR7vL";

  /* ── Copied state for toast feedback ── */
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ════════════════════════════ Handlers ════════════════════════════ */

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopiedField(null), 2000);
    showToast.success("Copied to clipboard");
  }, []);

  const handleCreateStaging = useCallback(async () => {
    setCreating(true);
    const steps: CreationStep[] = CREATION_STEPS.map((s) => ({ ...s, done: false, active: false }));
    setCreationSteps(steps);

    for (let i = 0; i < CREATION_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setCreationSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          active: idx === i,
          done: idx < i || (idx === i && i === CREATION_STEPS.length - 1),
        }))
      );
    }

    await new Promise((r) => setTimeout(r, 600));
    setCreating(false);
    setHasStaging(true);
    showToast.success("Staging environment created successfully");
  }, []);

  const runSyncProgress = useCallback(async (action: "push" | "pull") => {
    setSyncProgressAction(action);
    setShowSyncProgress(true);
    const steps = PUSH_PULL_STEPS.map((s) => ({ ...s, done: false, active: false }));
    setSyncProgressSteps(steps);

    for (let i = 0; i < PUSH_PULL_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setSyncProgressSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          active: idx === i,
          done: idx < i || (idx === i && i === PUSH_PULL_STEPS.length - 1),
        }))
      );
    }

    await new Promise((r) => setTimeout(r, 2000));
    setShowSyncProgress(false);
    showToast.success(action === "push" ? "Changes pushed to live successfully" : "Live site pulled to staging successfully");
  }, []);

  const handlePushToLive = useCallback(() => {
    setShowPushConfirm(false);
    runSyncProgress("push");
  }, [runSyncProgress]);

  const handlePullFromLive = useCallback(() => {
    setShowPullConfirm(false);
    runSyncProgress("pull");
  }, [runSyncProgress]);

  const handleDeleteStaging = useCallback(() => {
    setShowDeleteConfirm(false);
    setHasStaging(false);
    showToast.success("Staging environment deleted");
  }, []);

  const handleShareAccess = useCallback(() => {
    const text = `Staging Site Access\n\nURL: ${STAGING_DATA.url}\nWP Admin: ${STAGING_DATA.wpAdminUrl}\nUsername: ${stagingUsername}\nPassword: ${stagingLoginPassword}`;
    navigator.clipboard.writeText(text);
    showToast.success("Staging credentials copied to clipboard");
  }, [stagingUsername, stagingLoginPassword]);

  /* ════════════════════════════ Style Classes ════════════════════════════ */

  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const secondaryBtnClass = `h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
    isLight
      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
      : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const syncBadge = getSyncBadge(STAGING_DATA.syncStatus, isLight);

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  /* ── Computed ── */
  const modifiedCount = CHANGED_FILES.filter((f) => f.type === "modified").length;
  const addedCount = CHANGED_FILES.filter((f) => f.type === "added").length;
  const deletedCount = CHANGED_FILES.filter((f) => f.type === "deleted").length;
  const categories = [...new Set(CHANGED_FILES.map((f) => f.category))];
  const filteredPreviewFiles = previewFilter === "all" ? CHANGED_FILES : CHANGED_FILES.filter((f) => f.type === previewFilter);

  /* ════════════════════════════ Copy Button Helper ════════════════════════════ */

  const CopyButton = ({ text, field, small }: { text: string; field: string; small?: boolean }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className={`${small ? "p-1" : "p-1.5"} rounded-lg transition-colors ${
        copiedField === field
          ? "text-emerald-500 bg-emerald-500/10"
          : isLight
            ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            : "text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-elevated)]"
      }`}
      title="Copy"
    >
      {copiedField === field ? (
        <svg className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );

  /* ════════════════════════════ RENDER ════════════════════════════ */

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Staging Environment
        </h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
          Test changes safely for{" "}
          <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {decodeURIComponent(siteId)}
          </span>
        </p>
      </div>

      {/* ══════════════════ STATE 1: Empty State ══════════════════ */}
      {!hasStaging && !creating && (
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              {/* Violet branch icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                isLight ? "bg-violet-50" : "bg-violet-500/10"
              }`}>
                <svg className="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>

              <h2 className={`text-xl font-semibold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                No Staging Environment
              </h2>
              <p className={`text-sm max-w-md mb-8 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Create a staging copy of your live site to test changes safely before pushing them to production. Your visitors will never see unfinished work.
              </p>

              <button
                onClick={handleCreateStaging}
                className={`h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2.5 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Staging Environment
              </button>
            </div>
          </div>

          {/* Benefit cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Safe Testing",
                desc: "Make changes without affecting your live site. Test plugins, themes, and code updates in an isolated environment.",
                color: "emerald",
                icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
              },
              {
                title: "One-Click Deploy",
                desc: "Push your staging changes to production with a single click. Selective sync lets you choose exactly what to deploy.",
                color: "sky",
                icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
              },
              {
                title: "Full Copy",
                desc: "Your staging site is a complete clone including files, database, plugins, themes, and media uploads.",
                color: "violet",
                icon: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75",
              },
            ].map((card) => {
              const c = getColorClasses(card.color);
              return (
                <div key={card.title} className={`${cardClass} p-5`}>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                    <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                    </svg>
                  </div>
                  <h3 className={`text-sm font-semibold mb-1.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {card.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════ STATE 2: Creating (Multi-step Animation) ══════════════════ */}
      {creating && (
        <div className={cardClass}>
          <div className="flex flex-col items-center py-16 px-6">
            {/* Animated icon */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
              isLight ? "bg-violet-50" : "bg-violet-500/10"
            }`}>
              <svg className="w-10 h-10 text-violet-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>

            <h2 className={`text-xl font-semibold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Creating Staging Environment
            </h2>
            <p className={`text-sm mb-10 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Cloning your live site. This usually takes a minute or two.
            </p>

            {/* Steps */}
            <div className="w-full max-w-sm space-y-3">
              {creationSteps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                    step.done
                      ? isLight ? "bg-emerald-50" : "bg-emerald-500/10"
                      : step.active
                        ? isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                        : "opacity-40"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {step.done ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    ) : step.active ? (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        isLight ? "border-slate-200" : "border-slate-600"
                      }`} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.done
                        ? "text-emerald-600"
                        : step.active
                          ? isLight ? "text-slate-800" : "text-slate-100"
                          : isLight ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {step.label}
                    </p>
                  </div>

                  {/* Detail */}
                  <span className={`text-xs flex-shrink-0 ${
                    step.done ? "text-emerald-500" : isLight ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {step.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ STATE 3: Active Staging Dashboard ══════════════════ */}
      {hasStaging && !creating && (
        <div className="space-y-6">

          {/* ── 3a. Status Header Card ── */}
          <div className={cardClass}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                {/* Live ↔ Staging visual */}
                <div className="flex items-center gap-4">
                  {/* Live */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                      <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Live Site</p>
                      <p className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {decodeURIComponent(siteId)}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className={`flex items-center px-3 ${isLight ? "text-slate-300" : "text-slate-600"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  </div>

                  {/* Staging */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 block" />
                      <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping opacity-50" />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Staging Site</p>
                      <p className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        staging.{decodeURIComponent(siteId)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sync badge + last synced */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${syncBadge.bg} ${syncBadge.ring}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${syncBadge.dot}`} />
                    <span className={`text-xs font-semibold ${syncBadge.text}`}>{syncBadge.label}</span>
                  </span>
                  <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    Last synced {STAGING_DATA.lastSynced}
                  </span>
                </div>
              </div>

              {/* ── 3b. Stats Strip ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Staging URL */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-sky-50/50 border-sky-200/60" : "bg-sky-500/5 border-sky-500/10"
                }`}>
                  <p className={labelClass}>Staging URL</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <a
                      href={STAGING_DATA.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-semibold hover:underline truncate ${isLight ? "text-sky-700" : "text-sky-400"}`}
                    >
                      {STAGING_DATA.url.replace("https://", "")}
                    </a>
                    <CopyButton text={STAGING_DATA.url} field="staging-url" small />
                  </div>
                </div>

                {/* Created */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-violet-50/50 border-violet-200/60" : "bg-violet-500/5 border-violet-500/10"
                }`}>
                  <p className={labelClass}>Created</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-violet-700" : "text-violet-400"}`}>
                    {STAGING_DATA.createdAt}
                  </p>
                </div>

                {/* Size */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-amber-50/50 border-amber-200/60" : "bg-amber-500/5 border-amber-500/10"
                }`}>
                  <p className={labelClass}>Size</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                    {STAGING_DATA.size}
                  </p>
                </div>

                {/* Uptime */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-emerald-50/50 border-emerald-200/60" : "bg-emerald-500/5 border-emerald-500/10"
                }`}>
                  <p className={labelClass}>Uptime</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                    {STAGING_DATA.uptime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3c. Staging Settings ── */}
          <div className={cardClass}>
            <div className="p-6">
              <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Staging Settings
              </h2>

              <div className="space-y-5">
                {/* Password Protection */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>Password Protection</p>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        Require a password to access the staging site
                      </p>
                    </div>
                    <Toggle enabled={passwordProtection} onChange={setPasswordProtection} />
                  </div>
                  {passwordProtection && (
                    <div className="mt-3 ml-0">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-xs">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={stagingPassword}
                            onChange={(e) => setStagingPassword(e.target.value)}
                            className={`${inputClass} pr-20 font-mono text-xs`}
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                {showPassword ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                ) : (
                                  <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </>
                                )}
                              </svg>
                            </button>
                            <CopyButton text={stagingPassword} field="stg-password" small />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"}`} />

                {/* Disable Emails */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>Disable Emails</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Prevent staging from sending real emails to customers
                    </p>
                  </div>
                  <Toggle enabled={disableEmails} onChange={setDisableEmails} />
                </div>

                <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"}`} />

                {/* Disable Search Indexing */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>Disable Search Indexing</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Block search engines from indexing the staging site
                    </p>
                  </div>
                  <Toggle enabled={disableIndexing} onChange={setDisableIndexing} />
                </div>

                <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"}`} />

                {/* Auto-expire */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>Auto-expire</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Automatically delete staging after 30 days of inactivity
                    </p>
                  </div>
                  <Toggle enabled={autoExpire} onChange={setAutoExpire} />
                </div>
              </div>
            </div>
          </div>

          {/* ── 3d. Selective Push/Pull ── */}
          <div className={cardClass}>
            <div className="p-6">
              <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Sync Operations
              </h2>

              {/* Segmented control */}
              <div className={`inline-flex rounded-xl p-1 mb-6 ${
                isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
              }`}>
                <button
                  onClick={() => setSyncTab("push")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    syncTab === "push"
                      ? isLight
                        ? "bg-white text-slate-800 shadow-sm"
                        : "bg-[var(--bg-secondary)] text-slate-100 shadow-sm"
                      : isLight
                        ? "text-slate-500 hover:text-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Push to Live
                  </span>
                </button>
                <button
                  onClick={() => setSyncTab("pull")}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    syncTab === "pull"
                      ? isLight
                        ? "bg-white text-slate-800 shadow-sm"
                        : "bg-[var(--bg-secondary)] text-slate-100 shadow-sm"
                      : isLight
                        ? "text-slate-500 hover:text-slate-700"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                    </svg>
                    Pull from Live
                  </span>
                </button>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mb-5">
                {[
                  { label: "Files", desc: "WordPress core files and custom code", state: syncFiles, set: setSyncFiles },
                  { label: "Database", desc: "Posts, pages, settings, and user data", state: syncDatabase, set: setSyncDatabase },
                  { label: "Media uploads", desc: "Images, videos, and other media files", state: syncMedia, set: setSyncMedia },
                  { label: "Plugins", desc: "All installed plugins and their settings", state: syncPlugins, set: setSyncPlugins },
                  { label: "Themes", desc: "Theme files and customizer settings", state: syncThemes, set: setSyncThemes },
                ].map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      item.state
                        ? isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/50"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.set(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/20"
                    />
                    <div>
                      <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>{item.label}</p>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Warning callout */}
              <div className={`flex items-start gap-3 p-4 rounded-xl mb-5 ${
                syncTab === "push"
                  ? isLight ? "bg-amber-50 border border-amber-200/60" : "bg-amber-500/5 border border-amber-500/10"
                  : isLight ? "bg-sky-50 border border-sky-200/60" : "bg-sky-500/5 border border-sky-500/10"
              }`}>
                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  syncTab === "push" ? "text-amber-500" : "text-sky-500"
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className={`text-sm ${
                  syncTab === "push"
                    ? isLight ? "text-amber-800" : "text-amber-300"
                    : isLight ? "text-sky-800" : "text-sky-300"
                }`}>
                  {syncTab === "push"
                    ? "This will overwrite selected components on your live site. A backup will be created automatically before sync."
                    : "This will overwrite selected components on staging with data from your live site."
                  }
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className={secondaryBtnClass}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preview Changes
                </button>
                <button
                  onClick={() => syncTab === "push" ? setShowPushConfirm(true) : setShowPullConfirm(true)}
                  disabled={!syncFiles && !syncDatabase && !syncMedia && !syncPlugins && !syncThemes}
                  className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    {syncTab === "push" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                    )}
                  </svg>
                  {syncTab === "push" ? "Push Selected" : "Pull Selected"}
                </button>
              </div>
            </div>
          </div>

          {/* ── 3e. Changes Diff / Comparison ── */}
          <div className={`${cardClass} overflow-hidden`}>
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Environment Comparison
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Property
                    </th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Live
                      </div>
                    </th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Staging
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ENV_COMPARISON.map((row) => (
                    <tr
                      key={row.label}
                      className={`border-b last:border-b-0 transition-colors ${
                        isLight
                          ? "border-slate-100 hover:bg-slate-50"
                          : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                      }`}
                    >
                      <td className={`px-6 py-4 text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                        {row.label}
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                        {row.live}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-mono ${
                            row.differs
                              ? "text-amber-500 font-semibold"
                              : isLight ? "text-slate-600" : "text-slate-300"
                          }`}>
                            {row.staging}
                          </span>
                          {row.differs && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isLight ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                            }`}>
                              differs
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Changed Files ── */}
          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Changed Files
                </h2>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{modifiedCount} modified</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{addedCount} added</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{deletedCount} deleted</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => {
                  const files = CHANGED_FILES.filter((f) => f.category === cat);
                  const isExpanded = expandedCategories[cat] ?? false;
                  return (
                    <div key={cat}>
                      <button
                        onClick={() => setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          isLight ? "hover:bg-slate-50" : "hover:bg-[var(--bg-elevated)]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                          <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>{cat}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"
                          }`}>
                            {files.length}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="ml-7 space-y-1 pb-2">
                          {files.map((file, i) => {
                            const badge = getFileTypeBadge(file.type, isLight);
                            return (
                              <div
                                key={i}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${
                                  isLight ? "hover:bg-slate-50" : "hover:bg-[var(--bg-elevated)]/30"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                                  <span className={`text-xs font-mono truncate ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                                    {file.path}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                                    {badge.label}
                                  </span>
                                  <span className={`text-xs font-mono ${
                                    file.type === "deleted" ? "text-rose-500" : file.type === "added" ? "text-emerald-500" : "text-amber-500"
                                  }`}>
                                    {file.sizeChange}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3f. Sync History Log ── */}
          <div className={cardClass}>
            <div className="p-6">
              <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Sync History
              </h2>

              <div className="space-y-0">
                {SYNC_HISTORY.map((entry, i) => {
                  const isPush = entry.action === "push";
                  const isLast = i === SYNC_HISTORY.length - 1;
                  return (
                    <div key={entry.id} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                          isPush ? "bg-sky-400" : "bg-violet-400"
                        }`} />
                        {!isLast && (
                          <div className={`w-px flex-1 my-1 ${
                            isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"
                          }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                                {isPush ? "Push to Live" : "Pull from Live"}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                entry.status === "success"
                                  ? isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
                                  : isLight ? "bg-rose-50 text-rose-700" : "bg-rose-500/10 text-rose-400"
                              }`}>
                                {entry.status}
                              </span>
                            </div>
                            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                              {entry.date} by {entry.user}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {entry.components.map((c) => (
                                <span key={c} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-400"
                                }`}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 3g. Staging Access Card ── */}
          <div className={cardClass}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Staging Access
                </h2>
                <button
                  onClick={handleShareAccess}
                  className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? "text-slate-600 hover:bg-slate-100 border border-slate-200"
                      : "text-slate-400 hover:bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  Share Access
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Staging URL */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Staging URL</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-sm font-mono truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {STAGING_DATA.url}
                    </span>
                    <CopyButton text={STAGING_DATA.url} field="access-url" small />
                    <a
                      href={STAGING_DATA.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1 rounded-lg transition-colors ${
                        isLight ? "text-slate-400 hover:text-sky-600" : "text-slate-500 hover:text-sky-400"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* WP Admin URL */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>WP Admin</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-sm font-mono truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {STAGING_DATA.wpAdminUrl}
                    </span>
                    <CopyButton text={STAGING_DATA.wpAdminUrl} field="access-admin" small />
                    <a
                      href={STAGING_DATA.wpAdminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1 rounded-lg transition-colors ${
                        isLight ? "text-slate-400 hover:text-sky-600" : "text-slate-500 hover:text-sky-400"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Username */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Username</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-sm font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {stagingUsername}
                    </span>
                    <CopyButton text={stagingUsername} field="access-user" small />
                  </div>
                </div>

                {/* Password */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Password</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-sm font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {showLoginPassword ? stagingLoginPassword : "••••••••••••"}
                    </span>
                    <button
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className={`p-1 rounded-lg transition-colors ${
                        isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        {showLoginPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </>
                        )}
                      </svg>
                    </button>
                    <CopyButton text={stagingLoginPassword} field="access-pass" small />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3h. Quick Actions Row ── */}
          <div className={`${cardClass} p-5`}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  showToast.info("Refreshing staging from live site...");
                  runSyncProgress("pull");
                }}
                className={secondaryBtnClass}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Refresh Staging
              </button>

              <a
                href={STAGING_DATA.url}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryBtnClass}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open Staging Site
              </a>

              <a
                href={STAGING_DATA.wpAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryBtnClass}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open WP Admin
              </a>

              <div className="flex-1" />

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                  isLight
                    ? "text-red-600 hover:bg-red-50 border border-red-200"
                    : "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete Staging
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ MODALS ══════════════════ */}

      {/* Push/Pull Progress Modal */}
      {showSyncProgress && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${
            isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
          }`}>
            <h3 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {syncProgressAction === "push" ? "Pushing to Live..." : "Pulling from Live..."}
            </h3>
            <p className={`text-sm mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Please do not close this window
            </p>

            <div className="space-y-3 mb-6">
              {syncProgressSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ${
                  step.done
                    ? isLight ? "bg-emerald-50" : "bg-emerald-500/10"
                    : step.active
                      ? isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                      : "opacity-30"
                }`}>
                  <div className="flex-shrink-0">
                    {step.done ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    ) : step.active ? (
                      <svg className="w-5 h-5 animate-spin text-sky-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${isLight ? "border-slate-200" : "border-slate-600"}`} />
                    )}
                  </div>
                  <span className={`text-sm flex-1 ${
                    step.done ? "text-emerald-600" : step.active ? (isLight ? "text-slate-800" : "text-slate-100") : ""
                  }`}>
                    {step.label}
                  </span>
                  {step.progress && step.active && (
                    <span className={`text-xs font-mono ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {step.progress}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Cancel warning */}
            <div className={`text-xs text-center ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              Cancelling mid-sync may leave your site in an inconsistent state
            </div>
          </div>
        </div>
      )}

      {/* Preview Changes Modal */}
      {showPreview && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowPreview(false)} />
          <div className={modalCardClass}>
            {/* Header */}
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Preview Changes
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLight ? "text-slate-400 hover:bg-slate-100" : "text-slate-500 hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Summary */}
              <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                <span className="text-amber-500 font-semibold">{modifiedCount} modified</span>,{" "}
                <span className="text-emerald-500 font-semibold">{addedCount} added</span>,{" "}
                <span className="text-rose-500 font-semibold">{deletedCount} deleted</span>
              </p>

              {/* Filter tabs */}
              <div className="flex gap-1 mt-4">
                {(["all", "modified", "added", "deleted"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPreviewFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      previewFilter === filter
                        ? isLight
                          ? "bg-slate-800 text-white"
                          : "bg-slate-200 text-slate-800"
                        : isLight
                          ? "text-slate-500 hover:bg-slate-100"
                          : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {filter}
                    {filter !== "all" && (
                      <span className="ml-1.5">
                        {filter === "modified" ? modifiedCount : filter === "added" ? addedCount : deletedCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* File list */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-1.5">
                {filteredPreviewFiles.map((file, i) => {
                  const badge = getFileTypeBadge(file.type, isLight);
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                        isLight ? "hover:bg-slate-50" : "hover:bg-[var(--bg-elevated)]/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${badge.dot}`} />
                        <span className={`text-xs font-mono truncate ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                          {file.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className={`text-xs font-mono ${
                          file.type === "deleted" ? "text-rose-500" : file.type === "added" ? "text-emerald-500" : "text-amber-500"
                        }`}>
                          {file.sizeChange}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button
                onClick={() => setShowPreview(false)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  if (syncTab === "push") setShowPushConfirm(true);
                  else setShowPullConfirm(true);
                }}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                Proceed with {syncTab === "push" ? "Push" : "Pull"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ Confirmation Dialogs ══════════════════ */}

      <ConfirmDialog
        open={showPushConfirm}
        onClose={() => setShowPushConfirm(false)}
        onConfirm={handlePushToLive}
        title="Push to Live?"
        message="This will overwrite selected components on your live site with the staging version. A backup will be created automatically, but any live changes not present in staging will be lost."
        confirmText="Push to Live"
        variant="warning"
      />

      <ConfirmDialog
        open={showPullConfirm}
        onClose={() => setShowPullConfirm(false)}
        onConfirm={handlePullFromLive}
        title="Pull from Live?"
        message="This will overwrite selected components on your staging environment with data from the live site. Any uncommitted staging changes will be lost."
        confirmText="Pull from Live"
        variant="warning"
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteStaging}
        title="Delete Staging Environment?"
        message="This will permanently delete the staging environment and all its data. This action cannot be undone."
        confirmText="Delete Staging"
        variant="danger"
        requireTypedConfirmation="DELETE"
      />
    </>
  );
}

export default function StagingPage() {
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
      <StagingTab siteId={siteId} />
    </AppShell>
  );
}
