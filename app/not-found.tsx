"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        isLight ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-primary)]"
      )}
    >
      <div className="w-full max-w-[500px] text-center">
        {/* 404 Number */}
        <p
          className={cn(
            "text-[80px] leading-none font-bold tracking-tight mb-2",
            isLight ? "text-slate-200" : "text-slate-800"
          )}
        >
          404
        </p>

        {/* Heading */}
        <h1
          className={cn(
            "text-2xl font-semibold mb-2",
            isLight ? "text-slate-900" : "text-slate-100"
          )}
        >
          Page not found
        </h1>

        {/* Subtext */}
        <p
          className={cn(
            "text-base mb-8",
            isLight ? "text-slate-500" : "text-slate-400"
          )}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Card Container */}
        <div
          className={cn(
            "rounded-2xl border p-6 space-y-5",
            isLight
              ? "bg-white border-slate-200"
              : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
          )}
        >
          {/* Search Input */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <svg
                className={cn(
                  "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4",
                  isLight ? "text-slate-400" : "text-slate-500"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for what you need..."
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
                  isLight
                    ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                    : "bg-[var(--bg-input)] border border-[var(--border-tertiary)] text-slate-100 placeholder:text-slate-500 focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)]"
                )}
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.back()}
              className={cn(
                "flex-1 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all",
                isLight
                  ? "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  : "border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-hover)] hover:border-[var(--border-primary)]"
              )}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
