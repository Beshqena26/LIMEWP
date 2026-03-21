"use client";

import { SectionHeader } from "../ui/SectionHeader";
import { useTheme } from "@/lib/context/ThemeContext";

interface QuickAction {
  label: string;
  description: string;
  icon: string;
  gradient: string;
  glowColor: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  onBackup?: () => void;
  onClearCache?: () => void;
  onRunScan?: () => void;
  onViewAnalytics?: () => void;
}

export function QuickActions({ onBackup, onClearCache, onRunScan, onViewAnalytics }: QuickActionsProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const actions: QuickAction[] = [
    {
      label: "Backup All Sites",
      description: "Create instant backup",
      icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
      gradient: "from-slate-600 to-slate-700",
      glowColor: "from-slate-500/15",
      onClick: onBackup,
    },
    {
      label: "Clear Cache",
      description: "Boost performance",
      icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182",
      gradient: "from-slate-500 to-slate-600",
      glowColor: "from-slate-500/15",
      onClick: onClearCache,
    },
    {
      label: "Security Scan",
      description: "Check for threats",
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      gradient: "from-slate-500 to-slate-600",
      glowColor: "from-slate-500/15",
      onClick: onRunScan,
    },
    {
      label: "View Analytics",
      description: "Traffic insights",
      icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
      gradient: "from-slate-600 to-slate-700",
      glowColor: "from-slate-500/15",
      onClick: onViewAnalytics,
    },
  ];

  return (
    <div className="mb-10">
      <SectionHeader
        title="Quick Actions"
        icon="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        iconColor="zinc"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`group relative rounded-xl transition-all duration-300 p-4 text-left overflow-hidden ${
              isLight
                ? "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${action.glowColor} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg mb-3 group-hover:scale-105 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d={action.icon} />
                </svg>
              </div>
              <div className={`font-semibold text-sm transition-colors mb-0.5 ${
                isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"
              }`}>
                {action.label}
              </div>
              <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
