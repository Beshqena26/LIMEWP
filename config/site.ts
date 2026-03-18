/**
 * Site configuration and branding constants.
 * Centralized metadata for the LimeWP application.
 */

export const SITE_CONFIG = {
  name: "LimeWP",
  tagline: "WordPress Hosting",
  description: "Professional WordPress hosting management dashboard",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  branding: {
    primaryColor: "emerald",
    logo: {
      text: { first: "Lime", second: "WP" },
      icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    },
  },

  defaults: {
    expandedGroups: {
      Operations: true,
      Resources: false,
      Support: true,
    } as Record<string, boolean>,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
