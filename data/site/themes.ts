export interface Theme {
  id: string;
  name: string;
  version: string;
  active: boolean;
  gradient: string;
  image: string;
  author: string;
  description: string;
  lastUpdated: string;
  color: string;
  updateAvailable?: string;
}

export interface MarketplaceTheme {
  id: string;
  name: string;
  image: string;
  author: string;
  description: string;
  rating: number;
  installs: string;
  color: string;
}

export const THEMES: Theme[] = [
  {
    id: "flavor-starter",
    name: "Flavor Starter",
    version: "2.4.1",
    active: true,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&q=80",
    author: "LimeWP",
    description: "A modern, lightweight starter theme optimized for speed and performance",
    lastUpdated: "2 days ago",
    color: "emerald",
  },
  {
    id: "developer-edition",
    name: "Developer Edition",
    version: "6.4",
    active: false,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
    author: "Developer Theme Co",
    description: "Premium developer theme with advanced customization and code editing",
    lastUpdated: "1 week ago",
    color: "violet",
    updateAvailable: "6.5.1",
  },
  {
    id: "starter-blog",
    name: "Starter Blog",
    version: "3.2.0",
    active: false,
    gradient: "from-amber-600 via-orange-600 to-rose-600",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop&q=80",
    author: "Theme Studio",
    description: "Perfect starter theme for blogs, portfolios, and personal sites",
    lastUpdated: "3 weeks ago",
    color: "amber",
  },
];

export const MARKETPLACE_THEMES: MarketplaceTheme[] = [
  { id: "nordic-store", name: "Nordic Store", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80", author: "Nordic Labs", description: "Minimalist theme with clean typography and elegant layouts", rating: 4.8, installs: "50k+", color: "sky" },
  { id: "ecommerce-pro", name: "Ecommerce Pro", image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&h=400&fit=crop&q=80", author: "WooThemes", description: "Full-featured online store theme with WooCommerce integration", rating: 4.6, installs: "30k+", color: "rose" },
  { id: "portfolio-x", name: "Portfolio X", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80", author: "Creative Studio", description: "Stunning visual portfolio for photographers and designers", rating: 4.9, installs: "120k+", color: "emerald" },
  { id: "magazine-hub", name: "Magazine Hub", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80", author: "Media Press", description: "Content-rich theme for news sites and online magazines", rating: 4.7, installs: "80k+", color: "violet" },
];

export const THEME_COLOR_MAP: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10" },
};
