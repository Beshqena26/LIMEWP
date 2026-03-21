"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { Button, Chip, Switch } from "@heroui/react";
import { showToast } from "@/lib/toast";
import { cacheStats, cacheColorMap, cachingOptions } from "@/data/site/caching";

interface CachingTabProps {
  siteId: string;
}

export function CachingTab({ siteId }: CachingTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const [cachingToggles, setCachingToggles] = useState<Record<string, boolean>>({ edge: true, fullPage: true, object: false, cdn: true });
  const toggleCaching = (key: string) => {
    const newState = !cachingToggles[key];
    setCachingToggles((prev) => ({ ...prev, [key]: newState }));
    showToast.success(`Cache ${newState ? "enabled" : "disabled"}`);
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cacheStats.map((stat) => {
          const colors = cacheColorMap[stat.color];
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
          <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Cache Configuration</h3>
          <Chip
            size="sm"
            classNames={{
              base: "bg-emerald-500/10 border-0",
              content: "text-emerald-400 font-semibold text-[10px]"
            }}
          >
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All systems active
            </span>
          </Chip>
        </div>
        <div className="flex items-center gap-2">
          <Button
              variant="bordered"
              size="sm"
              className={`font-medium ${isLight ? "text-slate-700 border-slate-300 hover:border-slate-400" : "text-slate-300 border-[var(--border-primary)] hover:border-slate-500"}`}
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
            >
              Analytics
            </Button>

          <Button
            color="success"
            className="font-semibold text-white shadow-lg shadow-emerald-500/20"
            onPress={() => showToast.success("All caches cleared")}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Clear All Cache
          </Button>
        </div>
      </div>

      {/* Caching Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cachingOptions.map((item) => {
          const colors = cacheColorMap[item.color];
          const isOn = cachingToggles[item.key];
          return (
            <div
              key={item.key}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 ${
                isLight
                  ? isOn
                    ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-slate-200/50"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                  : `bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] ${isOn ? colors.activeBorder : colors.border} hover:border-[var(--border-primary)] hover:shadow-lg hover:shadow-black/20`
              }`}
            >
              {/* Corner Glow */}
              {isOn && (
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70`} />
              )}

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                      {isOn && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`}></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-[15px] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{item.label}</h3>
                        <Chip
                          size="sm"
                          classNames={{
                            base: `${isOn ? "bg-emerald-500/10" : "bg-slate-500/10"} border-0 h-5`,
                            content: `${isOn ? "text-emerald-400" : "text-slate-400"} font-semibold text-[10px] px-0`
                          }}
                        >
                          {isOn ? "Active" : "Inactive"}
                        </Chip>
                      </div>
                      <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-500"}`}>{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    isSelected={isOn}
                    onValueChange={() => toggleCaching(item.key)}
                    classNames={{
                      wrapper: `${isOn ? "!bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-600"}`,
                    }}
                  />
                </div>

                {/* Stats Row */}
                {isOn && (
                  <div className={`flex items-center gap-4 pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Hit rate:</span>
                      <span className={`text-xs font-semibold ${colors.text}`}>{item.hitRate}</span>
                    </div>
                    <div className={`w-px h-4 ${isLight ? "bg-slate-300" : "bg-[var(--border-primary)]"}`} />
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                      </svg>
                      <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Objects:</span>
                      <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>{item.objects}</span>
                    </div>
                    <div className="ml-auto">
                      <button onClick={() => showToast.success(`Cache cleared for ${item.label}`)} className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all ring-1 flex items-center gap-1.5 ${
                        isLight
                          ? "bg-slate-100 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 ring-slate-200 hover:ring-rose-500/30"
                          : "bg-[var(--bg-elevated)]/70 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 ring-[var(--border-primary)] hover:ring-rose-500/30"
                      }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                          </svg>
                          Clear
                        </button>

                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
