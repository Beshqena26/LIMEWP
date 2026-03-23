export type BanDuration = "1h" | "24h" | "7d" | "30d" | "permanent";
export type BanReason = "brute-force" | "spam" | "scraping" | "manual" | "auto-rule";

export interface BlockedIP {
  id: string;
  ip: string;
  reason: BanReason;
  note: string;
  hits: number;
  createdAt: string;
  expiresAt: string | null;
  country: string;
  countryCode: string;
}

export interface BlockedAttempt {
  id: string;
  ip: string;
  url: string;
  time: string;
  country: string;
  countryCode: string;
  method: string;
}

export interface WhitelistedIP {
  id: string;
  ip: string;
  label: string;
  addedAt: string;
}

export interface AutoBanRule {
  id: string;
  name: string;
  description: string;
  threshold: number;
  window: string;
  duration: BanDuration;
  enabled: boolean;
}

export const BAN_REASONS: { value: BanReason; label: string }[] = [
  { value: "brute-force", label: "Brute Force" },
  { value: "spam", label: "Spam" },
  { value: "scraping", label: "Scraping" },
  { value: "manual", label: "Manual Block" },
  { value: "auto-rule", label: "Auto-Ban Rule" },
];

export const BAN_DURATIONS: { value: BanDuration; label: string }[] = [
  { value: "1h", label: "1 Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "permanent", label: "Permanent" },
];

export const BLOCKED_IPS: BlockedIP[] = [
  { id: "b1", ip: "185.220.101.45", reason: "brute-force", note: "500+ failed login attempts", hits: 2341, createdAt: "Mar 20, 2026", expiresAt: null, country: "Russia", countryCode: "RU" },
  { id: "b2", ip: "103.21.244.0/24", reason: "scraping", note: "Aggressive content scraping", hits: 8923, createdAt: "Mar 18, 2026", expiresAt: null, country: "China", countryCode: "CN" },
  { id: "b3", ip: "45.33.32.156", reason: "spam", note: "Comment spam bot", hits: 456, createdAt: "Mar 15, 2026", expiresAt: "Apr 15, 2026", country: "United States", countryCode: "US" },
  { id: "b4", ip: "91.108.4.0/22", reason: "auto-rule", note: "Exceeded rate limit (200 req/min)", hits: 1567, createdAt: "Mar 22, 2026", expiresAt: "Mar 23, 2026", country: "Germany", countryCode: "DE" },
  { id: "b5", ip: "178.62.198.34", reason: "manual", note: "Suspicious activity on admin pages", hits: 89, createdAt: "Mar 10, 2026", expiresAt: null, country: "Netherlands", countryCode: "NL" },
  { id: "b6", ip: "209.85.238.0/24", reason: "scraping", note: "Unauthorized API access", hits: 3421, createdAt: "Mar 5, 2026", expiresAt: "Apr 5, 2026", country: "United States", countryCode: "US" },
];

export const BLOCKED_ATTEMPTS: BlockedAttempt[] = [
  { id: "a1", ip: "185.220.101.45", url: "/wp-login.php", time: "2 min ago", country: "Russia", countryCode: "RU", method: "POST" },
  { id: "a2", ip: "103.21.244.12", url: "/wp-content/uploads/", time: "5 min ago", country: "China", countryCode: "CN", method: "GET" },
  { id: "a3", ip: "185.220.101.45", url: "/xmlrpc.php", time: "8 min ago", country: "Russia", countryCode: "RU", method: "POST" },
  { id: "a4", ip: "91.108.4.15", url: "/wp-json/wp/v2/posts", time: "12 min ago", country: "Germany", countryCode: "DE", method: "GET" },
  { id: "a5", ip: "103.21.244.88", url: "/wp-admin/admin-ajax.php", time: "15 min ago", country: "China", countryCode: "CN", method: "POST" },
  { id: "a6", ip: "45.33.32.156", url: "/wp-comments-post.php", time: "22 min ago", country: "United States", countryCode: "US", method: "POST" },
  { id: "a7", ip: "178.62.198.34", url: "/wp-admin/", time: "1 hour ago", country: "Netherlands", countryCode: "NL", method: "GET" },
  { id: "a8", ip: "185.220.101.45", url: "/wp-login.php", time: "1 hour ago", country: "Russia", countryCode: "RU", method: "POST" },
];

export const WHITELISTED_IPS: WhitelistedIP[] = [
  { id: "w1", ip: "192.168.1.45", label: "My Office IP", addedAt: "Jan 15, 2026" },
  { id: "w2", ip: "35.192.0.0/12", label: "Google Cloud (Payments)", addedAt: "Feb 1, 2026" },
  { id: "w3", ip: "52.16.0.0/15", label: "AWS (CDN Origin)", addedAt: "Feb 10, 2026" },
];

export const AUTO_BAN_RULES: AutoBanRule[] = [
  { id: "ar1", name: "Failed Login Protection", description: "Block after too many failed login attempts", threshold: 5, window: "15 min", duration: "24h", enabled: true },
  { id: "ar2", name: "Rate Limiter", description: "Block IPs exceeding request rate limit", threshold: 200, window: "1 min", duration: "1h", enabled: true },
  { id: "ar3", name: "XML-RPC Protection", description: "Block excessive XML-RPC requests", threshold: 10, window: "5 min", duration: "7d", enabled: false },
  { id: "ar4", name: "Comment Spam Guard", description: "Block IPs posting too many comments", threshold: 20, window: "1 hour", duration: "30d", enabled: true },
];

export const COUNTRY_LIST: { name: string; code: string }[] = [
  { name: "Afghanistan", code: "AF" }, { name: "Albania", code: "AL" }, { name: "Algeria", code: "DZ" },
  { name: "Argentina", code: "AR" }, { name: "Australia", code: "AU" }, { name: "Bangladesh", code: "BD" },
  { name: "Belarus", code: "BY" }, { name: "Brazil", code: "BR" }, { name: "Cambodia", code: "KH" },
  { name: "China", code: "CN" }, { name: "Colombia", code: "CO" }, { name: "Cuba", code: "CU" },
  { name: "Egypt", code: "EG" }, { name: "Ethiopia", code: "ET" }, { name: "Georgia", code: "GE" },
  { name: "Ghana", code: "GH" }, { name: "India", code: "IN" }, { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" }, { name: "Iraq", code: "IQ" }, { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" }, { name: "Libya", code: "LY" }, { name: "Malaysia", code: "MY" },
  { name: "Mexico", code: "MX" }, { name: "Morocco", code: "MA" }, { name: "Myanmar", code: "MM" },
  { name: "Nepal", code: "NP" }, { name: "Nigeria", code: "NG" }, { name: "North Korea", code: "KP" },
  { name: "Pakistan", code: "PK" }, { name: "Philippines", code: "PH" }, { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" }, { name: "Saudi Arabia", code: "SA" }, { name: "South Africa", code: "ZA" },
  { name: "Sri Lanka", code: "LK" }, { name: "Sudan", code: "SD" }, { name: "Syria", code: "SY" },
  { name: "Thailand", code: "TH" }, { name: "Turkey", code: "TR" }, { name: "Ukraine", code: "UA" },
  { name: "Uzbekistan", code: "UZ" }, { name: "Venezuela", code: "VE" }, { name: "Vietnam", code: "VN" },
  { name: "Yemen", code: "YE" }, { name: "Zimbabwe", code: "ZW" },
];
