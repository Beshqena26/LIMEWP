"use client";

import { Button, Input } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", focusBorder: "group-data-[focus=true]:border-emerald-500/50" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/10", gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20", focusBorder: "group-data-[focus=true]:border-sky-500/50" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/10", gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20", focusBorder: "group-data-[focus=true]:border-violet-500/50" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/10", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", focusBorder: "group-data-[focus=true]:border-amber-500/50" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/10", gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/20", focusBorder: "group-data-[focus=true]:border-pink-500/50" },
};

interface ApiKey {
  name: string;
  prefix: string;
  suffix: string;
  created: string;
  type: "live" | "test";
}

const API_KEYS: ApiKey[] = [
  { name: "Production Key", prefix: "lwp_sk_", suffix: "mN4o", created: "Jan 15, 2026", type: "live" },
  { name: "Test Key", prefix: "lwp_sk_test_", suffix: "xY9z", created: "Jan 10, 2026", type: "test" },
];

export function ApiKeysTab() {
  return (
    <div className="space-y-6">
      <ApiKeysCard />
      <WebhooksCard />
    </div>
  );
}

function ApiKeysCard() {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>API Keys</h3>
              <p className="text-xs text-zinc-500">Manage your API access</p>
            </div>
          </div>
          <Button className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-9 px-4 shadow-lg ${accent.shadow} gap-2`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Key
          </Button>
        </div>

        <div className="space-y-4">
          {API_KEYS.map((key) => (
            <div key={key.name} className={`p-4 rounded-xl ${
              isLight ? "bg-zinc-50" : "bg-[#27272A]/50"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${key.type === 'live' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                    <svg className={`w-4 h-4 ${key.type === 'live' ? 'text-emerald-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{key.name}</p>
                    <p className="text-[11px] text-zinc-500">Created {key.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="flat" size="sm" className={`${accent.bg} ${accent.text} hover:opacity-80 font-medium text-xs rounded-lg h-8`}>
                    Reveal
                  </Button>
                  <Button variant="flat" size="sm" className={`font-medium text-xs rounded-lg h-8 ${
                    isLight
                      ? "bg-zinc-200 text-zinc-600 hover:text-zinc-800"
                      : "bg-[#3F3F46] text-zinc-400 hover:text-zinc-200"
                  }`}>
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className={`font-mono text-sm px-4 py-2.5 rounded-lg border ${
                isLight
                  ? "bg-zinc-100 text-zinc-600 border-zinc-200"
                  : "bg-[#1E1E21] text-zinc-400 border-[#2A2A2E]"
              }`}>
                {key.prefix}••••••••••••••••{key.suffix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebhooksCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const inputClassNames = isLight ? {
    inputWrapper: `bg-zinc-50 border-zinc-200 hover:border-zinc-300 ${accent.focusBorder} !rounded-xl`,
    input: "text-zinc-800 placeholder:text-zinc-400",
  } : {
    inputWrapper: [
      "bg-[#1E1E21]",
      "border-[#2A2A2E]",
      "hover:border-[#3F3F46]",
      accent.focusBorder,
      "group-data-[focus=true]:ring-1",
      accent.ring,
      "rounded-xl",
      "transition-all",
    ],
    input: ["text-zinc-100", "placeholder:text-zinc-500"],
  };

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
              <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Webhooks</h3>
            <p className="text-xs text-zinc-500">Receive event notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">Endpoint URL</label>
            <Input placeholder="https://your-domain.com/webhook" classNames={inputClassNames} variant="bordered" size="md" />
          </div>
          <div className="flex gap-3">
            <Button className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg ${accent.shadow}`}>
              Save Endpoint
            </Button>
            <Button variant="flat" className={`font-medium text-sm rounded-xl h-10 px-5 ${
              isLight
                ? "bg-zinc-100 text-zinc-700 hover:text-zinc-900"
                : "bg-[#27272A] text-zinc-300 hover:text-white"
            }`}>
              Generate Secret
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
