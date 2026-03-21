export interface CacheStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

export interface CacheColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  iconBg: string;
  border: string;
  activeBorder: string;
}

export interface CachingOption {
  key: string;
  label: string;
  desc: string;
  color: string;
  icon: string;
  hitRate: string;
  objects: string;
}

export const cacheStats: CacheStat[] = [
  { label: "Cache Hit Rate", value: "94.7%", subtext: "Excellent", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
  { label: "Cached Objects", value: "2,847", subtext: "Last 24h", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", color: "sky" },
  { label: "Bandwidth Saved", value: "1.2 GB", subtext: "This month", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", color: "violet" },
  { label: "Avg Response", value: "42ms", subtext: "-68% faster", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "amber" },
];

export const cacheColorMap: Record<string, CacheColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20", border: "border-[#282b3a]", activeBorder: "border-emerald-500/40" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20", border: "border-[#282b3a]", activeBorder: "border-sky-500/40" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20", border: "border-[#282b3a]", activeBorder: "border-violet-500/40" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20", border: "border-[#282b3a]", activeBorder: "border-amber-500/40" },
};

export const cachingOptions: CachingOption[] = [
  { key: "edge", label: "Edge Caching", desc: "Cache at the network edge for fastest delivery. Reduces latency by serving content from the nearest location.", color: "emerald", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", hitRate: "97.2%", objects: "1,245" },
  { key: "fullPage", label: "Full Page Caching", desc: "Cache entire HTML pages for repeat visitors. Perfect for static content and logged-out users.", color: "sky", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", hitRate: "89.4%", objects: "892" },
  { key: "object", label: "Object Caching", desc: "Cache database queries and API responses. Speeds up dynamic content and reduces database load.", color: "violet", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", hitRate: "94.8%", objects: "456" },
  { key: "cdn", label: "CDN Integration", desc: "Serve static assets from global CDN network. 200+ edge locations worldwide for optimal performance.", color: "amber", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", hitRate: "99.1%", objects: "254" },
];
