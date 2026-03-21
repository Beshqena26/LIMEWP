"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Progress,
} from "@heroui/react";
import { BillingSkeleton } from "../components/skeletons";
import { useSimulatedLoading } from "@/hooks";
import { NoInvoices } from "../components/empty-states";
import { showToast } from "@/lib/toast";

const invoices = [
  { id: "INV-2026-001", date: "Jan 25, 2026", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-012", date: "Dec 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-011", date: "Nov 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-010", date: "Oct 25, 2025", amount: "$9.00", status: "Paid", description: "Global CDN Add-on" },
  { id: "INV-2025-009", date: "Oct 25, 2025", amount: "$49.00", status: "Paid", description: "Business Plan - Monthly" },
  { id: "INV-2025-008", date: "Sep 25, 2025", amount: "$49.00", status: "Refunded", description: "Business Plan - Monthly" },
];

const usageItems = [
  { label: "Sites", current: 2, max: 5, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" },
  { label: "Storage", current: 2.4, max: 50, unit: "GB", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
  { label: "Bandwidth", current: 45, max: 500, unit: "GB", icon: "M3 8l4-4m0 0l4 4m-4-4v12m14-4l-4 4m0 0l-4-4m4 4V4" },
  { label: "Backups", current: 14, max: 30, unit: "days", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
];

export default function BillingPage() {
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const { isLoading } = useSimulatedLoading(() => true);

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Billing</h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Manage your subscription, payment methods, and invoices</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            className={`font-semibold text-sm transition-all gap-2 rounded-xl ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--border-primary)] hover:text-white"
            }`}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            Manage Plan
          </Button>
          <Button
            onPress={() => showToast.success("Invoices downloaded")}
            className={`font-semibold text-sm text-white transition-all gap-2 rounded-xl shadow-lg ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            }
          >
            Download Invoices
          </Button>
        </div>
      </div>

      {isLoading ? (
        <BillingSkeleton />
      ) : (
      <>
      {/* Current Subscription Card */}
      <div className={`mb-8 group relative overflow-hidden rounded-2xl border transition-all ${
        isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
      }`}>
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Business Plan</h2>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${
                  isLight ? "bg-slate-100 ring-slate-200" : "bg-slate-800 ring-slate-700"
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? "bg-slate-500" : "bg-slate-400"}`}></span>
                  </span>
                  <span className={`text-[11px] font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>Active</span>
                </span>
              </div>
              <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Perfect for growing businesses with multiple sites</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-3xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>$49</span>
                <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-500"}`}>/month</span>
              </div>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Billed monthly</p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageItems.map((item) => {
              const percentage = (item.current / item.max) * 100;
              return (
                <div key={item.label} className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ring-1 flex items-center justify-center ${
                      isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{item.current}</span>
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>/ {item.max} {item.unit || ""}</span>
                  </div>
                  <Progress
                    size="sm"
                    value={percentage}
                    classNames={{
                      base: "h-1.5",
                      track: isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]",
                      indicator: isLight ? "bg-slate-400" : "bg-slate-500",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Next Billing Info */}
          <div className={`mt-5 pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center ${
                isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Next billing date</p>
                <p className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>February 25, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => showToast.warning("Plan cancellation requested")} className={`text-sm font-medium transition-colors px-4 py-2 ${
                isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
              }`}>
                Cancel Plan
              </button>
              <button onClick={() => showToast.info("Opening upgrade options...")} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Payment Methods</h2>
          <Button
            onPress={() => showToast.info("Opening payment method form...")}
            className={`font-semibold text-sm text-white transition-colors rounded-xl gap-2 ${accent.button} ${accent.buttonHover}`}
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Payment Method
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Credit Card */}
          <div
            onClick={() => setSelectedPayment("credit-card")}
            className={`group relative rounded-xl p-5 cursor-pointer transition-all overflow-hidden border-2 ${
              isLight
                ? selectedPayment === "credit-card"
                  ? "bg-white border-slate-400 hover:border-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-300"
                : selectedPayment === "credit-card"
                  ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-slate-500 hover:border-slate-400"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <span className={`font-semibold block ${isLight ? "text-slate-800" : "text-slate-100"}`}>Credit Card</span>
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Visa ending in 4242</span>
                  </div>
                </div>
                {selectedPayment === "credit-card" && (
                  <Chip
                    size="sm"
                    classNames={{
                      base: isLight ? "bg-slate-100 border-0" : "bg-slate-800 border-0",
                      content: isLight ? "text-slate-600 font-semibold text-[10px]" : "text-slate-400 font-semibold text-[10px]"
                    }}
                  >
                    Default
                  </Chip>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
                <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Exp 12/27</span>
              </div>
            </div>
          </div>

          {/* Account Balance */}
          <div
            onClick={() => setSelectedPayment("balance")}
            className={`group relative rounded-xl p-5 cursor-pointer transition-all overflow-hidden border-2 ${
              isLight
                ? selectedPayment === "balance"
                  ? "bg-white border-slate-400 hover:border-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-300"
                : selectedPayment === "balance"
                  ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-slate-500 hover:border-slate-400"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  </div>
                  <div>
                    <span className={`font-semibold block ${isLight ? "text-slate-800" : "text-slate-100"}`}>Account Balance</span>
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Prepaid credits</span>
                  </div>
                </div>
                {selectedPayment === "balance" && (
                  <Chip
                    size="sm"
                    classNames={{
                      base: isLight ? "bg-slate-100 border-0" : "bg-slate-800 border-0",
                      content: isLight ? "text-slate-600 font-semibold text-[10px]" : "text-slate-400 font-semibold text-[10px]"
                    }}
                  >
                    Default
                  </Chip>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>$247.50</span>
                  <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>available</span>
                </div>
                <button className={`text-xs font-semibold transition-colors flex items-center gap-1 ${
                  isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Cryptocurrency */}
          <div
            onClick={() => setSelectedPayment("crypto")}
            className={`group relative rounded-xl p-5 cursor-pointer transition-all overflow-hidden border-2 ${
              isLight
                ? selectedPayment === "crypto"
                  ? "bg-white border-slate-400 hover:border-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-300"
                : selectedPayment === "crypto"
                  ? "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-slate-500 hover:border-slate-400"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  </div>
                  <div>
                    <span className={`font-semibold block ${isLight ? "text-slate-800" : "text-slate-100"}`}>Cryptocurrency</span>
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>BTC, ETH, USDT</span>
                  </div>
                </div>
                {selectedPayment === "crypto" && (
                  <Chip
                    size="sm"
                    classNames={{
                      base: isLight ? "bg-slate-100 border-0" : "bg-slate-800 border-0",
                      content: isLight ? "text-slate-600 font-semibold text-[10px]" : "text-slate-400 font-semibold text-[10px]"
                    }}
                  >
                    Default
                  </Chip>
                )}
              </div>
              <div className="flex gap-2">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ring-1 ${
                  isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 ring-[var(--border-primary)]"
                }`}>BTC</span>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ring-1 ${
                  isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 ring-[var(--border-primary)]"
                }`}>ETH</span>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ring-1 ${
                  isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 ring-[var(--border-primary)]"
                }`}>USDT</span>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ring-1 ${
                  isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 ring-[var(--border-primary)]"
                }`}>+5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Recent Invoices</h2>
          <button className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
            isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"
          }`}>
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
        }`}>
          {invoices.length === 0 ? (
            <NoInvoices />
          ) : (
          <div className="overflow-x-auto">
          <Table
            aria-label="Invoices"
            removeWrapper
            classNames={{
              table: "bg-transparent",
              th: `text-[11px] font-semibold uppercase tracking-wider py-4 px-6 first:rounded-tl-none last:rounded-tr-none border-b ${
                isLight ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-[var(--bg-primary)]/80 text-slate-500 border-[var(--border-tertiary)]"
              }`,
              td: "text-sm py-4 px-6",
              tr: `border-b last:border-b-0 transition-colors ${
                isLight ? "hover:bg-slate-50 border-slate-100" : "hover:bg-[var(--bg-elevated)]/30 border-[var(--border-tertiary)]/50"
              }`,
            }}
          >
            <TableHeader>
              <TableColumn>Invoice</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <span className={`font-mono font-medium text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}>{inv.id}</span>
                    </TableCell>
                    <TableCell className={isLight ? "text-slate-600" : "text-slate-400"}>{inv.description}</TableCell>
                    <TableCell className={isLight ? "text-slate-500" : "text-slate-500"}>{inv.date}</TableCell>
                    <TableCell className={`font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{inv.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ring-inset ${
                        isLight ? "bg-slate-100 ring-slate-200" : "bg-slate-800 ring-slate-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-slate-500" : "bg-slate-400"}`} />
                        <span className={`text-[11px] font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>{inv.status}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700" : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700" : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </div>
          )}
        </div>
      </div>

      {/* Billing Support Banner */}
      <div className={`group relative overflow-hidden rounded-2xl border transition-all ${
        isLight
          ? "bg-white border-slate-200 hover:border-slate-300"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
      }`}>
        <div className="relative px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ring-1 flex items-center justify-center ${
              isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700"
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Need help with billing?</h3>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Our support team is available 24/7 to assist with any billing questions or issues.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => showToast.info("Opening FAQ...")} className={`text-sm font-medium transition-colors px-4 py-2 ${
              isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
            }`}>
              View FAQ
            </button>
            <button onClick={() => showToast.info("Opening support chat...")} className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200"
                : "bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)] text-slate-200 hover:text-white border-[var(--border-primary)]"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </AppShell>
  );
}
