"use client";

import { Button, Chip } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/15", gradient: "from-emerald-400 to-emerald-600", gradientBtn: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", borderLight: "border-emerald-200", borderDark: "border-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/15", gradient: "from-sky-400 to-sky-600", gradientBtn: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20", borderLight: "border-sky-200", borderDark: "border-sky-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/15", gradient: "from-violet-400 to-violet-600", gradientBtn: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20", borderLight: "border-violet-200", borderDark: "border-violet-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/15", gradient: "from-amber-400 to-amber-600", gradientBtn: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", borderLight: "border-amber-200", borderDark: "border-amber-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/15", gradient: "from-pink-400 to-pink-600", gradientBtn: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20", borderLight: "border-pink-200", borderDark: "border-pink-500/20" },
};

export function BillingSettingsTab() {
  return (
    <div className="space-y-6">
      <CurrentPlanCard />
      <PaymentMethodCard />
      <BillingAddressCard />
    </div>
  );
}

function CurrentPlanCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? `bg-white ${accent.borderLight}`
        : `bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] ${accent.borderDark}`
    }`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center shadow-lg ${accent.shadow}`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Business Plan</h3>
              <p className="text-sm text-zinc-500">Your current subscription</p>
            </div>
          </div>
          <Chip size="sm" classNames={{ base: `${accent.bg} border-0 px-3`, content: `${accent.text} font-semibold text-xs` }}>
            Active
          </Chip>
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <span className={`text-3xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>$49</span>
          <span className="text-sm text-zinc-500">/month</span>
        </div>

        <div className={`flex items-center gap-2 text-sm mb-6 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Renews Feb 20, 2026
        </div>

        <div className="flex gap-3">
          <Button className={`bg-gradient-to-r ${accent.gradientBtn} text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg ${accent.shadow}`}>
            Upgrade Plan
          </Button>
          <Button variant="flat" className={`font-medium text-sm rounded-xl h-10 px-5 ${
            isLight
              ? "bg-zinc-100 text-zinc-700 hover:text-zinc-900"
              : "bg-[#27272A] text-zinc-300 hover:text-white"
          }`}>
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Payment Method</h3>
            <p className="text-xs text-zinc-500">Manage your payment details</p>
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-xl ${
          isLight ? "bg-zinc-50" : "bg-[#27272A]/50"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">VISA</span>
            </div>
            <div>
              <p className={`text-sm font-medium font-mono ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>**** **** **** 4242</p>
              <p className="text-[11px] text-zinc-500">Expires 12/2027</p>
            </div>
          </div>
          <Button variant="flat" size="sm" className={`font-medium text-xs rounded-lg h-8 ${
            isLight
              ? "bg-zinc-200 text-zinc-700 hover:text-zinc-900"
              : "bg-[#3F3F46] text-zinc-300 hover:text-white"
          }`}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

function BillingAddressCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Billing Address</h3>
            <p className="text-xs text-zinc-500">Address for invoices</p>
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-xl ${
          isLight ? "bg-zinc-50" : "bg-[#27272A]/50"
        }`}>
          <div>
            <p className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>123 Main Street</p>
            <p className="text-[11px] text-zinc-500">New York, NY 10001, United States</p>
          </div>
          <Button variant="flat" size="sm" className={`font-medium text-xs rounded-lg h-8 ${
            isLight
              ? "bg-zinc-200 text-zinc-700 hover:text-zinc-900"
              : "bg-[#3F3F46] text-zinc-300 hover:text-white"
          }`}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
