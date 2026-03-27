"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";

// --- Mock data (replace with real API calls) ---

const SITE_STATUS = {
  healthy: true,
  lastChecked: "2 minutes ago",
  issues: [] as string[],
  // Example with issues:
  // issues: ["1 plugin needs updating", "Your backup is 3 days old"],
};

const SPEED = { rating: "Fast" as "Fast" | "OK" | "Slow", dots: 4, subtitle: "Your pages load in under 1 second" };
const SECURITY = { protected: true, subtitle: "SSL active, firewall on" };
const UPTIME = { value: "99.98%", subtitle: "Your site has been online all month" };

const STORAGE = { used: 1.2, total: 10, unit: "GB" };
const VISITORS = { thisMonth: 8700, today: 342, trend: "+12%", trendUp: true };

const TODO_ITEMS = [
  { text: "Update WordPress to 6.7.2", action: "Update", priority: "amber" as const },
  { text: "3 plugins have updates available", action: "Update All", priority: "amber" as const },
  { text: "Your last backup was 2 days ago", action: "Back Up Now", priority: "emerald" as const },
  { text: "Review 6 blocked login attempts", action: "View", priority: "amber" as const },
];

const RECENT_ACTIVITY = [
  { text: "Your site was backed up", time: "1 hour ago", color: "bg-violet-500" },
  { text: "Site cache was refreshed", time: "4 hours ago", color: "bg-emerald-500" },
  { text: "A plugin was updated", time: "Yesterday", color: "bg-sky-500" },
  { text: "WordPress was updated", time: "2 days ago", color: "bg-amber-500" },
];

// --- Component ---

