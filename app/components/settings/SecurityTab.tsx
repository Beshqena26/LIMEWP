"use client";

import { Button, Input, Chip } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { INPUT_CLASS_NAMES, TWO_FACTOR_OPTIONS, ACTIVE_SESSIONS } from "@/data/settings";

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", focusBorder: "group-data-[focus=true]:border-emerald-500/50" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/10", gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20", focusBorder: "group-data-[focus=true]:border-sky-500/50" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/10", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20", focusBorder: "group-data-[focus=true]:border-violet-500/50" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/10", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", focusBorder: "group-data-[focus=true]:border-amber-500/50" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/10", gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20", focusBorder: "group-data-[focus=true]:border-pink-500/50" },
};

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <PasswordCard />
      <TwoFactorCard />
      <SessionsCard />
      <DangerZone />
    </div>
  );
}

function PasswordCard() {
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
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Change Password</h3>
            <p className="text-xs text-zinc-500">Update your password regularly for security</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Current Password</label>
            <Input type="password" placeholder="••••••••••••" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">New Password</label>
            <Input type="password" placeholder="••••••••••••" classNames={inputClassNames} variant="bordered" size="md" />
            <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1.5">
              <svg className={`w-3.5 h-3.5 ${isLight ? "text-zinc-400" : "text-zinc-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              12+ characters, mixed case, numbers, symbols
            </p>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Confirm Password</label>
            <Input type="password" placeholder="••••••••••••" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <Button className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg ${accent.shadow} mt-2`}>
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}

function TwoFactorCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

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
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Two-Factor Authentication</h3>
            <p className="text-xs text-zinc-500">Add an extra layer of security</p>
          </div>
        </div>

        <div className="space-y-3">
          {TWO_FACTOR_OPTIONS.map((item) => (
            <div key={item.label} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isLight
                ? "bg-zinc-50 hover:bg-zinc-100"
                : "bg-[#27272A]/50 hover:bg-[#27272A]"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isLight ? "bg-zinc-200" : "bg-[#1E1E21]"
                }`}>
                  <svg className={`w-4 h-4 ${isLight ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{item.label}</p>
                  <p className="text-[11px] text-zinc-500">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {item.enabled !== null && (
                  <Chip
                    size="sm"
                    classNames={{
                      base: item.enabled ? `${accent.bg} border-0` : "bg-zinc-700/50 border-0",
                      content: item.enabled ? `${accent.text} font-semibold text-[10px]` : "text-zinc-500 font-medium text-[10px]"
                    }}
                  >
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Chip>
                )}
                <Button variant="flat" size="sm" className={`font-medium text-xs rounded-lg h-8 ${
                  isLight
                    ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900"
                    : "bg-[#3F3F46] text-zinc-300 hover:text-white"
                }`}>
                  {item.enabled === null ? "Generate" : item.enabled ? "Manage" : "Setup"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionsCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

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
              <path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Active Sessions</h3>
            <p className="text-xs text-zinc-500">Manage your logged-in devices</p>
          </div>
        </div>

        <div className="space-y-3">
          {ACTIVE_SESSIONS.map((session, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
              isLight ? "bg-zinc-50" : "bg-[#27272A]/50"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  session.current
                    ? `${accent.bg}`
                    : isLight ? 'bg-zinc-200' : 'bg-[#1E1E21]'
                }`}>
                  <svg className={`w-4 h-4 ${session.current ? accent.text : isLight ? 'text-zinc-500' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={session.icon} />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{session.device}</p>
                  <p className="text-[11px] text-zinc-500">{session.location} · {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <Chip size="sm" classNames={{ base: `${accent.bg} border-0`, content: `${accent.text} font-semibold text-[10px]` }}>
                  Current
                </Chip>
              ) : (
                <Button variant="flat" size="sm" className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-medium text-xs rounded-lg h-8">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DangerZone() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className={`relative rounded-2xl border border-rose-500/20 overflow-hidden ${
      isLight
        ? "bg-rose-50/50"
        : "bg-gradient-to-br from-rose-500/5 to-[#1a1a1d]"
    }`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-rose-400">Danger Zone</h3>
            <p className="text-xs text-zinc-500">Irreversible actions</p>
          </div>
        </div>
        <p className={`text-sm mb-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Once you delete your account, there is no going back. All your data will be permanently removed.</p>
        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm rounded-xl h-10 px-5">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
