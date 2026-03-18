"use client";

import { ActiveServiceCard } from "./ActiveServiceCard";
import { useTheme } from "@/lib/context/ThemeContext";
import type { CurrentService } from "@/data/services";

interface ActiveServicesSectionProps {
  services: CurrentService[];
  onManage?: (service: CurrentService) => void;
  onUpgrade?: (service: CurrentService) => void;
}

export function ActiveServicesSection({ services, onManage, onUpgrade }: ActiveServicesSectionProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <svg className={`w-5 h-5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Active Services</h2>
        <span className={`text-xs px-2 py-0.5 rounded-md ${
          isLight ? "text-zinc-500 bg-zinc-100" : "text-zinc-500 bg-[#27272A]"
        }`}>{services.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {services.map((service) => (
          <ActiveServiceCard
            key={service.name}
            service={service}
            onManage={onManage}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>
    </div>
  );
}
