export type NotificationType =
  | "backup-complete"
  | "site-down"
  | "ssl-expiring"
  | "deploy-finished"
  | "new-login"
  | "system-update"
  | "billing"
  | "security"
  | "domain"
  | "email"
  | "staging"
  | "performance"
  | "migration"
  | "support-reply"
  | "announcement"
  | "changelog";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  site?: string;
}

export const NOTIFICATION_STYLES: Record<
  NotificationType,
  { bg: string; text: string; ring: string; iconPath: string; label: string }
> = {
  "backup-complete": {
    bg: "bg-emerald-500/15",
    text: "text-emerald-500",
    ring: "ring-emerald-500/20",
    iconPath: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
    label: "Backup",
  },
  "site-down": {
    bg: "bg-rose-500/15",
    text: "text-rose-500",
    ring: "ring-rose-500/20",
    iconPath: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    label: "Alert",
  },
  "ssl-expiring": {
    bg: "bg-amber-500/15",
    text: "text-amber-500",
    ring: "ring-amber-500/20",
    iconPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    label: "SSL",
  },
  "deploy-finished": {
    bg: "bg-sky-500/15",
    text: "text-sky-500",
    ring: "ring-sky-500/20",
    iconPath: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    label: "Deploy",
  },
  "new-login": {
    bg: "bg-slate-500/15",
    text: "text-slate-500",
    ring: "ring-slate-500/20",
    iconPath: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    label: "Login",
  },
  "system-update": {
    bg: "bg-violet-500/15",
    text: "text-violet-500",
    ring: "ring-violet-500/20",
    iconPath: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3",
    label: "Update",
  },
  billing: {
    bg: "bg-orange-500/15",
    text: "text-orange-500",
    ring: "ring-orange-500/20",
    iconPath: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
    label: "Billing",
  },
  security: {
    bg: "bg-red-500/15",
    text: "text-red-500",
    ring: "ring-red-500/20",
    iconPath: "M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    label: "Security",
  },
  domain: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-500",
    ring: "ring-indigo-500/20",
    iconPath: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    label: "Domain",
  },
  email: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-500",
    ring: "ring-cyan-500/20",
    iconPath: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    label: "Email",
  },
  staging: {
    bg: "bg-purple-500/15",
    text: "text-purple-500",
    ring: "ring-purple-500/20",
    iconPath: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z",
    label: "Staging",
  },
  performance: {
    bg: "bg-teal-500/15",
    text: "text-teal-500",
    ring: "ring-teal-500/20",
    iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    label: "Performance",
  },
  migration: {
    bg: "bg-pink-500/15",
    text: "text-pink-500",
    ring: "ring-pink-500/20",
    iconPath: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    label: "Migration",
  },
  "support-reply": {
    bg: "bg-blue-500/15",
    text: "text-blue-500",
    ring: "ring-blue-500/20",
    iconPath: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
    label: "Support",
  },
  announcement: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-500",
    ring: "ring-yellow-500/20",
    iconPath: "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46",
    label: "Announcement",
  },
  changelog: {
    bg: "bg-lime-500/15",
    text: "text-lime-500",
    ring: "ring-lime-500/20",
    iconPath: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
    label: "Changelog",
  },
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  // Recent — unread
  { id: "n1", type: "backup-complete", title: "Backup completed", description: "Full backup of limewp.com finished successfully. Size: 1.8 GB.", time: "2 min ago", unread: true, site: "limewp.com" },
  { id: "n2", type: "site-down", title: "Site unreachable", description: "supernova.guru is not responding. Our team has been notified and is investigating.", time: "5 min ago", unread: true, site: "supernova.guru" },
  { id: "n3", type: "billing", title: "Free trial ending soon", description: "Your 6-month free trial expires in 14 days. Add a payment method to continue hosting.", time: "10 min ago", unread: true },
  { id: "n4", type: "security", title: "Brute force attack blocked", description: "47 failed login attempts from IP 203.0.113.50 were blocked by the firewall on limewp.com.", time: "15 min ago", unread: true, site: "limewp.com" },
  { id: "n5", type: "ssl-expiring", title: "SSL certificate expiring", description: "The SSL certificate for supernova.guru expires in 7 days. Auto-renewal is scheduled.", time: "30 min ago", unread: true, site: "supernova.guru" },
  { id: "n6", type: "performance", title: "Speed score dropped", description: "limewp.com speed score dropped from 92 to 78. Consider clearing cache and optimizing images.", time: "45 min ago", unread: true, site: "limewp.com" },
  { id: "n7", type: "deploy-finished", title: "Deployment complete", description: "WordPress 6.7.1 has been deployed to limewp.com. All health checks passed.", time: "1 hour ago", unread: true, site: "limewp.com" },
  { id: "n7a", type: "support-reply", title: "Support replied to your ticket", description: "Our team replied to ticket #1234 — 'SSL certificate not working'. Check the latest update.", time: "1 hour ago", unread: true },
  { id: "n7b", type: "announcement", title: "Scheduled maintenance tonight", description: "We'll be performing server upgrades tonight from 2:00-4:00 AM UTC. Brief interruptions may occur.", time: "2 hours ago", unread: true },
  { id: "n7c", type: "changelog", title: "LimeWP v2.4.0 released", description: "New DNS management, migration wizard with 12 providers, and improved staging workflow. View changelog.", time: "2 hours ago", unread: true },

  // Recent — read
  { id: "n8", type: "domain", title: "DNS propagation complete", description: "DNS records for supernova.guru have fully propagated across all nameservers.", time: "2 hours ago", unread: false, site: "supernova.guru" },
  { id: "n9", type: "new-login", title: "New login detected", description: "A new login was detected from Chrome on macOS in San Francisco, CA.", time: "3 hours ago", unread: false },
  { id: "n10", type: "email", title: "Mailbox almost full", description: "admin@limewp.com has used 90% of its 1 GB quota. Consider upgrading or cleaning up.", time: "4 hours ago", unread: false, site: "limewp.com" },
  { id: "n11", type: "staging", title: "Staging pushed to live", description: "Staging changes for limewp.com have been successfully pushed to the live site.", time: "5 hours ago", unread: false, site: "limewp.com" },
  { id: "n12", type: "system-update", title: "PHP 8.3.7 available", description: "A new PHP version is available for your servers. Update at your convenience.", time: "6 hours ago", unread: false },
  { id: "n13", type: "billing", title: "Invoice generated", description: "Invoice #INV-2026-004 for $49.00 (Business Plan) has been generated.", time: "8 hours ago", unread: false },
  { id: "n14", type: "migration", title: "Migration completed", description: "3 sites from cPanel have been successfully migrated to LimeWP.", time: "10 hours ago", unread: false },

  // Older
  { id: "n15", type: "security", title: "Malware scan completed", description: "No threats detected on limewp.com. Last scan: 0 issues found across 2,847 files.", time: "12 hours ago", unread: false, site: "limewp.com" },
  { id: "n16", type: "backup-complete", title: "Backup completed", description: "Scheduled daily backup of supernova.guru completed. Size: 2.4 GB.", time: "1 day ago", unread: false, site: "supernova.guru" },
  { id: "n17", type: "domain", title: "Domain added", description: "blog.limewp.com has been added to your account and SSL is being provisioned.", time: "1 day ago", unread: false, site: "limewp.com" },
  { id: "n18", type: "performance", title: "Cache hit rate improved", description: "Edge caching hit rate for limewp.com improved from 85% to 97% after CDN configuration.", time: "1 day ago", unread: false, site: "limewp.com" },
  { id: "n19", type: "email", title: "DKIM configured", description: "DKIM signing has been enabled for limewp.com. Email deliverability should improve.", time: "2 days ago", unread: false, site: "limewp.com" },
  { id: "n20", type: "site-down", title: "Site recovered", description: "supernova.guru is back online. Downtime: 3 minutes. Root cause: DNS propagation delay.", time: "2 days ago", unread: false, site: "supernova.guru" },
  { id: "n21", type: "staging", title: "Staging environment created", description: "A new staging copy of limewp.com has been created at staging.limewp.com.", time: "3 days ago", unread: false, site: "limewp.com" },
  { id: "n22", type: "deploy-finished", title: "Plugin update deployed", description: "WooCommerce 9.2 has been updated on limewp.com successfully.", time: "3 days ago", unread: false, site: "limewp.com" },
  { id: "n23", type: "billing", title: "Payment successful", description: "Payment of $49.00 for Business Plan has been processed. Visa ending in 4242.", time: "4 days ago", unread: false },
  { id: "n24", type: "security", title: "2FA enabled", description: "Two-factor authentication has been enabled for your account via authenticator app.", time: "5 days ago", unread: false },
  { id: "n25", type: "migration", title: "Migration started", description: "Migration of 3 sites from cPanel has started. Estimated time: 15 minutes.", time: "5 days ago", unread: false },
  { id: "n26", type: "domain", title: "Domain expiring", description: "supernova.guru domain registration expires in 30 days. Renew to avoid service disruption.", time: "1 week ago", unread: false, site: "supernova.guru" },
  { id: "n27", type: "system-update", title: "WordPress 6.7.1 available", description: "A new WordPress version is available. Review changelog before updating.", time: "1 week ago", unread: false },
  { id: "n28", type: "performance", title: "Resource usage warning", description: "limewp.com CPU usage exceeded 80% for 10 minutes. Consider upgrading your plan.", time: "1 week ago", unread: false, site: "limewp.com" },
  { id: "n29", type: "email", title: "Spam threshold exceeded", description: "supernova.guru received 150+ spam emails today. Spam filter level has been auto-increased.", time: "2 weeks ago", unread: false, site: "supernova.guru" },
  { id: "n30", type: "billing", title: "Payment method expiring", description: "Your Visa card ending in 4242 expires next month. Update your payment method.", time: "2 weeks ago", unread: false },
  { id: "n31", type: "support-reply", title: "Ticket #1233 resolved", description: "Your support ticket 'Need help with DNS setup' has been resolved. Please confirm.", time: "2 weeks ago", unread: false },
  { id: "n32", type: "changelog", title: "LimeWP v2.3.0 released", description: "New migration wizard supports 12 hosting providers. One-click migration with zero downtime.", time: "2 weeks ago", unread: false },
  { id: "n33", type: "announcement", title: "New Singapore data center", description: "Asia-Pacific (Singapore) data center is now available. Migrate existing sites or deploy new ones.", time: "3 weeks ago", unread: false },
  { id: "n34", type: "support-reply", title: "Ticket #1230 update", description: "Our migration team has started working on your migration request. ETA: 2 hours.", time: "3 weeks ago", unread: false },
  { id: "n35", type: "announcement", title: "Holiday support hours", description: "Support hours will be limited Dec 24-26. Emergency support remains 24/7.", time: "1 month ago", unread: false },
];
