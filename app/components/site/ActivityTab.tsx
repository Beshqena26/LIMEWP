"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

interface ActivityTabProps {
  siteId: string;
}

interface ActivityEntry {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
  date: string;
  type: "content" | "system" | "security" | "plugin" | "theme" | "user" | "backup";
}

const TYPE_STYLES: Record<string, { bg: string; text: string; ring: string; dot: string; label: string }> = {
  content: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", dot: "bg-sky-400", label: "Content" },
  system: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", dot: "bg-violet-400", label: "System" },
  security: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", dot: "bg-rose-400", label: "Security" },
  plugin: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", dot: "bg-amber-400", label: "Plugin" },
  theme: { bg: "bg-pink-500/10", text: "text-pink-400", ring: "ring-pink-500/20", dot: "bg-pink-400", label: "Theme" },
  user: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", dot: "bg-emerald-400", label: "User" },
  backup: { bg: "bg-indigo-500/10", text: "text-indigo-400", ring: "ring-indigo-500/20", dot: "bg-indigo-400", label: "Backup" },
};

const ACTIVITIES: ActivityEntry[] = [
  { id: "a1", action: "Published post", target: "Getting Started with LimeWP", user: "Lime Admin", time: "10:34 AM", date: "Today", type: "content" },
  { id: "a2", action: "Backup completed", target: "Full site backup (856 MB)", user: "System", time: "03:00 AM", date: "Today", type: "backup" },
  { id: "a3", action: "Cache cleared", target: "Redis flush — all keys", user: "Lime Admin", time: "09:15 AM", date: "Today", type: "system" },
  { id: "a4", action: "Plugin updated", target: "Yoast SEO 21.5 → 22.0", user: "System", time: "03:02 AM", date: "Today", type: "plugin" },
  { id: "a5", action: "User logged in", target: "From Chrome on macOS, San Francisco", user: "Lime Admin", time: "08:22 AM", date: "Today", type: "security" },
  { id: "a6", action: "Theme customized", target: "Changed primary color, updated tagline", user: "Lime Admin", time: "02:45 PM", date: "Yesterday", type: "theme" },
  { id: "a7", action: "New user registered", target: "sarah_author (Author role)", user: "System", time: "11:30 AM", date: "Yesterday", type: "user" },
  { id: "a8", action: "Plugin installed", target: "WPForms Lite v1.0.0", user: "Lime Admin", time: "10:15 AM", date: "Yesterday", type: "plugin" },
  { id: "a9", action: "SSL certificate renewed", target: "limewp.com — auto-renewal", user: "System", time: "06:00 AM", date: "Yesterday", type: "security" },
  { id: "a10", action: "Edited post", target: "About Us page — updated team section", user: "John Smith", time: "04:20 PM", date: "Yesterday", type: "content" },
  { id: "a11", action: "Backup completed", target: "Full site backup (842 MB)", user: "System", time: "03:00 AM", date: "Yesterday", type: "backup" },
  { id: "a12", action: "PHP version changed", target: "8.2.12 → 8.3.4", user: "Lime Admin", time: "01:30 PM", date: "2 days ago", type: "system" },
  { id: "a13", action: "Blocked IP", target: "185.220.101.45 — brute force attempt", user: "Auto-Ban Rule", time: "09:45 AM", date: "2 days ago", type: "security" },
  { id: "a14", action: "Comment approved", target: "On: Getting Started with LimeWP", user: "John Smith", time: "08:10 AM", date: "2 days ago", type: "content" },
  { id: "a15", action: "Plugin deactivated", target: "WooCommerce v8.4.0", user: "Lime Admin", time: "03:50 PM", date: "3 days ago", type: "plugin" },
  { id: "a16", action: "Database optimized", target: "Freed 45 MB — 12 tables optimized", user: "System", time: "04:00 AM", date: "3 days ago", type: "system" },
  { id: "a17", action: "Password reset", target: "Email sent to mike@example.com", user: "Lime Admin", time: "11:20 AM", date: "3 days ago", type: "user" },
  { id: "a18", action: "Backup restored", target: "From Mar 5, 2026 backup", user: "Lime Admin", time: "02:15 PM", date: "4 days ago", type: "backup" },
  { id: "a19", action: "WordPress updated", target: "6.7.0 → 6.7.1", user: "System", time: "03:01 AM", date: "5 days ago", type: "system" },
  { id: "a20", action: "Domain added", target: "staging.limewp.com", user: "Lime Admin", time: "10:00 AM", date: "1 week ago", type: "system" },
];

const ITEMS_PER_PAGE = 10;

export function ActivityTab({ siteId }: ActivityTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredActivities = useMemo(() => {
    let list = ACTIVITIES;
    if (typeFilter !== "all") list = list.filter((a) => a.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.action.toLowerCase().includes(q) || a.target.toLowerCase().includes(q) || a.user.toLowerCase().includes(q));
    }
    return list;
  }, [typeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));
  const paginatedActivities = filteredActivities.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;

  // Group by date
  const grouped = useMemo(() => {
    const groups: { date: string; items: typeof paginatedActivities }[] = [];
    for (const item of paginatedActivities) {
      const existing = groups.find((g) => g.date === item.date);
      if (existing) { existing.items.push(item); }
      else { groups.push({ date: item.date, items: [item] }); }
    }
    return groups;
  }, [paginatedActivities]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Activity Log</h2>
          <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{filteredActivities.length} events recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardClass} p-4 mb-5`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input id="activity-search" type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder="Search activity..." className={`${inputClass} pl-10`} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => { setTypeFilter("all"); setPage(1); }} className={`px-3 h-8 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              typeFilter === "all" ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring}` : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
            }`}>All</button>
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
        ) : (
          <div>
            {grouped.map((group, gi) => (
              <div key={group.date}>
                {/* Date header */}
                <div className={`px-6 py-2.5 ${isLight ? "bg-slate-50 border-b border-slate-200" : "bg-white/[0.02] border-b border-white/[0.06]"}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>{group.date}</span>
                </div>

                {/* Entries */}
                {group.items.map((activity) => {
                  const style = TYPE_STYLES[activity.type] || TYPE_STYLES.system;
                  return (
                    <div key={activity.id} className={`flex items-start gap-4 px-6 py-4 border-b last:border-b-0 transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-white/[0.04] hover:bg-white/[0.02]"}`}>
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center pt-1 flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <div className={`w-px flex-1 mt-1 ${isLight ? "bg-slate-200" : "bg-white/[0.06]"}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activity.action}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ring-1 ${style.bg} ${style.text} ${style.ring}`}>{style.label}</span>
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
          </div>
        )}

        {/* Pagination */}
        {filteredActivities.length > ITEMS_PER_PAGE && (
          <div className={`flex items-center justify-between px-6 py-3 border-t ${isLight ? "border-slate-200 bg-slate-50" : "border-white/[0.06] bg-white/[0.02]"}`}>
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
    </div>
  );
}
