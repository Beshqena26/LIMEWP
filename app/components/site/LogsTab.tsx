"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { Button, Chip } from "@heroui/react";
import { showToast } from "@/lib/toast";
import { logStats, logColorMap, logEntries, logTypeOptions } from "@/data/site/logs";
import { NoLogs } from "../empty-states";

interface LogsTabProps {
  siteId: string;
}

export function LogsTab({ siteId }: LogsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const [logType, setLogType] = useState("error");

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {logStats.map((stat) => {
          const colors = logColorMap[stat.color];
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
                </div>
                <div className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Log Type Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
          }`}>
            {logTypeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setLogType(option.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  logType === option.key
                    ? "bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                    : isLight
                      ? "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d={option.icon} />
                </svg>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
              variant="bordered"
              size="sm"
              isIconOnly
              aria-label="Refresh logs"
              onPress={() => showToast.success("Logs refreshed")}
              className={`font-medium ${isLight ? "text-slate-700 border-slate-300 hover:border-slate-400" : "text-slate-300 border-[var(--border-primary)] hover:border-slate-500"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </Button>

          <Button
              variant="bordered"
              size="sm"
              onPress={() => showToast.warning("Logs cleared")}
              className="font-medium text-slate-300 border-[var(--border-primary)] hover:border-rose-500/50 hover:text-rose-400"
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              }
            >
              Clear
            </Button>

          <Button
            variant="bordered"
            size="sm"
            onPress={() => showToast.success("Logs downloaded")}
            className={`font-medium ${isLight ? "text-slate-700 border-slate-300 hover:border-slate-400" : "text-slate-300 border-[var(--border-primary)] hover:border-slate-500"}`}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            }
          >
            Download
          </Button>
        </div>
      </div>

      {/* Log Entries */}
      <div className={`relative border rounded-2xl overflow-hidden ${
        isLight
          ? "bg-white border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        {/* Header */}
        <div className={`relative px-5 py-4 border-b ${
          isLight
            ? "border-slate-200 bg-slate-50"
            : "border-[var(--border-tertiary)] bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-elevated)]"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Log Entries</h3>
                <p className="text-[11px] text-slate-500">Showing {logEntries.length} most recent entries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Auto-refresh: </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md ring-1 ring-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                On
              </span>
            </div>
          </div>
        </div>

        {/* Log List */}
        {logEntries.length === 0 ? (
          <NoLogs />
        ) : (
        <div className={`relative divide-y ${isLight ? "divide-slate-200" : "divide-[var(--border-tertiary)]"}`}>
          {logEntries.map((log) => {
            const colors = logColorMap[log.color];
            return (
              <div
                key={log.id}
                className={`group relative flex items-start gap-4 px-5 py-4 border-l-4 ${colors.border} transition-all cursor-pointer ${
                  isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Level Badge */}
                <div className={`flex-shrink-0 w-20`}>
                  <Chip
                    size="sm"
                    classNames={{
                      base: `${colors.bg} border-0`,
                      content: `${colors.text} font-bold text-[10px] font-mono px-0`
                    }}
                  >
                    {log.level}
                  </Chip>
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className={`font-mono text-sm break-all leading-relaxed mb-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {log.message}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {log.file && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="font-mono truncate max-w-[200px]">{log.file}</span>
                        {log.line && <span className="text-slate-600">:{log.line}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-slate-500 font-mono">{log.time}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{log.date}</div>
                </div>

                {/* Hover Actions */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <button aria-label="Copy to clipboard" onClick={() => showToast.success("Log entry copied")} className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ring-1 ${
                    isLight
                      ? "bg-white/90 hover:bg-slate-100 ring-slate-200"
                      : "bg-[var(--bg-elevated)]/90 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
                  }`}>
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    </button>

                  <button aria-label="View details" className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ring-1 ${
                    isLight
                      ? "bg-white/90 hover:bg-slate-100 ring-slate-200"
                      : "bg-[var(--bg-elevated)]/90 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
                  }`}>
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Footer */}
        <div className={`relative border-t bg-gradient-to-t from-violet-500/[0.02] to-transparent ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <button className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group/btn">
            <span>Load more entries</span>
            <svg className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
