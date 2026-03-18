/**
 * API Reference page mock data.
 */

export interface ApiNavItem {
  name: string;
  method: string | null;
}

export interface ApiNavSection {
  label: string;
  items: ApiNavItem[];
}

export const API_NAV_SECTIONS: ApiNavSection[] = [
  {
    label: "Introduction",
    items: [
      { name: "Overview", method: null },
      { name: "Authentication", method: null },
      { name: "Rate Limits", method: null },
      { name: "Errors", method: null },
    ],
  },
  {
    label: "Sites",
    items: [
      { name: "List Sites", method: "GET" },
      { name: "Get Site", method: "GET" },
      { name: "Create Site", method: "POST" },
      { name: "Update Site", method: "PUT" },
      { name: "Delete Site", method: "DEL" },
    ],
  },
  {
    label: "Backups",
    items: [
      { name: "List Backups", method: "GET" },
      { name: "Create Backup", method: "POST" },
      { name: "Restore Backup", method: "POST" },
    ],
  },
  {
    label: "Domains",
    items: [
      { name: "List Domains", method: "GET" },
      { name: "Add Domain", method: "POST" },
    ],
  },
];

export const API_CODE_TABS = ["cURL", "JavaScript", "Python", "PHP"] as const;

export type ApiCodeTab = typeof API_CODE_TABS[number];

export function getMethodBadgeClasses(method: string): string {
  switch (method) {
    case "GET":
      return "bg-emerald-500/10 text-emerald-400";
    case "POST":
      return "bg-sky-500/10 text-sky-400";
    case "PUT":
      return "bg-amber-500/10 text-amber-400";
    case "DEL":
      return "bg-red-500/10 text-red-400";
    default:
      return "";
  }
}

export const API_BASE_URL = "https://api.limewp.com/v1";
