"use client";

import { useState, useMemo } from "react";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

/* ────────────── types ────────────── */

interface GlobalActivity {
  id: string;
  action: string;
  target: string;
  site: string;
  user: string;
  time: string;
  date: string;
  type: "content" | "system" | "security" | "plugin" | "theme" | "user" | "backup" | "billing";
}

const TYPE_STYLES: Record<string, { bg: string; text: string; ring: string; dot: string; label: string }> = {
  content: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", dot: "bg-sky-400", label: "Content" },
  system: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", dot: "bg-violet-400", label: "System" },
  security: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", dot: "bg-rose-400", label: "Security" },
  plugin: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", dot: "bg-amber-400", label: "Plugin" },
  theme: { bg: "bg-pink-500/10", text: "text-pink-400", ring: "ring-pink-500/20", dot: "bg-pink-400", label: "Theme" },
  user: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", dot: "bg-emerald-400", label: "User" },
  backup: { bg: "bg-indigo-500/10", text: "text-indigo-400", ring: "ring-indigo-500/20", dot: "bg-indigo-400", label: "Backup" },
  billing: { bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "ring-cyan-500/20", dot: "bg-cyan-400", label: "Billing" },
};

const SITE_COLORS: Record<string, string> = {
  "limewp.com": "from-emerald-500 to-teal-500",
  "supernova.guru": "from-orange-500 to-red-500",
  "Account": "from-slate-500 to-slate-600",
};

/* ────────────── mock data ────────────── */

const ALL_ACTIVITIES: GlobalActivity[] = [
  { id: "g1", action: "Published post", target: "Getting Started with LimeWP", site: "limewp.com", user: "Lime Admin", time: "10:34 AM", date: "Today", type: "content" },
  { id: "g2", action: "Backup completed", target: "Full site backup (856 MB)", site: "limewp.com", user: "System", time: "03:00 AM", date: "Today", type: "backup" },
  { id: "g3", action: "Plugin updated", target: "Yoast SEO 21.5 → 22.0", site: "supernova.guru", user: "System", time: "03:02 AM", date: "Today", type: "plugin" },
  { id: "g4", action: "User logged in", target: "Chrome on macOS, San Francisco", site: "Account", user: "Lime Admin", time: "08:22 AM", date: "Today", type: "security" },
  { id: "g5", action: "SSL renewed", target: "Auto-renewal completed", site: "supernova.guru", user: "System", time: "06:00 AM", date: "Today", type: "security" },
  { id: "g6", action: "Cache cleared", target: "Redis flush — all keys", site: "limewp.com", user: "Lime Admin", time: "09:15 AM", date: "Today", type: "system" },
  { id: "g7", action: "Payment processed", target: "Business plan — $79.00", site: "Account", user: "System", time: "12:00 AM", date: "Today", type: "billing" },
  { id: "g8", action: "Backup completed", target: "Full site backup (2.4 GB)", site: "supernova.guru", user: "System", time: "03:00 AM", date: "Today", type: "backup" },
  { id: "g9", action: "Theme customized", target: "Changed primary color", site: "limewp.com", user: "Lime Admin", time: "02:45 PM", date: "Yesterday", type: "theme" },
  { id: "g10", action: "New user registered", target: "sarah_author (Author)", site: "limewp.com", user: "System", time: "11:30 AM", date: "Yesterday", type: "user" },
  { id: "g11", action: "Plugin installed", target: "WPForms Lite v1.0.0", site: "supernova.guru", user: "Lime Admin", time: "10:15 AM", date: "Yesterday", type: "plugin" },
  { id: "g12", action: "Blocked IP", target: "185.220.101.45 — brute force", site: "limewp.com", user: "Auto-Ban", time: "09:45 AM", date: "Yesterday", type: "security" },
  { id: "g13", action: "PHP updated", target: "8.2.12 → 8.3.4", site: "limewp.com", user: "Lime Admin", time: "01:30 PM", date: "2 days ago", type: "system" },
  { id: "g14", action: "Domain added", target: "staging.limewp.com", site: "limewp.com", user: "Lime Admin", time: "10:00 AM", date: "2 days ago", type: "system" },
  { id: "g15", action: "Service activated", target: "Global CDN — $9/mo", site: "supernova.guru", user: "Lime Admin", time: "03:20 PM", date: "2 days ago", type: "billing" },
  { id: "g16", action: "Edited post", target: "About Us page", site: "supernova.guru", user: "John Smith", time: "04:20 PM", date: "3 days ago", type: "content" },
  { id: "g17", action: "Database optimized", target: "Freed 45 MB", site: "limewp.com", user: "System", time: "04:00 AM", date: "3 days ago", type: "system" },
  { id: "g18", action: "WordPress updated", target: "6.7.0 → 6.7.1", site: "supernova.guru", user: "System", time: "03:01 AM", date: "4 days ago", type: "system" },
  { id: "g19", action: "WordPress updated", target: "6.7.0 → 6.7.1", site: "limewp.com", user: "System", time: "03:01 AM", date: "4 days ago", type: "system" },
  { id: "g20", action: "Backup restored", target: "From Mar 5, 2026 backup", site: "limewp.com", user: "Lime Admin", time: "02:15 PM", date: "5 days ago", type: "backup" },
  { id: "g21", action: "Password reset", target: "Email sent to mike@example.com", site: "Account", user: "Lime Admin", time: "11:20 AM", date: "5 days ago", type: "user" },
  { id: "g22", action: "Plan upgraded", target: "Starter → Business", site: "Account", user: "Lime Admin", time: "09:00 AM", date: "1 week ago", type: "billing" },
  { id: "g23", action: "Site created", target: "supernova.guru", site: "Account", user: "Lime Admin", time: "02:00 PM", date: "2 weeks ago", type: "system" },
  { id: "g24", action: "Account created", target: "Welcome to LimeWP", site: "Account", user: "System", time: "01:00 PM", date: "3 weeks ago", type: "user" },
];

