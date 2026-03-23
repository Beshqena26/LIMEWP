"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES } from "@/config/routes";

const ACCENT_STYLES: Record<string, { bg: string; hover: string; text: string }> = {
  emerald: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-emerald-500" },
  blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-blue-500" },
  violet: { bg: "bg-violet-500", hover: "hover:bg-violet-600", text: "text-violet-500" },
  rose: { bg: "bg-rose-500", hover: "hover:bg-rose-600", text: "text-rose-500" },
  amber: { bg: "bg-amber-500", hover: "hover:bg-amber-600", text: "text-amber-500" },
  cyan: { bg: "bg-cyan-500", hover: "hover:bg-cyan-600", text: "text-cyan-500" },
};

const FEATURES = [
  {
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    title: "Blazing Fast",
    desc: "Enterprise-grade infrastructure with global CDN",
  },
  {
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "Secure by Default",
    desc: "Free SSL, daily backups, and malware scanning",
  },
  {
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    title: "24/7 Support",
    desc: "Expert WordPress support whenever you need it",
  },
];

export default function OnboardingPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.emerald;
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isLight ? "bg-white" : "bg-[var(--bg-primary)]"
      }`}
    >
      <div
        className={`flex-1 flex flex-col items-center justify-center px-4 py-12 transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <Image src="/limewp-logo.svg" alt="LimeWP" width={64} height={64} />
        </div>

        {/* Heading */}
        <h1 className={`text-[32px] font-bold mb-3 text-center ${isLight ? "text-slate-900" : "text-white"}`}>
          Welcome to LimeWP!
        </h1>
        <p className={`text-base mb-12 max-w-md mx-auto text-center ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          Let&apos;s get your first WordPress site up and running in under 5 minutes.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[640px] mb-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`rounded-xl border p-4 text-center ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${accent.bg}/10 mx-auto mb-3 flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                {f.title}
              </h3>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(ROUTES.NEW_SITE)}
          className={`px-10 py-3.5 rounded-xl text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${accent.bg} ${accent.hover}`}
        >
          Create Your First Site
        </button>

        {/* Skip */}
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className={`mt-4 text-sm font-medium transition-colors ${
            isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Skip, take me to the dashboard
        </button>
      </div>
    </div>
  );
}
