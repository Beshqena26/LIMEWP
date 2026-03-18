"use client";

import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, icon, color = "emerald", className }: StatCardProps) {
  const colors = getColorClasses(color);

  return (
    <div className={cn(
      "relative group bg-gradient-to-br from-[#1e2130] to-[#181b28] rounded-xl p-4 border border-[#282b3a] hover:border-[#334155] transition-all overflow-hidden",
      className
    )}>
      <div className={cn("absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60", colors.bg)} />
      <div className="relative flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl ring-1 flex items-center justify-center", colors.bg, colors.ring)}>
          <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-100">{value}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );
}
