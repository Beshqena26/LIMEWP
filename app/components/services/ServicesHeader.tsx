"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";

interface ServicesHeaderProps {
  onAddService?: () => void;
}

export function ServicesHeader({ onAddService }: ServicesHeaderProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Services</h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Manage your active services and discover new solutions</p>
      </div>
      <button
        onClick={onAddService}
        className={`font-semibold text-sm gap-2 rounded-xl h-10 px-5 text-white shadow-lg flex items-center ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v16m8-8H4" />
        </svg>
        Add Service
      </button>
    </div>
  );
}
