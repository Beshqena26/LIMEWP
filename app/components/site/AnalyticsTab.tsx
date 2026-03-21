"use client";

import { Button } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { analyticsStats, analyticsColorMap, topPages, trafficSources } from "@/data/site/analytics";

interface AnalyticsTabProps {
  siteId: string;
}

export function AnalyticsTab({ siteId }: AnalyticsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsStats.map((stat) => {
          const colors = analyticsColorMap[stat.color];
          return (
            <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
              isLight
                ? "bg-white border-slate-200 hover:border-slate-300"
                : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={stat.icon} />
                    </svg>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${stat.positive ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"}`}>
                    <svg className={`w-3 h-3 ${stat.positive ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                    {stat.change}
                  </span>
                </div>
                <div className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Traffic Chart Placeholder */}
        <div className={`relative border rounded-2xl overflow-hidden ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-500/[0.04] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className={`relative p-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Traffic Overview</h3>
                  <p className="text-[11px] text-slate-500">Last 30 days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  isLight
                    ? "text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200"
                    : "text-slate-400 hover:text-slate-200 bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)]"
                }`}>7D</button>
                <button className="text-[11px] font-medium text-emerald-400 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">30D</button>
                <button className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  isLight
                    ? "text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200"
                    : "text-slate-400 hover:text-slate-200 bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)]"
                }`}>90D</button>
              </div>
            </div>
          </div>

          <div className="relative h-52 flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-sky-500/15 flex items-center justify-center ring-1 ring-emerald-500/20">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Chart coming soon</span>
            <span className="text-xs text-slate-500">Interactive traffic visualization</span>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={`relative border rounded-2xl overflow-hidden ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
        }`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div className={`relative p-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Traffic Sources</h3>
                <p className="text-[11px] text-slate-500">Where visitors come from</p>
              </div>
            </div>
          </div>

          <div className="relative p-4 space-y-3">
            {trafficSources.map((source) => {
              const colors = analyticsColorMap[source.color];
              return (
                <div key={source.source} className={`group flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                }`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={source.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{source.source}</span>
                      <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{source.visits}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                        <div className={`h-full ${colors.bg} rounded-full transition-all duration-500`} style={{ width: `${source.pct}%` }} />
                      </div>
                      <span className={`text-[11px] font-semibold ${colors.text}`}>{source.pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className={`relative border rounded-2xl overflow-hidden ${
        isLight
          ? "bg-white border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className={`relative p-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Top Pages</h3>
                <p className="text-[11px] text-slate-500">Most visited pages</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
              <span>View all</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`relative divide-y ${isLight ? "divide-slate-200" : "divide-[var(--border-tertiary)]"}`}>
          {topPages.map((page, index) => (
            <div key={page.page} className={`group flex items-center gap-4 px-5 py-4 transition-colors ${
              isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
            }`}>
              <div className={`w-8 h-8 rounded-lg ring-1 flex items-center justify-center flex-shrink-0 ${
                isLight ? "bg-slate-100 ring-slate-200" : "bg-[var(--bg-elevated)] ring-[var(--border-primary)]"
              }`}>
                <span className={`text-xs font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{page.title}</span>
                  <span className="text-xs text-slate-500 font-mono">{page.page}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-1 rounded-full overflow-hidden max-w-[200px] ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                    <div className="h-full bg-sky-500/30 rounded-full transition-all duration-500" style={{ width: `${page.pct}%` }} />
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{page.views}</div>
                <div className="text-[11px] text-slate-500">{page.pct}% of total</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
