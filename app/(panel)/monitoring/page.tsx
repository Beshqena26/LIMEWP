"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  MONITORED_SITES,
  INCIDENTS,
  RESPONSE_TIME_DATA,
  STATUS_COLORS,
  STATUS_LABELS,
  type MonitorStatus,
} from "@/data/monitoring";

/* ────────────── Custom Tooltip for Chart ────────────── */

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  isLight: boolean;
  cardClass: string;
}

function CustomTooltip({ active, payload, label, isLight, cardClass }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`${cardClass} px-3 py-2 shadow-lg`}>
      <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
        {payload[0].value}
        <span className="text-xs font-normal ml-0.5">ms</span>
      </p>
    </div>
  );
}

/* ────────────── Mock Data ────────────── */

const REGIONS = [
  { name: "US East", flag: "\u{1F1FA}\u{1F1F8}", response: 145, status: "up" as MonitorStatus, lastCheck: "2 min ago" },
  { name: "US West", flag: "\u{1F1FA}\u{1F1F8}", response: 178, status: "up" as MonitorStatus, lastCheck: "2 min ago" },
  { name: "Europe", flag: "\u{1F1EA}\u{1F1FA}", response: 245, status: "up" as MonitorStatus, lastCheck: "3 min ago" },
  { name: "Asia", flag: "\u{1F1EF}\u{1F1F5}", response: 890, status: "degraded" as MonitorStatus, lastCheck: "2 min ago" },
];

interface MaintenanceWindow {
  id: string;
  sites: string[];
  start: string;
  end: string;
  reason: string;
  status: "scheduled" | "active" | "completed";
}

const INITIAL_MAINTENANCE: MaintenanceWindow[] = [
  { id: "mw1", sites: ["limewp.com"], start: "Mar 28, 2026 02:00", end: "Mar 28, 2026 04:00", reason: "Server upgrade and memory expansion", status: "scheduled" },
  { id: "mw2", sites: ["shop.limewp.com", "supernova.guru"], start: "Mar 15, 2026 01:00", end: "Mar 15, 2026 03:00", reason: "Database migration to new cluster", status: "completed" },
];

const SSL_INFO = {
  issuer: "Let's Encrypt Authority X3",
  validFrom: "Jan 15, 2026",
  validTo: "Apr 15, 2026",
  daysRemaining: 22,
};

const INCIDENT_TIMELINES: Record<string, { time: string; label: string; detail: string }[]> = {
  inc1: [
    { time: "14:32", label: "Detected", detail: "Automated monitor detected DNS resolution failure" },
    { time: "14:33", label: "Investigating", detail: "Engineering team alerted and investigating" },
    { time: "14:34", label: "Identified", detail: "DNS zone update caused propagation delay" },
    { time: "14:35", label: "Resolved", detail: "DNS records propagated successfully" },
  ],
  inc2: [
    { time: "09:15", label: "Detected", detail: "Connection pool utilization exceeded 95%" },
    { time: "09:17", label: "Investigating", detail: "Database team investigating connection limits" },
    { time: "09:22", label: "Identified", detail: "Traffic spike caused pool exhaustion" },
    { time: "09:27", label: "Resolved", detail: "Pool size increased and connections stabilized" },
  ],
  inc3: [
    { time: "03:00", label: "Detected", detail: "Multiple sites unreachable from EU monitoring" },
    { time: "03:05", label: "Investigating", detail: "Network team investigating upstream connectivity" },
    { time: "03:20", label: "Identified", detail: "Frankfurt DC undergoing unplanned maintenance" },
    { time: "03:45", label: "Resolved", detail: "Upstream provider completed maintenance" },
  ],
  inc4: [
    { time: "11:42", label: "Detected", detail: "SSL handshake failures detected" },
    { time: "11:44", label: "Investigating", detail: "Certificate renewal process checked" },
    { time: "11:47", label: "Identified", detail: "ACME challenge timeout during renewal" },
    { time: "11:50", label: "Resolved", detail: "Auto-retry succeeded, certificate renewed" },
  ],
};

/* ────────────── Helper functions ────────────── */

function computeChartStats(data: { value: number }[]) {
  const values = data.map((d) => d.value);
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
  const p99 = sorted[Math.floor(sorted.length * 0.99)] ?? 0;
  return { min, max, avg, p95, p99 };
}

/* ────────────── Page Component ────────────── */

