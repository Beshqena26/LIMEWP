"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

/* ────────────────────────── Types ────────────────────────── */

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";
type IncidentStatus = "Resolved" | "Investigating" | "Monitoring" | "Identified";
type DayStatus = "up" | "degraded" | "down" | "none";

interface Service {
  name: string;
  status: ServiceStatus;
  uptimePercent: number;
  icon: string;
  history: DayStatus[];
}

interface IncidentUpdate {
  time: string;
  status: IncidentStatus;
  message: string;
}

interface Incident {
  id: string;
  date: string;
  title: string;
  status: IncidentStatus | "Resolved";
  duration: string;
  affectedServices: string[];
  updates: IncidentUpdate[];
}

interface MaintenanceWindow {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  affectedServices: string[];
  duration: string;
}

/* ────────────────────────── Helpers ────────────────────────── */

function generateHistory(): DayStatus[] {
  const history: DayStatus[] = [];
  for (let i = 0; i < 90; i++) {
    const rand = Math.random();
    if (rand > 0.97) history.push("degraded");
    else if (rand > 0.995) history.push("down");
    else history.push("up");
  }
  return history;
}

function generateDegradedHistory(): DayStatus[] {
  const history: DayStatus[] = [];
  for (let i = 0; i < 90; i++) {
    const rand = Math.random();
    if (i >= 85) {
      history.push(rand > 0.5 ? "degraded" : "up");
    } else if (rand > 0.94) {
      history.push("degraded");
    } else if (rand > 0.99) {
      history.push("down");
    } else {
      history.push("up");
    }
  }
  return history;
}

/* ────────────────────────── Data ────────────────────────── */

