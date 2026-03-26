"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { logStats, logColorMap, logEntries, LOG_SOURCES, LOG_STACK_TRACES, type LogEntry } from "@/data/site/logs";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

interface LogsTabProps {
  siteId: string;
}

const ITEMS_PER_PAGE = 15;

const LEVEL_COLORS: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  ERROR: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", dot: "bg-rose-400" },
  WARNING: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", dot: "bg-amber-400" },
  INFO: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", dot: "bg-sky-400" },
  SUCCESS: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", dot: "bg-emerald-400" },
};

export function LogsTab({ siteId }: LogsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [activeSource, setActiveSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilters, setLevelFilters] = useState<Record<string, boolean>>({ ERROR: true, WARNING: true, INFO: true, SUCCESS: true });
  const [dateRange, setDateRange] = useState<"today" | "24h" | "7d" | "30d">("7d");
  const [liveTail, setLiveTail] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>(logEntries);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (activeSource === "error" && log.level !== "ERROR") return false;
      if (activeSource === "php" && !log.file.includes(".php")) return false;
      if (activeSource === "access" && log.level !== "SUCCESS" && !log.message.toLowerCase().includes("logged")) return false;
      if (activeSource === "nginx" && !log.file.toLowerCase().includes("system") && !log.file.toLowerCase().includes("nginx")) return false;
      if (activeSource === "slow" && !log.message.toLowerCase().includes("time") && !log.message.toLowerCase().includes("exceeded")) return false;
      if (!levelFilters[log.level]) return false;
      if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && !log.file.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (dateRange === "today" && log.date !== "Today") return false;
      if (dateRange === "24h" && !["Today", "Yesterday"].includes(log.date)) return false;
      return true;
    });
  }, [logs, activeSource, levelFilters, searchQuery, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    setShowClearConfirm(false);
    showToast.success("All logs cleared");
  }, []);

  const handleCopyLog = useCallback((log: LogEntry) => {
    const text = `[${log.time}] ${log.level} ${log.file}${log.line ? `:${log.line}` : ""}\n${log.message}`;
    navigator.clipboard.writeText(text);
    showToast.success("Log entry copied");
  }, []);

  useEffect(() => { setPage(1); }, [activeSource, searchQuery, dateRange, levelFilters]);

  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;

  const errorCount = logs.filter((l) => l.level === "ERROR").length;
  const warnCount = logs.filter((l) => l.level === "WARNING").length;

  return (
    <>
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {logStats.map((stat) => {
            const colors = logColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={stat.icon} /></svg>
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

        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Log Viewer</h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {filteredLogs.length} entries
              {errorCount > 0 && <span className="text-rose-400"> &bull; {errorCount} errors</span>}
              {warnCount > 0 && <span className="text-amber-400"> &bull; {warnCount} warnings</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg ring-1 ring-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
            <button onClick={() => showToast.success("Logs downloaded")} aria-label="Download logs" className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Download
            </button>
            <button onClick={() => setShowClearConfirm(true)} className={`h-9 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-rose-500 hover:bg-rose-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-rose-400 hover:bg-rose-500/10"}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              Clear
            </button>
          </div>
        </div>

        {/* Source tabs + Filters */}
        <div className={`${cardClass} p-4 mb-5`}>
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {LOG_SOURCES.map((src) => (
              <button key={src.key} onClick={() => setActiveSource(src.key)} className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSource === src.key ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}` : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={src.icon} /></svg>
                {src.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input id="log-search" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search logs..." className={`${inputClass} pl-10 font-mono text-xs`} />
          </div>
        </div>

        {/* Log Table */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`}>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-24 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Level</th>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Message</th>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-48 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Source</th>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-24 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Time</th>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 w-16 ${isLight ? "text-slate-500" : "text-slate-400"}`}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr><td colSpan={5} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No log entries match your filters</td></tr>
                ) : paginatedLogs.map((log) => {
                  const lc = LEVEL_COLORS[log.level] || LEVEL_COLORS.INFO;
                  const hasTrace = !!LOG_STACK_TRACES[log.id];
                  const isExpanded = expandedLog === log.id;
                  return (
                    <tr key={log.id} onClick={() => hasTrace && setExpandedLog(isExpanded ? null : log.id)} className={`border-b last:border-b-0 transition-colors ${hasTrace ? "cursor-pointer" : ""} ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)] hover:bg-[var(--bg-primary)]/50"}`}>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-bold ${lc.bg} ${lc.text} ${lc.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lc.dot}`} />
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className={`text-sm font-mono leading-relaxed ${isLight ? "text-slate-700" : "text-slate-200"}`}>{log.message}</p>
                        {hasTrace && (
                          <button onClick={(e) => { e.stopPropagation(); setExpandedLog(isExpanded ? null : log.id); }} className={`mt-1.5 flex items-center gap-1 text-[10px] font-medium ${isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"}`} aria-expanded={isExpanded} aria-label="Toggle stack trace">
                            <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                            Stack trace ({LOG_STACK_TRACES[log.id].length} frames)
                          </button>
                        )}
                        {isExpanded && LOG_STACK_TRACES[log.id] && (
                          <div className={`mt-2 p-3 rounded-xl font-mono text-[11px] leading-relaxed space-y-0.5 ${isLight ? "bg-slate-100 text-slate-600" : "bg-[#0d1117] text-slate-400"}`}>
                            {LOG_STACK_TRACES[log.id].map((frame, i) => (
                              <div key={i} className="break-all">{frame}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>{log.file}</span>
                        {log.line && <span className={`text-xs font-mono ${isLight ? "text-slate-400" : "text-slate-500"}`}>:{log.line}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-xs font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>{log.time}</div>
                        <div className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>{log.date}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); handleCopyLog(log); }} aria-label="Copy log entry" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLogs.length > ITEMS_PER_PAGE && (
            <div className={`flex items-center justify-between px-4 py-3 border-t ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`}>
              <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${isLight ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--border-primary)]"}`}>Prev</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${isLight ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--border-primary)]"}`}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearLogs}
        title="Clear all logs?"
        message="This will permanently delete all log entries. This action cannot be undone."
        confirmText="Clear Logs"
        variant="danger"
      />
    </>
  );
}
