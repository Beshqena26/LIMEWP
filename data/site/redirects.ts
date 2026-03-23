export type RedirectType = "301" | "302" | "307";

export interface Redirect {
  id: string;
  source: string;
  destination: string;
  type: RedirectType;
  hits: number;
  enabled: boolean;
  createdAt: string;
  regex: boolean;
}

export interface Redirect404 {
  id: string;
  url: string;
  hits: number;
  lastSeen: string;
  referrer: string;
}

export const REDIRECT_TYPES: { value: RedirectType; label: string; description: string }[] = [
  { value: "301", label: "301 Permanent", description: "Page has permanently moved. Search engines transfer SEO value." },
  { value: "302", label: "302 Temporary", description: "Page is temporarily at a different URL. SEO stays on original." },
  { value: "307", label: "307 Preserve Method", description: "Like 302 but preserves the HTTP method (POST stays POST)." },
];

export const INITIAL_REDIRECTS: Redirect[] = [
  { id: "r1", source: "/old-blog", destination: "/blog", type: "301", hits: 1243, enabled: true, createdAt: "Jan 15, 2026", regex: false },
  { id: "r2", source: "/products/discontinued", destination: "/shop", type: "301", hits: 567, enabled: true, createdAt: "Feb 3, 2026", regex: false },
  { id: "r3", source: "/about-us", destination: "/about", type: "301", hits: 892, enabled: true, createdAt: "Dec 10, 2025", regex: false },
  { id: "r4", source: "/temporary-sale", destination: "/promotions/spring-2026", type: "302", hits: 234, enabled: true, createdAt: "Mar 1, 2026", regex: false },
  { id: "r5", source: "/wp-content/uploads/2024/(.*)", destination: "/media/$1", type: "301", hits: 3421, enabled: true, createdAt: "Nov 20, 2025", regex: true },
  { id: "r6", source: "/old-contact", destination: "/contact", type: "301", hits: 156, enabled: false, createdAt: "Jan 5, 2026", regex: false },
  { id: "r7", source: "/services/web-design", destination: "/services#design", type: "301", hits: 78, enabled: true, createdAt: "Mar 10, 2026", regex: false },
  { id: "r8", source: "/feed/rss", destination: "/feed", type: "301", hits: 445, enabled: true, createdAt: "Oct 1, 2025", regex: false },
];

export const INITIAL_404S: Redirect404[] = [
  { id: "e1", url: "/wp-login.php", hits: 892, lastSeen: "5 min ago", referrer: "Direct" },
  { id: "e2", url: "/old-page-2024", hits: 234, lastSeen: "1 hour ago", referrer: "google.com" },
  { id: "e3", url: "/images/banner-old.jpg", hits: 156, lastSeen: "3 hours ago", referrer: "internal" },
  { id: "e4", url: "/api/v1/deprecated", hits: 89, lastSeen: "6 hours ago", referrer: "app.example.com" },
  { id: "e5", url: "/category/uncategorized", hits: 67, lastSeen: "1 day ago", referrer: "bing.com" },
  { id: "e6", url: "/author/deleted-user", hits: 45, lastSeen: "2 days ago", referrer: "google.com" },
];
