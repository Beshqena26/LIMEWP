"use client";

import { Button, Chip } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { backupStats, backupColorMap, backups } from "@/data/site/backups";
import { NoBackups } from "../empty-states";

interface BackupsTabProps {
  siteId: string;
}

export function BackupsTab({ siteId }: BackupsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {backupStats.map((stat) => {
          const colors = backupColorMap[stat.color];
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
          <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Backup History</h3>
          <Chip
            size="sm"
            classNames={{
              base: "bg-emerald-500/10 border-0",
              content: "text-emerald-400 font-semibold text-[10px]"
            }}
          >
            {backups.length} backups
          </Chip>
        </div>
        <div className="flex items-center gap-2">
          <Button
              variant="bordered"
              size="sm"
              className={`font-medium ${isLight ? "text-slate-700 border-slate-300 hover:border-slate-400" : "text-slate-300 border-[var(--border-primary)] hover:border-slate-500"}`}
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                </svg>
              }
            >
              Settings
            </Button>

          <Button
            color="success"
            className="font-semibold text-white shadow-lg shadow-emerald-500/20"
            onPress={() => showToast.success("Backup created")}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Backup
          </Button>
        </div>
      </div>

      {/* Backup Cards */}
      {backups.length === 0 ? (
        <NoBackups />
      ) : (
      <div className="space-y-3">
        {backups.map((backup, index) => {
          const colors = backupColorMap[backup.color];
          const isLatest = index === 0;
          return (
            <div
              key={backup.id}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isLight
                  ? isLatest
                    ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-slate-200/50"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : isLatest
                    ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-black/20"
                    : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
              }`}
            >
              {/* Corner Glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50`} />

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  {/* Backup Icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                      {backup.type === "automatic" ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                      )}
                    </div>
                    {isLatest && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`}></span>
                      </span>
                    )}
                  </div>

                  {/* Backup Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`font-semibold text-[15px] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{backup.name}</span>
                      {isLatest && (
                        <Chip
                          size="sm"
                          classNames={{
                            base: "bg-emerald-500/10 border-0 h-5",
                            content: "text-emerald-400 font-bold text-[9px] px-0"
                          }}
                        >
                          LATEST
                        </Chip>
                      )}
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                          base: `${backup.type === "automatic" ? "bg-sky-500/10" : "bg-violet-500/10"} border-0 h-5`,
                          content: `${backup.type === "automatic" ? "text-sky-400" : "text-violet-400"} font-semibold text-[10px] px-0 capitalize`
                        }}
                      >
                        {backup.type}
                      </Chip>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>{backup.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{backup.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                        </svg>
                        <span className="font-mono">{backup.size}</span>
                      </div>
                    </div>

                    {/* Includes Tags */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-600">Includes:</span>
                      <div className="flex gap-1.5">
                        {backup.includes.map((item) => (
                          <span
                            key={item}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${
                              isLight
                                ? "text-slate-500 bg-slate-100 ring-slate-200"
                                : "text-slate-400 bg-[var(--bg-elevated)] ring-[var(--border-primary)]"
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => showToast.info("Restoring backup...")} className="h-9 px-3.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all ring-1 ring-emerald-500/20 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                        </svg>
                        Restore
                      </button>

                    <button onClick={() => showToast.success("Backup downloaded")} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-slate-100 hover:bg-slate-200 ring-slate-200"
                        : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
                    }`}>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>

                    <button onClick={() => showToast.warning("Backup deleted")} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-slate-100 hover:bg-rose-500/10 ring-slate-200 hover:ring-rose-500/30"
                        : "bg-[var(--bg-elevated)]/70 hover:bg-rose-500/10 ring-[var(--border-primary)] hover:ring-rose-500/30"
                    }`}>
                        <svg className="w-4 h-4 text-slate-400 hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* View More */}
      <div className="mt-4 flex justify-center">
        <button className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group/btn">
          <span>View all backups</span>
          <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
