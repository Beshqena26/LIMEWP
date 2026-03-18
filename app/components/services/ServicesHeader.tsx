"use client";

import { Button } from "@heroui/react";
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
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Services</h1>
        <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Manage your active services and discover new solutions</p>
      </div>
      <Button
        onClick={onAddService}
        className={`font-semibold text-sm gap-2 rounded-xl h-10 px-5 text-white shadow-lg ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
        startContent={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
        }
      >
        Add Service
      </Button>
    </div>
  );
}
