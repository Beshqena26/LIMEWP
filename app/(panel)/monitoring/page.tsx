"use client";

import { useState, useCallback } from "react";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
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
    <div
      className={`${cardClass} px-3 py-2 shadow-lg`}
    >
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
  const [checkInterval, setCheckInterval] = useState<"1" | "5" | "15">("5");
  const [responseThreshold, setResponseThreshold] = useState("1s");
  const [hoveredDot, setHoveredDot] = useState<{ siteId: string; dayIndex: number } | null>(null);

  /* ── shared styles ── */
  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  /* ── derived values ── */
  const sitesWithIssues = MONITORED_SITES.filter((s) => s.status !== "up");
  const overallUptime =
    Math.round(
      (MONITORED_SITES.reduce((sum, s) => sum + s.uptime, 0) / MONITORED_SITES.length) * 100
    ) / 100;
  const chartData = RESPONSE_TIME_DATA[timeRange];
  const avgValue = chartData[0]?.avg ?? 0;

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

  const timeRangeOptions: ("24h" | "7d" | "30d" | "90d")[] = ["24h", "7d", "30d", "90d"];
  const intervalOptions: { value: "1" | "5" | "15"; label: string }[] = [
    { value: "1", label: "1 min" },
    { value: "5", label: "5 min" },
    { value: "15", label: "15 min" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Uptime Monitoring
          </h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            Monitor site availability and response times
          </p>
        </div>

        {/* ────────── SECTION 1 — Overall Status Banner ────────── */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-4">
            {/* Shield / check icon */}
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
                sitesWithIssues.length === 0
                  ? "bg-emerald-500/10"
                  : "bg-rose-500/10"
              }`}
            >
              {sitesWithIssues.length === 0 ? (
                <svg
                  className="w-7 h-7 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7 text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M12 2.944a11.955 11.955 0 018.618 3.04A12.02 12.02 0 0121 9c0 5.591-3.824 10.29-9 11.622C6.824 19.29 3 14.591 3 9c0-1.042.133-2.052.382-3.016A11.955 11.955 0 0112 2.944z"
                  />
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
        </div>

        {/* ────────── SECTION 2 — Sites Grid ────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MONITORED_SITES.map((site) => {
            const colors = STATUS_COLORS[site.status];
            return (
              <div key={site.id} className={`${cardClass} p-4`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-semibold ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    {site.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${colors.bg} ${colors.text} ${colors.ring}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {STATUS_LABELS[site.status]}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className={labelClass}>Uptime</p>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? "text-slate-800" : "text-slate-100"
                      }`}
                    >
                      {site.uptime}%
                    </p>
                  </div>
                  <div>
                    <p className={labelClass}>Avg Response</p>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? "text-slate-800" : "text-slate-100"
                      }`}
                    >
                      {site.avgResponse} ms
                    </p>
                  </div>
                </div>

                {/* 30-day status dots */}
                <div className="flex gap-1 flex-wrap">
                  {site.dailyStatus.map((day, i) => (
                    <div
                      key={day.date}
                      className="relative"
                      onMouseEnter={() => handleDotEnter(site.id, i)}
                      onMouseLeave={handleDotLeave}
                    >
                      <div
                        className={`w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                          STATUS_COLORS[day.status].dot
                        }`}
                      />
                      {hoveredDot?.siteId === site.id && hoveredDot?.dayIndex === i && (
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 ${cardClass} px-3 py-2 shadow-lg whitespace-nowrap`}
                        >
                          <p
                            className={`text-xs font-medium ${
                              isLight ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {day.date}
                          </p>
                          <p
                            className={`text-xs ${
                              isLight ? "text-slate-700" : "text-slate-200"
                            }`}
                          >
                            Uptime: {day.uptime}%
                          </p>
                          <p
                            className={`text-xs ${
                              isLight ? "text-slate-700" : "text-slate-200"
                            }`}
                          >
                            Response: {day.responseTime} ms
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ────────── SECTION 3 — Response Time Chart ────────── */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-lg font-semibold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Response Time
            </h3>

            {/* Time range pills */}
            <div
              className={`inline-flex rounded-xl p-1 ${
                isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"
              }`}
            >
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

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e2e8f0" : "#1e293b"}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#475569" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#475569" }}
                tickLine={false}
                axisLine={false}
                unit="ms"
              />
              <RechartsTooltip
                content={<CustomTooltip isLight={isLight} cardClass={cardClass} />}
              />
              <ReferenceLine
                y={avgValue}
                stroke={isLight ? "#94a3b8" : "#475569"}
                strokeDasharray="5 5"
                label={{
                  value: "Avg",
                  position: "right",
                  fontSize: 11,
                  fill: isLight ? "#94a3b8" : "#475569",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ────────── SECTION 4 — Incident History ────────── */}
        <div className={`${cardClass} p-6`}>
          <h3
            className={`text-lg font-semibold mb-6 ${
              isLight ? "text-slate-800" : "text-slate-100"
            }`}
          >
            Incident History
          </h3>

          <div
            className={`relative pl-6 border-l-2 ${
              isLight ? "border-slate-200" : "border-slate-700"
            }`}
          >
            {INCIDENTS.map((inc, idx) => {
              const dotColor =
                inc.status === "resolved" ? "bg-emerald-400" : "bg-amber-400";
              const statusBg =
                inc.status === "resolved"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400";

              return (
                <div
                  key={inc.id}
                  className={`relative ${idx < INCIDENTS.length - 1 ? "pb-8" : ""}`}
                >
                  {/* Dot on the line */}
                  <div
                    className={`absolute -left-[7px] w-3 h-3 rounded-full ${dotColor} ring-4 ${
                      isLight ? "ring-white" : "ring-[var(--gradient-card-from)]"
                    }`}
                    style={{ top: "4px", left: "-31px" }}
                  />

                  {/* Date */}
                  <p
                    className={`font-semibold text-sm ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    {inc.date}
                  </p>

                  {/* Duration badge */}
                  <span
                    className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                      isLight
                        ? "bg-slate-100 text-slate-600"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {inc.duration}
                  </span>

                  {/* Affected sites */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {inc.sites.map((site) => (
                      <span
                        key={site}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isLight
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {site}
                      </span>
                    ))}
                  </div>

                  {/* Root cause */}
                  <p
                    className={`text-sm mt-2 ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {inc.rootCause}
                  </p>

                  {/* Status badge */}
                  <span
                    className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBg}`}
                  >
                    {inc.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ────────── SECTION 5 — Alert Configuration ────────── */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Configure Alerts
            <svg
              className={`w-4 h-4 transition-transform ${alertsOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {alertsOpen && (
            <div className={`${cardClass} p-6 mt-4 space-y-6`}>
              {/* Email notifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm font-medium ${
                      isLight ? "text-slate-700" : "text-slate-200"
                    }`}
                  >
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

              {/* Check interval */}
              <div>
                <label className={labelClass}>Check Interval</label>
                <div
                  className={`inline-flex rounded-xl p-1 mt-1 ${
                    isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"
                  }`}
                >
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
                  <svg
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                      isLight ? "text-slate-400" : "text-slate-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveAlerts}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                  accent.button ?? "bg-emerald-500"
                } ${accent.buttonHover ?? "hover:bg-emerald-600"}`}
              >
                Save Configuration
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
