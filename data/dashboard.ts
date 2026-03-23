/**
 * Dashboard page mock data.
 */

export interface DashboardSite {
  name: string;
  url: string;
  initials: string;
  gradient: string;
  visits: string;
  storage: string;
  wordpress: string;
  health: number;
  cpu: number;
  memory: number;
  storagePct: number;
}

export interface DashboardActivity {
  action: string;
  site: string;
  siteInitials: string;
  siteGradient: string;
  time: string;
  type: string;
  typeLabel: string;
  color: string;
  icon: string;
  details: string;
}

export const DASHBOARD_SITES: DashboardSite[] = [
  {
    name: "limewp.com",
    url: "https://limewp.com",
    initials: "LW",
    gradient: "bg-black",
    visits: "8,734",
    storage: "150 MB",
    wordpress: "WP 6.6.2",
    health: 76,
    cpu: 22,
    memory: 12,
    storagePct: 1.5,
  },
  {
    name: "supernova.guru",
    url: "https://supernova.guru",
    initials: "SG",
    gradient: "bg-black",
    visits: "15,821",
    storage: "420 MB",
    wordpress: "WP 6.6.2",
    health: 92,
    cpu: 45,
    memory: 38,
    storagePct: 4.2,
  },
];

export const DASHBOARD_ACTIVITIES: DashboardActivity[] = [
  {
    action: "Backup completed",
    site: "limewp.com",
    siteInitials: "LW",
    siteGradient: "from-emerald-500 to-teal-500",
    time: "2 hours ago",
    type: "backup",
    typeLabel: "Backup",
    color: "success",
    icon: "M5 13l4 4L19 7",
    details: "Full site backup • 148 MB",
  },
  {
    action: "Plugin updated",
    site: "supernova.guru",
    siteInitials: "SG",
    siteGradient: "from-orange-500 to-red-500",
    time: "5 hours ago",
    type: "update",
    typeLabel: "Update",
    color: "update",
    icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182",
    details: "Flavor starter v2.4.1 → v2.5.0",
  },
  {
    action: "SSL certificate renewed",
    site: "limewp.com",
    siteInitials: "LW",
    siteGradient: "from-emerald-500 to-teal-500",
    time: "1 day ago",
    type: "security",
    typeLabel: "Security",
    color: "info",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    details: "Valid until Jan 28, 2027",
  },
  {
    action: "PHP upgraded to 8.3",
    site: "supernova.guru",
    siteInitials: "SG",
    siteGradient: "from-orange-500 to-red-500",
    time: "2 days ago",
    type: "system",
    typeLabel: "System",
    color: "warning",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    details: "PHP 8.2 → PHP 8.3",
  },
  {
    action: "WordPress core updated",
    site: "limewp.com",
    siteInitials: "LW",
    siteGradient: "from-emerald-500 to-teal-500",
    time: "3 days ago",
    type: "update",
    typeLabel: "Update",
    color: "update",
    icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182",
    details: "WP 6.7.0 → WP 6.7.1",
  },
];
