/**
 * Application-wide constants.
 * Shared constants that are used across multiple features.
 */

// Re-export from centralized configs
export { ROUTES, createRoute } from "@/config/routes";
export { SITE_CONFIG } from "@/config/site";
export { NAV_GROUPS, SITES_DATA, NAV_ICONS, GROUP_COLOR_MAP } from "@/config/navigation";

// Animation durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const;

// Breakpoints matching Tailwind
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 50,
  MODAL: 100,
  TOOLTIP: 150,
  TOAST: 200,
} as const;

// API
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.limewp.com",
  VERSION: "v1",
  TIMEOUT: 30000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Date formats
export const DATE_FORMAT = {
  SHORT: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  WITH_TIME: "MMM d, yyyy h:mm a",
  ISO: "yyyy-MM-dd",
} as const;
