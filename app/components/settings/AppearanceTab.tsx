"use client";

import { Switch } from "@heroui/react";
import { useTheme, type ThemeMode, type AccentColor } from "@/lib/context/ThemeContext";

interface ThemeOption {
  id: ThemeMode;
  label: string;
  icon: string;
}

interface AccentColorOption {
  id: AccentColor;
  cls: string;
  ring: string;
  label: string;
}

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", border: "border-emerald-500/50", iconBg: "bg-emerald-500/20", switchOn: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/10", border: "border-sky-500/50", iconBg: "bg-sky-500/20", switchOn: "bg-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/10", border: "border-violet-500/50", iconBg: "bg-violet-500/20", switchOn: "bg-violet-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/10", border: "border-amber-500/50", iconBg: "bg-amber-500/20", switchOn: "bg-amber-500" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/10", border: "border-pink-500/50", iconBg: "bg-pink-500/20", switchOn: "bg-pink-500" },
};

const THEMES: ThemeOption[] = [
  { id: "dark", label: "Dark", icon: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" },
  { id: "light", label: "Light", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
  { id: "system", label: "System", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
];

const ACCENT_COLORS: AccentColorOption[] = [
  { id: "emerald", cls: "bg-emerald-500", ring: "ring-emerald-400", label: "Emerald" },
  { id: "sky", cls: "bg-sky-500", ring: "ring-sky-400", label: "Sky" },
  { id: "violet", cls: "bg-violet-500", ring: "ring-violet-400", label: "Violet" },
  { id: "amber", cls: "bg-amber-500", ring: "ring-amber-400", label: "Amber" },
  { id: "pink", cls: "bg-pink-500", ring: "ring-pink-400", label: "Pink" },
];

const UI_PREFERENCES = [
  { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing in the interface" },
  { key: "sidebarCollapsed", label: "Collapsed Sidebar", desc: "Start with sidebar minimized" },
  { key: "reduceMotion", label: "Reduce Motion", desc: "Minimize animations" },
  { key: "highContrast", label: "High Contrast", desc: "Increase text contrast" },
];

interface AppearanceTabProps {
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function AppearanceTab({ toggles, onToggle }: AppearanceTabProps) {
  const { theme, accentColor, setTheme, setAccentColor, resolvedTheme } = useTheme();

  return (
    <div className="space-y-6">
      <ThemeCard theme={theme} resolvedTheme={resolvedTheme} onThemeChange={setTheme} accentColor={accentColor} />
      <AccentColorCard accentColor={accentColor} onAccentColorChange={setAccentColor} resolvedTheme={resolvedTheme} />
      <UIPreferencesCard toggles={toggles} onToggle={onToggle} resolvedTheme={resolvedTheme} accentColor={accentColor} />
    </div>
  );
}

interface ThemeCardProps {
  theme: ThemeMode;
  resolvedTheme: "dark" | "light";
  accentColor: AccentColor;
  onThemeChange: (theme: ThemeMode) => void;
}

function ThemeCard({ theme, resolvedTheme, accentColor, onThemeChange }: ThemeCardProps) {
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-colors ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>Color Theme</h3>
            <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Choose your preferred theme</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`group relative p-4 rounded-xl cursor-pointer text-center transition-all overflow-hidden ${
                  active
                    ? `${accent.bg} border-2 ${accent.border}`
                    : isLight
                    ? "bg-zinc-100 border-2 border-transparent hover:border-zinc-300"
                    : "bg-[#27272A]/50 border-2 border-transparent hover:border-[#3F3F46]"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
                  active
                    ? `${accent.iconBg} ${accent.text}`
                    : isLight
                    ? "bg-zinc-200 text-zinc-500"
                    : "bg-[#1E1E21] text-zinc-400"
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                </div>
                <span className={`text-sm font-medium ${active ? accent.text : isLight ? "text-zinc-700" : "text-zinc-300"}`}>{t.label}</span>
                {active && (
                  <div className="absolute top-2 right-2">
                    <svg className={`w-4 h-4 ${accent.text}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface AccentColorCardProps {
  accentColor: AccentColor;
  resolvedTheme: "dark" | "light";
  onAccentColorChange: (color: AccentColor) => void;
}

function AccentColorCard({ accentColor, resolvedTheme, onAccentColorChange }: AccentColorCardProps) {
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-colors ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ring-1 ${accent.ring} flex items-center justify-center ${accent.text}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>Accent Color</h3>
            <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Customize your interface color</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {ACCENT_COLORS.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-2">
              <button
                onClick={() => onAccentColorChange(c.id)}
                className={`w-12 h-12 rounded-xl cursor-pointer transition-all ${c.cls} ${
                  accentColor === c.id
                    ? `ring-2 ${c.ring} ring-offset-2 ${isLight ? "ring-offset-white" : "ring-offset-[#1E1E21]"} scale-110`
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
              />
              <span className={`text-[10px] font-medium ${
                accentColor === c.id
                  ? isLight ? "text-zinc-900" : "text-zinc-100"
                  : isLight ? "text-zinc-500" : "text-zinc-500"
              }`}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface UIPreferencesCardProps {
  toggles: Record<string, boolean>;
  resolvedTheme: "dark" | "light";
  accentColor: AccentColor;
  onToggle: (key: string) => void;
}

function UIPreferencesCard({ toggles, resolvedTheme, accentColor, onToggle }: UIPreferencesCardProps) {
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const getSwitchClassNames = (isSelected: boolean) => ({
    wrapper: `transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isSelected
        ? accent.switchOn
        : isLight
          ? "bg-zinc-300"
          : "bg-zinc-600"
    }`,
    thumb: `bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
      isSelected ? "!ml-[calc(100%-20px)]" : "!ml-0"
    }`,
    thumbIcon: "hidden",
  });

  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-colors ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ring-1 ${accent.ring} flex items-center justify-center ${accent.text}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>UI Preferences</h3>
            <p className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Customize your interface experience</p>
          </div>
        </div>

        <div className="space-y-3">
          {UI_PREFERENCES.map((item) => (
            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isLight
                ? "bg-zinc-100/50 hover:bg-zinc-100"
                : "bg-[#27272A]/50 hover:bg-[#27272A]"
            }`}>
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{item.label}</p>
                <p className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{item.desc}</p>
              </div>
              <Switch isSelected={toggles[item.key]} onValueChange={() => onToggle(item.key)} classNames={getSwitchClassNames(toggles[item.key])} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
