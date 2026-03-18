"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";

interface PromoBannerProps {
  onLearnMore?: () => void;
  onUpgrade?: () => void;
}

export function PromoBanner({ onLearnMore, onUpgrade }: PromoBannerProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={cn(
      "mb-10 rounded-xl border p-6",
      isLight
        ? "bg-slate-50 border-slate-200"
        : "bg-slate-900/50 border-slate-800"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          {/* Icon */}
          <div className={cn(
            "w-11 h-11 rounded-lg flex items-center justify-center shrink-0",
            isLight ? "bg-slate-200" : "bg-slate-800"
          )}>
            <svg
              className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "text-sm font-semibold",
                isLight ? "text-slate-800" : "text-slate-100"
              )}>
                Upgrade to Pro
              </h3>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                isLight
                  ? "bg-slate-200 text-slate-600"
                  : "bg-slate-700 text-slate-300"
              )}>
                20% OFF
              </span>
            </div>
            <p className={cn(
              "text-xs",
              isLight ? "text-slate-500" : "text-slate-400"
            )}>
              Unlimited sites, priority support, and advanced analytics.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:shrink-0">
          <button
            onClick={onLearnMore}
            className={cn(
              "text-xs font-medium px-3 py-2 rounded-lg transition-colors",
              isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            )}
          >
            Learn more
          </button>
          <button
            onClick={onUpgrade}
            className={cn(
              "text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5",
              isLight
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            )}
          >
            Upgrade
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
