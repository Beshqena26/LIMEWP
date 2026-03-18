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

// Circular progress component
function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  isLight
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  isLight: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value < 50) return "stroke-emerald-500";
    if (value < 80) return "stroke-amber-500";
    return "stroke-red-500";
  };

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={isLight ? "stroke-zinc-100" : "stroke-zinc-800"}
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

export function OverviewTab() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Theme classes
  const cardBg = isLight ? "bg-white" : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d]";
  const cardBorder = isLight ? "border-zinc-200" : "border-[#2A2A2E]";
  const dividerBorder = isLight ? "border-zinc-100" : "border-[#2A2A2E]";
  const textPrimary = isLight ? "text-zinc-900" : "text-zinc-100";
  const textSecondary = isLight ? "text-zinc-500" : "text-zinc-500";
  const textTertiary = isLight ? "text-zinc-400" : "text-zinc-600";
  const subtleBg = isLight ? "bg-zinc-50" : "bg-zinc-800/50";
  const hoverBg = isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]";

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${cardBg} ${cardBorder}`}>
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

      {/* Section 1: Subscription Usage */}
      <div className="relative p-6">
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

        <div className="grid grid-cols-5 gap-4">
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

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 2: Performance */}
      <div className="relative p-6">
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
                  isLight ? "bg-zinc-50 hover:bg-zinc-100" : "bg-zinc-800/30 hover:bg-zinc-800/50"
                }`}
              >
                {/* Subtle glow */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${colorClasses.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-5 h-5 ${colorClasses.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 3: Server Details */}
      <div className="relative p-6">
        <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Server</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVER_INFO.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isLight ? "bg-zinc-50 hover:bg-zinc-100" : "bg-zinc-800/30 hover:bg-zinc-800/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isLight ? "bg-zinc-200/50" : "bg-zinc-700/50"
              }`}>
                <svg className={`w-4 h-4 ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 4: Recent Activity */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textPrimary}`}>Activity</span>
          <button className={`text-xs ${textTertiary} hover:${textSecondary} transition-colors`}>
            View all
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
