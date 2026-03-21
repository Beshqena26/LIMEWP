export interface LogStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

export interface LogColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  iconBg: string;
  border: string;
}

export interface LogEntry {
  id: string;
  level: string;
  color: string;
  message: string;
  file: string;
  line: number | null;
  time: string;
  date: string;
}

export interface LogTypeOption {
  key: string;
  label: string;
  icon: string;
}

export const logStats: LogStat[] = [
  { label: "Total Entries", value: "1,247", subtext: "Last 7 days", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", color: "sky" },
  { label: "Errors", value: "3", subtext: "Requires attention", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z", color: "rose" },
  { label: "Warnings", value: "12", subtext: "Last 24 hours", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z", color: "amber" },
  { label: "Info", value: "98%", subtext: "Success rate", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
];

export const logColorMap: Record<string, LogColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20", border: "border-l-emerald-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20", border: "border-l-sky-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20", border: "border-l-amber-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20", border: "border-l-rose-500" },
};

export const logEntries: LogEntry[] = [
  {
    id: "log-001",
    level: "ERROR",
    color: "rose",
    message: "PHP Fatal error: Uncaught Error: Call to undefined function wp_get_current_user()",
    file: "/wp-includes/pluggable.php",
    line: 624,
    time: "12:34:56",
    date: "Today",
  },
  {
    id: "log-002",
    level: "WARNING",
    color: "amber",
    message: "Invalid argument supplied for foreach() in theme functions",
    file: "/wp-content/themes/flavor/functions.php",
    line: 142,
    time: "12:30:12",
    date: "Today",
  },
  {
    id: "log-003",
    level: "INFO",
    color: "sky",
    message: "WordPress auto-update: Theme 'flavor-starter' updated to version 2.4.1",
    file: "System",
    line: null,
    time: "11:45:23",
    date: "Today",
  },
  {
    id: "log-004",
    level: "SUCCESS",
    color: "emerald",
    message: "User 'limewp_admin' logged in successfully from IP 192.168.1.100",
    file: "Authentication",
    line: null,
    time: "10:22:08",
    date: "Today",
  },
  {
    id: "log-005",
    level: "WARNING",
    color: "amber",
    message: "PHP Deprecated: Function create_function() is deprecated since PHP 7.2",
    file: "/wp-content/plugins/old-plugin/main.php",
    line: 89,
    time: "09:15:44",
    date: "Today",
  },
  {
    id: "log-006",
    level: "INFO",
    color: "sky",
    message: "Scheduled backup completed successfully. Size: 856 MB",
    file: "Backup System",
    line: null,
    time: "03:00:12",
    date: "Today",
  },
  {
    id: "log-007",
    level: "ERROR",
    color: "rose",
    message: "Database connection timeout after 30 seconds. Retrying...",
    file: "/wp-includes/wp-db.php",
    line: 1892,
    time: "23:45:01",
    date: "Yesterday",
  },
];

export const logTypeOptions: LogTypeOption[] = [
  { key: "all", label: "All Logs", icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" },
  { key: "error", label: "Error Log", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
  { key: "access", label: "Access Log", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
  { key: "php", label: "PHP Log", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
];
