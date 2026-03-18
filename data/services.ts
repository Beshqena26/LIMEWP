/**
 * Services page mock data.
 */

export interface ServiceStat {
  label: string;
  value: string;
  progress: number;
}

export interface CurrentService {
  name: string;
  plan: string;
  icon: string;
  color: string;
  nextBilling: string;
  price: number;
  stats: ServiceStat[];
}

export interface ServiceBadge {
  label: string;
  type: "popular" | "recommended" | "new";
}

export interface SuggestedService {
  name: string;
  description: string;
  icon: string;
  color: string;
  price: number;
  badge?: ServiceBadge;
  features: string[];
}

export const CURRENT_SERVICES: CurrentService[] = [
  {
    name: "Managed WordPress Hosting",
    plan: "Business",
    icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7",
    color: "emerald",
    nextBilling: "Feb 25, 2026",
    price: 49,
    stats: [
      { label: "Sites", value: "2/5", progress: 40 },
      { label: "Storage", value: "2.4 GB / 50 GB", progress: 5 },
      { label: "Bandwidth", value: "45 GB / 500 GB", progress: 9 },
    ],
  },
  {
    name: "Email Hosting",
    plan: "Professional",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    color: "sky",
    nextBilling: "Feb 25, 2026",
    price: 29,
    stats: [
      { label: "Mailboxes", value: "5/10", progress: 50 },
      { label: "Storage", value: "12 GB / 50 GB", progress: 24 },
    ],
  },
];

export const SUGGESTED_SERVICES: SuggestedService[] = [
  {
    name: "Global CDN",
    description: "Accelerate your site globally with 200+ edge locations for lightning-fast delivery",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    color: "sky",
    price: 9,
    badge: { label: "Popular", type: "popular" },
    features: ["200+ Edge Locations", "Auto Optimization", "Real-time Analytics"],
  },
  {
    name: "Premium SSL",
    description: "Enhanced security with wildcard certificates and extended validation",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    color: "emerald",
    price: 19,
    badge: { label: "Recommended", type: "recommended" },
    features: ["Wildcard Support", "EV Certificates", "Auto Renewal"],
  },
  {
    name: "Priority Backup",
    description: "Automated hourly backups with 30-day retention and instant restore",
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
    color: "violet",
    price: 12,
    features: ["Hourly Backups", "30-Day Retention", "One-Click Restore"],
  },
  {
    name: "Uptime Monitoring",
    description: "Real-time availability monitoring with instant alerts and detailed reports",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605",
    color: "amber",
    price: 7,
    badge: { label: "New", type: "new" },
    features: ["1-Min Checks", "SMS Alerts", "Status Pages"],
  },
  {
    name: "Staging Environment",
    description: "Test changes safely in an isolated environment before going live",
    icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
    color: "zinc",
    price: 15,
    features: ["One-Click Deploy", "Sync to Live", "Branch Support"],
  },
  {
    name: "Web App Firewall",
    description: "Advanced threat protection with DDoS mitigation and bot blocking",
    icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013-5.4 8.25 8.25 0 013.362 1.014zM12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z",
    color: "rose",
    price: 24,
    badge: { label: "Popular", type: "popular" },
    features: ["DDoS Protection", "Bot Blocking", "Rate Limiting"],
  },
];

export const SERVICE_BADGE_STYLES: Record<string, string> = {
  popular: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  recommended: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  new: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
};
