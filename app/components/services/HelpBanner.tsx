"use client";

import { useTheme } from "@/lib/context/ThemeContext";

interface HelpBannerProps {
  onContactSales?: () => void;
}

export function HelpBanner({ onContactSales }: HelpBannerProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className="relative px-6 py-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-800 text-zinc-400"
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <div className={`font-semibold text-sm ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Need help choosing?</div>
            <p className={`text-xs ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Our team can help you find the perfect services for your needs.</p>
          </div>
        </div>
        <button
          onClick={onContactSales}
          className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
            isLight
              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
              : "bg-[#27272A] text-zinc-300 hover:bg-[#3F3F46] hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Contact Sales
        </button>
      </div>
    </div>
  );
}
