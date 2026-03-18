"use client";

import { SuggestedServiceCard } from "./SuggestedServiceCard";
import { useTheme } from "@/lib/context/ThemeContext";
import type { SuggestedService } from "@/data/services";

interface SuggestedServicesSectionProps {
  services: SuggestedService[];
  onAdd?: (service: SuggestedService) => void;
  onViewAll?: () => void;
}

export function SuggestedServicesSection({ services, onAdd, onViewAll }: SuggestedServicesSectionProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg className={`w-5 h-5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <h2 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Explore More Services</h2>
        </div>
        <button
          onClick={onViewAll}
          className={`text-sm transition-colors flex items-center gap-1 ${
            isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <SuggestedServiceCard
            key={service.name}
            service={service}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}
