"use client";

import { Avatar, Chip } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { plugins, pluginColorMap } from "@/data/site/plugins";

interface PluginsTabProps {
  siteId: string;
}

export function PluginsTab({ siteId }: PluginsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {plugins.map((plugin) => {
        const colors = pluginColorMap[plugin.color] || pluginColorMap.emerald;
        return (
          <div
            key={plugin.name}
            className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isLight
                ? plugin.active
                  ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : "bg-white border-slate-200/70 hover:border-slate-300/50 hover:shadow-slate-200/50"
                : plugin.active
                  ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]/70 hover:border-[var(--border-primary)]/50 hover:shadow-black/20"
            }`}
          >
            {/* Corner Glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />

            <div className="relative p-5">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Plugin Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${plugin.gradient} rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <Avatar
                    name={plugin.icon}
                    size="lg"
                    classNames={{
                      base: `relative w-14 h-14 bg-gradient-to-br ${plugin.gradient} ring-2 ring-white/10`,
                      name: "text-white text-sm font-bold",
                    }}
                  />
                  {plugin.active && (
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 flex items-center justify-center ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Plugin Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-[15px] truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>{plugin.name}</h3>
                    {plugin.featured && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </span>

                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>
                      v{plugin.version}
                    </span>
                    {plugin.active ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md ring-1 ring-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md ring-1 ring-slate-500/20">
                        Inactive
                      </span>
                    )}
                    {plugin.autoUpdate && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md ring-1 ring-sky-500/20">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                          </svg>
                        </span>

                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className={`text-xs mb-4 leading-relaxed line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{plugin.description}</p>

              {/* Meta Info */}
              <div className={`flex items-center gap-4 mb-4 text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>{plugin.author}</span>
                </div>
                <span className={isLight ? "text-slate-400" : "text-slate-600"}>•</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>{plugin.downloads}</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{plugin.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className={`flex items-center gap-2 pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {plugin.active ? (
                  <>
                    <button onClick={() => showToast.info("Opening plugin settings...")} className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ring-1 ${
                      isLight
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200"
                        : "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 hover:from-slate-600 hover:to-slate-700 ring-white/5"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                    <button onClick={() => showToast.info("Plugin deactivated")} className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all ring-1 ring-amber-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                        </svg>
                      </button>

                    <button onClick={() => showToast.warning("Plugin deleted")} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                  </>
                ) : (
                  <>
                    <button onClick={() => showToast.success("Plugin activated")} className="flex-1 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Activate
                    </button>
                    <button onClick={() => showToast.warning("Plugin deleted")} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