export function OverviewTab({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const textPrimary = isLight ? "text-slate-900" : "text-slate-100";
  const textSecondary = isLight ? "text-slate-600" : "text-slate-400";
  const textTertiary = isLight ? "text-slate-500" : "text-slate-500";
  const subtleBg = isLight ? "bg-slate-50" : "bg-slate-800/30";

  const storagePercent = Math.round((STORAGE.used / STORAGE.total) * 100);
  const storageFriendly = storagePercent < 70 ? "You have plenty of space" : storagePercent < 90 ? "Space is getting low" : "Running low on space";

  // --- State ---
  const [backupModal, setBackupModal] = useState(false);
  const [speedModal, setSpeedModal] = useState(false);
  const [modalSteps, setModalSteps] = useState<{ label: string; done: boolean; active: boolean }[]>([]);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [todoItems, setTodoItems] = useState(TODO_ITEMS.map((t, i) => ({ ...t, id: i, removing: false })));
  const [todoLoading, setTodoLoading] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const runSteps = useCallback(async (stepLabels: string[], setOpen: (v: boolean) => void) => {
    const s = stepLabels.map(l => ({ label: l, done: false, active: false }));
    setModalSteps(s);
    for (let i = 0; i < stepLabels.length; i++) {
      await new Promise(r => setTimeout(r, i === 0 ? 600 : 1200));
      if (!mountedRef.current) return;
      setModalSteps(prev => prev.map((x, j) => ({
        ...x,
        active: j === i,
        done: j < i || (j === i && i === stepLabels.length - 1),
      })));
    }
    await new Promise(r => setTimeout(r, 1500));
    if (mountedRef.current) setOpen(false);
  }, []);

  const handleBackup = useCallback(() => {
    setBackupModal(true);
    runSteps(["Preparing backup...", "Saving files...", "Saving database...", "Done! 312 MB saved"], setBackupModal);
  }, [runSteps]);

  const handleSpeedUp = useCallback(() => {
    setSpeedModal(true);
    runSteps(["Clearing page cache...", "Optimizing database...", "Compressing images...", "Done! Your site is 15% faster"], setSpeedModal);
  }, [runSteps]);

  const handleCheckUpdates = useCallback(async () => {
    setCheckingUpdates(true);
    await new Promise(r => setTimeout(r, 2000));
    if (mountedRef.current) { setCheckingUpdates(false); showToast.success("Everything is up to date!"); }
  }, []);

  const handleTodoAction = useCallback(async (item: typeof todoItems[0]) => {
    setTodoLoading(item.id);
    await new Promise(r => setTimeout(r, 1500));
    if (!mountedRef.current) return;
    const msgs: Record<string, string> = { "Update": "WordPress updated to 6.7.2", "Update All": "3 plugins updated", "Back Up Now": "Backup completed", "View": "" };
    if (item.action === "View") { setTodoLoading(null); onNavigate?.("logs"); return; }
    setTodoItems(prev => prev.map(t => t.id === item.id ? { ...t, removing: true } : t));
    setTimeout(() => { if (mountedRef.current) setTodoItems(prev => prev.filter(t => t.id !== item.id)); }, 300);
    setTodoLoading(null);
    showToast.success(msgs[item.action] || "Done!");
  }, [onNavigate]);

  const handleAdvancedAction = useCallback(async (label: string) => {
    setLoadingAction(label);
    await new Promise(r => setTimeout(r, 2000));
    if (mountedRef.current) { setLoadingAction(null); showToast.success(`${label} complete`); }
  }, []);

  const SpinnerIcon = () => (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
  );
  return (
    <div className="space-y-6">

      {/* 1. Site Status */}
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${isLight ? "bg-emerald-50/50" : "bg-emerald-500/[0.04]"}`}>
        {SITE_STATUS.healthy && SITE_STATUS.issues.length === 0 ? (
          <>
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${textPrimary}`}>Your site is running great</span>
            <span className={`text-xs ${textTertiary}`}>· checked {SITE_STATUS.lastChecked}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className={`text-sm font-medium ${textPrimary}`}>Your site needs attention</span>
            <span className={`text-xs ${textTertiary}`}>· checked {SITE_STATUS.lastChecked}</span>
            {SITE_STATUS.issues.map((issue, i) => (
              <span key={i} className={`text-xs ${textSecondary}`}>· {issue}</span>
            ))}
          </>
        )}
      </div>

      {/* 2. Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {([
          { label: "Back up my site", color: "violet", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
          { label: "Speed up my site", color: "emerald", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
          { label: "Check for updates", color: "amber", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" },
          { label: "View my visitors", color: "sky", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", nav: "analytics" },
        ] as const).map((action) => {
          const iconColors: Record<string, string> = { violet: "text-violet-500", emerald: "text-emerald-500", amber: "text-amber-500", sky: "text-sky-500" };
          const isChecking = action.label === "Check for updates" && checkingUpdates;
          return (
            <button
              key={action.label}
              onClick={() => {
                if (action.label === "Back up my site") handleBackup();
                else if (action.label === "Speed up my site") handleSpeedUp();
                else if (action.label === "Check for updates") handleCheckUpdates();
                else if ("nav" in action && action.nav) onNavigate?.(action.nav);
              }}
              disabled={isChecking}
              className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-medium transition-all border disabled:opacity-60 ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-300 hover:border-[var(--border-primary)] hover:bg-white/[0.02] active:bg-white/[0.04]"
              }`}
            >
              {isChecking ? (
                <svg className={`w-4 h-4 animate-spin ${iconColors[action.color]}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className={`w-4 h-4 ${iconColors[action.color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              )}
              {isChecking ? "Checking..." : action.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Quick Actions */}
      <div className={`flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-white/[0.02]"}`}>
        <span className={`text-xs font-medium mr-1 ${textTertiary}`}>Pro:</span>
        {[
          { label: "Clear Cache", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", color: "emerald" },
          { label: "Restart PHP", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "orange" },
          { label: "SSL Check", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", color: "sky" },
          { label: "Security Scan", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: "purple" },
          { label: "Restart Server", icon: "M5.636 5.636a9 9 0 1012.728 0M12 3v9", color: "rose" },
        ].map((action) => {
          const isLoading = loadingAction === action.label;
          const colorMap: Record<string, string> = { emerald: "text-emerald-500", orange: "text-orange-500", sky: "text-sky-500", purple: "text-purple-500", rose: "text-rose-500" };
          return (
            <button
              key={action.label}
              onClick={() => handleAdvancedAction(action.label)}
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-xs font-medium transition-all disabled:opacity-60 ${
                isLight ? "text-slate-600 hover:bg-slate-200/80" : "text-slate-400 hover:bg-white/[0.06]"
              }`}
            >
              {isLoading ? <SpinnerIcon /> : (
                <svg className={`w-3.5 h-3.5 ${colorMap[action.color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              )}
              {action.label}
            </button>
          );
        })}
      </div>

      {/* 3. How's My Site Doing? */}
      <div className="grid grid-cols-3 gap-3">
        {/* Speed */}
        <button onClick={() => onNavigate?.("caching")} className={`${cardClass} p-5 text-left hover:-translate-y-px transition-all group`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-emerald-50" : "bg-emerald-500/10"}`}>
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <p className={`text-lg font-bold ${SPEED.rating === "Fast" ? "text-emerald-500" : SPEED.rating === "OK" ? "text-amber-500" : "text-rose-500"}`}>
            {SPEED.rating}
          </p>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>{SPEED.subtitle}</p>
          <div className="flex gap-1 mt-2.5">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span key={dot} className={`w-2 h-2 rounded-full ${dot <= SPEED.dots ? "bg-emerald-500" : isLight ? "bg-slate-200" : "bg-slate-700"}`} />
            ))}
          </div>
        </button>

        {/* Security */}
        <button onClick={() => onNavigate?.("tools")} className={`${cardClass} p-5 text-left hover:-translate-y-px transition-all group`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-sky-50" : "bg-sky-500/10"}`}>
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <p className={`text-lg font-bold ${SECURITY.protected ? "text-sky-500" : "text-rose-500"}`}>
            {SECURITY.protected ? "Protected" : "At Risk"}
          </p>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>{SECURITY.subtitle}</p>
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-sky-50 text-sky-600" : "bg-sky-500/10 text-sky-400"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            All clear
          </div>
        </button>

        {/* Uptime */}
        <button onClick={() => showToast.info("Opening monitoring...")} className={`${cardClass} p-5 text-left hover:-translate-y-px transition-all group`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-violet-50" : "bg-violet-500/10"}`}>
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${textTertiary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
          <p className="text-lg font-bold text-violet-500">{UPTIME.value}</p>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>{UPTIME.subtitle}</p>
          <div className="mt-2.5 flex gap-0.5">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className="flex-1 h-1.5 rounded-full bg-violet-500" />
            ))}
          </div>
        </button>
      </div>

      {/* 4. Storage & Visitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Storage */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-sm font-medium ${textPrimary} mb-4`}>Storage</h3>
          <div className={`w-full h-3 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${storagePercent < 50 ? "bg-emerald-500" : storagePercent < 80 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-lg font-semibold ${textPrimary}`}>
              {STORAGE.used} {STORAGE.unit} <span className={`text-sm font-normal ${textSecondary}`}>of {STORAGE.total} {STORAGE.unit}</span>
            </span>
            <span className={`text-sm ${textSecondary}`}>{storagePercent}%</span>
          </div>
          <p className={`text-sm mt-1 ${storagePercent < 70 ? "text-emerald-500" : storagePercent < 90 ? "text-amber-500" : "text-rose-500"}`}>
            {storageFriendly}
          </p>
        </div>

        {/* Visitors */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textPrimary}`}>This Month&apos;s Visitors</h3>
            <button onClick={() => onNavigate?.("analytics")} className="text-xs text-sky-500 hover:text-sky-400 transition-colors">
              View details &rarr;
            </button>
          </div>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {VISITORS.thisMonth.toLocaleString()} <span className={`text-sm font-normal ${textSecondary}`}>visitors</span>
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`text-sm ${textSecondary}`}>{VISITORS.today.toLocaleString()} today</span>
            <span className={`text-sm font-medium ${VISITORS.trendUp ? "text-emerald-500" : "text-rose-500"}`}>
              {VISITORS.trendUp ? "\u2191" : "\u2193"} {VISITORS.trend} from last month
            </span>
          </div>
        </div>
      </div>

      {/* 5. Things To Do */}
      <div className={`${cardClass} p-6`}>
        <h3 className={`text-sm font-medium ${textPrimary} mb-4`}>Things To Do</h3>
        {todoItems.length === 0 ? (
          <p className={`text-sm ${textSecondary}`}>Everything is up to date!</p>
        ) : (
          <div className="space-y-2">
            {todoItems.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${subtleBg} transition-all duration-300 ${item.removing ? "opacity-0 scale-95" : "opacity-100"}`}>
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.priority === "amber" ? "bg-amber-500" : "bg-emerald-500"}`} />
                <span className={`text-sm flex-1 ${textPrimary}`}>{item.text}</span>
                <button
                  onClick={() => handleTodoAction(item)}
                  disabled={todoLoading === item.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors inline-flex items-center gap-1.5 disabled:opacity-70 ${
                    item.priority === "amber"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {todoLoading === item.id && (
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  )}
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Recent Activity */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-medium ${textPrimary}`}>Recent Activity</h3>
          <button onClick={() => onNavigate?.("activity")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View all activity &rarr;
          </button>
        </div>
        <div className="space-y-1">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-all ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
              <span className={`text-sm flex-1 ${textPrimary}`}>{item.text}</span>
              <span className={`text-xs ${textTertiary}`}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Need Help? */}
      <div className={`flex items-center justify-between px-5 py-4 rounded-xl ${isLight ? "bg-slate-50" : "bg-white/[0.02]"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-violet-50" : "bg-violet-500/10"}`}>
            <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <span className={`text-sm ${textSecondary}`}>Need help? Our support team is here 24/7.</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast.info("Opening support chat...")} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-500 hover:bg-violet-600 transition-colors">
            Contact Support
          </button>
          <button onClick={() => showToast.info("Opening help articles...")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isLight ? "text-slate-600 hover:bg-slate-200" : "text-slate-400 hover:bg-white/[0.04]"}`}>
            Help Articles
          </button>
        </div>
      </div>

      {/* Backup Progress Modal */}
      {backupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBackupModal(false)} />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl p-6 ${isLight ? "bg-white" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`}>
            <h3 className={`text-base font-semibold mb-4 ${textPrimary}`}>Backing up your site</h3>
            <div className="space-y-3">
              {modalSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {step.done ? (
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : step.active ? (
                    <svg className="w-5 h-5 text-violet-500 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isLight ? "border-slate-200" : "border-slate-700"}`} />
                  )}
                  <span className={`text-sm ${step.active || step.done ? textPrimary : textTertiary}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Speed Optimization Modal */}
      {speedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSpeedModal(false)} />
          <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl p-6 ${isLight ? "bg-white" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`}>
            <h3 className={`text-base font-semibold mb-4 ${textPrimary}`}>Optimizing your site</h3>
            <div className="space-y-3">
              {modalSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {step.done ? (
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : step.active ? (
                    <svg className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isLight ? "border-slate-200" : "border-slate-700"}`} />
                  )}
                  <span className={`text-sm ${step.active || step.done ? textPrimary : textTertiary}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
