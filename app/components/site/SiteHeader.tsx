"use client";

import { Button } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";

interface SiteHeaderProps {
  siteName: string;
  onVisitSite?: () => void;
  onSettings?: () => void;
}

export function SiteHeader({ siteName, onVisitSite, onSettings }: SiteHeaderProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-emerald-500/20 ring-4 ${isLight ? "ring-zinc-200" : "ring-white/5"}`}>
          {siteName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className={`text-xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{siteName}</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-400">Active</span>
            </span>
          </div>
          <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>WordPress 6.4.2 · PHP 8.2</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onVisitSite}
          variant="flat"
          className={`font-medium text-sm gap-2 ${
            isLight
              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
              : "bg-[#27272A] text-zinc-300 hover:text-white"
          }`}
          radius="lg"
          startContent={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          }
        >
          Visit Site
        </Button>
        <Button
          onClick={onSettings}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 gap-2"
          radius="lg"
          startContent={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          Settings
        </Button>
      </div>
    </div>
  );
}
