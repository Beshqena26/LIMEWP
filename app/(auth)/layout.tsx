"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { accentColor, resolvedTheme } = useTheme();
  const colors = getColorClasses(accentColor);
  const isLight = resolvedTheme === "light";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — desktop only */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br ${colors.gradient} flex-col justify-between p-12 text-white`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/20" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-white/30" />
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/10" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">LimeWP</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Manage your WordPress
              <br />
              sites with ease
            </h1>
            <p className="mt-3 text-white/70 text-sm max-w-sm">
              The all-in-one platform for WordPress hosting, management, and optimization.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                title: "One-click WordPress installation",
                desc: "Deploy new sites in seconds with our optimized stack",
              },
              {
                icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
                title: "Automated daily backups",
                desc: "Never lose your data with automated backup solutions",
              },
              {
                icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
                title: "24/7 expert support",
                desc: "Our WordPress experts are always ready to help",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-white/60 text-xs mt-0.5">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/50 text-xs">
          &copy; {new Date().getFullYear()} LimeWP. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 ${
          isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"
        }`}
      >
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
