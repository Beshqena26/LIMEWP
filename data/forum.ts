/**
 * Forum page mock data.
 */
import type { ReactNode } from "react";

export interface ForumCategoryData {
  title: string;
  desc: string;
  stats: string;
  bg: string;
  text: string;
  iconPath: string;
}

export interface ThreadTag {
  label: string;
  bg: string;
  text: string;
}

export interface ForumThread {
  initials: string;
  gradient: string;
  title: string;
  meta: string;
  excerpt: string;
  tags: ThreadTag[];
  comments: number;
  views: number;
}

export interface ForumContributor {
  initials: string;
  gradient: string;
  name: string;
  helpful: string;
  badge: string | null;
  badgeBg: string;
  badgeText: string;
}

export interface ForumStat {
  value: string;
  label: string;
}

export const FORUM_CATEGORIES: ForumCategoryData[] = [
  {
    title: "General Discussion",
    desc: "Chat about anything related to WordPress and web hosting",
    stats: "1,234 threads · 8,567 replies",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    iconPath: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  },
  {
    title: "Technical Support",
    desc: "Get help with hosting issues, errors, and configurations",
    stats: "2,456 threads · 15,234 replies",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    iconPath: "M11.42 15.17l-5.1-5.1a2.12 2.12 0 113-3l5.1 5.1m0 0l5.1 5.1a2.12 2.12 0 01-3 3l-5.1-5.1zm0 0L9 12m2.42 3.17L15 12",
  },
  {
    title: "Feature Requests",
    desc: "Share ideas and vote on new features for LimeWP",
    stats: "456 threads · 2,890 replies",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    iconPath: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
  {
    title: "Showcase",
    desc: "Show off your WordPress sites built on LimeWP",
    stats: "189 threads · 1,456 replies",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    iconPath: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
];

export const FORUM_THREADS: ForumThread[] = [
  {
    initials: "JD",
    gradient: "from-emerald-500 to-sky-500",
    title: "How to configure Redis object caching for better performance?",
    meta: "John Doe · Technical Support · 2 hours ago",
    excerpt: "I've been trying to set up Redis for my WordPress site...",
    tags: [],
    comments: 12,
    views: 156,
  },
  {
    initials: "SM",
    gradient: "from-violet-500 to-purple-500",
    title: "Best practices for WordPress multisite on LimeWP",
    meta: "Sarah M. · General Discussion · 5 hours ago",
    excerpt: "I'm planning to set up a multisite network...",
    tags: [{ label: "Solved", bg: "bg-emerald-500/10", text: "text-emerald-400" }],
    comments: 24,
    views: 342,
  },
  {
    initials: "MK",
    gradient: "from-sky-500 to-blue-500",
    title: "Feature Request: Staging environment one-click deploy",
    meta: "Mike K. · Feature Requests · 1 day ago",
    excerpt: "It would be great to have a one-click deploy...",
    tags: [{ label: "Popular", bg: "bg-amber-500/10", text: "text-amber-400" }],
    comments: 45,
    views: 567,
  },
  {
    initials: "AL",
    gradient: "from-amber-500 to-orange-500",
    title: "Showcase: My e-commerce site built with WooCommerce",
    meta: "Amy L. · Showcase · 2 days ago",
    excerpt: "Just launched my online store using WooCommerce...",
    tags: [],
    comments: 18,
    views: 234,
  },
  {
    initials: "RJ",
    gradient: "from-red-500 to-pink-500",
    title: "SSL certificate not renewing automatically",
    meta: "Rob J. · Technical Support · 3 days ago",
    excerpt: "My SSL cert didn't auto-renew and now my site...",
    tags: [{ label: "Solved", bg: "bg-emerald-500/10", text: "text-emerald-400" }],
    comments: 8,
    views: 189,
  },
];

export const FORUM_CONTRIBUTORS: ForumContributor[] = [
  { initials: "JD", gradient: "from-emerald-500 to-teal-500", name: "John Doe", helpful: "142 helpful answers", badge: "MVP", badgeBg: "bg-emerald-500/10", badgeText: "text-emerald-400" },
  { initials: "SM", gradient: "from-violet-500 to-purple-500", name: "Sarah M.", helpful: "98 helpful answers", badge: "Expert", badgeBg: "bg-violet-500/10", badgeText: "text-violet-400" },
  { initials: "MK", gradient: "from-sky-500 to-blue-500", name: "Mike K.", helpful: "76 helpful answers", badge: "Expert", badgeBg: "bg-violet-500/10", badgeText: "text-violet-400" },
  { initials: "AL", gradient: "from-amber-500 to-orange-500", name: "Amy L.", helpful: "54 helpful answers", badge: null, badgeBg: "", badgeText: "" },
];

export const FORUM_TRENDING_TAGS = ["performance", "ssl", "migration", "woocommerce", "caching", "php8", "backup", "dns", "multisite"];

export const FORUM_STATS: ForumStat[] = [
  { value: "4,335", label: "Discussions" },
  { value: "28.1K", label: "Replies" },
  { value: "12.5K", label: "Members" },
  { value: "89%", label: "Solved" },
];