const SERVICES: Service[] = [
  { name: "Web Hosting", status: "operational", uptimePercent: 99.99, icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z", history: generateHistory() },
  { name: "DNS", status: "operational", uptimePercent: 99.99, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", history: generateHistory() },
  { name: "CDN", status: "operational", uptimePercent: 99.98, icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", history: generateHistory() },
  { name: "Email", status: "operational", uptimePercent: 99.97, icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", history: generateHistory() },
  { name: "API", status: "operational", uptimePercent: 99.99, icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", history: generateHistory() },
  { name: "Control Panel", status: "operational", uptimePercent: 99.99, icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75", history: generateHistory() },
  { name: "Backups", status: "operational", uptimePercent: 99.95, icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", history: generateHistory() },
  { name: "Monitoring", status: "degraded", uptimePercent: 99.82, icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", history: generateDegradedHistory() },
];

const INCIDENTS: Incident[] = [
  {
    id: "INC-2026-005",
    date: "Mar 26, 2026",
    title: "Monitoring Service Degraded Performance",
    status: "Investigating",
    duration: "Ongoing",
    affectedServices: ["Monitoring"],
    updates: [
      { time: "2:15 PM UTC", status: "Investigating", message: "We are investigating elevated response times in the monitoring service. External checks may experience delays of up to 30 seconds." },
      { time: "2:00 PM UTC", status: "Identified", message: "Increased latency detected on monitoring endpoints. The engineering team has been engaged." },
    ],
  },
  {
    id: "INC-2026-004",
    date: "Mar 18, 2026",
    title: "CDN Cache Purge Delays",
    status: "Resolved",
    duration: "47 minutes",
    affectedServices: ["CDN"],
    updates: [
      { time: "4:32 PM UTC", status: "Resolved", message: "Cache purge operations have returned to normal. All queued purge requests have been processed." },
      { time: "4:10 PM UTC", status: "Monitoring", message: "A fix has been deployed. We are monitoring purge queue processing times." },
      { time: "3:45 PM UTC", status: "Identified", message: "Root cause identified as a configuration issue in the cache invalidation pipeline following a routine update." },
    ],
  },
  {
    id: "INC-2026-003",
    date: "Mar 10, 2026",
    title: "API Rate Limiting False Positives",
    status: "Resolved",
    duration: "1 hour 23 minutes",
    affectedServices: ["API", "Control Panel"],
    updates: [
      { time: "11:48 AM UTC", status: "Resolved", message: "Rate limiting rules have been corrected. All API endpoints are responding normally." },
      { time: "11:15 AM UTC", status: "Monitoring", message: "Adjusted rate limiting thresholds. Monitoring for false positive rejections." },
      { time: "10:25 AM UTC", status: "Identified", message: "Identified overly aggressive rate limiting rules deployed in the last maintenance window." },
    ],
  },
  {
    id: "INC-2026-002",
    date: "Feb 28, 2026",
    title: "Email Delivery Delays",
    status: "Resolved",
    duration: "2 hours 15 minutes",
    affectedServices: ["Email"],
    updates: [
      { time: "6:15 PM UTC", status: "Resolved", message: "All queued emails have been delivered. SMTP relay performance is back to normal." },
      { time: "5:30 PM UTC", status: "Monitoring", message: "Email queue is draining. Delivery times improving." },
      { time: "4:00 PM UTC", status: "Identified", message: "SMTP relay experiencing connection timeouts due to upstream provider issue." },
    ],
  },
  {
    id: "INC-2026-001",
    date: "Feb 15, 2026",
    title: "Scheduled Database Migration Overrun",
    status: "Resolved",
    duration: "3 hours 42 minutes",
    affectedServices: ["Web Hosting", "Backups"],
    updates: [
      { time: "8:42 AM UTC", status: "Resolved", message: "Database migration completed. All sites are operational with improved query performance." },
      { time: "7:00 AM UTC", status: "Monitoring", message: "Migration is 95% complete. Some sites may experience brief read-only periods." },
      { time: "5:00 AM UTC", status: "Identified", message: "Database migration taking longer than expected due to larger-than-anticipated table sizes." },
    ],
  },
];

const MAINTENANCE: MaintenanceWindow[] = [
  {
    id: "MNT-2026-003",
    date: "Apr 2, 2026",
    time: "2:00 AM - 4:00 AM UTC",
    title: "Network Infrastructure Upgrade",
    description: "Upgrading core network switches to support 100Gbps throughput. Brief connectivity interruptions may occur.",
    affectedServices: ["Web Hosting", "CDN", "API"],
    duration: "2 hours",
  },
  {
    id: "MNT-2026-004",
    date: "Apr 10, 2026",
    time: "3:00 AM - 5:00 AM UTC",
    title: "Database Engine Update",
    description: "Updating MySQL and PostgreSQL engines to latest stable releases for improved performance and security patches.",
    affectedServices: ["Web Hosting", "Backups"],
    duration: "2 hours",
  },
];

/* ────────────────────────── Status Helpers ────────────────────────── */

const STATUS_CONFIG: Record<ServiceStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  operational: { label: "Operational", dotClass: "bg-emerald-500", bgClass: "bg-emerald-500/10", textClass: "text-emerald-600 dark:text-emerald-400" },
  degraded: { label: "Degraded Performance", dotClass: "bg-amber-500", bgClass: "bg-amber-500/10", textClass: "text-amber-600 dark:text-amber-400" },
  outage: { label: "Major Outage", dotClass: "bg-rose-500", bgClass: "bg-rose-500/10", textClass: "text-rose-600 dark:text-rose-400" },
  maintenance: { label: "Under Maintenance", dotClass: "bg-sky-500", bgClass: "bg-sky-500/10", textClass: "text-sky-600 dark:text-sky-400" },
};

const DAY_STATUS_COLOR: Record<DayStatus, string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-rose-500",
  none: "bg-slate-300 dark:bg-slate-700",
};

const INCIDENT_STATUS_COLOR: Record<string, string> = {
  Resolved: "text-emerald-600 dark:text-emerald-400",
  Investigating: "text-amber-600 dark:text-amber-400",
  Monitoring: "text-sky-600 dark:text-sky-400",
  Identified: "text-rose-600 dark:text-rose-400",
};

function getOverallStatus(services: Service[]): { label: string; isHealthy: boolean } {
  const hasOutage = services.some(s => s.status === "outage");
  const hasDegraded = services.some(s => s.status === "degraded");
  if (hasOutage) return { label: "Partial System Outage", isHealthy: false };
  if (hasDegraded) return { label: "Degraded System Performance", isHealthy: false };
  return { label: "All Systems Operational", isHealthy: true };
}

/* ────────────────────────── Component ────────────────────────── */

export default function StatusPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);

  const overall = getOverallStatus(SERVICES);
  const avgUptime = (SERVICES.reduce((sum, s) => sum + s.uptimePercent, 0) / SERVICES.length).toFixed(2);

  const cardClass = cn(
    "rounded-2xl border transition-all",
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  );

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      showToast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    showToast.success("Subscribed to status updates!");
  };

  return (
    <div className={cn("min-h-screen transition-colors", isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]")}>
      {/* ── Header ── */}
      <header className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        isLight
          ? "bg-white/80 border-slate-200"
          : "bg-[var(--bg-primary)]/80 border-[var(--border-tertiary)]"
      )}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/limewp-logo.svg" alt="LimeWP" width={100} height={28} />
            <span className={cn(
              "hidden sm:inline-block text-sm font-medium px-2.5 py-0.5 rounded-full",
              isLight ? "bg-slate-100 text-slate-600" : "bg-white/5 text-slate-400"
            )}>
              System Status
            </span>
          </Link>
          <a
            href="#subscribe"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              `bg-gradient-to-r ${accent.gradient} text-white shadow-lg ${accent.buttonShadow} hover:shadow-xl hover:scale-[1.02]`
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Subscribe to Updates
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Overall Status Banner ── */}
        <div className={cn(
          "rounded-2xl border p-6 sm:p-8 text-center",
          overall.isHealthy
            ? isLight
              ? "bg-emerald-50 border-emerald-200"
              : "bg-emerald-500/5 border-emerald-500/20"
            : isLight
              ? "bg-amber-50 border-amber-200"
              : "bg-amber-500/5 border-amber-500/20"
        )}>
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
            overall.isHealthy ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}>
            {overall.isHealthy ? (
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <h1 className={cn(
            "text-2xl sm:text-3xl font-bold mb-2",
            overall.isHealthy
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-amber-700 dark:text-amber-400"
          )}>
            {overall.label}
          </h1>
          <p className={cn("text-sm", isLight ? "text-slate-500" : "text-slate-400")}>
            Last updated: {new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" })}
          </p>
        </div>

        {/* ── Services Grid ── */}
        <div>
          <h2 className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
            Current Status
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SERVICES.map(service => {
              const cfg = STATUS_CONFIG[service.status];
              return (
                <div key={service.name} className={cn(cardClass, "p-4 flex items-center gap-3")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.bgClass)}>
                    <svg className={cn("w-5 h-5", cfg.textClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium truncate", isLight ? "text-slate-800" : "text-slate-200")}>
                      {service.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dotClass)} />
                      <span className={cn("text-xs font-medium", cfg.textClass)}>{cfg.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Uptime Percentage ── */}
        <div className={cn(cardClass, "p-6")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className={cn("text-lg font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                Overall Uptime
              </h2>
              <p className={cn("text-sm mt-1", isLight ? "text-slate-500" : "text-slate-400")}>
                Average across all services this month
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-4xl font-bold", accent.text)}>{avgUptime}%</p>
              <p className={cn("text-xs mt-1", isLight ? "text-slate-500" : "text-slate-400")}>uptime this month</p>
            </div>
          </div>
        </div>

        {/* ── 90-Day Uptime History ── */}
        <div>
          <h2 className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
            90-Day Uptime History
          </h2>
          <div className="space-y-3">
            {SERVICES.map(service => (
              <div key={service.name} className={cn(cardClass, "p-4")}>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                    {service.name}
                  </span>
                  <span className={cn("text-xs font-semibold tabular-nums", accent.text)}>
                    {service.uptimePercent}%
                  </span>
                </div>
                <div className="flex gap-[2px]">
                  {service.history.map((day, i) => (
                    <div
                      key={i}
                      className={cn("flex-1 h-8 rounded-[2px] transition-all hover:scale-y-110 cursor-default", DAY_STATUS_COLOR[day])}
                      title={`Day ${90 - i}: ${day === "up" ? "Operational" : day === "degraded" ? "Degraded" : day === "down" ? "Outage" : "No data"}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className={cn("text-[10px]", isLight ? "text-slate-400" : "text-slate-500")}>90 days ago</span>
                  <span className={cn("text-[10px]", isLight ? "text-slate-400" : "text-slate-500")}>Today</span>
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 justify-center">
            {[
              { label: "Operational", color: "bg-emerald-500" },
              { label: "Degraded", color: "bg-amber-500" },
              { label: "Outage", color: "bg-rose-500" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("w-3 h-3 rounded-sm", item.color)} />
                <span className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Incident History ── */}
        <div>
          <h2 className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
            Incident History
          </h2>
          <div className="space-y-3">
            {INCIDENTS.map(incident => {
              const isExpanded = expandedIncident === incident.id;
              const statusColor = INCIDENT_STATUS_COLOR[incident.status] || "text-slate-400";
              return (
                <div key={incident.id} className={cn(cardClass, "overflow-hidden")}>
                  <button
                    onClick={() => setExpandedIncident(isExpanded ? null : incident.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start gap-4"
                  >
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                      incident.status === "Resolved" ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h3 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                          {incident.title}
                        </h3>
                        <span className={cn("text-xs font-medium shrink-0", statusColor)}>
                          {incident.status}
                        </span>
                      </div>
                      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                        <span>{incident.date}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>Duration: {incident.duration}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>Affected: {incident.affectedServices.join(", ")}</span>
                      </div>
                    </div>
                    <svg
                      className={cn(
                        "w-4 h-4 shrink-0 mt-1 transition-transform",
                        isExpanded ? "rotate-180" : "",
                        isLight ? "text-slate-400" : "text-slate-500"
                      )}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className={cn("px-4 sm:px-5 pb-5 border-t", isLight ? "border-slate-100" : "border-[var(--border-tertiary)]")}>
                      <div className="ml-6 mt-4 space-y-4 relative">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-px", isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]")} />
                        {incident.updates.map((update, i) => (
                          <div key={i} className="pl-5 relative">
                            <div className={cn(
                              "absolute left-[-3px] top-1.5 w-[7px] h-[7px] rounded-full border-2",
                              isLight ? "bg-white border-slate-300" : "bg-[var(--bg-primary)] border-slate-600"
                            )} />
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn("text-xs font-semibold", INCIDENT_STATUS_COLOR[update.status] || "text-slate-400")}>
                                {update.status}
                              </span>
                              <span className={cn("text-xs", isLight ? "text-slate-400" : "text-slate-500")}>
                                {update.time}
                              </span>
                            </div>
                            <p className={cn("text-sm leading-relaxed", isLight ? "text-slate-600" : "text-slate-300")}>
                              {update.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Scheduled Maintenance ── */}
        <div>
          <h2 className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
            Scheduled Maintenance
          </h2>
          {MAINTENANCE.length === 0 ? (
            <div className={cn(cardClass, "p-8 text-center")}>
              <p className={cn("text-sm", isLight ? "text-slate-500" : "text-slate-400")}>
                No scheduled maintenance windows at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {MAINTENANCE.map(maint => (
                <div key={maint.id} className={cn(cardClass, "p-4 sm:p-5")}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", "bg-sky-500/10")}>
                      <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1 3.03a.75.75 0 01-1.07-.83l1.35-5.68a.75.75 0 00-.22-.67L1.3 6.47a.75.75 0 01.42-1.28l5.77-.84a.75.75 0 00.57-.41l2.58-5.22a.75.75 0 011.36 0l2.58 5.22a.75.75 0 00.57.41l5.77.84a.75.75 0 01.42 1.28l-4.17 4.07a.75.75 0 00-.22.67l1.35 5.68a.75.75 0 01-1.07.83l-5.1-3.03a.75.75 0 00-.74 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                        {maint.title}
                      </h3>
                      <p className={cn("text-sm mt-1 leading-relaxed", isLight ? "text-slate-600" : "text-slate-300")}>
                        {maint.description}
                      </p>
                      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {maint.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {maint.time}
                        </span>
                        <span>Duration: {maint.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {maint.affectedServices.map(s => (
                          <span key={s} className={cn(
                            "text-[11px] font-medium px-2 py-0.5 rounded-full",
                            isLight ? "bg-sky-50 text-sky-700" : "bg-sky-500/10 text-sky-400"
                          )}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Subscribe ── */}
        <div id="subscribe" className={cn(cardClass, "p-6 sm:p-8")}>
          <div className="text-center max-w-md mx-auto">
            <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4", accent.bg)}>
              <svg className={cn("w-6 h-6", accent.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h2 className={cn("text-lg font-semibold mb-2", isLight ? "text-slate-800" : "text-slate-100")}>
              Stay Informed
            </h2>
            <p className={cn("text-sm mb-5", isLight ? "text-slate-500" : "text-slate-400")}>
              Get notified when we create or resolve an incident. No spam, unsubscribe at any time.
            </p>
            {subscribed ? (
              <div className={cn("flex items-center justify-center gap-2 py-3 px-4 rounded-xl", "bg-emerald-500/10")}>
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  You&apos;re subscribed to status updates!
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                  placeholder="your@email.com"
                  className={cn(
                    "flex-1 h-11 px-4 rounded-xl text-sm outline-none transition-all border",
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                      : "bg-white/5 border-[var(--border-tertiary)] text-slate-200 placeholder:text-slate-500 focus:border-[var(--border-primary)] focus:ring-2 focus:ring-white/5"
                  )}
                />
                <button
                  onClick={handleSubscribe}
                  className={cn(
                    "h-11 px-5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]",
                    `bg-gradient-to-r ${accent.gradient} shadow-lg ${accent.buttonShadow}`
                  )}
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className={cn(
          "border-t pt-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4",
          isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
        )}>
          <div className="flex items-center gap-3">
            <Image src="/limewp-logo.svg" alt="LimeWP" width={80} height={22} />
            <span className={cn("text-xs", isLight ? "text-slate-400" : "text-slate-500")}>
              System Status
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className={cn("text-xs transition-colors hover:underline", isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200")}>
              Home
            </Link>
            <Link href="/contact" className={cn("text-xs transition-colors hover:underline", isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200")}>
              Contact
            </Link>
            <Link href="/docs" className={cn("text-xs transition-colors hover:underline", isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200")}>
              Documentation
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
