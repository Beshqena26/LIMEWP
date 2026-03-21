export interface UserStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  color: string;
}

export interface UserColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
  iconBg: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  color: string;
  gradient: string;
  lastLogin: string;
  postsCount: number;
  isOnline: boolean;
  twoFactor: boolean;
}

export const userStats: UserStat[] = [
  { label: "Total Users", value: "5", subtext: "WordPress users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", color: "emerald" },
  { label: "Active Now", value: "2", subtext: "Online users", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "sky" },
  { label: "Admins", value: "1", subtext: "Full access", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: "violet" },
  { label: "Pending", value: "0", subtext: "Awaiting approval", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z", color: "amber" },
];

export const userColorMap: Record<string, UserColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20" },
};

export const users: User[] = [
  {
    id: "usr-001",
    username: "limewp_admin",
    displayName: "Lime Admin",
    email: "admin@limewp.com",
    role: "Administrator",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    lastLogin: "2 hours ago",
    postsCount: 24,
    isOnline: true,
    twoFactor: true,
  },
  {
    id: "usr-002",
    username: "john_editor",
    displayName: "John Smith",
    email: "john@example.com",
    role: "Editor",
    color: "sky",
    gradient: "from-sky-500 to-blue-500",
    lastLogin: "1 day ago",
    postsCount: 156,
    isOnline: true,
    twoFactor: true,
  },
  {
    id: "usr-003",
    username: "sarah_author",
    displayName: "Sarah Connor",
    email: "sarah@example.com",
    role: "Author",
    color: "violet",
    gradient: "from-violet-500 to-purple-500",
    lastLogin: "3 days ago",
    postsCount: 42,
    isOnline: false,
    twoFactor: false,
  },
  {
    id: "usr-004",
    username: "mike_contrib",
    displayName: "Mike Johnson",
    email: "mike@example.com",
    role: "Contributor",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    lastLogin: "1 week ago",
    postsCount: 8,
    isOnline: false,
    twoFactor: false,
  },
  {
    id: "usr-005",
    username: "guest_user",
    displayName: "Guest User",
    email: "guest@example.com",
    role: "Subscriber",
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    lastLogin: "2 weeks ago",
    postsCount: 0,
    isOnline: false,
    twoFactor: false,
  },
];

export const rolePermissions: Record<string, string[]> = {
  Administrator: ["Full access", "Manage users", "Install plugins"],
  Editor: ["Publish posts", "Manage comments", "Moderate content"],
  Author: ["Write posts", "Upload media", "Edit own content"],
  Contributor: ["Write drafts", "Read content"],
  Subscriber: ["Read content", "Manage profile"],
};
