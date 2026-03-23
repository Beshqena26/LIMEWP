"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  analyticsStats,
  analyticsColorMap,
  topPages,
  trafficSources,
  TRAFFIC_DATA,
  DEVICE_DATA,
  GEO_DATA,
  WEB_VITALS,
  ERRORS_404,
  SEARCH_QUERIES,
  BANDWIDTH,
  REALTIME_VISITORS,
} from "@/data/site/analytics";

/* ────────────── Helpers ────────────── */

function countryFlag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
}

/* ────────────── Custom Tooltip ────────────── */

function ChartTooltip({ active, payload, label, isLight }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className={`rounded-xl border px-3 py-2 shadow-lg ${
        isLight
          ? "bg-white border-slate-200"
          : "bg-[var(--bg-primary)] border-[var(--border-tertiary)]"
      }`}
    >
      <p
        className={`text-xs font-medium mb-1 ${
          isLight ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      {payload.map((entry: any) => (
        <p
          key={entry.name}
          className={`text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}
        >
          <span style={{ color: entry.color }}>●</span> {entry.name}:{" "}
          <span className="font-semibold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ────────────── Component ────────────── */

interface AnalyticsTabProps {
  siteId: string;
}

export function AnalyticsTab({ siteId }: AnalyticsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  /* ── shared styles ── */
  const cardClass = `relative border rounded-2xl overflow-hidden transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const thClass = `text-[11px] font-semibold uppercase tracking-wider ${
    isLight ? "text-slate-400" : "text-slate-500"
  }`;

  const timeRanges: { key: "7d" | "30d" | "90d"; label: string }[] = [
    { key: "7d", label: "7D" },
    { key: "30d", label: "30D" },
    { key: "90d", label: "90D" },
  ];

  return (
    <div>
      {/* ── 1. Header Row ── */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-lg font-bold ${
            isLight ? "text-slate-800" : "text-slate-100"
          }`}
        >
          Analytics
        </h2>
        <div className="flex items-center gap-4">
          {/* Real-time indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-300"
              }`}
            >
              {REALTIME_VISITORS} visitors online now
            </span>
          </div>
          {/* Export CSV */}
          <button
            onClick={() => showToast.success("CSV export started")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── 2. Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsStats.map((stat) => {
          const colors = analyticsColorMap[stat.color];
          return (
            <div
              key={stat.label}
              className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-slate-200 hover:border-slate-300"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={stat.icon} />
                    </svg>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                      stat.positive
                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 ${stat.positive ? "" : "rotate-180"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                    {stat.change}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold mb-1 ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className={`text-[10px] ${colors.text} mt-1`}>
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Traffic Chart (full width) ── */}
      <div className={`${cardClass} mb-5`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-500/[0.04] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

        <div
          className={`relative p-5 border-b ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Traffic Overview
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visitors &amp; page views
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {timeRanges.map((tr) => (
                <button
                  key={tr.key}
                  onClick={() => setTimeRange(tr.key)}
                  className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    timeRange === tr.key
                      ? `${accent.text} ${accent.bg} ring-1 ${accent.ring}`
                      : isLight
                        ? "text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200"
                        : "text-slate-400 hover:text-slate-200 bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)]"
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative p-5">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={TRAFFIC_DATA[timeRange]}>
              <defs>
                <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e2e8f0" : "rgba(255,255,255,0.06)"}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: isLight ? "#94a3b8" : "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <RechartsTooltip
                content={<ChartTooltip isLight={isLight} />}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradVisitors)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#gradPageViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 4. Traffic Sources + Device Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Traffic Sources */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Traffic Sources
                </h3>
                <p className="text-[11px] text-slate-500">
                  Where visitors come from
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-4 space-y-3">
            {trafficSources.map((source) => {
              const colors = analyticsColorMap[source.color];
              return (
                <div
                  key={source.source}
                  className={`group flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={source.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-sm font-medium ${
                          isLight ? "text-slate-700" : "text-slate-200"
                        }`}
                      >
                        {source.source}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isLight ? "text-slate-800" : "text-slate-100"
                        }`}
                      >
                        {source.visits}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                          isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"
                        }`}
                      >
                        <div
                          className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                          style={{ width: `${source.pct}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-semibold ${colors.text}`}
                      >
                        {source.pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-sky-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Device Breakdown
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visitors by device type
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-5 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DEVICE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {DEVICE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3">
              {DEVICE_DATA.map((device) => (
                <div key={device.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isLight ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    {device.name}
                  </span>
                  <span className="text-xs text-slate-500">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Top Pages + Geographic Data ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Top Pages */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    Top Pages
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Most visited pages
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
                <span>View all</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`relative divide-y ${
              isLight
                ? "divide-slate-200"
                : "divide-[var(--border-tertiary)]"
            }`}
          >
            {topPages.map((page, index) => (
              <div
                key={page.page}
                className={`group flex items-center gap-4 px-5 py-4 transition-colors ${
                  isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ring-1 flex items-center justify-center flex-shrink-0 ${
                    isLight
                      ? "bg-slate-100 ring-slate-200"
                      : "bg-[var(--bg-elevated)] ring-[var(--border-primary)]"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium truncate ${
                        isLight ? "text-slate-700" : "text-slate-200"
                      }`}
                    >
                      {page.title}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {page.page}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-1 h-1 rounded-full overflow-hidden max-w-[200px] ${
                        isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <div
                        className="h-full bg-sky-500/30 rounded-full transition-all duration-500"
                        style={{ width: `${page.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-sm font-semibold ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    {page.views}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {page.pct}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Data */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Geographic Data
                </h3>
                <p className="text-[11px] text-slate-500">
                  Top countries by visitors
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-4 space-y-2">
            {GEO_DATA.map((geo) => (
              <div
                key={geo.country}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-lg">{countryFlag(geo.flag)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-sm font-medium ${
                        isLight ? "text-slate-700" : "text-slate-200"
                      }`}
                    >
                      {geo.country}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isLight ? "text-slate-800" : "text-slate-100"
                      }`}
                    >
                      {geo.visitors}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                        isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <div
                        className="h-full bg-emerald-500/30 rounded-full transition-all duration-500"
                        style={{ width: `${geo.pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {geo.pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Core Web Vitals ── */}
      <div className={`${cardClass} mb-5`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div
          className={`relative p-5 border-b ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${
                  isLight ? "text-slate-800" : "text-slate-100"
                }`}
              >
                Core Web Vitals
              </h3>
              <p className="text-[11px] text-slate-500">
                Performance metrics from field data
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WEB_VITALS.map((vital) => {
            const scoreColors = {
              good: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
              "needs-improvement":
                "bg-amber-500/10 text-amber-400 ring-amber-500/20",
              poor: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
            };
            const scoreLabels = {
              good: "Good",
              "needs-improvement": "Needs Work",
              poor: "Poor",
            };
            return (
              <div
                key={vital.name}
                className={`p-4 rounded-xl border ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-[var(--bg-elevated)] border-[var(--border-primary)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-bold ${
                      isLight ? "text-slate-800" : "text-slate-100"
                    }`}
                  >
                    {vital.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${scoreColors[vital.score]}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        vital.score === "good"
                          ? "bg-emerald-400"
                          : vital.score === "needs-improvement"
                            ? "bg-amber-400"
                            : "bg-rose-400"
                      }`}
                    />
                    {scoreLabels[vital.score]}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold mb-1 ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  {vital.value}
                </div>
                <p className="text-[11px] text-slate-500">{vital.label}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Target: {vital.target}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 7. 404 Errors + Search Queries ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* 404 Errors */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/20 text-rose-400 ring-1 ring-rose-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  404 Errors
                </h3>
                <p className="text-[11px] text-slate-500">
                  Broken links &amp; missing pages
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className={`border-b ${
                    isLight
                      ? "border-slate-200"
                      : "border-[var(--border-tertiary)]"
                  }`}
                >
                  <th className={`${thClass} px-5 py-3`}>URL</th>
                  <th className={`${thClass} px-3 py-3`}>Hits</th>
                  <th className={`${thClass} px-3 py-3`}>Last Seen</th>
                  <th className={`${thClass} px-3 py-3`}>Referrer</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLight
                    ? "divide-slate-200"
                    : "divide-[var(--border-tertiary)]"
                }`}
              >
                {ERRORS_404.map((err) => (
                  <tr
                    key={err.url}
                    className={`transition-colors ${
                      isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-mono ${
                          isLight ? "text-slate-700" : "text-slate-200"
                        }`}
                      >
                        {err.url}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs font-semibold ${
                          isLight ? "text-slate-800" : "text-slate-100"
                        }`}
                      >
                        {err.hits}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">
                        {err.lastSeen}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">
                        {err.referrer}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search Queries */}
        <div className={cardClass}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div
            className={`relative p-5 border-b ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-400 ring-1 ring-amber-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Search Queries
                </h3>
                <p className="text-[11px] text-slate-500">
                  Top organic search terms
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className={`border-b ${
                    isLight
                      ? "border-slate-200"
                      : "border-[var(--border-tertiary)]"
                  }`}
                >
                  <th className={`${thClass} px-5 py-3`}>Query</th>
                  <th className={`${thClass} px-3 py-3`}>Clicks</th>
                  <th className={`${thClass} px-3 py-3`}>Impr.</th>
                  <th className={`${thClass} px-3 py-3`}>CTR</th>
                  <th className={`${thClass} px-3 py-3`}>Pos.</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLight
                    ? "divide-slate-200"
                    : "divide-[var(--border-tertiary)]"
                }`}
              >
                {SEARCH_QUERIES.map((sq) => (
                  <tr
                    key={sq.query}
                    className={`transition-colors ${
                      isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium ${
                          isLight ? "text-slate-700" : "text-slate-200"
                        }`}
                      >
                        {sq.query}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs font-semibold ${
                          isLight ? "text-slate-800" : "text-slate-100"
                        }`}
                      >
                        {sq.clicks}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">
                        {sq.impressions}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">{sq.ctr}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-500">
                        {sq.position}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 8. Bandwidth ── */}
      <div className={cardClass}>
        <div className="relative p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}
                >
                  Bandwidth Usage
                </h3>
                <p className="text-[11px] text-slate-500">
                  {BANDWIDTH.used} {BANDWIDTH.unit} of {BANDWIDTH.total}{" "}
                  {BANDWIDTH.unit} used
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              {Math.round((BANDWIDTH.used / BANDWIDTH.total) * 100)}%
            </span>
          </div>
          <div
            className={`w-full h-3 rounded-full overflow-hidden ${
              isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${(BANDWIDTH.used / BANDWIDTH.total) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
