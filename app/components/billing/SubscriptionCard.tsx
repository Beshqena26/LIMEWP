"use client";

import { Progress } from "@heroui/react";
import { getColorClasses } from "@/lib/utils/colors";
import { useTheme } from "@/lib/context/ThemeContext";
import type { UsageItem } from "@/data/billing";

interface SubscriptionCardProps {
  planName: string;
  price: number;
  usageItems: UsageItem[];
  nextBillingDate: string;
  onCancel?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionCard({ planName, price, usageItems, nextBillingDate, onCancel, onUpgrade }: SubscriptionCardProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={`mb-8 group relative overflow-hidden rounded-2xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all ${
      isLight ? "bg-white" : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d]"
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.08] via-transparent to-sky-500/[0.08]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{planName}</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">Active</span>
              </span>
            </div>
            <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Perfect for growing businesses with multiple sites</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1 mb-1">
              <span className={`text-3xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>${price}</span>
              <span className="text-sm text-zinc-500">/month</span>
            </div>
            <p className="text-xs text-zinc-500">Billed monthly</p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usageItems.map((item) => {
            const colors = getColorClasses(item.color);
            const percentage = (item.current / item.max) * 100;
            return (
              <div key={item.label} className={`rounded-xl p-4 border ${
                isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#18181B]/50 border-[#2A2A2E]"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <span className={`text-xs font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-lg font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{item.current}</span>
                  <span className="text-xs text-zinc-500">/ {item.max} {item.unit || ""}</span>
                </div>
                <Progress
                  size="sm"
                  value={percentage}
                  classNames={{
                    base: "h-1.5",
                    track: isLight ? "bg-zinc-200" : "bg-[#27272A]",
                    indicator: `bg-gradient-to-r ${colors.gradient}`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Next Billing Info */}
        <div className={`mt-5 pt-5 border-t flex items-center justify-between ${
          isLight ? "border-zinc-200" : "border-[#2A2A2E]"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Next billing date</p>
              <p className={`text-sm font-semibold ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{nextBillingDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className={`text-sm font-medium transition-colors px-4 py-2 ${
              isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-400 hover:text-zinc-200"
            }`}>
              Cancel Plan
            </button>
            <button onClick={onUpgrade} className="h-10 px-5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
