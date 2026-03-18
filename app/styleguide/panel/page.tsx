"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";

const THEME_COLORS = [
  { name: "Emerald", class: "bg-emerald-500", hex: "#10b981" },
  { name: "Sky", class: "bg-sky-500", hex: "#0ea5e9" },
  { name: "Violet", class: "bg-violet-500", hex: "#8b5cf6" },
  { name: "Amber", class: "bg-amber-500", hex: "#f59e0b" },
  { name: "Rose", class: "bg-rose-500", hex: "#f43f5e" },
  { name: "Pink", class: "bg-pink-500", hex: "#ec4899" },
  { name: "Cyan", class: "bg-cyan-500", hex: "#06b6d4" },
  { name: "Indigo", class: "bg-indigo-500", hex: "#6366f1" },
];

const ZINC_SCALE = [
  { name: "50", class: "bg-zinc-50", hex: "#fafafa" },
  { name: "100", class: "bg-zinc-100", hex: "#f4f4f5" },
  { name: "200", class: "bg-zinc-200", hex: "#e4e4e7" },
  { name: "300", class: "bg-zinc-300", hex: "#d4d4d8" },
  { name: "400", class: "bg-zinc-400", hex: "#a1a1aa" },
  { name: "500", class: "bg-zinc-500", hex: "#71717a" },
  { name: "600", class: "bg-zinc-600", hex: "#52525b" },
  { name: "700", class: "bg-zinc-700", hex: "#3f3f46" },
  { name: "800", class: "bg-zinc-800", hex: "#27272a" },
  { name: "900", class: "bg-zinc-900", hex: "#18181b" },
  { name: "950", class: "bg-zinc-950", hex: "#09090b" },
];

const SURFACE_TOKENS = [
  { name: "--bg-main", light: "#f0f2f5", dark: "#0f1117", desc: "Page background" },
  { name: "--bg-card", light: "#f4f5f7", dark: "#1e2130", desc: "Card surfaces" },
  { name: "--bg-elevated", light: "#ffffff", dark: "#1a1d27", desc: "Elevated elements" },
  { name: "--bg-sidebar", light: "#ebedf1", dark: "#161923", desc: "Sidebar background" },
  { name: "--bg-input", light: "#f4f5f7", dark: "#1e2130", desc: "Input backgrounds" },
  { name: "--text-primary", light: "#0f172a", dark: "#f1f5f9", desc: "Primary text" },
  { name: "--text-secondary", light: "#475569", dark: "#cbd5e1", desc: "Secondary text" },
  { name: "--text-tertiary", light: "#94a3b8", dark: "#64748b", desc: "Muted text" },
  { name: "--border", light: "#cbd5e1", dark: "#334155", desc: "Default borders" },
  { name: "--border-light", light: "#e2e8f0", dark: "#1e293b", desc: "Subtle borders" },
  { name: "--accent", light: "#059669", dark: "#10b981", desc: "Brand accent" },
  { name: "--accent-light", light: "#10b981", dark: "#34d399", desc: "Accent hover" },
  { name: "--accent-dark", light: "#047857", dark: "#059669", desc: "Accent pressed" },
];

const ICONS = [
  "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
  "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
];

const ICON_LABELS = ["Bolt", "Shield", "Search", "Bell", "Settings", "User"];

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

