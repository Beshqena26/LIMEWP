export interface Theme {
  name: string;
  version: string;
  active: boolean;
  gradient: string;
  author: string;
  description: string;
  lastUpdated: string;
  color: string;
}

export const THEMES: Theme[] = [
  {
    name: "flavor starter theme",
    version: "2.4.1",
    active: true,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    author: "Limestarter",
    description: "A modern, lightweight starter theme optimized for speed",
    lastUpdated: "2 days ago",
    color: "emerald"
  },
  {
    name: "flavor starter theme Developer Edition",
    version: "6.4",
    active: false,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    author: "flavor starter theme",
    description: "Premium developer theme with advanced customization options",
    lastUpdated: "1 week ago",
    color: "violet"
  },
  {
    name: "flavor starter theme starter",
    version: "3.2.0",
    active: false,
    gradient: "from-amber-600 via-orange-600 to-rose-600",
    author: "flavor starter theme Inc",
    description: "Perfect starter theme for blogs and portfolios",
    lastUpdated: "3 weeks ago",
    color: "amber"
  },
];

export const THEME_COLOR_MAP: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
};