export default function MonitoringPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  /* ── state ── */
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [checkInterval, setCheckInterval] = useState<"1" | "5" | "15">("5");
  const [responseThreshold, setResponseThreshold] = useState("1s");
  const [hoveredDot, setHoveredDot] = useState<{ siteId: string; dayIndex: number } | null>(null);
  const [downtimeNotify, setDowntimeNotify] = useState(true);
  const [recoveryNotify, setRecoveryNotify] = useState(true);
  const [sslExpiryNotify, setSslExpiryNotify] = useState(true);

  // Site interaction state
  const [pausedSites, setPausedSites] = useState<Set<string>>(new Set());
  const [pingSites, setPingSites] = useState<Set<string>>(new Set());
  const [checkAllPing, setCheckAllPing] = useState(false);
  const [lastCheckedTimes, setLastCheckedTimes] = useState<Record<string, string>>({});
  const [siteResponseOverrides, setSiteResponseOverrides] = useState<Record<string, number>>({});

  // Modals
  const [detailSiteId, setDetailSiteId] = useState<string | null>(null);
  const [showAddMonitor, setShowAddMonitor] = useState(false);
  const [showScheduleMaintenance, setShowScheduleMaintenance] = useState(false);

  // Add monitor form
  const [newMonitorUrl, setNewMonitorUrl] = useState("");
  const [newMonitorName, setNewMonitorName] = useState("");
  const [newMonitorInterval, setNewMonitorInterval] = useState("5");
  const [newMonitorRegions, setNewMonitorRegions] = useState<Set<string>>(new Set(["US East", "US West", "Europe", "Asia"]));
  const [newMonitorEmailAlert, setNewMonitorEmailAlert] = useState(true);
  const [newMonitorSlackAlert, setNewMonitorSlackAlert] = useState(false);
  const [newMonitorStatusCode, setNewMonitorStatusCode] = useState("200");
  const [addMonitorLoading, setAddMonitorLoading] = useState(false);

  // Incident detail toggle
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(new Set());

  // Maintenance
  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>(INITIAL_MAINTENANCE);
  const [deletingMaintenance, setDeletingMaintenance] = useState<string | null>(null);

  // Schedule maintenance form
  const [mwSites, setMwSites] = useState<string[]>([]);
  const [mwStart, setMwStart] = useState("");
  const [mwEnd, setMwEnd] = useState("");
  const [mwReason, setMwReason] = useState("");
  const [mwSuppressAlerts, setMwSuppressAlerts] = useState(true);

  // Public status page
  const [publicStatusEnabled, setPublicStatusEnabled] = useState(false);

  /* ── shared styles ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
  }`;

  /* ── derived values ── */
  const sitesWithIssues = MONITORED_SITES.filter((s) => s.status !== "up");
  const overallUptime =
    Math.round(
      (MONITORED_SITES.reduce((sum, s) => sum + s.uptime, 0) / MONITORED_SITES.length) * 100
    ) / 100;
  const avgResponse = Math.round(
    MONITORED_SITES.reduce((sum, s) => sum + s.avgResponse, 0) / MONITORED_SITES.length
  );
  const chartData = RESPONSE_TIME_DATA[timeRange];
  const avgValue = chartData[0]?.avg ?? 0;
  const chartStats = computeChartStats(chartData);

  const detailSite = detailSiteId ? MONITORED_SITES.find((s) => s.id === detailSiteId) : null;
  const detailChartData = RESPONSE_TIME_DATA["24h"];
  const detailStats = computeChartStats(detailChartData);

  /* ── handlers ── */
  const handleSaveAlerts = useCallback(() => {
    showToast.success("Alert configuration saved");
  }, []);

  const handleDotEnter = useCallback((siteId: string, dayIndex: number) => {
    setHoveredDot({ siteId, dayIndex });
  }, []);

  const handleDotLeave = useCallback(() => {
    setHoveredDot(null);
  }, []);

  const handlePingSite = useCallback((siteId: string) => {
    setPingSites((prev) => new Set(prev).add(siteId));
    setTimeout(() => {
      setPingSites((prev) => {
        const next = new Set(prev);
        next.delete(siteId);
        return next;
      });
      const site = MONITORED_SITES.find((s) => s.id === siteId);
      const ms = Math.round((site?.avgResponse ?? 180) * (0.85 + Math.random() * 0.3));
      setLastCheckedTimes((prev) => ({ ...prev, [siteId]: "Just now" }));
      setSiteResponseOverrides((prev) => ({ ...prev, [siteId]: ms }));
      showToast.success(`Ping complete: ${ms}ms response time`);
    }, 2000);
  }, []);

  const handleTogglePause = useCallback((siteId: string) => {
    setPausedSites((prev) => {
      const next = new Set(prev);
      if (next.has(siteId)) {
        next.delete(siteId);
        showToast.success("Monitoring resumed");
      } else {
        next.add(siteId);
        showToast.info("Monitoring paused");
      }
      return next;
    });
  }, []);

  const handleCheckAll = useCallback(() => {
    setCheckAllPing(true);
    // Mark all non-paused sites as pinging
    const activeSites = MONITORED_SITES.filter((s) => !pausedSites.has(s.id));
    setPingSites(new Set(activeSites.map((s) => s.id)));
    setTimeout(() => {
      setCheckAllPing(false);
      setPingSites(new Set());
      // Update last checked times and response times
      const newTimes: Record<string, string> = {};
      const newResponses: Record<string, number> = {};
      activeSites.forEach((s) => {
        newTimes[s.id] = "Just now";
        newResponses[s.id] = Math.round(s.avgResponse * (0.85 + Math.random() * 0.3));
      });
      setLastCheckedTimes((prev) => ({ ...prev, ...newTimes }));
      setSiteResponseOverrides((prev) => ({ ...prev, ...newResponses }));
      showToast.success(`All ${activeSites.length} sites checked — systems operational`);
    }, 2000);
  }, [pausedSites]);

  const handleAddMonitor = useCallback(() => {
    if (!newMonitorUrl.trim()) return;
    setAddMonitorLoading(true);
    setTimeout(() => {
      setAddMonitorLoading(false);
      setShowAddMonitor(false);
      setNewMonitorUrl("");
      setNewMonitorName("");
      showToast.success("Monitor added successfully");
    }, 1500);
  }, [newMonitorUrl]);

  const handleToggleRegion = useCallback((region: string) => {
    setNewMonitorRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }, []);

  const handleToggleIncident = useCallback((incId: string) => {
    setExpandedIncidents((prev) => {
      const next = new Set(prev);
      if (next.has(incId)) next.delete(incId);
      else next.add(incId);
      return next;
    });
  }, []);

  const handleDeleteMaintenance = useCallback((id: string) => {
    setMaintenanceWindows((prev) => prev.filter((mw) => mw.id !== id));
    setDeletingMaintenance(null);
    showToast.success("Maintenance window deleted");
  }, []);

  const handleScheduleMaintenance = useCallback(() => {
    if (!mwSites.length || !mwStart || !mwEnd) return;
    const newMw: MaintenanceWindow = {
      id: `mw${Date.now()}`,
      sites: mwSites,
      start: mwStart,
      end: mwEnd,
      reason: mwReason,
      status: "scheduled",
    };
    setMaintenanceWindows((prev) => [newMw, ...prev]);
    setShowScheduleMaintenance(false);
    setMwSites([]);
    setMwStart("");
    setMwEnd("");
    setMwReason("");
    showToast.success("Maintenance window scheduled");
  }, [mwSites, mwStart, mwEnd, mwReason]);

  const handleExportReport = useCallback(() => {
    const header = "Site,Status,Uptime,Avg Response\n";
    const rows = MONITORED_SITES.map((s) => `${s.name},${s.status},${s.uptime}%,${s.avgResponse}ms`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monitoring-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("Report exported as CSV");
  }, []);

  const handleToggleMwSite = useCallback((siteName: string) => {
    setMwSites((prev) =>
      prev.includes(siteName) ? prev.filter((s) => s !== siteName) : [...prev, siteName]
    );
  }, []);

  // Escape key + body scroll lock for modals
  useEffect(() => {
    const anyModalOpen = !!detailSiteId || showAddMonitor || showScheduleMaintenance;
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailSiteId, showAddMonitor, showScheduleMaintenance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (detailSiteId) setDetailSiteId(null);
        else if (showAddMonitor) setShowAddMonitor(false);
        else if (showScheduleMaintenance) setShowScheduleMaintenance(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detailSiteId, showAddMonitor, showScheduleMaintenance]);

  const timeRangeOptions: ("24h" | "7d" | "30d" | "90d")[] = ["24h", "7d", "30d", "90d"];
  const intervalOptions: { value: "1" | "5" | "15"; label: string }[] = [
    { value: "1", label: "1 min" },
    { value: "5", label: "5 min" },
    { value: "15", label: "15 min" },
  ];

  const maintenanceStatusColors: Record<string, { bg: string; text: string }> = {
    scheduled: { bg: "bg-sky-500/10", text: "text-sky-400" },
    active: { bg: "bg-amber-500/10", text: "text-amber-400" },
    completed: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Uptime Monitoring
            </h1>
            <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
              Monitor site availability and response times
            </p>
          </div>
          <button
            onClick={() => setShowAddMonitor(true)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px ${
              accent.button ?? "bg-emerald-600"
            } ${accent.buttonHover ?? "hover:bg-emerald-500"} shadow-lg ${accent.buttonShadow ?? "shadow-emerald-500/20"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Monitor
          </button>
        </div>

        {/* ────────── SECTION 1 — Stats Strip ────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Overall Uptime",
              value: `${overallUptime}%`,
              subtitle: "this month",
              color: "emerald",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
            {
              label: "Avg Response",
              value: `${avgResponse}ms`,
              subtitle: "across all sites",
              color: "sky",
              icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              label: "Active Monitors",
              value: `${MONITORED_SITES.length}`,
              subtitle: "sites monitored",
              color: "violet",
              icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
            },
            {
              label: "Incidents (30d)",
              value: `${INCIDENTS.length}`,
              subtitle: "last 30 days",
              color: "amber",
              icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
            },
          ].map((stat) => {
            const colorMap: Record<string, { iconBg: string; iconText: string; valueBg: string }> = {
              emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-400", valueBg: "bg-emerald-500/5" },
              sky: { iconBg: "bg-sky-500/10", iconText: "text-sky-400", valueBg: "bg-sky-500/5" },
              violet: { iconBg: "bg-violet-500/10", iconText: "text-violet-400", valueBg: "bg-violet-500/5" },
              amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-400", valueBg: "bg-amber-500/5" },
            };
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className={`${cardClass} p-4 hover:-translate-y-px transition-all`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-5 h-5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mt-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ────────── SECTION 2 — Overall Status Banner ────────── */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
                  sitesWithIssues.length === 0 ? "bg-emerald-500/10" : "bg-rose-500/10"
                }`}
              >
                {sitesWithIssues.length === 0 ? (
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 2.944a11.955 11.955 0 018.618 3.04A12.02 12.02 0 0121 9c0 5.591-3.824 10.29-9 11.622C6.824 19.29 3 14.591 3 9c0-1.042.133-2.052.382-3.016A11.955 11.955 0 0112 2.944z" />
                  </svg>
                )}
              </div>
              <div>
                {sitesWithIssues.length === 0 ? (
                  <h2 className="text-xl font-bold text-emerald-400">All Systems Operational</h2>
                ) : (
                  <h2 className="text-xl font-bold text-rose-400">
                    {sitesWithIssues.length} site{sitesWithIssues.length > 1 ? "s" : ""} ha
                    {sitesWithIssues.length > 1 ? "ve" : "s"} issues
                  </h2>
                )}
                <p className={`text-sm mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {overallUptime}% uptime this month
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckAll}
              disabled={checkAllPing}
              aria-label="Check all sites now"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-px ${
                isLight
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--bg-tertiary)]"
              } border ${isLight ? "border-slate-200" : "border-[var(--border-primary)]"}`}
            >
              {checkAllPing ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              )}
              {checkAllPing ? "Checking..." : "Check All Now"}
            </button>
          </div>
        </div>

        {/* ────────── SECTION 3 — Sites Grid ────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MONITORED_SITES.map((site) => {
            const isPaused = pausedSites.has(site.id);
            const isPinging = pingSites.has(site.id);
            const colors = isPaused
              ? { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400", ring: "ring-slate-500/20" }
              : STATUS_COLORS[site.status];
            const statusLabel = isPaused ? "Paused" : STATUS_LABELS[site.status];
            const lastCheck = lastCheckedTimes[site.id] || `${(site.id.charCodeAt(2) % 5) + 1} min ago`;
            const currentResponse = siteResponseOverrides[site.id] || site.avgResponse;
            const sslExpiry = `Apr 15, 2026`;

            return (
              <div
                key={site.id}
                className={`${cardClass} p-5 group hover:-translate-y-px transition-all`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => setDetailSiteId(site.id)}
                    className={`font-semibold text-left hover:underline decoration-dotted underline-offset-4 ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    {site.name}
                  </button>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${colors.bg} ${colors.text} ${colors.ring}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-slate-400" : colors.dot}`} />
                    {statusLabel}
                  </span>
                </div>

                <p className={`text-xs mb-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  {site.url}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Uptime", value: `${site.uptime}%` },
                    { label: "Avg Response", value: `${currentResponse}ms` },
                    { label: "Last Check", value: lastCheck },
                    { label: "SSL Expiry", value: sslExpiry },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className={labelClass}>{s.label}</p>
                      <p className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 30-day status dots */}
                <div className="flex gap-[3px] flex-wrap mb-4">
                  {site.dailyStatus.map((day, i) => {
                    const dotColor = isPaused ? "bg-slate-400/50" : STATUS_COLORS[day.status].dot;
                    return (
                      <div
                        key={day.date}
                        className="relative"
                        onMouseEnter={() => handleDotEnter(site.id, i)}
                        onMouseLeave={handleDotLeave}
                      >
                        <div
                          className={`w-[7px] h-5 rounded-sm cursor-pointer transition-all hover:scale-110 ${dotColor}`}
                        />
                        {hoveredDot?.siteId === site.id && hoveredDot?.dayIndex === i && (
                          <div
                            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 ${cardClass} px-3 py-2 shadow-lg whitespace-nowrap`}
                          >
                            <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                              {day.date}
                            </p>
                            <p className={`text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                              Uptime: {day.uptime}%
                            </p>
                            <p className={`text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                              Response: {day.responseTime}ms
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Hover actions row */}
                <div className={`flex gap-2 pt-3 border-t ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <button
                    onClick={() => handlePingSite(site.id)}
                    disabled={isPinging || isPaused}
                    aria-label="Ping site now"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isLight ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    } disabled:opacity-40`}
                  >
                    {isPinging ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    )}
                    {isPinging ? "Pinging..." : "Ping Now"}
                  </button>

                  <button
                    onClick={() => handleTogglePause(site.id)}
                    aria-label={isPaused ? "Resume monitoring" : "Pause monitoring"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isPaused
                        ? isLight ? "bg-sky-50 text-sky-700 hover:bg-sky-100" : "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                        : isLight ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                    }`}
                  >
                    {isPaused ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </button>

                  <button
                    onClick={() => setDetailSiteId(site.id)}
                    aria-label="View site details"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-slate-500/10 text-slate-300 hover:bg-slate-500/20"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ────────── SECTION 4 — Response Time Chart ────────── */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Response Time
            </h3>
            <div className={`inline-flex rounded-xl p-1 ${isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"}`}>
              {timeRangeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTimeRange(opt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    timeRange === opt
                      ? `${accent.activeBg} ${accent.text}`
                      : isLight
                      ? "text-slate-500 hover:text-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row above chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Min", value: `${chartStats.min}ms`, color: "emerald" },
              { label: "Max", value: `${chartStats.max}ms`, color: "rose" },
              { label: "Avg", value: `${chartStats.avg}ms`, color: "sky" },
              { label: "p95", value: `${chartStats.p95}ms`, color: "amber" },
            ].map((s) => {
              const bgMap: Record<string, string> = {
                emerald: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
                rose: isLight ? "bg-rose-50" : "bg-rose-500/10",
                sky: isLight ? "bg-sky-50" : "bg-sky-500/10",
                amber: isLight ? "bg-amber-50" : "bg-amber-500/10",
              };
              const textMap: Record<string, string> = {
                emerald: "text-emerald-500",
                rose: "text-rose-500",
                sky: "text-sky-500",
                amber: "text-amber-500",
              };
              return (
                <div key={s.label} className={`${bgMap[s.color]} rounded-xl px-3 py-2.5`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                  <p className={`text-sm font-bold ${textMap[s.color]}`}>{s.value}</p>
                </div>
              );
            })}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2e8f0" : "#1e293b"} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} unit="ms" />
              <RechartsTooltip content={<CustomTooltip isLight={isLight} cardClass={cardClass} />} />
              <ReferenceLine
                y={avgValue}
                stroke={isLight ? "#94a3b8" : "#475569"}
                strokeDasharray="5 5"
                label={{ value: "Avg", position: "right", fontSize: 11, fill: isLight ? "#94a3b8" : "#475569" }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ────────── SECTION 5 — Incident History ────────── */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-lg font-semibold mb-6 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Incident History
          </h3>

          <div className={`relative pl-6 border-l-2 ${isLight ? "border-slate-200" : "border-slate-700"}`}>
            {INCIDENTS.map((inc, idx) => {
              const dotColor = inc.status === "resolved" ? "bg-emerald-400" : "bg-amber-400";
              const statusBg =
                inc.status === "resolved"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400";
              const isExpanded = expandedIncidents.has(inc.id);
              const timeline = INCIDENT_TIMELINES[inc.id] ?? [];

              return (
                <div key={inc.id} className={`relative ${idx < INCIDENTS.length - 1 ? "pb-8" : ""}`}>
                  <div
                    className={`absolute w-3 h-3 rounded-full ${dotColor} ring-4 ${
                      isLight ? "ring-white" : "ring-[var(--gradient-card-from)]"
                    }`}
                    style={{ top: "4px", left: "-31px" }}
                  />

                  <p className={`font-semibold text-sm ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {inc.date}
                  </p>

                  <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isLight ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-300"}`}>
                    {inc.duration}
                  </span>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {inc.sites.map((site) => (
                      <span key={site} className={`text-xs font-medium px-2 py-0.5 rounded-full ${isLight ? "bg-violet-50 text-violet-700" : "bg-violet-500/10 text-violet-400"}`}>
                        {site}
                      </span>
                    ))}
                  </div>

                  <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {inc.rootCause}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBg}`}>
                      {inc.status}
                    </span>
                    <button
                      onClick={() => handleToggleIncident(inc.id)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {isExpanded ? "Hide" : "View"} Details
                      <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Incident detail inline */}
                  {isExpanded && timeline.length > 0 && (
                    <div className={`mt-3 rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                        Incident Timeline
                      </p>
                      <div className="space-y-3">
                        {timeline.map((step, si) => (
                          <div key={si} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                step.label === "Resolved" ? "bg-emerald-400" : step.label === "Detected" ? "bg-rose-400" : "bg-amber-400"
                              }`} />
                              {si < timeline.length - 1 && (
                                <div className={`w-px flex-1 mt-1 ${isLight ? "bg-slate-200" : "bg-slate-700"}`} />
                              )}
                            </div>
                            <div className="pb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>{step.label}</span>
                                <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>{step.time}</span>
                              </div>
                              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={`flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dashed ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>Affected regions:</span>
                        {REGIONS.map((r) => (
                          <span key={r.name} className={`text-[10px] px-1.5 py-0.5 rounded ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"}`}>
                            {r.flag} {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ────────── SECTION 6 — Alert Configuration ────────── */}
        <div>
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isLight
                ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Configure Alerts
            <svg className={`w-4 h-4 transition-transform ${alertsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {alertsOpen && (
            <div className={`${cardClass} p-6 mt-4 space-y-6`}>
              {/* Email notifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    Email Notifications
                  </label>
                  <Toggle enabled={emailEnabled} onChange={setEmailEnabled} />
                </div>
                {emailEnabled && (
                  <div>
                    <label htmlFor="alert-email" className={labelClass}>Email address</label>
                    <input
                      id="alert-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${inputClass} mt-1`}
                    />
                  </div>
                )}
              </div>

              {/* Slack webhook */}
              <div>
                <label htmlFor="slack-webhook" className={labelClass}>Slack Webhook URL</label>
                <input
                  id="slack-webhook"
                  type="url"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className={`${inputClass} mt-1`}
                />
              </div>

              {/* Discord webhook */}
              <div>
                <label htmlFor="discord-webhook" className={labelClass}>Discord Webhook URL</label>
                <input
                  id="discord-webhook"
                  type="url"
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className={`${inputClass} mt-1`}
                />
              </div>

              {/* Check interval */}
              <div>
                <label className={labelClass}>Check Interval</label>
                <div className={`inline-flex rounded-xl p-1 mt-1 ${isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"}`}>
                  {intervalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCheckInterval(opt.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        checkInterval === opt.value
                          ? `${accent.activeBg} ${accent.text}`
                          : isLight
                          ? "text-slate-500 hover:text-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response threshold */}
              <div>
                <label htmlFor="response-threshold" className={labelClass}>Response Threshold</label>
                <div className="relative mt-1">
                  <select
                    id="response-threshold"
                    value={responseThreshold}
                    onChange={(e) => setResponseThreshold(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="500ms">500ms</option>
                    <option value="1s">1s</option>
                    <option value="2s">2s</option>
                    <option value="5s">5s</option>
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Downtime notification */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Downtime Notification</p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Alert when a site goes down</p>
                </div>
                <Toggle enabled={downtimeNotify} onChange={setDowntimeNotify} />
              </div>

              {/* Recovery notification */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Recovery Notification</p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Alert when a site comes back up</p>
                </div>
                <Toggle enabled={recoveryNotify} onChange={setRecoveryNotify} />
              </div>

              {/* SSL expiry warning */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>SSL Expiry Warning</p>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Alert before SSL certificate expires</p>
                </div>
                <Toggle enabled={sslExpiryNotify} onChange={setSslExpiryNotify} />
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveAlerts}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-px ${
                  accent.button ?? "bg-emerald-500"
                } ${accent.buttonHover ?? "hover:bg-emerald-600"} shadow-lg ${accent.buttonShadow ?? "shadow-emerald-500/20"}`}
              >
                Save Configuration
              </button>
            </div>
          )}
        </div>

        {/* ────────── SECTION 7 — Maintenance Windows ────────── */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Maintenance Windows
            </h3>
            <button
              onClick={() => setShowScheduleMaintenance(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:-translate-y-px ${
                isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Schedule Maintenance
            </button>
          </div>

          {maintenanceWindows.length === 0 ? (
            <p className={`text-sm text-center py-8 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              No maintenance windows scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {maintenanceWindows.map((mw) => {
                const mwColor = maintenanceStatusColors[mw.status] ?? maintenanceStatusColors.scheduled;
                return (
                  <div
                    key={mw.id}
                    className={`rounded-xl p-4 border transition-all hover:-translate-y-px ${
                      isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-primary)]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {mw.sites.map((s) => (
                            <span key={s} className={`text-xs font-medium px-2 py-0.5 rounded-full ${isLight ? "bg-violet-50 text-violet-700" : "bg-violet-500/10 text-violet-400"}`}>
                              {s}
                            </span>
                          ))}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${mwColor.bg} ${mwColor.text}`}>
                            {mw.status}
                          </span>
                        </div>
                        <p className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                          {mw.reason}
                        </p>
                        <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {mw.start} &mdash; {mw.end}
                        </p>
                      </div>
                      {mw.status !== "completed" && (
                        <button
                          onClick={() => setDeletingMaintenance(mw.id)}
                          aria-label="Delete maintenance window"
                          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                            isLight ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50" : "text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ────────── SECTION 8 — Export & Public Status ────────── */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-lg font-semibold mb-6 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Export & Public Status
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={handleExportReport}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-px ${
                isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--bg-tertiary)]"
              } border ${isLight ? "border-slate-200" : "border-[var(--border-primary)]"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Report
            </button>

            <div className={`flex-1 rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Public Status Page</p>
                  <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    Share a public URL showing your uptime status
                  </p>
                </div>
                <Toggle enabled={publicStatusEnabled} onChange={setPublicStatusEnabled} />
              </div>
              {publicStatusEnabled && (
                <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg ${isLight ? "bg-emerald-50" : "bg-emerald-500/10"}`}>
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span className={`text-sm font-mono ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                    status.limewp.com
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ MODALS ════════════════ */}

      {/* ── Site Detail Modal ── */}
      {detailSite && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setDetailSiteId(null)} aria-hidden="true" />
          <div className={`${modalCardClass} max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {detailSite.name}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${STATUS_COLORS[detailSite.status].bg} ${STATUS_COLORS[detailSite.status].text} ${STATUS_COLORS[detailSite.status].ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[detailSite.status].dot}`} />
                      {STATUS_LABELS[detailSite.status]}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    {detailSite.url}
                  </p>
                </div>
                <button
                  onClick={() => setDetailSiteId(null)}
                  aria-label="Close site details"
                  className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Response time mini chart */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Response Time (24h)
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={detailChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2e8f0" : "#1e293b"} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: isLight ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: isLight ? "#94a3b8" : "#475569" }} tickLine={false} axisLine={false} unit="ms" />
                    <RechartsTooltip content={<CustomTooltip isLight={isLight} cardClass={cardClass} />} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 3, fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: "Uptime", value: `${detailSite.uptime}%`, color: "emerald" },
                  { label: "Avg", value: `${detailStats.avg}ms`, color: "sky" },
                  { label: "Min", value: `${detailStats.min}ms`, color: "emerald" },
                  { label: "Max", value: `${detailStats.max}ms`, color: "rose" },
                  { label: "p95", value: `${detailStats.p95}ms`, color: "amber" },
                  { label: "p99", value: `${detailStats.p99}ms`, color: "rose" },
                ].map((s) => {
                  const bgMap: Record<string, string> = {
                    emerald: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
                    sky: isLight ? "bg-sky-50" : "bg-sky-500/10",
                    rose: isLight ? "bg-rose-50" : "bg-rose-500/10",
                    amber: isLight ? "bg-amber-50" : "bg-amber-500/10",
                  };
                  const textMap: Record<string, string> = {
                    emerald: "text-emerald-500",
                    sky: "text-sky-500",
                    rose: "text-rose-500",
                    amber: "text-amber-500",
                  };
                  return (
                    <div key={s.label} className={`${bgMap[s.color]} rounded-xl px-2.5 py-2 text-center`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                      <p className={`text-sm font-bold ${textMap[s.color]}`}>{s.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Multi-region checks */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Multi-Region Checks
                </p>
                <div className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200" : "border-[var(--border-primary)]"}`}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}>
                        {["Region", "Status", "Response", "Last Check"].map((h) => (
                          <th key={h} className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {REGIONS.map((region, ri) => {
                        const rc = STATUS_COLORS[region.status];
                        return (
                          <tr key={region.name} className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"}`}>
                            <td className={`px-4 py-3 font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                              {region.flag} {region.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${rc.bg} ${rc.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                                {STATUS_LABELS[region.status]}
                              </span>
                            </td>
                            <td className={`px-4 py-3 font-mono text-xs ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                              {region.response}ms
                            </td>
                            <td className={`px-4 py-3 text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                              {region.lastCheck}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SSL Certificate info */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  SSL Certificate
                </p>
                <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-primary)]"}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={labelClass}>Issuer</p>
                      <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{SSL_INFO.issuer}</p>
                    </div>
                    <div>
                      <p className={labelClass}>Days Remaining</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        SSL_INFO.daysRemaining > 30
                          ? "bg-emerald-500/10 text-emerald-400"
                          : SSL_INFO.daysRemaining > 7
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {SSL_INFO.daysRemaining} days
                      </span>
                    </div>
                    <div>
                      <p className={labelClass}>Valid From</p>
                      <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{SSL_INFO.validFrom}</p>
                    </div>
                    <div>
                      <p className={labelClass}>Valid To</p>
                      <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{SSL_INFO.validTo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Monitor Modal ── */}
      {showAddMonitor && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowAddMonitor(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Add Monitor
                </h2>
                <button
                  onClick={() => setShowAddMonitor(false)}
                  aria-label="Close add monitor modal"
                  className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label htmlFor="monitor-url" className={labelClass}>URL</label>
                <input
                  id="monitor-url"
                  type="url"
                  value={newMonitorUrl}
                  onChange={(e) => setNewMonitorUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label htmlFor="monitor-name" className={labelClass}>Display Name</label>
                <input
                  id="monitor-name"
                  type="text"
                  value={newMonitorName}
                  onChange={(e) => setNewMonitorName(e.target.value)}
                  placeholder="My Website"
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className={labelClass}>Check Interval</label>
                <div className={`inline-flex rounded-xl p-1 mt-1 ${isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"}`}>
                  {[{ v: "1", l: "1 min" }, { v: "5", l: "5 min" }, { v: "15", l: "15 min" }].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setNewMonitorInterval(opt.v)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        newMonitorInterval === opt.v
                          ? `${accent.activeBg} ${accent.text}`
                          : isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Monitoring Regions</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {REGIONS.map((r) => (
                    <label
                      key={r.name}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                        newMonitorRegions.has(r.name)
                          ? isLight ? "bg-emerald-50 border border-emerald-200" : "bg-emerald-500/10 border border-emerald-500/20"
                          : isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newMonitorRegions.has(r.name)}
                        onChange={() => handleToggleRegion(r.name)}
                        className="sr-only"
                      />
                      <span className="text-sm">{r.flag}</span>
                      <span className={`text-xs font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{r.name}</span>
                      {newMonitorRegions.has(r.name) && (
                        <svg className="w-3.5 h-3.5 text-emerald-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>Email Alerts</span>
                  <Toggle enabled={newMonitorEmailAlert} onChange={setNewMonitorEmailAlert} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>Slack Alerts</span>
                  <Toggle enabled={newMonitorSlackAlert} onChange={setNewMonitorSlackAlert} />
                </div>
              </div>

              <div>
                <label htmlFor="expected-status" className={labelClass}>Expected Status Code</label>
                <div className="relative mt-1">
                  <select
                    id="expected-status"
                    value={newMonitorStatusCode}
                    onChange={(e) => setNewMonitorStatusCode(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="200">200 OK</option>
                    <option value="301">301 Moved</option>
                    <option value="302">302 Found</option>
                    <option value="403">403 Forbidden</option>
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleAddMonitor}
                disabled={addMonitorLoading || !newMonitorUrl.trim()}
                className={`w-full h-11 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  accent.button ?? "bg-emerald-600"
                } ${accent.buttonHover ?? "hover:bg-emerald-500"} shadow-lg ${accent.buttonShadow ?? "shadow-emerald-500/20"}`}
              >
                {addMonitorLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Monitor...
                  </>
                ) : (
                  "Add Monitor"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Maintenance Modal ── */}
      {showScheduleMaintenance && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowScheduleMaintenance(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  Schedule Maintenance
                </h2>
                <button
                  onClick={() => setShowScheduleMaintenance(false)}
                  aria-label="Close schedule maintenance modal"
                  className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className={labelClass}>Select Sites</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {MONITORED_SITES.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => handleToggleMwSite(site.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        mwSites.includes(site.name)
                          ? isLight ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300" : "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30"
                          : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {site.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mw-start" className={labelClass}>Start Date/Time</label>
                  <input
                    id="mw-start"
                    type="datetime-local"
                    value={mwStart}
                    onChange={(e) => setMwStart(e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label htmlFor="mw-end" className={labelClass}>End Date/Time</label>
                  <input
                    id="mw-end"
                    type="datetime-local"
                    value={mwEnd}
                    onChange={(e) => setMwEnd(e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mw-reason" className={labelClass}>Reason</label>
                <textarea
                  id="mw-reason"
                  value={mwReason}
                  onChange={(e) => setMwReason(e.target.value)}
                  placeholder="Describe the maintenance activity..."
                  rows={3}
                  className={`${inputClass} h-auto py-2.5 mt-1 resize-none`}
                />
              </div>

              <label className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
                <input
                  type="checkbox"
                  checked={mwSuppressAlerts}
                  onChange={(e) => setMwSuppressAlerts(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  mwSuppressAlerts
                    ? "bg-emerald-500 border-emerald-500"
                    : isLight ? "border-slate-300" : "border-slate-600"
                }`}>
                  {mwSuppressAlerts && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Suppress alerts during maintenance
                </span>
              </label>

              <button
                onClick={handleScheduleMaintenance}
                disabled={!mwSites.length || !mwStart || !mwEnd}
                className={`w-full h-11 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${
                  accent.button ?? "bg-emerald-600"
                } ${accent.buttonHover ?? "hover:bg-emerald-500"} shadow-lg ${accent.buttonShadow ?? "shadow-emerald-500/20"}`}
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Maintenance ConfirmDialog ── */}
      <ConfirmDialog
        open={!!deletingMaintenance}
        onClose={() => setDeletingMaintenance(null)}
        onConfirm={() => deletingMaintenance && handleDeleteMaintenance(deletingMaintenance)}
        title="Delete Maintenance Window"
        message="Are you sure you want to delete this scheduled maintenance window? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </AppShell>
  );
}
