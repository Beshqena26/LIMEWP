"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import type { SuggestedService } from "@/data/services";

interface SuggestedServiceCardProps {
  service: SuggestedService;
  onAdd?: (service: SuggestedService) => void;
}

export function SuggestedServiceCard({ service, onAdd }: SuggestedServiceCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  return (
    <div className={`group relative rounded-2xl border transition-all overflow-hidden cursor-pointer ${
      isLight
        ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
        : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
    }`}>
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            isLight ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200" : "bg-slate-800 text-slate-400 ring-1 ring-slate-700"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d={service.icon} />
            </svg>
          </div>
          {service.badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ring-1 ${
              isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700"
            }`}>
              {service.badge.label}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className={`font-semibold text-[15px] mb-1.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{service.name}</h3>
        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{service.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.map((feature) => (
            <span key={feature} className={`text-[10px] font-medium px-2 py-1 rounded-md ${
              isLight ? "text-slate-600 bg-slate-100" : "text-slate-400 bg-[var(--bg-elevated)]"
            }`}>
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex justify-between items-center pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>${service.price}</span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <button
            onClick={() => onAdd?.(service)}
            className={`h-9 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
