"use client";

import { Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "@/lib/context/ThemeContext";
import { SupportChat } from "./ui/SupportChat";
import { Breadcrumbs } from "./ui/Breadcrumbs";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-white focus:text-slate-900 focus:shadow-lg focus:ring-2 focus:ring-emerald-500 focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        className={`pt-16 flex-1 transition-colors ${
          isLight ? "bg-slate-100" : "bg-[var(--bg-primary)]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 py-6 sm:p-6 lg:p-8">
          <Suspense fallback={null}>
            <Breadcrumbs />
          </Suspense>
          {children}
        </div>
      </main>
      <Footer />
      <aside aria-label="Support chat">
        <SupportChat />
      </aside>
    </div>
  );
}
