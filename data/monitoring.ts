export type MonitorStatus = "up" | "down" | "degraded";

export interface DailyStatus {
  date: string;
  status: MonitorStatus;
  uptime: number;
  responseTime: number;
}

export interface MonitoredSite {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  uptime: number;
  avgResponse: number;
  dailyStatus: DailyStatus[];
}

export interface Incident {
  id: string;
  date: string;
  duration: string;
  sites: string[];
  rootCause: string;
  status: "resolved" | "investigating";
}

export const STATUS_COLORS: Record<MonitorStatus, { bg: string; text: string; dot: string; ring: string }> = {
  up: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", ring: "ring-emerald-500/20" },
  down: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400", ring: "ring-rose-500/20" },
  degraded: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", ring: "ring-amber-500/20" },
};

export const STATUS_LABELS: Record<MonitorStatus, string> = {
  up: "Up",
  down: "Down",
  degraded: "Degraded",
};

/* ────────────── generate daily status ────────────── */

function generateDailyStatus(seed: number): DailyStatus[] {
  const days: DailyStatus[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const rng = ((seed * 9301 + 49297 + i * 233) % 233280) / 233280;
    let status: MonitorStatus = "up";
    let uptime = 99.9 + rng * 0.1;
    let responseTime = 150 + Math.floor(rng * 200);
    if (i === 12 && seed === 1) { status = "down"; uptime = 95.2; responseTime = 2400; }
    if (i === 5 && seed === 3) { status = "degraded"; uptime = 98.1; responseTime = 1200; }
    days.push({ date: dateStr, status, uptime: Math.round(uptime * 100) / 100, responseTime });
  }
  return days;
}

export const MONITORED_SITES: MonitoredSite[] = [
  { id: "ms1", name: "limewp.com", url: "https://limewp.com", status: "up", uptime: 99.97, avgResponse: 185, dailyStatus: generateDailyStatus(1) },
  { id: "ms2", name: "supernova.guru", url: "https://supernova.guru", status: "up", uptime: 99.99, avgResponse: 142, dailyStatus: generateDailyStatus(2) },
  { id: "ms3", name: "shop.limewp.com", url: "https://shop.limewp.com", status: "degraded", uptime: 98.54, avgResponse: 890, dailyStatus: generateDailyStatus(3) },
  { id: "ms4", name: "blog.example.com", url: "https://blog.example.com", status: "up", uptime: 99.95, avgResponse: 210, dailyStatus: generateDailyStatus(4) },
];

export const INCIDENTS: Incident[] = [
  { id: "inc1", date: "2026-03-18", duration: "3 min", sites: ["limewp.com"], rootCause: "DNS propagation delay after zone update", status: "resolved" },
  { id: "inc2", date: "2026-03-10", duration: "12 min", sites: ["shop.limewp.com"], rootCause: "Database connection pool exhaustion under load spike", status: "resolved" },
  { id: "inc3", date: "2026-02-28", duration: "45 min", sites: ["limewp.com", "supernova.guru", "shop.limewp.com"], rootCause: "Upstream provider network maintenance in Frankfurt DC", status: "resolved" },
  { id: "inc4", date: "2026-02-15", duration: "8 min", sites: ["blog.example.com"], rootCause: "SSL certificate renewal timeout — auto-retry succeeded", status: "resolved" },
];

/* ────────────── chart data ────────────── */

export interface ResponseTimePoint {
  time: string;
  value: number;
  avg: number;
}

function generateResponseData(hours: number, intervalMinutes: number): ResponseTimePoint[] {
  const data: ResponseTimePoint[] = [];
  const now = new Date();
  const points = Math.floor((hours * 60) / intervalMinutes);
  let total = 0;
  const baseValues: number[] = [];

  for (let i = 0; i < points; i++) {
    const rng = ((i * 7919 + 104729) % 233280) / 233280;
    const spike = i === Math.floor(points * 0.3) ? 400 : i === Math.floor(points * 0.7) ? 250 : 0;
    const val = Math.round(140 + rng * 180 + spike);
    baseValues.push(val);
    total += val;
  }

  const avg = Math.round(total / points);

  for (let i = 0; i < points; i++) {
    const date = new Date(now.getTime() - (points - 1 - i) * intervalMinutes * 60000);
    const label = hours <= 24
      ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    data.push({ time: label, value: baseValues[i], avg });
  }

  return data;
}

export const RESPONSE_TIME_DATA: Record<string, ResponseTimePoint[]> = {
  "24h": generateResponseData(24, 30),
  "7d": generateResponseData(168, 360),
  "30d": generateResponseData(720, 1440),
  "90d": generateResponseData(2160, 4320),
};
