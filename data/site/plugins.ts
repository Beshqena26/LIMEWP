export interface Plugin {
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
}

export interface PluginColorEntry {
  bg: string;
  text: string;
  ring: string;
  glow: string;
}

export const plugins: Plugin[] = [
  {
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
    featured: true
  },
  {
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
    featured: false
  },
  {
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
    featured: false
  },
  {
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
    featured: false
  },
];

export const pluginColorMap: Record<string, PluginColorEntry> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
};
