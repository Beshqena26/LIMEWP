"use client";

import { useState, useEffect, useCallback, Fragment, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ROUTES } from "@/config/routes";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import {
  SOURCE_CARDS,
  CONNECTION_FIELDS,
  MOCK_DISCOVERED_SITES,
  MIGRATION_STEPS,
  MIGRATION_STATUS_LABELS,
  type MigrationSource,
  type MigrationStatus,
  type DiscoveredSite,
} from "@/data/migration";

/* ────────────────────────── Types ────────────────────────── */

type SiteWithSelection = DiscoveredSite & { selected: boolean };

interface MigrationLogEntry {
  message: string;
  timestamp: string;
  type: "info" | "error" | "success";
}

/* ────────────────────────── Constants ────────────────────────── */

const SOURCE_COLORS: Record<MigrationSource, { bg: string; text: string; border: string }> = {
  cpanel: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
  siteground: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  bluehost: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  cloudways: { bg: "bg-teal-500/10", text: "text-teal-500", border: "border-teal-500/20" },
  kinsta: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
  wpengine: { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20" },
  flywheel: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  godaddy: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20" },
  hostinger: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  "wordpress-com": { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20" },
  plesk: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
  manual: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
};

const STATUS_COLORS: Record<MigrationStatus, { bg: string; text: string; progress: string; dot: string }> = {
  pending: { bg: "bg-slate-500/10", text: "text-slate-400", progress: "bg-slate-400", dot: "bg-slate-400" },
  copying: { bg: "bg-sky-500/10", text: "text-sky-400", progress: "bg-sky-500", dot: "bg-sky-500" },
  importing: { bg: "bg-violet-500/10", text: "text-violet-400", progress: "bg-violet-500", dot: "bg-violet-500" },
  configuring: { bg: "bg-amber-500/10", text: "text-amber-400", progress: "bg-amber-500", dot: "bg-amber-500" },
  complete: { bg: "bg-emerald-500/10", text: "text-emerald-400", progress: "bg-emerald-500", dot: "bg-emerald-500" },
  failed: { bg: "bg-rose-500/10", text: "text-rose-400", progress: "bg-rose-500", dot: "bg-rose-500" },
};

const DATA_CENTERS = [
  { id: "us-east", label: "US East", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "us-west", label: "US West", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "europe", label: "Europe", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "asia", label: "Asia", flag: "\u{1F1EF}\u{1F1F5}" },
];

const MIGRATION_HISTORY = [
  { id: "mh1", source: "cPanel" as const, date: "Mar 10, 2026", sites: 3, successful: 3, failed: 0, duration: "12 min" },
  { id: "mh2", source: "WP Engine" as const, date: "Feb 22, 2026", sites: 2, successful: 1, failed: 1, duration: "8 min" },
];

const CONNECTION_TEST_STEPS = ["Connecting...", "Authenticating...", "Scanning...", "Connected!"];

const MIGRATION_LOG_TEMPLATES: { message: string; minPct: number; maxPct: number }[] = [
  { message: "Connecting to source server...", minPct: 0, maxPct: 5 },
  { message: "Copying wp-content files... (342 files)", minPct: 10, maxPct: 40 },
  { message: "Importing database... (23 tables)", minPct: 40, maxPct: 70 },
  { message: "Updating wp-config.php...", minPct: 70, maxPct: 80 },
  { message: "Configuring SSL certificate...", minPct: 80, maxPct: 90 },
  { message: "Flushing caches...", minPct: 90, maxPct: 95 },
  { message: "Migration complete!", minPct: 100, maxPct: 100 },
];

const PRE_MIGRATION_CHECKS = [
  "I have a recent backup of my source site",
  "I understand DNS changes may take up to 48 hours",
  "I've disabled any rate-limiting or firewall rules that might block migration",
];

/* ────────────────────────── Helpers ────────────────────────── */

const spinner = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

function parseSizeToGB(size: string): number {
  const num = parseFloat(size);
  if (size.includes("MB")) return num / 1024;
  if (size.includes("GB")) return num;
  return num;
}

function getLogEntriesForProgress(progress: number, status: MigrationStatus): MigrationLogEntry[] {
  const entries: MigrationLogEntry[] = [];
  for (const tmpl of MIGRATION_LOG_TEMPLATES) {
    if (progress >= tmpl.minPct) {
      entries.push({
        message: tmpl.message,
        timestamp: new Date().toLocaleTimeString(),
        type: tmpl.message.includes("complete") ? "success" : "info",
      });
    }
  }
  if (status === "failed") {
    entries.push({
      message: "Error: Connection timeout during database import",
      timestamp: new Date().toLocaleTimeString(),
      type: "error",
    });
  }
  return entries;
}

/* ────────────────────────── Component ────────────────────────── */

export default function MigratePage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const router = useRouter();

  /* ── Fade-in ── */
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* ── Wizard state ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState<MigrationSource | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStepIndex, setTestStepIndex] = useState(-1);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sites, setSites] = useState<SiteWithSelection[]>([]);

  /* ── Migration options ── */
  const [dataCenter, setDataCenter] = useState("us-east");
  const [skipCache, setSkipCache] = useState(true);
  const [skipThumbnails, setSkipThumbnails] = useState(false);
  const [replaceUrls, setReplaceUrls] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [preMigrationChecks, setPreMigrationChecks] = useState<boolean[]>(PRE_MIGRATION_CHECKS.map(() => false));

  /* ── Migration progress ── */
  const [migrationProgress, setMigrationProgress] = useState<
    Record<string, { progress: number; status: MigrationStatus }>
  >({});
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [emailNotify, setEmailNotify] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [copiedNs, setCopiedNs] = useState<string | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyResults, setVerifyResults] = useState<Record<string, "checking" | "passed" | "failed">>({});
  const [showReport, setShowReport] = useState(false);

  /* ── Initialize sites when entering step 2 ── */
  useEffect(() => {
    if (currentStep === 2 && selectedSource && sites.length === 0) {
      const discovered = MOCK_DISCOVERED_SITES[selectedSource];
      setSites(discovered.map((s) => ({ ...s, selected: true })));
    }
  }, [currentStep, selectedSource, sites.length]);

  /* ── Migration simulation ── */
  useEffect(() => {
    if (currentStep !== 3) return;
    const entries = Object.entries(migrationProgress);
    if (entries.length === 0) return;
    const allDone = entries.every(([, v]) => v.status === "complete" || v.status === "failed");
    if (allDone) return;

    const interval = setInterval(() => {
      setMigrationProgress((prev) => {
        const next = { ...prev };
        const ids = Object.keys(next);
        const failTargetId = ids.length >= 3 ? ids[ids.length - 1] : null;

        for (const id of ids) {
          const entry = { ...next[id] };
          if (entry.status === "complete" || entry.status === "failed") {
            next[id] = entry;
            continue;
          }
          if (id === failTargetId && entry.progress >= 58) {
            entry.status = "failed";
            next[id] = entry;
            continue;
          }
          if (entry.status === "pending" && entry.progress === 0) {
            entry.status = "copying";
          }
          const increment = Math.floor(Math.random() * 4) + 2;
          entry.progress = Math.min(entry.progress + increment, 100);
          if (entry.progress >= 100) {
            entry.progress = 100;
            entry.status = "complete";
          } else if (entry.progress >= 70) {
            entry.status = "configuring";
          } else if (entry.progress >= 40) {
            entry.status = "importing";
          }
          next[id] = entry;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentStep, migrationProgress]);

  /* ── Check for completion ── */
  useEffect(() => {
    if (currentStep !== 3) return;
    const entries = Object.entries(migrationProgress);
    if (entries.length === 0) return;
    const allDone = entries.every(([, v]) => v.status === "complete" || v.status === "failed");
    const anyComplete = entries.some(([, v]) => v.status === "complete");
    if (allDone && anyComplete && !migrationComplete) {
      setMigrationComplete(true);
      import("canvas-confetti").then((m) =>
        m.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      );
    }
  }, [currentStep, migrationProgress, migrationComplete]);

  /* ── Handlers ── */

  const handleTestConnection = useCallback(() => {
    if (!selectedSource) return;
    const fields = CONNECTION_FIELDS[selectedSource];
    const errors: Record<string, string> = {};
    for (const f of fields) {
      if (!formValues[f.name]?.trim()) {
        errors[f.name] = "This field is required";
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setTesting(true);
    setTestStepIndex(0);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= CONNECTION_TEST_STEPS.length) {
        clearInterval(timer);
        setTesting(false);
        setTestStepIndex(-1);
        setConnectionTested(true);
        showToast.success("Connection established successfully");
      } else {
        setTestStepIndex(step);
      }
    }, 500);
  }, [selectedSource, formValues]);

  const handleStartMigration = useCallback(() => {
    const selected = sites.filter((s) => s.selected);
    const progress: Record<string, { progress: number; status: MigrationStatus }> = {};
    for (const s of selected) {
      progress[s.id] = { progress: 0, status: "pending" };
    }
    setMigrationProgress(progress);
    setMigrationComplete(false);
    setExpandedLogs({});
    setCurrentStep(3);
  }, [sites]);

  const handleRetry = useCallback((siteId: string) => {
    setMigrationComplete(false);
    setMigrationProgress((prev) => ({
      ...prev,
      [siteId]: { progress: 0, status: "pending" },
    }));
  }, []);

  const handleCancelSite = useCallback((siteId: string) => {
    setMigrationProgress((prev) => {
      const next = { ...prev };
      delete next[siteId];
      return next;
    });
    setCancelTarget(null);
    showToast.success("Migration cancelled for site");
  }, []);

  const toggleSite = useCallback((id: string) => {
    setSites((prev) => prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)));
  }, []);

  const toggleAll = useCallback(() => {
    setSites((prev) => {
      const allSelected = prev.every((s) => s.selected);
      return prev.map((s) => ({ ...s, selected: !allSelected }));
    });
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNs(text);
    showToast.success(`Copied ${text}`);
    setTimeout(() => setCopiedNs(null), 2000);
  }, []);

  /* ── Derived state ── */
  const selectedCount = sites.filter((s) => s.selected).length;
  const selectedSites = sites.filter((s) => s.selected);
  const totalSizeGB = selectedSites.reduce((sum, s) => sum + parseSizeToGB(s.size), 0);
  const estimatedMinutes = Math.max(1, Math.round(totalSizeGB * 3));
  const allChecksConfirmed = preMigrationChecks.every(Boolean);
  const sourceName = selectedSource ? SOURCE_CARDS.find((c) => c.id === selectedSource)?.name ?? "" : "";
  const selectedDC = DATA_CENTERS.find((d) => d.id === dataCenter)!;

  /* ── Style classes ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const inputErrorClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight
      ? "bg-white border-red-400 text-slate-800 focus:border-red-500 ring-1 ring-red-400/20"
      : "bg-[var(--bg-elevated)] border-red-500 text-slate-200 focus:border-red-400 ring-1 ring-red-500/20"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const btnPrimary = `h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`;

  const btnSecondary = `h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
    isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
  }`;

  /* ════════════════════════════════════════════════════════════════
     Progress Bar Stepper
     ════════════════════════════════════════════════════════════════ */

  const renderProgressBar = () => (
    <div className="flex items-center w-full max-w-[700px] mb-12">
      {MIGRATION_STEPS.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && (
            <div
              className={`flex-1 h-0.5 transition-colors duration-300 ${
                i <= currentStep
                  ? accent.progress || "bg-emerald-500"
                  : isLight
                  ? "bg-slate-200"
                  : "bg-slate-700"
              }`}
            />
          )}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i < currentStep
                  ? `${accent.button} text-white`
                  : i === currentStep
                  ? `${accent.button} text-white ring-4 ${isLight ? "ring-slate-100" : "ring-[var(--bg-primary)]"}`
                  : `border-2 ${isLight ? "border-slate-300 text-slate-400" : "border-slate-600 text-slate-500"}`
              }`}
            >
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                i <= currentStep
                  ? isLight ? "text-slate-700" : "text-slate-200"
                  : isLight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );

  /* ════════════════════════════════════════════════════════════════
     Step 0 — Choose Source
     ════════════════════════════════════════════════════════════════ */

  const [sourceSearch, setSourceSearch] = useState("");

  const filteredSources = SOURCE_CARDS.filter((card) =>
    card.name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
    card.description.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const renderStep0 = () => (
    <div className="max-w-[900px] w-full">
      <div className="text-center mb-8">
        <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Where are you migrating from?
        </h1>
        <p className={`text-sm mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          We&apos;ll handle everything &mdash; zero downtime guaranteed
        </p>
        {/* Search */}
        <div className="mt-5 max-w-sm mx-auto relative">
          <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={sourceSearch}
            onChange={(e) => setSourceSearch(e.target.value)}
            placeholder="Search hosting providers..."
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {filteredSources.map((card) => {
          const colors = SOURCE_COLORS[card.id];
          return (
            <button
              key={card.id}
              onClick={() => {
                setSelectedSource(card.id);
                setCurrentStep(1);
                setConnectionTested(false);
                setFormValues({});
                setFieldErrors({});
                setTestStepIndex(-1);
              }}
              className={`relative rounded-2xl border p-4 cursor-pointer hover:-translate-y-px hover:shadow-lg transition-all text-left group ${cardClass}`}
            >
              {card.badge && (
                <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
                  card.id === "cpanel" ? "bg-orange-500" : card.id === "kinsta" ? "bg-purple-500" : accent.button
                }`}>
                  {card.badge}
                </span>
              )}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors.bg}`}>
                <svg
                  className={`w-5 h-5 ${colors.text}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
                </svg>
              </div>
              <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {card.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{card.description}</p>
              {/* Arrow hint on hover */}
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${colors.text}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* No results */}
      {filteredSources.length === 0 && (
        <div className="text-center py-8">
          <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            No providers found for &ldquo;{sourceSearch}&rdquo;
          </p>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            Try a different search or use <button onClick={() => { setSourceSearch(""); setSelectedSource("manual"); setCurrentStep(1); setConnectionTested(false); setFormValues({}); }} className={`font-semibold ${accent.text} hover:underline`}>Manual (SSH/SFTP)</button>
          </p>
        </div>
      )}

      {/* Migration History */}
      {MIGRATION_HISTORY.length > 0 && (
        <div className="mt-10">
          <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            Previous Migrations
          </h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            {/* Table header */}
            <div
              className={`grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium border-b ${
                isLight ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-white/[0.02] text-slate-400 border-[var(--border-tertiary)]"
              }`}
            >
              <span>Source</span>
              <span>Date</span>
              <span>Sites</span>
              <span>Status</span>
              <span className="text-right">Duration</span>
            </div>
            {MIGRATION_HISTORY.map((h) => (
              <div
                key={h.id}
                className={`grid grid-cols-5 gap-4 px-5 py-3 border-b last:border-b-0 text-sm ${
                  isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"
                }`}
              >
                <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  {h.source}
                </span>
                <span className="text-slate-400">{h.date}</span>
                <span className="text-slate-400">{h.sites}</span>
                <span>
                  {h.failed === 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {h.successful}/{h.sites} succeeded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {h.successful}/{h.sites} succeeded
                    </span>
                  )}
                </span>
                <span className="text-slate-400 text-right">{h.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ════════════════════════════════════════════════════════════════
     Step 1 — Connection Details
     ════════════════════════════════════════════════════════════════ */

  const renderStep1 = () => {
    const fields = CONNECTION_FIELDS[selectedSource!];
    return (
      <div className="max-w-[700px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Connect to {sourceName}
          </h1>
          <p className={`text-sm mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Enter your connection credentials
          </p>
        </div>

        <div className={`rounded-2xl border p-6 space-y-5 ${cardClass}`}>
          {fields.map((field) => {
            const hasError = !!fieldErrors[field.name];
            return (
              <div key={field.name}>
                <label className={`block mb-1.5 ${labelClass}`}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className={`${hasError ? inputErrorClass : inputClass} h-24 py-2 font-mono resize-none`}
                    placeholder={field.placeholder}
                    value={formValues[field.name] || ""}
                    onChange={(e) => {
                      setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }));
                      if (fieldErrors[field.name]) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next[field.name];
                          return next;
                        });
                      }
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    className={hasError ? inputErrorClass : inputClass}
                    placeholder={field.placeholder}
                    value={formValues[field.name] || ""}
                    onChange={(e) => {
                      setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }));
                      if (fieldErrors[field.name]) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next[field.name];
                          return next;
                        });
                      }
                    }}
                  />
                )}
                {hasError && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors[field.name]}</p>
                )}
              </div>
            );
          })}

          <div className="flex items-center gap-3 pt-2">
            <button className={btnPrimary} onClick={handleTestConnection} disabled={testing}>
              {testing ? (
                <>
                  {spinner}
                  {testStepIndex >= 0 ? CONNECTION_TEST_STEPS[testStepIndex] : "Testing..."}
                </>
              ) : (
                "Test Connection"
              )}
            </button>

            {connectionTested && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Connection successful
              </span>
            )}
          </div>
        </div>

        {/* Security note */}
        <div className={`mt-4 rounded-xl border p-4 flex items-start gap-3 ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-white/[0.02] border-[var(--border-tertiary)]"
        }`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
              End-to-end encrypted
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Your credentials are encrypted end-to-end and never stored after migration
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            className={btnSecondary}
            onClick={() => {
              setCurrentStep(0);
              setConnectionTested(false);
            }}
          >
            Back
          </button>
          <button className={btnPrimary} disabled={!connectionTested} onClick={() => setCurrentStep(2)}>
            Next
          </button>
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════
     Step 2 — Select Sites + Migration Options + Pre-flight Checklist
     ════════════════════════════════════════════════════════════════ */

  const renderStep2 = () => {
    const allSelected = sites.length > 0 && sites.every((s) => s.selected);
    return (
      <div className="max-w-[800px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Found {sites.length} sites
          </h1>
          <p className={`text-sm mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Select the sites you want to migrate
          </p>
        </div>

        {/* Sites table */}
        <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
          <div
            className={`flex items-center gap-4 px-5 py-3 text-xs font-medium border-b ${
              isLight ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-white/[0.02] text-slate-400 border-[var(--border-tertiary)]"
            }`}
          >
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded accent-emerald-500" />
            <span className="flex-1">Site</span>
            <span className="w-44 truncate">URL</span>
            <span className="w-16 text-right">Size</span>
            <span className="w-20 text-right">WP Version</span>
          </div>

          {sites.map((site) => (
            <div
              key={site.id}
              className={`flex items-center gap-4 px-5 py-3 border-b last:border-b-0 transition-colors ${
                isLight
                  ? "border-slate-100 hover:bg-slate-50"
                  : "border-[var(--border-tertiary)] hover:bg-white/[0.02]"
              }`}
            >
              <input
                type="checkbox"
                checked={site.selected}
                onChange={() => toggleSite(site.id)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span className={`flex-1 font-semibold text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                {site.name}
              </span>
              <span className="w-44 font-mono text-xs text-slate-400 truncate">{site.url}</span>
              <span className={`w-16 text-right text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                {site.size}
              </span>
              <span className="w-20 text-right">
                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isLight ? "bg-slate-100 text-slate-600" : "bg-white/5 text-slate-400"
                }`}>
                  {site.wpVersion}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Migration Options */}
        <div className={`rounded-2xl border p-6 mt-6 ${cardClass}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-700" : "text-slate-200"}`}>
            Migration Options
          </h3>

          {/* Data Center selection */}
          <div className="mb-5">
            <label className={`block mb-2 ${labelClass}`}>Data Center</label>
            <div className="flex gap-2 flex-wrap">
              {DATA_CENTERS.map((dc) => (
                <button
                  key={dc.id}
                  onClick={() => setDataCenter(dc.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    dataCenter === dc.id
                      ? `${accent.button} text-white border-transparent shadow-md`
                      : isLight
                      ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-300 hover:border-[var(--border-secondary)]"
                  }`}
                >
                  {dc.flag} {dc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Skip cache files
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Excludes wp-content/cache to speed up transfer
                </p>
              </div>
              <Toggle enabled={skipCache} onChange={setSkipCache} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Skip media thumbnails
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Regenerate thumbnails after migration
                </p>
              </div>
              <Toggle enabled={skipThumbnails} onChange={setSkipThumbnails} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Replace URLs in database
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auto-update URLs to match new domain
                </p>
              </div>
              <Toggle enabled={replaceUrls} onChange={setReplaceUrls} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Enable maintenance mode on source
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prevents changes during migration
                </p>
              </div>
              <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
          </div>
        </div>

        {/* Pre-Migration Checklist */}
        <div className={`rounded-2xl border p-6 mt-4 ${cardClass}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-700" : "text-slate-200"}`}>
            Pre-Migration Checklist
          </h3>
          <div className="space-y-3">
            {PRE_MIGRATION_CHECKS.map((check, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  preMigrationChecks[i]
                    ? isLight ? "bg-emerald-50" : "bg-emerald-500/5"
                    : isLight ? "bg-slate-50 hover:bg-slate-100" : "bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={preMigrationChecks[i]}
                  onChange={() => {
                    setPreMigrationChecks((prev) => {
                      const next = [...prev];
                      next[i] = !next[i];
                      return next;
                    });
                  }}
                  className="w-4 h-4 rounded accent-emerald-500 mt-0.5 flex-shrink-0"
                />
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>{check}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div className={`rounded-2xl border p-6 mt-4 ${cardClass}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-700" : "text-slate-200"}`}>
            Migration Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">Total sites</p>
              <p className={`text-lg font-bold mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {selectedCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total size</p>
              <p className={`text-lg font-bold mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {totalSizeGB.toFixed(1)} GB
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Est. transfer time</p>
              <p className={`text-lg font-bold mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                ~{estimatedMinutes} min
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Data center</p>
              <p className={`text-lg font-bold mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {selectedDC.flag} {selectedDC.label}
              </p>
            </div>
          </div>

          {/* Email notification */}
          <div className={`mt-5 pt-5 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Email me when migration completes
                </p>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Get notified so you don&apos;t have to keep this page open
                </p>
              </div>
              <Toggle enabled={emailNotify} onChange={setEmailNotify} />
            </div>
            {emailNotify && (
              <input
                type="email"
                placeholder="you@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={`${inputClass} mt-3`}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <button className={btnSecondary} onClick={() => setCurrentStep(1)}>
              Back
            </button>
            <span className="text-sm text-slate-400">
              {selectedCount} sites selected ({sites.length} total)
            </span>
          </div>
          <button
            className={btnPrimary}
            disabled={selectedCount === 0 || !allChecksConfirmed}
            onClick={handleStartMigration}
            title={!allChecksConfirmed ? "Please complete the pre-migration checklist" : undefined}
          >
            Start Migration
          </button>
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════
     Step 3 — Migration Progress / Completion
     ════════════════════════════════════════════════════════════════ */

  const renderStep3 = () => {
    const entries = Object.entries(migrationProgress);
    const totalProgress = entries.length
      ? Math.round(entries.reduce((sum, [, v]) => sum + v.progress, 0) / entries.length)
      : 0;
    const completedCount = entries.filter(([, v]) => v.status === "complete").length;
    const failedCount = entries.filter(([, v]) => v.status === "failed").length;
    const inProgressCount = entries.filter(([, v]) => v.status !== "complete" && v.status !== "failed").length;
    const remainingGB = entries
      .filter(([, v]) => v.status !== "complete" && v.status !== "failed")
      .reduce((sum, [id, v]) => {
        const site = sites.find((s) => s.id === id);
        if (!site) return sum;
        return sum + parseSizeToGB(site.size) * ((100 - v.progress) / 100);
      }, 0);
    const estRemaining = Math.max(1, Math.round(remainingGB * 3));
    const failedSites = entries.filter(([, v]) => v.status === "failed").map(([id]) => sites.find((s) => s.id === id)!).filter(Boolean);

    /* ── Completion screen ── */
    if (migrationComplete) {
      return (
        <div className="max-w-[700px] w-full">
          {/* Success hero */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Migration Complete!
            </h1>
            <p className={`text-sm mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {completedCount} site{completedCount !== 1 ? "s" : ""} migrated successfully
              {failedCount > 0 ? `, ${failedCount} failed` : ""}
            </p>
          </div>

          {/* Per-site final status */}
          <div className="space-y-2 mb-6">
            {entries.map(([id, data]) => {
              const site = sites.find((s) => s.id === id);
              if (!site) return null;
              const sColors = STATUS_COLORS[data.status];
              return (
                <div key={id} className={`rounded-xl border p-4 flex items-center justify-between ${cardClass}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${sColors.dot}`} />
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {site.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{site.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sColors.bg} ${sColors.text}`}>
                      {MIGRATION_STATUS_LABELS[data.status]}
                    </span>
                    {data.status === "failed" && (
                      <button
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                        onClick={() => handleRetry(id)}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Failed sites warning */}
          {failedCount > 0 && (
            <div className={`rounded-2xl border p-5 mb-6 ${
              isLight ? "bg-rose-50 border-rose-200" : "bg-rose-500/5 border-rose-500/20"
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isLight ? "text-rose-800" : "text-rose-300"}`}>
                    {failedCount} site{failedCount !== 1 ? "s" : ""} failed to migrate
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? "text-rose-600" : "text-rose-400"}`}>
                    {failedSites.map((s) => s.name).join(", ")} &mdash; You can retry above or contact support for assistance.
                  </p>
                  <button
                    className="mt-2 text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
                    onClick={() => showToast.info("Support ticket created. We'll reach out shortly.")}
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DNS Instructions */}
          <div className={`rounded-2xl border p-6 mb-6 ${cardClass}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Update Your DNS Settings
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Point your domain&apos;s nameservers to LimeWP:
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {["ns1.limewp.com", "ns2.limewp.com"].map((ns) => (
                <div
                  key={ns}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                  }`}
                >
                  <code className={`text-sm font-mono font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    {ns}
                  </code>
                  <button
                    onClick={() => copyToClipboard(ns)}
                    aria-label={`Copy ${ns}`}
                    className={`p-1.5 rounded-lg transition-colors ${
                      copiedNs === ns
                        ? "text-emerald-500"
                        : isLight
                        ? "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {copiedNs === ns ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-3">
              DNS changes typically propagate within 24-48 hours
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button className={btnPrimary} onClick={() => router.push(ROUTES.DASHBOARD)}>
              Go to Dashboard
            </button>
            <button
              className={btnSecondary}
              onClick={() => {
                setShowVerify(true);
                const completed = Object.entries(migrationProgress).filter(([, v]) => v.status === "complete");
                const initial: Record<string, "checking" | "passed" | "failed"> = {};
                completed.forEach(([id]) => { initial[id] = "checking"; });
                setVerifyResults(initial);
                // Simulate verification per site
                completed.forEach(([id], i) => {
                  setTimeout(() => {
                    setVerifyResults((prev) => ({ ...prev, [id]: Math.random() > 0.1 ? "passed" : "failed" }));
                  }, 1500 + i * 1000);
                });
              }}
            >
              Verify Sites
            </button>
            <button
              className={btnSecondary}
              onClick={() => setShowReport(true)}
            >
              View Migration Report
            </button>
          </div>
        </div>
      );
    }

    /* ── In-progress screen ── */
    return (
      <div className="max-w-[700px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Migrating your sites...
          </h1>
          <p className={`text-sm mt-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Please keep this page open while we transfer your sites
          </p>
        </div>

        {/* Overall progress */}
        <div className={`rounded-2xl border p-6 mb-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Overall Progress
            </span>
            <span className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {totalProgress}%
            </span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${accent.progress || "bg-emerald-500"}`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">
              {completedCount} of {entries.length} complete
              {failedCount > 0 ? ` \u00B7 ${failedCount} failed` : ""}
            </span>
            {inProgressCount > 0 && (
              <span className="text-xs text-slate-400">
                Estimated time remaining: ~{estRemaining} min
              </span>
            )}
          </div>

          {/* Email notification reminder */}
          {emailNotify && emailAddress && (
            <div className={`mt-4 pt-4 border-t flex items-center gap-2 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>We&apos;ll notify <strong className={isLight ? "text-slate-700" : "text-slate-200"}>{emailAddress}</strong> when migration completes.</span>
            </div>
          )}
        </div>

        {/* Per-site cards */}
        <div className="space-y-3">
          {entries.map(([id, data]) => {
            const site = sites.find((s) => s.id === id);
            if (!site) return null;
            const sColors = STATUS_COLORS[data.status];
            const isFailed = data.status === "failed";
            const isComplete = data.status === "complete";
            const isInProgress = !isFailed && !isComplete;
            const isExpanded = expandedLogs[id] || false;
            const logEntries = getLogEntriesForProgress(data.progress, data.status);

            return (
              <div key={id} className={`rounded-2xl border p-4 transition-all ${cardClass}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {site.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-2">{site.url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${sColors.bg} ${sColors.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sColors.dot}`} />
                      {MIGRATION_STATUS_LABELS[data.status]}
                    </span>
                    <span className={`text-sm font-semibold tabular-nums ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {data.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={`h-2 rounded-full overflow-hidden mb-2 ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${sColors.progress}`}
                    style={{ width: `${data.progress}%` }}
                  />
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }))}
                    className={`text-xs font-medium transition-colors ${
                      isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isExpanded ? "Hide Log" : "View Log"}
                    <svg
                      className={`w-3 h-3 inline-block ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    {isFailed && (
                      <button
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                        onClick={() => handleRetry(id)}
                      >
                        Retry
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
                        onClick={() => setCancelTarget(id)}
                        aria-label={`Cancel migration for ${site.name}`}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Log entries */}
                {isExpanded && (
                  <div className={`mt-3 pt-3 border-t space-y-1.5 ${
                    isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"
                  }`}>
                    {logEntries.map((entry, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          entry.type === "error" ? "bg-rose-500" : entry.type === "success" ? "bg-emerald-500" : "bg-slate-400"
                        }`} />
                        <span className={`text-xs font-mono ${
                          entry.type === "error" ? "text-rose-400" : entry.type === "success" ? "text-emerald-400" : "text-slate-400"
                        }`}>
                          {entry.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════
     Main Layout
     ════════════════════════════════════════════════════════════════ */

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]"}`}>
      {/* Top bar */}
      <div className={`px-6 py-4 flex items-center justify-between border-b ${
        isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      }`}>
        <Image
          src="/limewp-logo.svg"
          alt="LimeWP"
          width={100}
          height={28}
          className={isLight ? "brightness-0" : ""}
        />
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className={`text-sm font-medium transition-colors ${
            isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          &larr; Back to dashboard
        </button>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col items-center px-4 py-8 transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {renderProgressBar()}

        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Cancel migration ConfirmDialog */}
      <ConfirmDialog
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && handleCancelSite(cancelTarget)}
        title="Cancel Migration"
        message="Are you sure you want to cancel the migration for this site? This action cannot be undone and any transferred data will be removed."
        confirmText="Cancel Migration"
        cancelText="Keep Migrating"
        variant="warning"
      />

      {/* ═══════ Verify Sites Modal ═══════ */}
      {showVerify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVerify(false)} aria-hidden="true" />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`} role="dialog" aria-modal="true">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Site Verification</h3>
                <button onClick={() => setShowVerify(false)} aria-label="Close" className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-slate-800 text-slate-500"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Checking each migrated site is live and responding correctly.</p>
              <div className="space-y-3">
                {Object.entries(verifyResults).map(([id, status]) => {
                  const site = sites.find((s) => s.id === id);
                  if (!site) return null;
                  return (
                    <div key={id} className={`flex items-center gap-3 p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
                      {status === "checking" && (
                        <svg className="w-5 h-5 animate-spin text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      )}
                      {status === "passed" && (
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                      {status === "failed" && (
                        <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium block ${isLight ? "text-slate-700" : "text-slate-200"}`}>{site.name}</span>
                        <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>{site.url}</span>
                      </div>
                      <span className={`text-xs font-semibold shrink-0 ${
                        status === "checking" ? "text-amber-400" : status === "passed" ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {status === "checking" ? "Checking..." : status === "passed" ? "Live" : "Unreachable"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {Object.values(verifyResults).every((s) => s !== "checking") && (
                <div className={`mt-5 p-3 rounded-xl text-sm ${
                  Object.values(verifyResults).every((s) => s === "passed")
                    ? isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
                    : isLight ? "bg-amber-50 text-amber-700" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {Object.values(verifyResults).every((s) => s === "passed")
                    ? "All sites are live and responding correctly!"
                    : "Some sites are not reachable yet. DNS propagation may still be in progress (can take up to 48 hours)."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Migration Report Modal ═══════ */}
      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReport(false)} aria-hidden="true" />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`} role="dialog" aria-modal="true">
            <div className="h-1.5 bg-gradient-to-r from-sky-500 to-indigo-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Migration Report</h3>
                <button onClick={() => setShowReport(false)} aria-label="Close" className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-slate-800 text-slate-500"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Total Sites", value: String(Object.keys(migrationProgress).length), color: "text-sky-500" },
                  { label: "Successful", value: String(Object.values(migrationProgress).filter((v) => v.status === "complete").length), color: "text-emerald-500" },
                  { label: "Failed", value: String(Object.values(migrationProgress).filter((v) => v.status === "failed").length), color: "text-rose-500" },
                ].map((stat) => (
                  <div key={stat.label} className={`text-center p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Per-site details */}
              <div className={`rounded-xl border overflow-hidden mb-5 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                <div className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-xs font-semibold ${isLight ? "bg-slate-50 text-slate-500" : "bg-white/[0.02] text-slate-400"}`}>
                  <span>Site</span>
                  <span>Size</span>
                  <span>Status</span>
                  <span className="text-right">Progress</span>
                </div>
                {Object.entries(migrationProgress).map(([id, data]) => {
                  const site = sites.find((s) => s.id === id);
                  if (!site) return null;
                  return (
                    <div key={id} className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-sm border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                      <span className={`font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{site.name}</span>
                      <span className={isLight ? "text-slate-500" : "text-slate-400"}>{site.size}</span>
                      <span className={`text-xs font-semibold ${
                        data.status === "complete" ? "text-emerald-500" : data.status === "failed" ? "text-rose-500" : "text-amber-400"
                      }`}>
                        {data.status === "complete" ? "Success" : data.status === "failed" ? "Failed" : "In Progress"}
                      </span>
                      <span className={`text-right font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{data.progress}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Details */}
              <div className={`space-y-2 mb-5 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                <div className="flex justify-between"><span>Source</span><span className={`font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{sourceName}</span></div>
                <div className="flex justify-between"><span>Data Center</span><span className={`font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{selectedDC.flag} {selectedDC.label}</span></div>
                <div className="flex justify-between"><span>Total Size</span><span className={`font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{totalSizeGB.toFixed(1)} GB</span></div>
                <div className="flex justify-between"><span>Date</span><span className={`font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { showToast.success("Report downloaded as PDF"); setShowReport(false); }}
                  className={btnPrimary + " flex-1 justify-center"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Download PDF
                </button>
                <button
                  onClick={() => { showToast.success("Report sent to your email"); setShowReport(false); }}
                  className={btnSecondary + " flex-1 justify-center flex items-center gap-2"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  Email Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
