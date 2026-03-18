/**
 * Documentation page mock data.
 */

export interface DocItem {
  title: string;
  readTime: string;
  updated: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface DocSection {
  label: string;
  icon: string;
  color: string;
  items: DocItem[];
}

export interface TableOfContentsItem {
  id: string;
  label: string;
}

export interface PopularArticle {
  title: string;
  category: string;
  readTime: string;
}

export interface DocStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    label: "Getting Started",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    color: "emerald",
    items: [
      { title: "Quick Start Guide", readTime: "5 min", updated: "Jan 15, 2026", isNew: true },
      { title: "Creating Your First Site", readTime: "8 min", updated: "Jan 12, 2026" },
      { title: "Migrating from Another Host", readTime: "12 min", updated: "Jan 10, 2026" },
    ],
  },
  {
    label: "Site Management",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    color: "sky",
    items: [
      { title: "Managing WordPress Sites", readTime: "10 min", updated: "Jan 14, 2026" },
      { title: "Backups & Restore", readTime: "7 min", updated: "Jan 13, 2026", isPopular: true },
      { title: "Domain & DNS Settings", readTime: "6 min", updated: "Jan 11, 2026" },
      { title: "SSL Certificates", readTime: "5 min", updated: "Jan 8, 2026" },
    ],
  },
  {
    label: "Advanced",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    color: "violet",
    items: [
      { title: "WP-CLI Commands", readTime: "15 min", updated: "Jan 9, 2026" },
      { title: "SSH & SFTP Access", readTime: "8 min", updated: "Jan 7, 2026" },
      { title: "Performance Optimization", readTime: "12 min", updated: "Jan 5, 2026", isPopular: true },
    ],
  },
  {
    label: "Troubleshooting",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    color: "amber",
    items: [
      { title: "Common Error Messages", readTime: "10 min", updated: "Jan 6, 2026" },
      { title: "Database Issues", readTime: "8 min", updated: "Jan 4, 2026" },
      { title: "Plugin Conflicts", readTime: "6 min", updated: "Jan 3, 2026" },
    ],
  },
];

export const TABLE_OF_CONTENTS: TableOfContentsItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "step-1", label: "Step 1: Create a New Site" },
  { id: "step-2", label: "Step 2: Configure Your Site" },
  { id: "step-3", label: "Step 3: Install Plugins" },
  { id: "next-steps", label: "Next Steps" },
];

export const POPULAR_ARTICLES: PopularArticle[] = [
  { title: "How to migrate from cPanel", category: "Migration", readTime: "10 min" },
  { title: "Setting up automatic backups", category: "Backups", readTime: "5 min" },
  { title: "Optimizing WordPress speed", category: "Performance", readTime: "12 min" },
  { title: "Connecting a custom domain", category: "DNS", readTime: "6 min" },
];

export const DOC_STATS: DocStat[] = [
  { label: "Total Articles", value: "47", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", color: "emerald" },
  { label: "Categories", value: "4", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z", color: "sky" },
  { label: "Video Tutorials", value: "12", icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z", color: "violet" },
  { label: "Last Updated", value: "Today", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "amber" },
];

export const RECOMMENDED_PLUGINS = [
  { name: "Wordfence Security", desc: "Firewall and malware scanner", color: "emerald", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  { name: "W3 Total Cache", desc: "Performance optimization", color: "sky", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { name: "Smush", desc: "Image compression", color: "violet", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12z" },
  { name: "Yoast SEO", desc: "Search engine optimization", color: "amber", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
];