const SITES = ["All Sites", "limewp.com", "supernova.guru", "Account"];
const ITEMS_PER_PAGE = 12;

/* ────────────── component ────────────── */

export default function ActivityPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredActivities = useMemo(() => {
    let list = ALL_ACTIVITIES;
    if (siteFilter !== "All Sites") list = list.filter((a) => a.site === siteFilter);
    if (typeFilter !== "all") list = list.filter((a) => a.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.action.toLowerCase().includes(q) || a.target.toLowerCase().includes(q) || a.user.toLowerCase().includes(q) || a.site.toLowerCase().includes(q));
    }
    return list;
  }, [siteFilter, typeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));
  const paginatedActivities = filteredActivities.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { date: string; items: typeof paginatedActivities }[] = [];
    for (const item of paginatedActivities) {
      const existing = groups.find((g) => g.date === item.date);
      if (existing) existing.items.push(item);
      else groups.push({ date: item.date, items: [item] });
    }
    return groups;
  }, [paginatedActivities]);

  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Activity Log</h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>All activity across your sites and account</p>
      </div>

      {/* Filters */}
      <div className={`${cardClass} p-4 mb-5`}>
        <div className="flex flex-col gap-3">
          {/* Search + site filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input id="global-activity-search" type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Search all activity..." className={`${inputClass} pl-10`} />
            </div>
            <div className="flex gap-1.5">
              {SITES.map((site) => (
                <button key={site} onClick={() => { setSiteFilter(site); setPage(1); }} className={`px-3 h-10 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  siteFilter === site
                    ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}`
                    : isLight ? "text-slate-600 hover:bg-slate-100 border border-slate-200" : "text-slate-400 hover:bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"
                }`}>
                  {site !== "All Sites" && site !== "Account" && (
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${SITE_COLORS[site] || "from-slate-400 to-slate-500"}`} />
                  )}
                  {site}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => { setTypeFilter("all"); setPage(1); }} className={`px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              typeFilter === "all" ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}` : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
            }`}>All Types</button>
            {Object.entries(TYPE_STYLES).map(([key, style]) => (
              <button key={key} onClick={() => { setTypeFilter(key); setPage(1); }} className={`px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                typeFilter === key ? `${style.bg} ${style.text} ring-1 ${style.ring}` : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className={`${cardClass} overflow-hidden`}>
        {grouped.length === 0 ? (
          <div className={`px-6 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No activity matches your filters</div>
        ) : grouped.map((group) => (
          <div key={group.date}>
            <div className={`px-6 py-2.5 ${isLight ? "bg-slate-50 border-b border-slate-200" : "bg-[var(--bg-primary)]/50 border-b border-[var(--border-tertiary)]"}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>{group.date}</span>
            </div>
            {group.items.map((activity) => {
              const style = TYPE_STYLES[activity.type] || TYPE_STYLES.system;
              const siteGradient = SITE_COLORS[activity.site] || "from-slate-400 to-slate-500";
              return (
                <div key={activity.id} className={`flex items-start gap-4 px-6 py-4 border-b last:border-b-0 transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"}`}>
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <div className={`w-px flex-1 mt-1 ${isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activity.action}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ring-1 ${style.bg} ${style.text} ${style.ring}`}>{style.label}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md ring-1 ring-slate-500/20 bg-slate-500/10 text-slate-400">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${siteGradient}`} />
                        {activity.site}
                      </span>
                    </div>
                    <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>{activity.target}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>{activity.user}</span>
                      <span className={`text-[11px] ${isLight ? "text-slate-300" : "text-slate-600"}`}>&bull;</span>
                      <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-slate-500"}`}>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {filteredActivities.length > ITEMS_PER_PAGE && (
          <div className={`flex items-center justify-between px-6 py-3 border-t ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-primary)]/50"}`}>
            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${isLight ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--border-primary)]"}`}>Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${isLight ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--border-primary)]"}`}>Next</button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
