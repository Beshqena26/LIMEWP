export type NotificationType =
  | "backup-complete"
  | "site-down"
  | "ssl-expiring"
  | "deploy-finished"
  | "new-login"
  | "system-update";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATION_STYLES: Record<
  NotificationType,
  { bg: string; text: string; ring: string; iconPath: string; label: string }
> = {
  "backup-complete": {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
    iconPath: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
    label: "Backup",
  },
  "site-down": {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    ring: "ring-rose-500/20",
    iconPath: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    label: "Alert",
  },
  "ssl-expiring": {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    ring: "ring-amber-500/20",
    iconPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    label: "SSL",
  },
  "deploy-finished": {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    ring: "ring-sky-500/20",
    iconPath: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    label: "Deploy",
  },
  "new-login": {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    ring: "ring-slate-500/20",
    iconPath: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    label: "Login",
  },
  "system-update": {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    ring: "ring-violet-500/20",
    iconPath: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3",
    label: "Update",
  },
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "backup-complete", title: "Backup completed", description: "Full backup of limewp.com finished successfully. Size: 1.8 GB.", time: "2 min ago", unread: true },
  { id: "n2", type: "site-down", title: "Site unreachable", description: "supernova.guru is not responding. Our team has been notified and is investigating.", time: "5 min ago", unread: true },
  { id: "n3", type: "ssl-expiring", title: "SSL certificate expiring", description: "The SSL certificate for supernova.guru expires in 7 days. Auto-renewal is scheduled.", time: "15 min ago", unread: true },
  { id: "n4", type: "deploy-finished", title: "Deployment complete", description: "WordPress 6.7.1 has been deployed to limewp.com. All health checks passed.", time: "1 hour ago", unread: true },
  { id: "n5", type: "new-login", title: "New login detected", description: "A new login was detected from Chrome on macOS in San Francisco, CA.", time: "2 hours ago", unread: true },
  { id: "n6", type: "system-update", title: "PHP 8.3.7 available", description: "A new PHP version is available for your servers. Update at your convenience.", time: "3 hours ago", unread: true },
  { id: "n7", type: "backup-complete", title: "Backup completed", description: "Scheduled daily backup of supernova.guru completed. Size: 2.4 GB.", time: "4 hours ago", unread: true },
  { id: "n8", type: "deploy-finished", title: "Plugin update deployed", description: "WooCommerce 9.2 has been updated on limewp.com successfully.", time: "5 hours ago", unread: false },
  { id: "n9", type: "ssl-expiring", title: "SSL renewed", description: "The SSL certificate for limewp.com has been automatically renewed.", time: "6 hours ago", unread: false },
  { id: "n10", type: "new-login", title: "New login detected", description: "Login from Firefox on Windows in New York, NY.", time: "8 hours ago", unread: false },
  { id: "n11", type: "system-update", title: "WordPress 6.7.1 available", description: "A new WordPress version is available. Review changelog before updating.", time: "12 hours ago", unread: false },
  { id: "n12", type: "backup-complete", title: "Backup completed", description: "Full backup of limewp.com finished. Size: 1.7 GB.", time: "1 day ago", unread: false },
  { id: "n13", type: "site-down", title: "Site recovered", description: "supernova.guru is back online. Downtime: 3 minutes. Root cause: DNS propagation delay.", time: "1 day ago", unread: false },
  { id: "n14", type: "deploy-finished", title: "Theme update deployed", description: "Flavor Theme 3.2 deployed to supernova.guru.", time: "1 day ago", unread: false },
  { id: "n15", type: "new-login", title: "New login detected", description: "Login from Safari on iOS in London, UK.", time: "2 days ago", unread: false },
  { id: "n16", type: "system-update", title: "Server maintenance scheduled", description: "Scheduled maintenance window on March 25, 2:00-4:00 AM UTC.", time: "2 days ago", unread: false },
  { id: "n17", type: "backup-complete", title: "Backup completed", description: "Weekly backup of all sites completed. Total size: 4.2 GB.", time: "3 days ago", unread: false },
  { id: "n18", type: "ssl-expiring", title: "SSL certificate expiring", description: "The SSL certificate for blog.example.com expires in 14 days.", time: "4 days ago", unread: false },
  { id: "n19", type: "deploy-finished", title: "Deployment complete", description: "Nginx configuration update applied to all servers.", time: "5 days ago", unread: false },
  { id: "n20", type: "site-down", title: "High latency detected", description: "limewp.com response time exceeded 2s threshold for 5 minutes.", time: "1 week ago", unread: false },
  { id: "n21", type: "new-login", title: "New API key used", description: "API key ending in ...a4f2 was used for the first time.", time: "1 week ago", unread: false },
  { id: "n22", type: "system-update", title: "MySQL 8.0.37 available", description: "A new MySQL version is available. Includes security patches.", time: "2 weeks ago", unread: false },
  { id: "n23", type: "backup-complete", title: "Backup restored", description: "limewp.com was restored from backup dated March 5, 2026.", time: "2 weeks ago", unread: false },
  { id: "n24", type: "deploy-finished", title: "CDN cache purged", description: "Global CDN cache has been purged for supernova.guru.", time: "3 weeks ago", unread: false },
  { id: "n25", type: "system-update", title: "New data center available", description: "Asia-Pacific (Singapore) data center is now available for new deployments.", time: "3 weeks ago", unread: false },
];
