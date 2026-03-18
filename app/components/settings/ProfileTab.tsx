"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { INPUT_CLASS_NAMES, SELECT_CLASS_NAMES } from "@/data/settings";

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", shadowHover: "hover:shadow-emerald-500/30", focusBorder: "group-data-[focus=true]:border-emerald-500/50" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/10", gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20", shadowHover: "hover:shadow-sky-500/30", focusBorder: "group-data-[focus=true]:border-sky-500/50" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/10", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20", shadowHover: "hover:shadow-violet-500/30", focusBorder: "group-data-[focus=true]:border-violet-500/50" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/10", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", shadowHover: "hover:shadow-amber-500/30", focusBorder: "group-data-[focus=true]:border-amber-500/50" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/10", gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20", shadowHover: "hover:shadow-pink-500/30", focusBorder: "group-data-[focus=true]:border-pink-500/50" },
};

interface ProfileTabProps {
  onSave?: () => void;
}

export function ProfileTab({ onSave }: ProfileTabProps) {
  const { accentColor } = useTheme();
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className="space-y-6">
      {/* Profile Photo Card */}
      <ProfilePhotoCard />

      {/* Personal Info Card */}
      <PersonalInfoCard />

      {/* Preferences Card */}
      <PreferencesCard />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-11 px-6 shadow-lg ${accent.shadow} ${accent.shadowHover} transition-all`}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function ProfilePhotoCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Profile Photo</h3>
            <p className="text-xs text-zinc-500">Update your profile picture</p>
          </div>
        </div>

        <div className={`flex items-center gap-6 pb-6 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${accent.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
            <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white/10`}>
              LK
            </div>
          </div>
          <div className="flex gap-3">
            <Button className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-4 shadow-lg ${accent.shadow}`}>
              Upload Photo
            </Button>
            <Button variant="flat" className={`font-medium text-sm rounded-xl h-10 px-4 ${
              isLight
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                : "bg-[#27272A] text-zinc-400 hover:text-zinc-200"
            }`}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const inputClassNames = isLight ? {
    inputWrapper: `bg-zinc-50 border-zinc-200 hover:border-zinc-300 ${accent.focusBorder} !rounded-xl`,
    input: "text-zinc-800 placeholder:text-zinc-400",
  } : INPUT_CLASS_NAMES;

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Personal Information</h3>
            <p className="text-xs text-zinc-500">Manage your account details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Full Name</label>
            <Input defaultValue="Lime Admin" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Email Address</label>
            <Input defaultValue="admin@limewp.com" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Username</label>
            <Input defaultValue="limeadmin" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Phone Number</label>
            <Input defaultValue="+1 (555) 123-4567" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const selectClassNames = isLight ? {
    trigger: `bg-zinc-50 border-zinc-200 hover:border-zinc-300 ${accent.focusBorder} !rounded-xl text-zinc-800`,
    value: "text-zinc-800",
    popoverContent: "bg-white border border-zinc-200 rounded-xl",
    listbox: "bg-white",
  } : SELECT_CLASS_NAMES;

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Regional Preferences</h3>
            <p className="text-xs text-zinc-500">Set your timezone and language</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Timezone</label>
            <Select defaultSelectedKeys={["EST"]} classNames={selectClassNames} variant="bordered">
              <SelectItem key="UTC">UTC</SelectItem>
              <SelectItem key="EST">EST (Eastern)</SelectItem>
              <SelectItem key="PST">PST (Pacific)</SelectItem>
              <SelectItem key="CET">CET (Central Europe)</SelectItem>
              <SelectItem key="JST">JST (Japan)</SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Language</label>
            <Select defaultSelectedKeys={["en-us"]} classNames={selectClassNames} variant="bordered">
              <SelectItem key="en-us">English (US)</SelectItem>
              <SelectItem key="en-uk">English (UK)</SelectItem>
              <SelectItem key="es">Español</SelectItem>
              <SelectItem key="fr">Français</SelectItem>
              <SelectItem key="de">Deutsch</SelectItem>
              <SelectItem key="ja">日本語</SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
