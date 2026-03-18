/**
 * Shared type definitions for the application.
 * Centralized interfaces for reusability across components.
 */

// Re-export navigation types from config
export type { NavItem, NavGroup, SiteData } from "@/config/navigation";

/**
 * Site information with extended details.
 */
export interface Site {
  name: string;
  url?: string;
  initials: string;
  gradient: string;
  status: "online" | "offline" | "maintenance";
  visits: string;
  storage?: string;
  wordpress?: string;
  health?: number;
  cpu?: number;
  memory?: number;
  storagePct?: number;
}

/**
 * Notification types for the TopHeader dropdown.
 */
export type NotificationType = "success" | "warning" | "update" | "info" | "error";

export interface Notification {
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

/**
 * Activity item for dashboard timeline.
 */
export interface Activity {
  action: string;
  site: string;
  siteInitials: string;
  siteGradient: string;
  time: string;
  type: string;
  typeLabel: string;
  color: string;
  icon: string;
  details: string;
}

/**
 * User profile information.
 */
export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

/**
 * API response wrapper type.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