function Section({ id, title, desc, children }: { id: string; title: string; desc: string; children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <section id={id} className="mb-16">
      <h2 className={cn("text-2xl font-bold mb-1", isLight ? "text-zinc-900" : "text-zinc-100")}>{title}</h2>
      <p className={cn("text-sm mb-8", isLight ? "text-zinc-500" : "text-zinc-500")}>{desc}</p>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-4 mt-8", isLight ? "text-zinc-400" : "text-zinc-500")}>{children}</h3>;
}

export default function StyleGuidePage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const TOC = ["colors", "surfaces", "typography", "spacing", "buttons", "badges", "inputs", "cards", "tables", "icons", "states"];

  return (
    <div className={cn("min-h-screen", isLight ? "bg-zinc-50" : "bg-[#18181B]")}>
      {/* Header */}
      <div className={cn("sticky top-0 z-50 border-b backdrop-blur-xl", isLight ? "bg-white/80 border-zinc-200" : "bg-[#18181B]/80 border-[#27272A]")}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className={cn("text-xs font-semibold uppercase tracking-wider", isLight ? "text-emerald-600" : "text-emerald-400")}>Design System</span>
            <h1 className={cn("text-xl font-bold", isLight ? "text-zinc-900" : "text-zinc-100")}>LimeWP Style Guide</h1>
          </div>
          <Link href="/dashboard" className={cn("text-sm font-medium px-4 py-2 rounded-lg transition-colors", isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800")}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Table of Contents */}
        <div className={cn("flex flex-wrap gap-2 mb-12 p-4 rounded-xl border", isLight ? "bg-white border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]")}>
          <span className={cn("text-xs font-medium mr-2 py-1", isLight ? "text-zinc-400" : "text-zinc-500")}>Jump to:</span>
          {TOC.map(s => (
            <a key={s} href={`#${s}`} className={cn("text-xs font-medium px-3 py-1 rounded-md transition-colors capitalize", isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800")}>{s}</a>
          ))}
        </div>

        {/* ===== COLORS ===== */}
        <Section id="colors" title="Theme Colors" desc="Primary accent palette. 8 color variants available for buttons, badges, charts, and interactive elements.">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {THEME_COLORS.map(c => (
              <div key={c.name} onClick={() => copy(c.hex)} className={cn("rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 border", isLight ? "bg-white border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]")}>
                <div className={cn("h-16 w-full", c.class)} />
                <div className="p-3">
                  <div className={cn("text-xs font-semibold", isLight ? "text-zinc-800" : "text-zinc-200")}>{c.name}</div>
                  <div className={cn("text-[10px] font-mono", isLight ? "text-zinc-400" : "text-zinc-500")}>{copiedText === c.hex ? "Copied!" : c.hex}</div>
                </div>
              </div>
            ))}
          </div>

          <SubHeading>Zinc Scale</SubHeading>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2">
            {ZINC_SCALE.map(c => (
              <div key={c.name} onClick={() => copy(c.hex)} className="cursor-pointer group">
                <div className={cn("h-10 rounded-lg mb-1 ring-1 transition-all group-hover:scale-110", c.class, isLight ? "ring-zinc-200" : "ring-zinc-700")} />
                <div className={cn("text-[10px] font-mono text-center", isLight ? "text-zinc-500" : "text-zinc-500")}>{c.name}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== SURFACE TOKENS ===== */}
        <Section id="surfaces" title="Surface & Text Tokens" desc="CSS custom properties that adapt between light and dark modes. These power the entire theme system.">
          <div className={cn("rounded-xl border overflow-hidden", isLight ? "border-zinc-200" : "border-[#2A2A2E]")}>
            <table className="w-full text-sm">
              <thead>
                <tr className={cn(isLight ? "bg-zinc-50" : "bg-[#1E1E21]")}>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider", isLight ? "text-zinc-500" : "text-zinc-500")}>Token</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider", isLight ? "text-zinc-500" : "text-zinc-500")}>Light</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider", isLight ? "text-zinc-500" : "text-zinc-500")}>Dark</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider", isLight ? "text-zinc-500" : "text-zinc-500")}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {SURFACE_TOKENS.map((t, i) => (
                  <tr key={t.name} className={cn("border-t", isLight ? "border-zinc-100" : "border-[#27272A]", i % 2 === 0 ? "" : isLight ? "bg-zinc-50/50" : "bg-[#1E1E21]/50")}>
                    <td className="px-4 py-3"><code className={cn("text-xs font-mono px-2 py-0.5 rounded", isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-800 text-zinc-300")}>{t.name}</code></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-zinc-300" style={{ background: t.light }} />
                        <span className={cn("text-xs font-mono", isLight ? "text-zinc-600" : "text-zinc-400")}>{t.light}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-zinc-600" style={{ background: t.dark }} />
                        <span className={cn("text-xs font-mono", isLight ? "text-zinc-600" : "text-zinc-400")}>{t.dark}</span>
                      </div>
                    </td>
                    <td className={cn("px-4 py-3 text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== TYPOGRAPHY ===== */}
        <Section id="typography" title="Typography" desc="Plus Jakarta Sans for headings, system sans-serif stack for body. Zinc-based color scale for text hierarchy.">
          <div className="space-y-6">
            {[
              { label: "Display", size: "text-4xl", weight: "font-bold", sample: "Dashboard Overview" },
              { label: "Heading 1", size: "text-2xl", weight: "font-bold", sample: "Site Performance" },
              { label: "Heading 2", size: "text-xl", weight: "font-semibold", sample: "Security Status" },
              { label: "Heading 3", size: "text-lg", weight: "font-semibold", sample: "Recent Activity" },
              { label: "Body", size: "text-sm", weight: "font-normal", sample: "Premium managed WordPress hosting with blazing-fast performance and enterprise-grade security." },
              { label: "Caption", size: "text-xs", weight: "font-normal", sample: "Last updated 2 hours ago • 24.5K requests" },
            ].map(t => (
              <div key={t.label} className={cn("flex items-baseline gap-6 py-3 border-b", isLight ? "border-zinc-100" : "border-zinc-800")}>
                <span className={cn("text-xs font-mono w-24 flex-shrink-0", isLight ? "text-zinc-400" : "text-zinc-500")}>{t.label}</span>
                <span className={cn(t.size, t.weight, isLight ? "text-zinc-900" : "text-zinc-100")}>{t.sample}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== SPACING ===== */}
        <Section id="spacing" title="Spacing Scale" desc="Tailwind spacing utilities used consistently across the dashboard. Based on 4px increments.">
          <div className="space-y-2">
            {SPACING.map(s => (
              <div key={s} className="flex items-center gap-4">
                <span className={cn("text-xs font-mono w-10 text-right flex-shrink-0", isLight ? "text-zinc-400" : "text-zinc-500")}>{s}</span>
                <div className={cn("h-3 rounded-sm transition-all", isLight ? "bg-emerald-500/30" : "bg-emerald-500/20")} style={{ width: s * 4 }} />
                <span className={cn("text-xs font-mono", isLight ? "text-zinc-400" : "text-zinc-500")}>{s * 4}px</span>
              </div>
            ))}
          </div>

          <SubHeading>Border Radius</SubHeading>
          <div className="flex flex-wrap gap-6 mt-4">
            {[
              { name: "rounded-md", value: "6px" },
              { name: "rounded-lg", value: "8px" },
              { name: "rounded-xl", value: "12px" },
              { name: "rounded-2xl", value: "16px" },
              { name: "rounded-full", value: "9999px" },
            ].map(r => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div className={cn("w-16 h-16 border-2", r.name, isLight ? "border-zinc-300 bg-zinc-100" : "border-zinc-600 bg-zinc-800")} />
                <code className={cn("text-[10px] font-mono", isLight ? "text-zinc-500" : "text-zinc-500")}>{r.name}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== BUTTONS ===== */}
        <Section id="buttons" title="Buttons" desc="Primary, secondary, and destructive button variants. Used across the dashboard for actions and navigation.">
          <SubHeading>Primary</SubHeading>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 transition-all">Primary Action</button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-500/20 transition-all">Sky Variant</button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 shadow-lg shadow-violet-500/20 transition-all">Violet Variant</button>
          </div>

          <SubHeading>Secondary</SubHeading>
          <div className="flex flex-wrap gap-3">
            <button className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ring-1", isLight ? "bg-white text-zinc-700 ring-zinc-200 hover:bg-zinc-50" : "bg-[#27272A] text-zinc-200 ring-[#3F3F46] hover:bg-[#3F3F46]")}>Secondary</button>
            <button className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all", isLight ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200")}>Inverted</button>
          </div>

          <SubHeading>Destructive & States</SubHeading>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-400 transition-all">Delete</button>
            <button className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed", isLight ? "bg-zinc-200 text-zinc-500" : "bg-zinc-700 text-zinc-500")} disabled>Disabled</button>
          </div>

          <SubHeading>Sizes</SubHeading>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-500">Small</button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500">Default</button>
            <button className="px-6 py-3 rounded-xl text-base font-semibold text-white bg-emerald-500">Large</button>
          </div>
        </Section>

        {/* ===== BADGES ===== */}
        <Section id="badges" title="Badges & Status" desc="Inline status indicators, labels, and notification badges used throughout the dashboard.">
          <div className="flex flex-wrap gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Active</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">Warning</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 ring-1 ring-red-500/20">Critical</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">Info</span>
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold ring-1", isLight ? "bg-zinc-100 text-zinc-600 ring-zinc-200" : "bg-zinc-800 text-zinc-400 ring-zinc-700")}>Inactive</span>
          </div>

          <SubHeading>Status Dots</SubHeading>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Online", color: "bg-emerald-500" },
              { label: "Degraded", color: "bg-amber-500" },
              { label: "Offline", color: "bg-red-500" },
              { label: "Maintenance", color: "bg-sky-500" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", s.color)} />
                  <span className={cn("relative inline-flex rounded-full h-2 w-2", s.color)} />
                </span>
                <span className={cn("text-sm", isLight ? "text-zinc-700" : "text-zinc-300")}>{s.label}</span>
              </div>
            ))}
          </div>

          <SubHeading>Pill Tags</SubHeading>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white">New</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white">Pro</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">Hiring</span>
          </div>
        </Section>

        {/* ===== INPUTS ===== */}
        <Section id="inputs" title="Form Inputs" desc="Text inputs, selects, and form controls styled for the dashboard theme.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className={cn("block text-xs font-semibold mb-2", isLight ? "text-zinc-700" : "text-zinc-300")}>Default Input</label>
              <input type="text" placeholder="Type something..." className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ring-1", isLight ? "bg-zinc-50 text-zinc-800 ring-zinc-200 focus:ring-emerald-500/50" : "bg-[#27272A] text-zinc-100 ring-[#3F3F46] focus:ring-emerald-500/50")} />
            </div>
            <div>
              <label className={cn("block text-xs font-semibold mb-2", isLight ? "text-zinc-700" : "text-zinc-300")}>With Value</label>
              <input type="text" defaultValue="hello@limewp.com" className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ring-1", isLight ? "bg-zinc-50 text-zinc-800 ring-zinc-200 focus:ring-emerald-500/50" : "bg-[#27272A] text-zinc-100 ring-[#3F3F46] focus:ring-emerald-500/50")} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-red-400">Error State</label>
              <input type="text" defaultValue="bad-email" className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none ring-2 ring-red-500/50", isLight ? "bg-red-50 text-zinc-800" : "bg-red-500/10 text-zinc-100")} />
            </div>
            <div>
              <label className={cn("block text-xs font-semibold mb-2", isLight ? "text-zinc-700" : "text-zinc-300")}>Disabled</label>
              <input type="text" placeholder="Cannot edit" disabled className={cn("w-full px-4 py-2.5 rounded-xl text-sm outline-none ring-1 opacity-50 cursor-not-allowed", isLight ? "bg-zinc-100 text-zinc-400 ring-zinc-200" : "bg-[#27272A] text-zinc-500 ring-[#3F3F46]")} />
            </div>
          </div>
        </Section>

        {/* ===== CARDS ===== */}
        <Section id="cards" title="Cards" desc="Container components used for site cards, stat cards, and dashboard panels.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={cn("rounded-2xl border p-5 transition-all hover:shadow-lg cursor-pointer", isLight ? "bg-white border-zinc-200 hover:border-zinc-300" : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46]")}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={ICONS[0]} /></svg>
              </div>
              <h3 className={cn("text-sm font-semibold mb-1", isLight ? "text-zinc-800" : "text-zinc-100")}>Performance</h3>
              <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Optimized server response times</p>
            </div>
            <div className={cn("rounded-2xl border p-5 transition-all hover:shadow-lg cursor-pointer", isLight ? "bg-white border-zinc-200 hover:border-zinc-300" : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46]")}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={ICONS[1]} /></svg>
              </div>
              <h3 className={cn("text-sm font-semibold mb-1", isLight ? "text-zinc-800" : "text-zinc-100")}>Security</h3>
              <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Enterprise-grade protection</p>
            </div>
            <div className={cn("rounded-2xl border p-5 transition-all hover:shadow-lg cursor-pointer", isLight ? "bg-white border-zinc-200 hover:border-zinc-300" : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46]")}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={ICONS[2]} /></svg>
              </div>
              <h3 className={cn("text-sm font-semibold mb-1", isLight ? "text-zinc-800" : "text-zinc-100")}>Monitoring</h3>
              <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>24/7 uptime monitoring</p>
            </div>
          </div>

          <SubHeading>Stat Card</SubHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Uptime", value: "99.98%", change: "+0.02%" },
              { label: "Response Time", value: "142ms", change: "-8ms" },
              { label: "Page Speed", value: "94", change: "+3" },
              { label: "Requests", value: "24.5K", change: "+12%" },
            ].map(s => (
              <div key={s.label} className={cn("rounded-xl border p-4", isLight ? "bg-white border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]")}>
                <div className={cn("text-xs mb-2", isLight ? "text-zinc-500" : "text-zinc-500")}>{s.label}</div>
                <div className={cn("text-2xl font-bold", isLight ? "text-zinc-900" : "text-zinc-100")}>{s.value}</div>
                <div className="text-xs text-emerald-400 mt-1">{s.change}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== TABLES ===== */}
        <Section id="tables" title="Tables" desc="Data tables used for invoices, DNS records, API keys, and activity logs.">
          <div className={cn("rounded-xl border overflow-hidden", isLight ? "border-zinc-200" : "border-[#2A2A2E]")}>
            <table className="w-full text-sm">
              <thead>
                <tr className={cn(isLight ? "bg-zinc-50" : "bg-[#1E1E21]")}>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Invoice</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Date</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Amount</th>
                  <th className={cn("text-left px-4 py-3 font-semibold text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INV-001", date: "Mar 1, 2026", amount: "$29.00", status: "Paid" },
                  { id: "INV-002", date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
                  { id: "INV-003", date: "Jan 1, 2026", amount: "$29.00", status: "Pending" },
                ].map((row, i) => (
                  <tr key={row.id} className={cn("border-t", isLight ? "border-zinc-100" : "border-[#27272A]")}>
                    <td className={cn("px-4 py-3 font-medium", isLight ? "text-zinc-800" : "text-zinc-200")}>{row.id}</td>
                    <td className={cn("px-4 py-3", isLight ? "text-zinc-600" : "text-zinc-400")}>{row.date}</td>
                    <td className={cn("px-4 py-3 font-semibold", isLight ? "text-zinc-800" : "text-zinc-200")}>{row.amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase", row.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== ICONS ===== */}
        <Section id="icons" title="Icons" desc="Heroicons (outline) used throughout the dashboard. 24x24 SVG with stroke rendering.">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {ICONS.map((path, i) => (
              <div key={i} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer", isLight ? "hover:bg-zinc-100" : "hover:bg-zinc-800")}>
                <svg className={cn("w-6 h-6", isLight ? "text-zinc-700" : "text-zinc-300")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
                <span className={cn("text-[10px] font-mono", isLight ? "text-zinc-400" : "text-zinc-500")}>{ICON_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== STATES ===== */}
        <Section id="states" title="Interactive States" desc="Hover, focus, active, and disabled states demonstrated on common UI elements.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={cn("rounded-xl border p-5", isLight ? "bg-white border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]")}>
              <h4 className={cn("text-sm font-semibold mb-4", isLight ? "text-zinc-800" : "text-zinc-200")}>Progress Bars</h4>
              <div className="space-y-3">
                {[
                  { label: "CPU", value: 23, color: "bg-emerald-500" },
                  { label: "Memory", value: 67, color: "bg-sky-500" },
                  { label: "Storage", value: 89, color: "bg-amber-500" },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isLight ? "text-zinc-500" : "text-zinc-500"}>{p.label}</span>
                      <span className={isLight ? "text-zinc-600" : "text-zinc-400"}>{p.value}%</span>
                    </div>
                    <div className={cn("h-1.5 rounded-full overflow-hidden", isLight ? "bg-zinc-100" : "bg-zinc-800")}>
                      <div className={cn("h-full rounded-full transition-all", p.color)} style={{ width: `${p.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("rounded-xl border p-5", isLight ? "bg-white border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]")}>
              <h4 className={cn("text-sm font-semibold mb-4", isLight ? "text-zinc-800" : "text-zinc-200")}>Toggle Switches</h4>
              <div className="space-y-4">
                {["Notifications", "Auto-backup", "2FA"].map((label, i) => (
                  <ToggleRow key={label} label={label} defaultOn={i < 2} isLight={isLight} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className={cn("text-center py-8 mt-8 border-t text-xs", isLight ? "border-zinc-200 text-zinc-400" : "border-zinc-800 text-zinc-600")}>
          LimeWP Design System • March 2026
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn, isLight }: { label: string; defaultOn: boolean; isLight: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm", isLight ? "text-zinc-700" : "text-zinc-300")}>{label}</span>
      <button onClick={() => setOn(!on)} className={cn("relative w-10 h-5 rounded-full transition-colors", on ? "bg-emerald-500" : isLight ? "bg-zinc-200" : "bg-zinc-700")}>
        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
