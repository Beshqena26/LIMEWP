"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Progress } from "@heroui/react";

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
  if (pct >= 90) return { bar: "bg-rose-500", spark: "#f43f5e", label: "text-rose-500" };
  if (pct >= 70) return { bar: "bg-amber-500", spark: "#f59e0b", label: "text-amber-500" };
  return { bar: "bg-emerald-500", spark: "#10b981", label: "text-emerald-500" };
}

/* ────────────── component ────────────── */

export default function ServerManagementPage() {
  const params = useParams();
  const siteId = params.siteId as string;
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
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  return (
    <AppShell>
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

      {/* SECTION 4 - Quick Actions (top for easy access) */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Restart PHP", loading: restartingPhp, setLoading: setRestartingPhp, icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M15.015 4.36V9.35h4.992" },
          { label: "Restart Nginx", loading: restartingNginx, setLoading: setRestartingNginx, icon: "M5.636 5.636a9 9 0 1012.728 0M12 3v9" },
          { label: "Clear OPcache", loading: clearingCache, setLoading: setClearingCache, icon: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" },
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
              </svg>
            )}
            {action.loading ? `${action.label}…` : action.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* SECTION 1 - PHP Configuration */}
        <div className={cardClass}>
          <div className="p-6">
            <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              PHP Configuration
            </h2>

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
                    Saving…
                  </>
                ) : (
                  "Save PHP Settings"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2 - Server Info */}
        <div className={cardClass}>
          <div className="p-6">
            <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Server Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {SERVER_INFO.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl p-4 border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                  }`}
                >
                  <p className={labelClass}>{item.label}</p>
                  <p className={`text-sm font-semibold mt-1 ${item.mono ? "font-mono" : ""} ${
                    isLight ? "text-slate-800" : "text-slate-100"
                  }`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 - Resource Usage */}
      <div className={cardClass}>
        <div className="p-6">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Resource Usage
            <span className={`text-xs font-normal ml-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Last 24 hours</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RESOURCE_USAGE.map((res) => {
              const pct = (res.used / res.total) * 100;
              const colors = getUsageColor(pct);

              return (
                <div
                  key={res.label}
                  className={`rounded-xl p-4 border ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {res.label}
                    </span>
                    <span className={`text-xs font-bold ${colors.label}`}>
                      {Math.round(pct)}%
                    </span>
                  </div>

                  <Progress
                    size="sm"
                    value={pct}
                    classNames={{
                      base: "h-2 mb-3",
                      track: isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]",
                      indicator: colors.bar,
                    }}
                  />

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
    </AppShell>
  );
}
