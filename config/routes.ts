/**
 * Centralized route definitions for the application.
 * All route paths should be defined here and imported throughout the app.
 * This eliminates hardcoded strings and enables type-safe navigation.
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  NEW_SITE: "/new-site",

  // Operations
  SERVICES: "/services",
  BILLING: "/billing",
  DNS: "/dns",

  // Resources
  DOCS: "/docs",
  API_REFERENCE: "/api-reference",
  FORUM: "/forum",

  // Support
  SUPPORT: "/support",
  SETTINGS: "/settings",

  // Settings Tabs
  SETTINGS_PROFILE: "/settings?tab=profile",
  SETTINGS_SECURITY: "/settings?tab=security",
  SETTINGS_NOTIFICATIONS: "/settings?tab=notifications",
  SETTINGS_APPEARANCE: "/settings?tab=appearance",
  SETTINGS_BILLING: "/settings?tab=billing",
  SETTINGS_API_KEYS: "/settings?tab=apikeys",

  // Site Management
  SITE: "/site",

  // Legal
  PRIVACY: "/privacy",
  TERMS: "/terms",
  COOKIES: "/cookies",

  // Contact
  CONTACT: "/contact",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Helper for creating dynamic routes with parameters.
 */
export const createRoute = {
  site: (name: string) => `${ROUTES.SITE}?name=${encodeURIComponent(name)}`,
} as const;
