"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { DOMAINS } from "@/data/site/domains";
import { NoDomains } from "../empty-states";

interface DomainsTabProps {
  siteId: string;
}

export function DomainsTab({ siteId }: DomainsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="space-y-4">
      {/* Domain Cards */}
      {DOMAINS.length === 0 ? (
        <NoDomains />
      ) : (
      <>
      {DOMAINS.map((row) => (
        <div
          key={row.domain}
          className={`group relative rounded-2xl border overflow-hidden transition-all ${
            isLight
              ? row.primary
                ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-slate-200/50"
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
              : row.primary
                ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-black/20"
                : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-lg hover:shadow-black/20"
          }`}
        >
          {/* Corner Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${row.primary ? "from-emerald-500/[0.08]" : "from-sky-500/[0.04]"} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

          <div className="relative p-5">
            <div className="flex items-center justify-between gap-4">
              {/* Domain Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-xl ${row.primary ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : "bg-sky-500/10 ring-1 ring-sky-500/20"} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <svg className={`w-6 h-6 ${row.primary ? "text-emerald-400" : "text-sky-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{row.domain}</span>
                    {row.primary && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" />
                      </svg>
                      {row.dnsProvider}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span>SSL expires {row.sslExpiry}</span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Active Status */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">Active</span>
                </div>

                {/* SSL Status */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
                  <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-semibold text-sky-400">SSL</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => showToast.info("Opening domain settings...")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200"
                      : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)]"
                  }`}>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      </svg>
                    </button>

                  <button onClick={() => showToast.info("SSL check in progress...")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isLight
                      ? "bg-slate-100 hover:bg-slate-200"
                      : "bg-[var(--bg-elevated)]/70 hover:bg-[var(--border-primary)]"
                  }`}>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </button>

                  {!row.primary && (
                    <button onClick={() => showToast.success("Primary domain updated")} className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-all ring-1 ring-emerald-500/20">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </button>

                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      </>
      )}

      {/* Add Domain Button */}
      <button className={`w-full group relative rounded-2xl border border-dashed p-5 transition-all overflow-hidden ${
        isLight
          ? "bg-slate-50 border-slate-300 hover:border-emerald-500/40"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-primary)] hover:border-emerald-500/40"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.02] to-sky-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left">
            <span className={`text-sm font-semibold group-hover:text-emerald-400 transition-colors ${isLight ? "text-slate-700" : "text-slate-200"}`}>Add New Domain</span>
            <p className="text-xs text-slate-500">Point a new domain to this site</p>
          </div>
        </div>
      </button>
    </div>
  );
}
