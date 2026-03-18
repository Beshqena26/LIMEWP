"use client";

import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function StyleGuideIndex() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={cn("min-h-screen flex items-center justify-center", isLight ? "bg-zinc-50" : "bg-[#18181B]")}>
      <div className="max-w-lg w-full px-6">
        <div className="text-center mb-10">
          <span className={cn("text-xs font-semibold uppercase tracking-wider", isLight ? "text-emerald-600" : "text-emerald-400")}>Design System</span>
          <h1 className={cn("text-3xl font-bold mt-2", isLight ? "text-zinc-900" : "text-zinc-100")}>LimeWP Style Guides</h1>
          <p className={cn("text-sm mt-3", isLight ? "text-zinc-500" : "text-zinc-500")}>Choose which design system to explore.</p>
        </div>

        <div className="space-y-4">
          <Link href="/styleguide/landing" className={cn("block rounded-2xl border p-6 transition-all hover:scale-[1.02]", isLight ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg" : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46]")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isLight ? "text-zinc-900" : "text-zinc-100")}>Landing Page</h2>
                <p className={cn("text-sm", isLight ? "text-zinc-500" : "text-zinc-500")}>Vanilla CSS tokens, custom components, Icon library, Cards, Toggles</p>
              </div>
              <svg className={cn("w-5 h-5 ml-auto flex-shrink-0", isLight ? "text-zinc-400" : "text-zinc-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </div>
          </Link>

          <Link href="/styleguide/panel" className={cn("block rounded-2xl border p-6 transition-all hover:scale-[1.02]", isLight ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg" : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46]")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className={cn("text-lg font-semibold", isLight ? "text-zinc-900" : "text-zinc-100")}>Dashboard Panel</h2>
                <p className={cn("text-sm", isLight ? "text-zinc-500" : "text-zinc-500")}>Tailwind + HeroUI, zinc palette, buttons, badges, tables, inputs, states</p>
              </div>
              <svg className={cn("w-5 h-5 ml-auto flex-shrink-0", isLight ? "text-zinc-400" : "text-zinc-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className={cn("text-sm transition-colors", isLight ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-600 hover:text-zinc-400")}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
