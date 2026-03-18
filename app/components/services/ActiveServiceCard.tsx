"use client";

import { Progress } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import type { CurrentService } from "@/data/services";

interface ActiveServiceCardProps {
  service: CurrentService;
  onManage?: (service: CurrentService) => void;
  onUpgrade?: (service: CurrentService) => void;
}

export function ActiveServiceCard({ service, onManage, onUpgrade }: ActiveServiceCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  return (
    <div className={`group relative rounded-2xl border transition-all overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
    }`}>
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isLight ? "bg-zinc-200" : "bg-zinc-800"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={service.icon} />
              </svg>
            </div>
            <div>
              <div className={`font-semibold text-base ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{service.name}</div>
              <div className={`text-xs flex items-center gap-2 mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                <span>{service.plan} Plan</span>
                <span className={isLight ? "text-zinc-400" : "text-zinc-600"}>•</span>
                <span>${service.price}/mo</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            isLight ? "bg-zinc-100 ring-1 ring-zinc-200" : "bg-zinc-800 ring-1 ring-zinc-700"
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
            </span>
            <span className={`text-xs font-semibold ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {service.stats.map((stat) => (
            <div key={stat.label} className={`rounded-xl p-3 ${isLight ? "bg-zinc-50" : "bg-[#18181B]"}`}>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{stat.label}</div>
              <div className={`text-sm font-semibold mb-2 ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{stat.value}</div>
              <Progress
                value={stat.progress}
                size="sm"
                classNames={{
                  track: `h-1 ${isLight ? "bg-zinc-200" : "bg-[#27272A]"}`,
                  indicator: `${isLight ? "bg-zinc-500" : "bg-zinc-400"} rounded-full`
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 border-t ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
          <div className="text-xs text-zinc-500">
            Next billing: <span className={`font-medium ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{service.nextBilling}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onManage?.(service)}
              className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isLight
                  ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                  : "bg-[#27272A] text-zinc-300 hover:bg-[#3F3F46] hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage
            </button>
            <button
              onClick={() => onUpgrade?.(service)}
              className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
