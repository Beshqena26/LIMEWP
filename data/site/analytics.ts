export interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
  icon: string;
  subtext: string;
}

export interface AnalyticsColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  iconBg: string;
}

export interface TopPage {
  page: string;
  title: string;
  views: string;
  pct: number;
}

export interface TrafficSource {
  source: string;
  visits: string;
  pct: number;
  color: string;
  icon: string;
}

export const analyticsStats: AnalyticsStat[] = [
  { label: "Total Visits", value: "8,734", change: "+12.5%", positive: true, color: "emerald", icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z", subtext: "Unique visitors" },
  { label: "Page Views", value: "24,521", change: "+8.2%", positive: true, color: "sky", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", subtext: "2.8 pages/visit" },
  { label: "Bounce Rate", value: "42.3%", change: "+2.1%", positive: false, color: "rose", icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3", subtext: "Single page visits" },
  { label: "Avg Session", value: "3m 24s", change: "+5.8%", positive: true, color: "violet", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", subtext: "Time on site" },
];

export const analyticsColorMap: Record<string, AnalyticsColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
};

export const topPages: TopPage[] = [
  { page: "/", title: "Homepage", views: "4,521", pct: 45 },
  { page: "/blog", title: "Blog", views: "2,134", pct: 21 },
  { page: "/contact", title: "Contact", views: "1,245", pct: 13 },
  { page: "/about", title: "About Us", views: "892", pct: 9 },
  { page: "/services", title: "Services", views: "729", pct: 7 },
];

export const trafficSources: TrafficSource[] = [
  { source: "Organic Search", visits: "4,234", pct: 48, color: "emerald", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { source: "Direct", visits: "2,156", pct: 25, color: "sky", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" },
  { source: "Social Media", visits: "1,567", pct: 18, color: "violet", icon: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" },
  { source: "Referrals", visits: "777", pct: 9, color: "amber", icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" },
];
