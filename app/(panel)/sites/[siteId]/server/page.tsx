"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

/* ────────────── data ────────────── */

const PHP_VERSIONS = [
  { value: "8.1", label: "PHP 8.1" },
  { value: "8.2", label: "PHP 8.2" },
  { value: "8.3", label: "PHP 8.3", recommended: true },
];

const MEMORY_LIMITS = ["128", "256", "512", "1024"];

const SERVER_INFO = [
  { label: "Nginx Version", value: "1.25.4" },
  { label: "Operating System", value: "Ubuntu 22.04 LTS" },
  { label: "Server IP", value: "185.199.108.53", mono: true },
  { label: "Datacenter", value: "Frankfurt, DE" },
  { label: "PHP Version", value: "8.3.6", mono: true },
  { label: "MySQL Version", value: "8.0.36", mono: true },
];

const RESOURCE_USAGE = [
  { label: "CPU", used: 34, total: 100, unit: "%", sparkline: [12, 18, 25, 22, 30, 42, 38, 34, 28, 35, 40, 34] },
  { label: "RAM", used: 2.4, total: 4, unit: "GB", sparkline: [1.8, 2.0, 2.1, 2.3, 2.2, 2.5, 2.4, 2.3, 2.6, 2.4, 2.3, 2.4] },
  { label: "Disk", used: 12, total: 50, unit: "GB", sparkline: [10, 10.2, 10.5, 10.8, 11, 11.2, 11.5, 11.7, 11.8, 11.9, 12, 12] },
];

