"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { THEMES, THEME_COLOR_MAP } from "@/data/site/themes";

interface ThemesTabProps {
  siteId: string;
}

export function ThemesTab({ siteId }: ThemesTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {THEMES.map((theme) => {
        const colors = THEME_COLOR_MAP[theme.color] || THEME_COLOR_MAP.emerald;
        return (
          <div
            key={theme.name}
            className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isLight
                ? theme.active
                  ? "bg-white border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-slate-200/50"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                : theme.active
                  ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-black/20"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
            }`}
          >
            {/* Theme Preview */}
            <div className={`h-36 bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="absolute inset-4 border border-white/10 rounded-lg" />
              <div className="absolute top-6 left-6 right-6 h-2 bg-white/20 rounded-full" />
              <div className="absolute top-10 left-6 w-1/3 h-1.5 bg-white/15 rounded-full" />
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">
                <div className="h-8 bg-white/10 rounded" />
                <div className="h-8 bg-white/10 rounded" />
                <div className="h-8 bg-white/10 rounded" />
              </div>
              {theme.active && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    Active
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                <button onClick={() => showToast.info("Opening theme preview...")} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                <button onClick={() => showToast.info("Opening theme preview...")} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </button>
              </div>
            </div>

            {/* Theme Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`font-semibold text-[15px] capitalize leading-tight ${isLight ? "text-slate-800" : "text-slate-100"}`}>{theme.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex-shrink-0`}>
                  v{theme.version}
                </span>
              </div>

              <p className={`text-xs mb-3 line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{theme.description}</p>

              <div className={`flex items-center gap-3 mb-4 text-[11px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {theme.author}
                </div>
                <span className={isLight ? "text-slate-400" : "text-slate-600"}>•</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {theme.lastUpdated}
                </div>
              </div>

              {/* Actions */}
              {theme.active ? (
                <button onClick={() => showToast.info("Opening theme customizer...")} className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  </svg>
                  Customize
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => showToast.success("Theme activated")} className={`flex-1 h-9 rounded-xl text-sm font-medium transition-all ring-1 flex items-center justify-center gap-1.5 ${
                    isLight
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200"
                      : "bg-[var(--bg-elevated)]/70 text-slate-200 hover:bg-[var(--border-primary)] ring-[var(--border-primary)]"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Activate
                  </button>
                  <button onClick={() => showToast.warning("Theme deleted")} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>

                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
