"use client";

import { useTheme } from "@/lib/context/ThemeContext";

// Subscription/Plan usage
const SUBSCRIPTION = {
  plan: "Business",
  renewsAt: "Mar 15, 2026",
  metrics: [
    { label: "Visitors", used: 8700, total: 10000, unit: "" },
    { label: "Storage", used: 1.2, total: 10, unit: "GB" },
    { label: "Bandwidth", used: 3.2, total: 40, unit: "GB" },
    { label: "CPU", used: 0.44, total: 2, unit: "vCPU" },
    { label: "RAM", used: 520, total: 4096, unit: "MB" },
  ],
};

// Performance metrics with icons and colors
const PERFORMANCE = [
  {
    label: "Uptime",
    value: "99.98",
    unit: "%",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "emerald"
  },
  {
    label: "Response",
    value: "45",
    unit: "ms",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    color: "amber"
  },
  {
    label: "Speed",
    value: "92",
    unit: "/100",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    color: "violet"
  },
  {
    label: "Security",
    value: "A",
    unit: "",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    color: "cyan"
  },
];

// Server info with icons
const SERVER_INFO = [
  { label: "IP Address", value: "34.89.42.178", mono: true, icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" },
  { label: "Region", value: "US East", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" },
  { label: "WordPress", value: "6.7.1", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
  { label: "PHP", value: "8.3.4", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
  { label: "MySQL", value: "8.0.40", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
  { label: "SSL", value: "324 days", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" },
];

// Recent activity (trimmed)
const ACTIVITY = [
  { action: "Backup completed", detail: "312 MB", time: "1h ago" },
  { action: "Cache cleared", detail: "Redis flush", time: "4h ago" },
  { action: "Plugin updated", detail: "WooCommerce 9.5", time: "1d ago" },
  { action: "PHP updated", detail: "8.3.4", time: "2d ago" },
];

// New data constants
const HEALTH_SCORE = 88;

const SITE_QUICK_INFO = [
  { label: "WordPress", value: "6.7.1", status: "update", update: "6.7.2" },
  { label: "Plugins", value: "12 active", badge: "3 updates" },
  { label: "Theme", value: "Flavor Starter" },
  { label: "SSL", value: "324 days" },
];

const TRAFFIC_24H = { visitors: 342, pageViews: 1245, pagesPerVisit: 2.8 };

const SECURITY_STATUS = [
  { label: "Firewall", value: "Active", color: "emerald" },
  { label: "2FA Users", value: "3 / 5", color: "sky" },
  { label: "Last Scan", value: "2 hours ago", color: "violet" },
  { label: "Blocked IPs", value: "6 today", color: "rose" },
];

const DISK_USAGE = [
  { label: "WordPress Core", size: 280, color: "bg-sky-500" },
  { label: "Media Uploads", size: 620, color: "bg-violet-500" },
  { label: "Database", size: 180, color: "bg-amber-500" },
  { label: "Plugins & Themes", size: 120, color: "bg-emerald-500" },
];
const DISK_TOTAL = DISK_USAGE.reduce((s, d) => s + d.size, 0);

const RECENT_ERRORS = [
  { level: "error", message: "PHP Fatal: undefined function wp_get_current_user()", time: "2h ago" },
  { level: "warning", message: "Deprecated: create_function() is deprecated", time: "9h ago" },
  { level: "error", message: "Database connection timeout after 30s", time: "1d ago" },
];

// Circular progress component
function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  isLight,
  highIsGood = false,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  isLight: boolean;
  highIsGood?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (highIsGood) {
      if (value >= 70) return "stroke-emerald-500";
      if (value >= 40) return "stroke-amber-500";
      return "stroke-red-500";
    }
    if (value < 50) return "stroke-emerald-500";
    if (value < 80) return "stroke-amber-500";
    return "stroke-red-500";
  };

  return (
    <svg aria-hidden="true" width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={isLight ? "stroke-slate-100" : "stroke-slate-800"}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`${getColor()} transition-all duration-500`}
      />
    </svg>
  );
}

export function OverviewTab({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Theme classes
  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const textPrimary = isLight ? "text-slate-900" : "text-slate-100";
  const textSecondary = isLight ? "text-slate-500" : "text-slate-500";
  const textTertiary = isLight ? "text-slate-400" : "text-slate-600";
  const hoverBg = isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]";
  const linkClass = "text-xs text-violet-400 hover:text-violet-300 transition-colors";

  return (
    <div className="space-y-5">
      {/* Site Health + Quick Info */}
      <div className={`${cardClass} p-6`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Health Score */}
          <div className="relative flex-shrink-0">
            <CircularProgress value={HEALTH_SCORE} size={80} strokeWidth={6} isLight={isLight} highIsGood />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-bold tabular-nums ${textPrimary}`}>{HEALTH_SCORE}</span>
              <span className={`text-[9px] uppercase tracking-wider ${textTertiary}`}>Health</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {SITE_QUICK_INFO.map((info) => (
              <div key={info.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${isLight ? "bg-slate-50" : "bg-slate-800/30"}`}>
                {info.label === "WordPress" && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${info.status === "update" ? "bg-amber-500" : "bg-emerald-500"}`} />}
                {info.label === "SSL" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                <span className={`font-medium ${textPrimary}`}>{info.label === "WordPress" ? `WP ${info.value}` : info.value}</span>
                {info.status === "update" && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isLight ? "bg-amber-100 text-amber-600" : "bg-amber-500/10 text-amber-400"}`}>Update available</span>}
                {info.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isLight ? "bg-violet-100 text-violet-600" : "bg-violet-500/10 text-violet-400"}`}>{info.badge}</span>}
              </div>
            ))}
          </div>

          {/* Site URL */}
          <a href="https://limewp.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-sm font-medium flex-shrink-0 ${textPrimary} hover:text-violet-400 transition-colors`}>
            limewp.com
            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
        </div>
      </div>

      {/* Plan Usage */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${textPrimary}`}>Plan Usage</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/10 text-emerald-400"
            }`}>
              {SUBSCRIPTION.plan}
            </span>
          </div>
          <span className={`text-xs ${textTertiary}`}>
            Renews {SUBSCRIPTION.renewsAt}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {SUBSCRIPTION.metrics.map((metric) => {
            const percentage = Math.round((metric.used / metric.total) * 100);
            const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

            return (
              <div key={metric.label} className="flex flex-col items-center">
                <div className="relative">
                  <CircularProgress value={percentage} size={72} strokeWidth={5} isLight={isLight} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-base font-semibold tabular-nums ${textPrimary}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${textPrimary}`}>{metric.label}</div>
                  <div className={`text-[10px] ${textTertiary} mt-0.5 tabular-nums`}>
                    {formatNumber(metric.used)} / {formatNumber(metric.total)}{metric.unit && ` ${metric.unit}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Performance */}
      <div className={`${cardClass} p-6`}>
        <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Performance</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PERFORMANCE.map((metric) => {
            const colorMap: Record<string, { bg: string; icon: string; glow: string }> = {
              emerald: { bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", icon: "text-emerald-500", glow: "from-emerald-500/10" },
              amber: { bg: isLight ? "bg-amber-50" : "bg-amber-500/10", icon: "text-amber-500", glow: "from-amber-500/10" },
              violet: { bg: isLight ? "bg-violet-50" : "bg-violet-500/10", icon: "text-violet-500", glow: "from-violet-500/10" },
              cyan: { bg: isLight ? "bg-cyan-50" : "bg-cyan-500/10", icon: "text-cyan-500", glow: "from-cyan-500/10" },
            };
            const colorClasses = colorMap[metric.color];

            return (
              <div
                key={metric.label}
                className={`relative group p-4 rounded-xl transition-all overflow-hidden ${
                  isLight ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-800/30 hover:bg-slate-800/50"
                }`}
              >
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${colorClasses.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
                    <svg aria-hidden="true" className={`w-5 h-5 ${colorClasses.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={metric.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-xl font-semibold tabular-nums ${textPrimary}`}>
                        {metric.value}
                      </span>
                      {metric.unit && (
                        <span className={`text-xs ${textSecondary}`}>{metric.unit}</span>
                      )}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider ${textTertiary}`}>
                      {metric.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Traffic Snapshot */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textPrimary}`}>Last 24 hours</span>
          <button onClick={() => onNavigate?.("analytics")} className={linkClass}>
            View analytics
            <span className="ml-0.5">&rarr;</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className={`text-center p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-slate-800/30"}`}>
            <div className={`text-2xl font-semibold tabular-nums ${textPrimary}`}>
              {TRAFFIC_24H.visitors.toLocaleString()}
            </div>
            <div className={`text-[10px] uppercase tracking-wider mt-1 ${textTertiary}`}>Visitors</div>
          </div>
          <div className={`text-center p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-slate-800/30"}`}>
            <div className={`text-2xl font-semibold tabular-nums ${textPrimary}`}>
              {TRAFFIC_24H.pageViews.toLocaleString()}
            </div>
            <div className={`text-[10px] uppercase tracking-wider mt-1 ${textTertiary}`}>Page Views</div>
          </div>
          <div className={`text-center p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-slate-800/30"}`}>
            <div className={`text-2xl font-semibold tabular-nums ${textPrimary}`}>
              {TRAFFIC_24H.pagesPerVisit}
            </div>
            <div className={`text-[10px] uppercase tracking-wider mt-1 ${textTertiary}`}>Pages / Visit</div>
          </div>
        </div>
      </div>

      {/* Section 5: Server Info + Security Status (two columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Server Info */}
        <div className={`${cardClass} p-6`}>
          <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Server</span>
          <div className="grid grid-cols-2 gap-3">
            {SERVER_INFO.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isLight ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-800/30 hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isLight ? "bg-slate-200/50" : "bg-slate-700/50"
                }`}>
                  <svg aria-hidden="true" className={`w-4 h-4 ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className={`text-[10px] uppercase tracking-wider ${textTertiary}`}>
                    {item.label}
                  </div>
                  <div className={`text-sm truncate ${item.mono ? "font-mono" : "font-medium"} ${textPrimary}`}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${textPrimary}`}>Security</span>
            <button onClick={() => onNavigate?.("tools")} className={linkClass}>
              View security
              <span className="ml-0.5">&rarr;</span>
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {SECURITY_STATUS.map((item) => {
              const dotColors: Record<string, string> = {
                emerald: "bg-emerald-500",
                sky: "bg-sky-500",
                violet: "bg-violet-500",
                rose: "bg-rose-500",
              };
              return (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isLight ? "bg-slate-50" : "bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${dotColors[item.color]}`} />
                    <span className={`text-sm ${textPrimary}`}>{item.label}</span>
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${textPrimary}`}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 6: Disk Usage + Recent Errors (two columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Disk Usage */}
        <div className={`${cardClass} p-6`}>
          <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Storage Breakdown</span>

          {/* Stacked horizontal bar */}
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {DISK_USAGE.map((segment) => (
              <div
                key={segment.label}
                className={`${segment.color} transition-all duration-500`}
                style={{ width: `${(segment.size / DISK_TOTAL) * 100}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {DISK_USAGE.map((segment) => (
              <div key={segment.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${segment.color} flex-shrink-0`} />
                <span className={`text-xs ${textSecondary} truncate`}>{segment.label}</span>
                <span className={`text-xs font-medium tabular-nums ml-auto ${textPrimary}`}>
                  {segment.size >= 1000 ? `${(segment.size / 1000).toFixed(1)} GB` : `${segment.size} MB`}
                </span>
              </div>
            ))}
          </div>

          <div className={`mt-3 pt-3 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textTertiary}`}>Total</span>
              <span className={`text-sm font-semibold tabular-nums ${textPrimary}`}>
                {(DISK_TOTAL / 1000).toFixed(1)} GB
              </span>
            </div>
          </div>
        </div>

        {/* Recent Errors */}
        <div className={`${cardClass} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${textPrimary}`}>Recent Errors</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                isLight ? "bg-red-100 text-red-600" : "bg-red-500/10 text-red-400"
              }`}>
                {RECENT_ERRORS.filter((e) => e.level === "error").length + RECENT_ERRORS.filter((e) => e.level === "warning").length}
              </span>
            </div>
            <button onClick={() => onNavigate?.("logs")} className={linkClass}>
              View all logs
              <span className="ml-0.5">&rarr;</span>
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {RECENT_ERRORS.map((err, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 p-3 rounded-xl ${
                  isLight ? "bg-slate-50" : "bg-slate-800/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    err.level === "error" ? "bg-red-500" : "bg-amber-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs leading-snug truncate ${textPrimary}`}>{err.message}</div>
                </div>
                <span className={`text-[10px] tabular-nums flex-shrink-0 ${textTertiary}`}>{err.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 7: Activity */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textPrimary}`}>Activity</span>
          <button onClick={() => onNavigate?.("activity")} className={linkClass}>
            View all
            <span className="ml-0.5">&rarr;</span>
          </button>
        </div>

        <div className="space-y-0.5">
          {ACTIVITY.map((item, index) => (
            <div
              key={index}
              className={`group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-all ${hoverBg}`}
            >
              <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className={`text-sm ${textPrimary} flex-1`}>{item.action}</span>
              <span className={`text-xs ${textTertiary} tabular-nums`}>{item.detail}</span>
              <span className={`text-xs ${textTertiary} tabular-nums w-12 text-right`}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