const SERVER_ENV_ITEMS = [
  { label: "OS", value: "Ubuntu 22.04 LTS", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25", color: "text-sky-400" },
  { label: "Web Server", value: "Nginx 1.24.0", icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z", color: "text-emerald-400" },
  { label: "PHP", value: "8.3.6", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", color: "text-violet-400" },
  { label: "MySQL", value: "8.0.36", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125", color: "text-amber-400" },
  { label: "Redis", value: "7.2.4", icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25", color: "text-rose-400" },
  { label: "Node.js", value: "20.11.0", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3M5.25 20.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z", color: "text-emerald-400" },
];

const SERVER_ENV_BARS = [
  { label: "Disk Space", used: 45.2, total: 200, unit: "GB" },
  { label: "Memory", used: 3.2, total: 8, unit: "GB" },
];

const PHP_EXTENSIONS = [
  { name: "opcache", enabled: true, description: "Bytecode caching" },
  { name: "redis", enabled: true, description: "Redis object cache" },
  { name: "imagick", enabled: true, description: "Image processing" },
  { name: "curl", enabled: true, description: "HTTP client" },
  { name: "mbstring", enabled: true, description: "Multibyte strings" },
  { name: "zip", enabled: true, description: "ZIP archive support" },
  { name: "gd", enabled: false, description: "Image creation" },
  { name: "intl", enabled: false, description: "Internationalization" },
  { name: "soap", enabled: false, description: "SOAP protocol" },
  { name: "xdebug", enabled: false, description: "Debugging (dev only)" },
];

const ERROR_LOGS = [
  { time: "14:32:15", level: "ERROR", message: "PHP Fatal error: Allowed memory size exhausted in /wp-includes/class-wpdb.php:2056" },
  { time: "14:30:01", level: "WARNING", message: "PHP Warning: Undefined variable $post in /wp-content/themes/flavor/single.php:45" },
  { time: "14:28:44", level: "NOTICE", message: "PHP Notice: Trying to access array offset on null in /wp-content/plugins/woocommerce/includes/class-wc-cart.php:1023" },
  { time: "13:15:22", level: "ERROR", message: "PHP Fatal error: Call to undefined function wp_cache_get() in /wp-content/object-cache.php:12" },
  { time: "12:45:00", level: "WARNING", message: "PHP Warning: file_get_contents(): SSL operation failed in /wp-includes/http.php:394" },
];

const ACCESS_LOG_URLS = [
  { url: "/wp-admin/admin-ajax.php", hits: 1243 },
  { url: "/", hits: 856 },
  { url: "/wp-cron.php", hits: 412 },
  { url: "/shop/", hits: 389 },
  { url: "/wp-json/wp/v2/posts", hits: 267 },
];

const ACCESS_LOG_IPS = [
  { ip: "192.168.1.105", hits: 534 },
  { ip: "10.0.0.42", hits: 421 },
  { ip: "172.16.0.88", hits: 298 },
  { ip: "203.0.113.50", hits: 187 },
  { ip: "198.51.100.14", hits: 142 },
];

const STATUS_CODES = [
  { code: 200, count: 4521, color: "bg-emerald-500", label: "text-emerald-500", bgTint: "bg-emerald-500/10" },
  { code: 301, count: 342, color: "bg-sky-500", label: "text-sky-500", bgTint: "bg-sky-500/10" },
  { code: 404, count: 89, color: "bg-amber-500", label: "text-amber-500", bgTint: "bg-amber-500/10" },
  { code: 500, count: 12, color: "bg-rose-500", label: "text-rose-500", bgTint: "bg-rose-500/10" },
];

const CRON_JOBS = [
  { name: "wp_cron", schedule: "Every minute", nextRun: "In 30 seconds", status: "active" as const },
  { name: "wp_scheduled_auto_draft_delete", schedule: "Daily", nextRun: "In 6 hours", status: "active" as const },
  { name: "wp_update_plugins", schedule: "Twice daily", nextRun: "In 3 hours", status: "active" as const },
  { name: "woocommerce_cleanup_sessions", schedule: "Twice daily", nextRun: "In 8 hours", status: "active" as const },
  { name: "wp_privacy_delete_old_export_files", schedule: "Hourly", nextRun: "In 45 min", status: "paused" as const },
];

const RESTART_HISTORY = [
  { service: "PHP-FPM", time: "2 hours ago", user: "John Doe", reason: "Manual restart" },
  { service: "Nginx", time: "1 day ago", user: "System", reason: "Configuration update" },
  { service: "OPcache", time: "3 days ago", user: "John Doe", reason: "Manual clear" },
];

/* ────────────── sparkline ────────────── */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────── helpers ────────────── */

function getUsageColor(pct: number) {
  if (pct >= 80) return { bar: "bg-rose-500", spark: "#f43f5e", label: "text-rose-500" };
  if (pct >= 50) return { bar: "bg-amber-500", spark: "#f59e0b", label: "text-amber-500" };
  return { bar: "bg-emerald-500", spark: "#10b981", label: "text-emerald-500" };
}

function getLevelColor(level: string) {
  if (level === "ERROR") return { badge: "bg-rose-500/10 text-rose-500", dot: "bg-rose-500" };
  if (level === "WARNING") return { badge: "bg-amber-500/10 text-amber-500", dot: "bg-amber-500" };
  return { badge: "bg-sky-500/10 text-sky-500", dot: "bg-sky-500" };
}

function getServiceColor(service: string) {
  if (service === "PHP-FPM") return "bg-violet-500";
  if (service === "Nginx") return "bg-sky-500";
  return "bg-emerald-500";
}

/* ────────────── section heading ────────────── */

function SectionHeading({ icon, iconColor, title, subtitle, isLight }: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  isLight: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        iconColor.includes("violet") ? "bg-violet-500/10" :
        iconColor.includes("sky") ? "bg-sky-500/10" :
        iconColor.includes("emerald") ? "bg-emerald-500/10" :
        iconColor.includes("amber") ? "bg-amber-500/10" :
        iconColor.includes("rose") ? "bg-rose-500/10" :
        iconColor.includes("cyan") ? "bg-cyan-500/10" :
        iconColor.includes("indigo") ? "bg-indigo-500/10" :
        "bg-slate-500/10"
      }`}>
        <svg className={`w-[18px] h-[18px] ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ────────────── component ────────────── */

export function ServerTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // PHP Config state
  const [phpVersion, setPhpVersion] = useState("8.3");
  const [phpWorkers, setPhpWorkers] = useState(4);
  const [memoryLimit, setMemoryLimit] = useState("256");
  const [maxExecTime, setMaxExecTime] = useState(300);
  const [saving, setSaving] = useState(false);

  // Quick action loading states
  const [restartingPhp, setRestartingPhp] = useState(false);
  const [restartingNginx, setRestartingNginx] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  // PHP Extensions state
  const [extensions, setExtensions] = useState(PHP_EXTENSIONS);

  // Cron Jobs state
  const [cronJobs, setCronJobs] = useState(CRON_JOBS);

  // Resource Alerts state
  const [cpuThreshold, setCpuThreshold] = useState(90);
  const [memThreshold, setMemThreshold] = useState(85);
  const [diskThreshold, setDiskThreshold] = useState(90);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savingAlerts, setSavingAlerts] = useState(false);

  // Clear logs confirm dialog
  const [clearLogsOpen, setClearLogsOpen] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  const handleSavePhp = useCallback(async () => {
    if (maxExecTime < 30 || maxExecTime > 600) {
      showToast.error("Max execution time must be between 30 and 600 seconds");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    showToast.success("PHP settings saved successfully");
  }, [maxExecTime]);

  const handleQuickAction = useCallback(
    async (
      action: string,
      setLoading: (v: boolean) => void
    ) => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
      showToast.success(`${action} completed successfully`);
    },
    []
  );

  const handleToggleExtension = useCallback((name: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.name === name ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
    const ext = extensions.find((e) => e.name === name);
    if (ext) {
      showToast.success(`${name} ${ext.enabled ? "disabled" : "enabled"} successfully`);
    }
  }, [extensions]);

  const handleToggleCron = useCallback((name: string) => {
    setCronJobs((prev) =>
      prev.map((job) =>
        job.name === name
          ? { ...job, status: job.status === "active" ? "paused" as const : "active" as const }
          : job
      )
    );
    const job = cronJobs.find((j) => j.name === name);
    if (job) {
      showToast.success(`${name} ${job.status === "active" ? "paused" : "resumed"}`);
    }
  }, [cronJobs]);

  const handleRunCron = useCallback((name: string) => {
    showToast.success(`Running ${name}...`);
  }, []);

  const handleClearLogs = useCallback(async () => {
    setClearingLogs(true);
    await new Promise((r) => setTimeout(r, 1500));
    setClearingLogs(false);
    setClearLogsOpen(false);
    showToast.success("Error logs cleared successfully");
  }, []);

  const handleSaveAlerts = useCallback(async () => {
    setSavingAlerts(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSavingAlerts(false);
    showToast.success("Alert thresholds saved");
  }, []);

  /* ── shared styles ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const selectClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium appearance-none outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const innerCardClass = `rounded-xl p-4 border ${
    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
  }`;

  const smallBtnClass = `h-8 px-3 rounded-lg text-xs font-semibold transition-all border ${
    isLight
      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
      : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
  }`;

  const totalStatusHits = STATUS_CODES.reduce((a, b) => a + b.count, 0);
  const maxUrlHits = Math.max(...ACCESS_LOG_URLS.map((u) => u.hits));

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Server Management
        </h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
          Configure server settings for{" "}
          <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {decodeURIComponent(siteId)}
          </span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Restart PHP", loading: restartingPhp, setLoading: setRestartingPhp, icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M15.015 4.36V9.35h4.992", color: "text-violet-400" },
          { label: "Restart Nginx", loading: restartingNginx, setLoading: setRestartingNginx, icon: "M5.636 5.636a9 9 0 1012.728 0M12 3v9", color: "text-sky-400" },
          { label: "Clear OPcache", loading: clearingCache, setLoading: setClearingCache, icon: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0", color: "text-emerald-400" },
        ].map((action) => (
          <button
            key={action.label}
            disabled={action.loading}
            onClick={() => handleQuickAction(action.label, action.setLoading)}
            className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border disabled:opacity-60 ${
              isLight
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
            }`}
          >
            {action.loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className={`w-4 h-4 ${action.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
              </svg>
            )}
            {action.loading ? `${action.label}...` : action.label}
          </button>
        ))}
      </div>

      {/* Row 1: PHP Config + Server Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PHP Configuration */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              iconColor="text-violet-400"
              title="PHP Configuration"
              isLight={isLight}
            />

            <div className="space-y-5">
              {/* PHP Version */}
              <div>
                <label className={labelClass}>PHP Version</label>
                <div className="relative mt-1.5">
                  <select
                    value={phpVersion}
                    onChange={(e) => setPhpVersion(e.target.value)}
                    className={selectClass}
                  >
                    {PHP_VERSIONS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}{v.recommended ? " (Recommended)" : ""}
                      </option>
                    ))}
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* PHP Workers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>PHP Workers</label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-200"
                  }`}>{phpWorkers}</span>
                </div>
                {(() => {
                  const steps = [1, 2, 4, 6, 8, 10, 12, 16];
                  const activeIdx = steps.indexOf(phpWorkers);
                  return (
                    <div className="flex items-center gap-1.5">
                      {steps.map((n, i) => {
                        const isActive = n === phpWorkers;
                        const isFilled = i <= activeIdx;
                        return (
                          <button
                            key={n}
                            onClick={() => setPhpWorkers(n)}
                            className="flex-1 flex flex-col items-center gap-1.5 group"
                          >
                            <div className={`w-full h-2 rounded-full transition-all ${
                              isFilled
                                ? isLight ? "bg-slate-600" : "bg-slate-300"
                                : isLight ? "bg-slate-200 group-hover:bg-slate-300" : "bg-slate-700 group-hover:bg-slate-600"
                            } ${isActive ? "ring-2 ring-offset-1 " + (isLight ? "ring-slate-400 ring-offset-white" : "ring-slate-500 ring-offset-[#0f1729]") : ""}`} />
                            <span className={`text-[10px] font-medium transition-colors ${
                              isActive
                                ? isLight ? "text-slate-800 font-bold" : "text-slate-100 font-bold"
                                : isLight ? "text-slate-400 group-hover:text-slate-600" : "text-slate-600 group-hover:text-slate-400"
                            }`}>
                              {n}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Memory Limit */}
              <div>
                <label className={labelClass}>Memory Limit</label>
                <div className="relative mt-1.5">
                  <select
                    value={memoryLimit}
                    onChange={(e) => setMemoryLimit(e.target.value)}
                    className={selectClass}
                  >
                    {MEMORY_LIMITS.map((m) => (
                      <option key={m} value={m}>{m} MB</option>
                    ))}
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Max Execution Time */}
              <div>
                <label className={labelClass}>Max Execution Time</label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    min={30}
                    max={600}
                    value={maxExecTime}
                    onChange={(e) => setMaxExecTime(Number(e.target.value))}
                    className={inputClass}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    seconds
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePhp}
                disabled={saving}
                className={`w-full h-10 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save PHP Settings"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Server Environment Info */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
              iconColor="text-sky-400"
              title="Server Environment"
              subtitle="Infrastructure overview"
              isLight={isLight}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {SERVER_ENV_ITEMS.map((item) => (
                <div key={item.label} className={innerCardClass}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className={`w-4 h-4 ${item.color} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span className={labelClass}>{item.label}</span>
                  </div>
                  <p className={`text-sm font-semibold font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress bars for Disk + Memory */}
            <div className="space-y-3">
              {SERVER_ENV_BARS.map((item) => {
                const pct = (item.used / item.total) * 100;
                const colors = getUsageColor(pct);
                return (
                  <div key={item.label} className={innerCardClass}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>{item.label}</span>
                      <span className={`text-xs font-bold ${colors.label}`}>
                        {item.used} / {item.total} {item.unit}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className={`text-[10px] mt-1.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {Math.round(pct)}% used — {(item.total - item.used).toFixed(1)} {item.unit} free
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Resource Usage (full width) */}
      <div className={`${cardClass} mb-6`}>
        <div className="p-6">
          <SectionHeading
            icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            iconColor="text-emerald-400"
            title="Resource Usage"
            subtitle="Last 24 hours"
            isLight={isLight}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RESOURCE_USAGE.map((res) => {
              const pct = (res.used / res.total) * 100;
              const colors = getUsageColor(pct);

              return (
                <div key={res.label} className={innerCardClass}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {res.label}
                    </span>
                    <span className={`text-xs font-bold ${colors.label}`}>
                      {Math.round(pct)}%
                    </span>
                  </div>

                  <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                    <div className={`h-full rounded-full transition-all ${colors.bar}`} style={{ width: `${pct}%` }} />
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {res.used}
                      </span>
                      <span className={`text-xs ml-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        / {res.total} {res.unit}
                      </span>
                    </div>
                    <Sparkline data={res.sparkline} color={colors.spark} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: PHP Extensions (full width) */}
      <div className={`${cardClass} mb-6`}>
        <div className="p-6">
          <SectionHeading
            icon="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
            iconColor="text-amber-400"
            title="PHP Extensions"
            subtitle="Toggle extensions for your PHP environment"
            isLight={isLight}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {extensions.map((ext) => (
              <div
                key={ext.name}
                className={`${innerCardClass} flex items-center justify-between gap-3 transition-all ${
                  ext.enabled ? "" : "opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {ext.name}
                    </span>
                    {ext.name === "xdebug" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 flex-shrink-0">
                        Dev Only
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mt-0.5 truncate ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    {ext.description}
                  </p>
                </div>
                <Toggle
                  enabled={ext.enabled}
                  onChange={() => handleToggleExtension(ext.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Error Log + Access Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Error Log Viewer */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              iconColor="text-rose-400"
              title="Error Log"
              subtitle="Recent PHP errors"
              isLight={isLight}
            />

            <div className={`rounded-xl border overflow-hidden mb-4 ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}>
              <div className={`max-h-[280px] overflow-y-auto ${
                isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]"
              }`}>
                {ERROR_LOGS.map((log, i) => {
                  const levelColor = getLevelColor(log.level);
                  return (
                    <div
                      key={i}
                      className={`px-4 py-3 flex items-start gap-3 border-b last:border-b-0 transition-colors ${
                        isLight
                          ? "border-slate-100 hover:bg-slate-100"
                          : "border-[var(--border-tertiary)] hover:bg-[var(--bg-elevated)]/50"
                      }`}
                    >
                      <span className={`text-[11px] font-mono flex-shrink-0 mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        {log.time}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${levelColor.badge}`}>
                        {log.level}
                      </span>
                      <p className={`text-xs font-mono break-all leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        {log.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => showToast.success("Opening full log viewer...")}
                className={smallBtnClass}
              >
                View Full Logs
              </button>
              <button
                onClick={() => setClearLogsOpen(true)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all border ${
                  isLight
                    ? "bg-white border-rose-200 text-rose-600 hover:bg-rose-50"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                }`}
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        {/* Access Log Summary */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              iconColor="text-cyan-400"
              title="Access Log Summary"
              subtitle="Traffic overview"
              isLight={isLight}
            />

            {/* Status Code Distribution */}
            <div className="mb-4">
              <p className={`text-xs font-medium mb-2.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Status Codes</p>
              <div className="flex gap-2">
                {STATUS_CODES.map((sc) => (
                  <div key={sc.code} className={`flex-1 ${innerCardClass} text-center`}>
                    <span className={`text-lg font-bold ${sc.label}`}>{sc.count.toLocaleString()}</span>
                    <p className={`text-[10px] font-bold mt-0.5 ${sc.label}`}>{sc.code}</p>
                    <div className={`h-1 rounded-full mt-2 ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                      <div
                        className={`h-full rounded-full ${sc.color}`}
                        style={{ width: `${(sc.count / totalStatusHits) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top URLs */}
            <div className="mb-4">
              <p className={`text-xs font-medium mb-2.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Top URLs</p>
              <div className="space-y-1.5">
                {ACCESS_LOG_URLS.map((item) => (
                  <div key={item.url} className="flex items-center gap-3">
                    <span className={`text-[11px] font-mono truncate flex-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {item.url}
                    </span>
                    <div className={`w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0 ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${(item.hits / maxUrlHits) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold w-10 text-right flex-shrink-0 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      {item.hits}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top IPs */}
            <div className="mb-4">
              <p className={`text-xs font-medium mb-2.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Top IPs</p>
              <div className="flex flex-wrap gap-2">
                {ACCESS_LOG_IPS.map((item) => (
                  <span
                    key={item.ip}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg ${
                      isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-400"
                    }`}
                  >
                    {item.ip} <span className={`font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>({item.hits})</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => showToast.success("Opening full access log...")}
              className={smallBtnClass}
            >
              View Full Access Log
            </button>
          </div>
        </div>
      </div>

      {/* Row 5: Cron Jobs (full width) */}
      <div className={`${cardClass} mb-6`}>
        <div className="p-6">
          <SectionHeading
            icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            iconColor="text-indigo-400"
            title="Cron Jobs"
            subtitle="WordPress scheduled tasks"
            isLight={isLight}
          />

          <div className="space-y-2">
            {cronJobs.map((job) => (
              <div
                key={job.name}
                className={`${innerCardClass} flex items-center gap-4 flex-wrap sm:flex-nowrap`}
              >
                {/* Name */}
                <span className={`text-sm font-mono font-semibold min-w-0 truncate flex-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  {job.name}
                </span>

                {/* Schedule badge */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                  job.schedule === "Every minute"
                    ? "bg-violet-500/10 text-violet-500"
                    : job.schedule === "Hourly"
                    ? "bg-sky-500/10 text-sky-500"
                    : job.schedule === "Daily"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}>
                  {job.schedule}
                </span>

                {/* Next Run */}
                <span className={`text-xs flex-shrink-0 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  {job.nextRun}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleRunCron(job.name)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      isLight
                        ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        : "text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    Run Now
                  </button>
                  <Toggle
                    enabled={job.status === "active"}
                    onChange={() => handleToggleCron(job.name)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 6: Resource Alerts + Restart History + Server Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Resource Usage Alerts */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              iconColor="text-amber-400"
              title="Alert Thresholds"
              isLight={isLight}
            />

            <div className="space-y-4">
              {[
                { label: "CPU Alert", value: cpuThreshold, setter: setCpuThreshold },
                { label: "Memory Alert", value: memThreshold, setter: setMemThreshold },
                { label: "Disk Alert", value: diskThreshold, setter: setDiskThreshold },
              ].map((item) => (
                <div key={item.label}>
                  <label className={labelClass}>{item.label}</label>
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      min={50}
                      max={99}
                      value={item.value}
                      onChange={(e) => item.setter(Number(e.target.value))}
                      className={inputClass}
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      %
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-1">
                <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                  Email alerts
                </span>
                <Toggle enabled={emailAlerts} onChange={setEmailAlerts} />
              </div>

              <button
                onClick={handleSaveAlerts}
                disabled={savingAlerts}
                className={`w-full h-9 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {savingAlerts ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Thresholds"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Restart History */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M15.015 4.36V9.35h4.992"
              iconColor="text-violet-400"
              title="Restart History"
              isLight={isLight}
            />

            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-[7px] top-3 bottom-3 w-px ${isLight ? "bg-slate-200" : "bg-slate-700"}`} />

              <div className="space-y-5">
                {RESTART_HISTORY.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    {/* Dot */}
                    <div className={`w-[15px] h-[15px] rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      isLight ? "border-white" : "border-[var(--bg-primary)]"
                    } ${getServiceColor(entry.service)}`} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {entry.service}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                          isLight ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-400"
                        }`}>
                          {entry.time}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                        {entry.reason} by <span className={`font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>{entry.user}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Server Info (original) */}
        <div className={cardClass}>
          <div className="p-6">
            <SectionHeading
              icon="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              iconColor="text-sky-400"
              title="Server Information"
              isLight={isLight}
            />

            <div className="grid grid-cols-1 gap-3">
              {SERVER_INFO.map((item) => (
                <div
                  key={item.label}
                  className={`${innerCardClass} flex items-center justify-between`}
                >
                  <span className={labelClass}>{item.label}</span>
                  <span className={`text-sm font-semibold ${item.mono ? "font-mono" : ""} ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ConfirmDialog for clearing logs */}
      <ConfirmDialog
        open={clearLogsOpen}
        onClose={() => setClearLogsOpen(false)}
        onConfirm={handleClearLogs}
        title="Clear Error Logs"
        message="This will permanently delete all error log entries. This action cannot be undone."
        confirmText="Clear Logs"
        cancelText="Cancel"
        variant="danger"
        isLoading={clearingLogs}
      />
    </>
  );
}

export default function ServerManagementPage() {
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
      <ServerTab siteId={siteId} />
    </AppShell>
  );
}
