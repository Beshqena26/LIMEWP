/**
 * Billing page mock data.
 */

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Refunded" | "Failed";
  description: string;
}

export interface UsageItem {
  label: string;
  current: number;
  max: number;
  unit?: string;
  icon: string;
  color: string;
}

export const INVOICES: Invoice[] = [
  { id: "INV-2026-001", date: "Jan 25, 2026", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-012", date: "Dec 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-011", date: "Nov 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-010", date: "Oct 25, 2025", amount: "$9.00", status: "Paid", description: "Global CDN Add-on" },
  { id: "INV-2025-009", date: "Oct 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-008", date: "Sep 25, 2025", amount: "$49.00", status: "Refunded", description: "Business Plan - Monthly" },
];

export const USAGE_ITEMS: UsageItem[] = [
  { label: "Sites", current: 2, max: 5, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", color: "emerald" },
  { label: "Storage", current: 2.4, max: 50, unit: "GB", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125", color: "sky" },
  { label: "Bandwidth", current: 45, max: 500, unit: "GB", icon: "M3 8l4-4m0 0l4 4m-4-4v12m14-4l-4 4m0 0l-4-4m4 4V4", color: "violet" },
  { label: "Backups", current: 14, max: 30, unit: "days", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "amber" },
];

export const INVOICE_STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Paid: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  Pending: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  Refunded: { bg: "bg-sky-500/10", text: "text-sky-400", dot: "bg-sky-400" },
  Failed: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
};
