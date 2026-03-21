export interface BackupStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

export interface BackupColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  iconBg: string;
}

export interface Backup {
  id: string;
  name: string;
  date: string;
  time: string;
  size: string;
  type: string;
  status: string;
  includes: string[];
  color: string;
}

export const backupStats: BackupStat[] = [
  { label: "Total Backups", value: "14", subtext: "Last 30 days", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "emerald" },
  { label: "Auto Backup", value: "Daily", subtext: "Next: 3:00 AM", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "sky" },
  { label: "Storage Used", value: "2.4 GB", subtext: "of 10 GB", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", color: "violet" },
  { label: "Retention", value: "30 days", subtext: "Auto-cleanup", icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3", color: "amber" },
];

export const backupColorMap: Record<string, BackupColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
};

export const backups: Backup[] = [
  {
    id: "bkp-001",
    name: "Full Site Backup",
    date: "Jan 27, 2026",
    time: "3:00 AM",
    size: "856 MB",
    type: "automatic",
    status: "completed",
    includes: ["Files", "Database", "Media"],
    color: "emerald",
  },
  {
    id: "bkp-002",
    name: "Full Site Backup",
    date: "Jan 26, 2026",
    time: "3:00 AM",
    size: "842 MB",
    type: "automatic",
    status: "completed",
    includes: ["Files", "Database", "Media"],
    color: "emerald",
  },
  {
    id: "bkp-003",
    name: "Pre-Update Backup",
    date: "Jan 25, 2026",
    time: "2:15 PM",
    size: "838 MB",
    type: "manual",
    status: "completed",
    includes: ["Files", "Database"],
    color: "sky",
  },
  {
    id: "bkp-004",
    name: "Database Only",
    date: "Jan 24, 2026",
    time: "11:30 AM",
    size: "124 MB",
    type: "manual",
    status: "completed",
    includes: ["Database"],
    color: "violet",
  },
  {
    id: "bkp-005",
    name: "Full Site Backup",
    date: "Jan 23, 2026",
    time: "3:00 AM",
    size: "835 MB",
    type: "automatic",
    status: "completed",
    includes: ["Files", "Database", "Media"],
    color: "emerald",
  },
];
