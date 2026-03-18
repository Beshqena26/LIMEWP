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
        ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
    }`}>
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            isLight ? "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200" : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d={service.icon} />
            </svg>
          </div>
          {service.badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ring-1 ${
              isLight ? "bg-zinc-100 text-zinc-600 ring-zinc-200" : "bg-zinc-800 text-zinc-400 ring-zinc-700"
            }`}>
              {service.badge.label}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className={`font-semibold text-[15px] mb-1.5 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{service.name}</h3>
        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{service.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.map((feature) => (
            <span key={feature} className={`text-[10px] font-medium px-2 py-1 rounded-md ${
              isLight ? "text-zinc-600 bg-zinc-100" : "text-zinc-400 bg-[#27272A]"
            }`}>
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex justify-between items-center pt-4 border-t ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>${service.price}</span>
            <span className="text-xs text-zinc-500">/month</span>
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
