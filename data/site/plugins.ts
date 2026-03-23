export interface Plugin {
  id: string;
  name: string;
  version: string;
  active: boolean;
  autoUpdate: boolean;
  icon: string;
  gradient: string;
  author: string;
  description: string;
  downloads: string;
  lastUpdated: string;
  color: string;
  featured: boolean;
  updateAvailable?: string;
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  author: string;
  description: string;
  downloads: string;
  rating: number;
  color: string;
}

export interface PluginColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
}

export const plugins: Plugin[] = [
  {
    id: "limewp-mu",
    name: "LimeWP MU-Plugin",
    version: "1.2.0",
    active: true,
    autoUpdate: true,
    icon: "LW",
    gradient: "from-emerald-500 to-teal-500",
    author: "LimeWP Team",
    description: "Essential must-use plugin for LimeWP hosting optimization and security",
    downloads: "50K+",
    lastUpdated: "1 week ago",
    color: "emerald",
    featured: true,
  },
  {
    id: "yoast-seo",
    name: "Yoast SEO",
    version: "21.5",
    active: true,
    autoUpdate: true,
    icon: "YS",
    gradient: "from-sky-500 to-blue-500",
    author: "Yoast",
    description: "The #1 WordPress SEO plugin for optimizing your site's search rankings",
    downloads: "5M+",
    lastUpdated: "3 days ago",
    color: "sky",
    featured: false,
    updateAvailable: "22.0",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    version: "8.4.0",
    active: false,
    autoUpdate: false,
    icon: "WC",
    gradient: "from-violet-500 to-purple-500",
    author: "Automattic",
    description: "The most popular eCommerce platform for WordPress stores",
    downloads: "10M+",
    lastUpdated: "5 days ago",
    color: "violet",
    featured: false,
  },
  {
    id: "contact-form-7",
    name: "Contact Form 7",
    version: "5.8.5",
    active: true,
    autoUpdate: true,
    icon: "CF",
    gradient: "from-amber-500 to-orange-500",
    author: "Takayuki Miyoshi",
    description: "Simple but flexible contact form builder with spam protection",
    downloads: "5M+",
    lastUpdated: "2 weeks ago",
    color: "amber",
    featured: false,
  },
];

export const marketplacePlugins: MarketplacePlugin[] = [
  { id: "wpforms", name: "WPForms Lite", icon: "WF", gradient: "from-orange-500 to-red-500", author: "WPForms", description: "Drag-and-drop form builder with templates", downloads: "6M+", rating: 4.9, color: "amber" },
  { id: "elementor", name: "Elementor", icon: "EL", gradient: "from-pink-500 to-rose-500", author: "Elementor.com", description: "Visual page builder with drag-and-drop editor", downloads: "5M+", rating: 4.7, color: "rose" },
  { id: "wordfence", name: "Wordfence Security", icon: "WF", gradient: "from-red-500 to-orange-500", author: "Wordfence", description: "Firewall, malware scanner, and login security", downloads: "4M+", rating: 4.8, color: "emerald" },
  { id: "updraftplus", name: "UpdraftPlus", icon: "UP", gradient: "from-blue-500 to-cyan-500", author: "UpdraftPlus.Com", description: "Backup and restore with cloud storage integration", downloads: "3M+", rating: 4.8, color: "sky" },
  { id: "wp-rocket", name: "WP Rocket", icon: "WR", gradient: "from-indigo-500 to-violet-500", author: "WP Media", description: "Premium caching and performance optimization plugin", downloads: "2M+", rating: 4.9, color: "violet" },
];

export const pluginColorMap: Record<string, PluginColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10" },
};
