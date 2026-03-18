"use client";

import { useState, useMemo } from "react";
import { Button, Input, Chip, Progress } from "@heroui/react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";

interface DocItem {
  title: string;
  readTime: string;
  updated: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface DocSection {
  label: string;
  icon: string;
  color: string;
  items: DocItem[];
}

const sections: DocSection[] = [
  {
    label: "Getting Started",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    color: "emerald",
    items: [
      { title: "Quick Start Guide", readTime: "5 min", updated: "Jan 15, 2026", isNew: true },
      { title: "Creating Your First Site", readTime: "8 min", updated: "Jan 12, 2026" },
      { title: "Migrating from Another Host", readTime: "12 min", updated: "Jan 10, 2026" },
    ],
  },
  {
    label: "Site Management",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    color: "sky",
    items: [
      { title: "Managing WordPress Sites", readTime: "10 min", updated: "Jan 14, 2026" },
      { title: "Backups & Restore", readTime: "7 min", updated: "Jan 13, 2026", isPopular: true },
      { title: "Domain & DNS Settings", readTime: "6 min", updated: "Jan 11, 2026" },
      { title: "SSL Certificates", readTime: "5 min", updated: "Jan 8, 2026" },
    ],
  },
  {
    label: "Advanced",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    color: "violet",
    items: [
      { title: "WP-CLI Commands", readTime: "15 min", updated: "Jan 9, 2026" },
      { title: "SSH & SFTP Access", readTime: "8 min", updated: "Jan 7, 2026" },
      { title: "Performance Optimization", readTime: "12 min", updated: "Jan 5, 2026", isPopular: true },
    ],
  },
  {
    label: "Troubleshooting",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    color: "amber",
    items: [
      { title: "Common Error Messages", readTime: "10 min", updated: "Jan 6, 2026" },
      { title: "Database Issues", readTime: "8 min", updated: "Jan 4, 2026" },
      { title: "Plugin Conflicts", readTime: "6 min", updated: "Jan 3, 2026" },
    ],
  },
];

const colorClasses: Record<string, { bg: string; text: string; textLight: string; ring: string; gradient: string }> = {
  emerald: { bg: "bg-zinc-500/10", text: "text-zinc-400", textLight: "text-zinc-600", ring: "ring-zinc-500/20", gradient: "from-zinc-400 to-zinc-600" },
  sky: { bg: "bg-zinc-500/10", text: "text-zinc-400", textLight: "text-zinc-600", ring: "ring-zinc-500/20", gradient: "from-zinc-400 to-zinc-600" },
  violet: { bg: "bg-zinc-500/10", text: "text-zinc-400", textLight: "text-zinc-600", ring: "ring-zinc-500/20", gradient: "from-zinc-400 to-zinc-600" },
  amber: { bg: "bg-zinc-500/10", text: "text-zinc-400", textLight: "text-zinc-600", ring: "ring-zinc-500/20", gradient: "from-zinc-400 to-zinc-600" },
};

const tableOfContents = [
  { id: "intro", label: "Introduction" },
  { id: "step-1", label: "Step 1: Create a New Site" },
  { id: "step-2", label: "Step 2: Configure Your Site" },
  { id: "step-3", label: "Step 3: Install Plugins" },
  { id: "next-steps", label: "Next Steps" },
];

const popularArticles = [
  { title: "How to migrate from cPanel", category: "Migration", readTime: "10 min" },
  { title: "Setting up automatic backups", category: "Backups", readTime: "5 min" },
  { title: "Optimizing WordPress speed", category: "Performance", readTime: "12 min" },
  { title: "Connecting a custom domain", category: "DNS", readTime: "6 min" },
];

export default function DocsPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [activeDoc, setActiveDoc] = useState("Quick Start Guide");
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Site Management": true,
    "Advanced": false,
    "Troubleshooting": false,
  });
  const [activeSection, setActiveSection] = useState("intro");
  const [helpfulFeedback, setHelpfulFeedback] = useState<boolean | null>(null);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const filteredSections = useMemo(() => {
    if (!search) return sections;
    return sections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
      ),
    })).filter(section => section.items.length > 0);
  }, [search]);

  const currentSection = sections.find(s => s.items.some(i => i.title === activeDoc));
  const currentDoc = currentSection?.items.find(i => i.title === activeDoc);

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Documentation</h1>
          <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Learn how to get the most out of LimeWP hosting</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
              className={`font-semibold text-sm transition-all gap-2 rounded-xl ${
                isLight
                  ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                  : "bg-[#27272A] text-zinc-200 hover:bg-[#3F3F46] hover:text-white"
              }`}
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Changelog
            </Button>
          
          <Button
              className={`font-semibold text-sm transition-all gap-2 rounded-xl ${
                isLight
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              }`}
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              }
            >
              Feedback
            </Button>
          
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Articles", value: "47", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", color: "emerald" },
          { label: "Categories", value: "4", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z", color: "sky" },
          { label: "Video Tutorials", value: "12", icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z", color: "violet" },
          { label: "Last Updated", value: "Today", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "amber" },
        ].map((stat) => {
          const colors = colorClasses[stat.color];
          return (
            <div key={stat.label} className={`relative group rounded-xl p-4 border transition-all overflow-hidden ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colors.bg} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className={`text-xl font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-72 shrink-0">
          <div className="sticky top-24">
            <div className={`relative rounded-2xl border overflow-hidden ${
                isLight
                  ? "bg-white border-zinc-200"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
              }`}>
              {/* Corner Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />

              <div className="relative p-4">
                {/* Search */}
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search documentation..."
                    value={search}
                    onValueChange={setSearch}
                    startContent={
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    }
                    classNames={{
                      inputWrapper: isLight
                        ? ["bg-zinc-100", "border-zinc-200", "hover:bg-zinc-100", "group-data-[focus=true]:bg-zinc-100", "!rounded-xl"]
                        : ["bg-[#27272A]", "border-[#3F3F46]", "hover:bg-[#27272A]", "group-data-[focus=true]:bg-[#27272A]", "!rounded-xl"],
                      input: isLight
                        ? ["text-zinc-800", "text-sm", "placeholder:text-zinc-500"]
                        : ["text-zinc-100", "text-sm", "placeholder:text-zinc-500"],
                    }}
                  />
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className={`flex items-center justify-center gap-2 mb-4 py-2 px-3 rounded-lg border ${
                  isLight
                    ? "bg-zinc-100/50 border-zinc-200/50"
                    : "bg-[#27272A]/50 border-[#3F3F46]/50"
                }`}>
                  <span className="text-xs text-zinc-500">Quick search</span>
                  <div className="flex items-center gap-1">
                    <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      isLight ? "bg-zinc-200 text-zinc-600" : "bg-[#3F3F46] text-zinc-400"
                    }`}>⌘</kbd>
                    <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      isLight ? "bg-zinc-200 text-zinc-600" : "bg-[#3F3F46] text-zinc-400"
                    }`}>K</kbd>
                  </div>
                </div>

                {/* Nav Sections */}
                <div className="space-y-1">
                  {filteredSections.map((section) => {
                    const colors = colorClasses[section.color];
                    const isExpanded = expandedSections[section.label];
                    return (
                      <div key={section.label}>
                        <button
                          onClick={() => toggleSection(section.label)}
                          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-colors group ${
                            isLight ? "hover:bg-zinc-100" : "hover:bg-[#27272A]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                              <svg className={`w-3.5 h-3.5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d={section.icon} />
                              </svg>
                            </div>
                            <span className={`text-sm font-medium transition-colors ${
                              isLight
                                ? "text-zinc-700 group-hover:text-zinc-900"
                                : "text-zinc-300 group-hover:text-zinc-100"
                            }`}>
                              {section.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isLight ? "text-zinc-500 bg-zinc-100" : "text-zinc-600 bg-[#27272A]"
                            }`}>
                              {section.items.length}
                            </span>
                            <svg
                              className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className={`ml-4 pl-5 border-l space-y-0.5 py-1 ${
                            isLight ? "border-zinc-200" : "border-[#2A2A2E]"
                          }`}>
                            {section.items.map((item) => (
                              <button
                                key={item.title}
                                onClick={() => setActiveDoc(item.title)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                  activeDoc === item.title
                                    ? `${colors.bg} ${colors.text} ring-1 ${colors.ring}`
                                    : isLight
                                      ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                      : "text-zinc-400 hover:bg-[#27272A] hover:text-zinc-100"
                                }`}
                              >
                                <span className="truncate">{item.title}</span>
                                {item.isNew && (
                                  <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isLight
                                      ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300"
                                      : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"
                                  }`}>
                                    NEW
                                  </span>
                                )}
                                {item.isPopular && (
                                  <svg className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <div className={`mt-4 relative rounded-2xl border p-4 overflow-hidden ${
              isLight
                ? "bg-white border-zinc-200"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            }`}>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-zinc-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/3" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Popular</span>
                </div>
                <div className="space-y-2">
                  {popularArticles.map((article, i) => (
                    <button key={i} className={`w-full text-left p-2 rounded-lg transition-colors group ${
                      isLight ? "hover:bg-zinc-100" : "hover:bg-[#27272A]"
                    }`}>
                      <div className={`text-sm truncate ${
                        isLight
                          ? "text-zinc-700 group-hover:text-zinc-900"
                          : "text-zinc-300 group-hover:text-zinc-100"
                      }`}>{article.title}</div>
                      <div className="text-[11px] text-zinc-500">{article.category} • {article.readTime}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className={`relative rounded-2xl border overflow-hidden ${
            isLight
              ? "bg-white border-zinc-200"
              : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
          }`}>
            {/* Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />

            <div className="relative p-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className={`cursor-pointer transition-colors ${
                  isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                }`}>Docs</span>
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className={`cursor-pointer transition-colors ${
                  isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                }`}>{currentSection?.label}</span>
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className={`font-medium ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{activeDoc}</span>
              </div>

              {/* Title & Meta */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className={`text-3xl font-bold mb-3 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{activeDoc}</h1>
                  <div className="flex items-center gap-4">
                    <Chip
                      size="sm"
                      classNames={{
                        base: "bg-zinc-500/10 ring-1 ring-zinc-500/20",
                        content: "text-zinc-400 text-xs font-medium",
                      }}
                      startContent={
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    >
                      {currentDoc?.readTime || "5 min"} read
                    </Chip>
                    <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Updated {currentDoc?.updated || "Jan 15, 2026"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isLight
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700"
                      : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-zinc-200"
                  }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>

                  <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isLight
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700"
                      : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-zinc-200"
                  }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                    </button>

                  <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isLight
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700"
                      : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-zinc-200"
                  }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                    </button>

                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <span>Reading progress</span>
                  <span>0%</span>
                </div>
                <Progress
                  value={0}
                  size="sm"
                  classNames={{
                    base: "h-1",
                    track: isLight ? "bg-zinc-200" : "bg-[#27272A]",
                    indicator: isLight ? "bg-zinc-700" : "bg-zinc-300",
                  }}
                />
              </div>

              {/* Intro */}
              <p className={`mb-8 leading-relaxed text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                This guide will help you get started with LimeWP, the modern WordPress hosting platform. Follow the steps below to create, configure, and launch your first WordPress site in minutes.
              </p>

              {/* Info Callout */}
              <div className={`relative rounded-xl p-4 mb-8 overflow-hidden border ${
                isLight
                  ? "bg-zinc-100 border-zinc-200"
                  : "bg-zinc-800/50 border-zinc-700"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="relative flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLight
                      ? "bg-zinc-200 ring-1 ring-zinc-300"
                      : "bg-zinc-700 ring-1 ring-zinc-600"
                  }`}>
                    <svg className={`w-5 h-5 ${isLight ? "text-zinc-600" : "text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Before you begin</div>
                    <p className="text-sm text-zinc-400">
                      Make sure you have a LimeWP account and have verified your email address. If you haven&apos;t signed up yet, visit our registration page to create an account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div id="step-1" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4 mt-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isLight
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 text-zinc-900"
                  }`}>
                    1
                  </div>
                  <h2 className={`text-xl font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Create a New Site</h2>
                </div>
                <p className={`mb-4 leading-relaxed pl-11 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  Creating a new WordPress site on LimeWP is straightforward. Navigate to your dashboard and click the &quot;Create Site&quot; button. You&apos;ll need to complete the following steps:
                </p>
                <ul className="space-y-3 mb-6 pl-11">
                  {[
                    "Choose your preferred data center location",
                    "Select a WordPress version",
                    "Set up your admin credentials",
                    "Configure basic settings",
                  ].map((item) => (
                    <li key={item} className={`flex items-center gap-3 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLight
                          ? "bg-zinc-200 ring-1 ring-zinc-300"
                          : "bg-zinc-700 ring-1 ring-zinc-600"
                      }`}>
                        <svg className={`w-3 h-3 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Block */}
              <div className={`relative rounded-xl overflow-hidden mb-8 ml-11 ${
                isLight ? "bg-zinc-900" : "bg-[#09090B]"
              }`}>
                <div className={`flex items-center justify-between px-4 py-3 border-b ${
                  isLight ? "border-zinc-800" : "border-[#1E1E21]"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-zinc-500 text-xs font-mono ml-2">Terminal</span>
                  </div>
                  <button className={`text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded ${
                    isLight ? "hover:bg-zinc-800" : "hover:bg-[#1E1E21]"
                  }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    </button>

                </div>
                <div className="p-5 overflow-x-auto">
                  <pre className="font-mono text-sm">
                    <code>
                      <span className="text-zinc-500">$</span> <span className="text-zinc-300">limewp</span> <span className="text-zinc-400">site:create</span> <span className="text-zinc-500">--name</span>=<span className="text-zinc-300">&quot;my-site&quot;</span>{"\n"}
                      <span className="text-zinc-500">$</span> <span className="text-zinc-300">limewp</span> <span className="text-zinc-400">site:install-wp</span> <span className="text-zinc-500">--admin-email</span>=<span className="text-zinc-300">&quot;admin@example.com&quot;</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Warning Callout */}
              <div className={`relative rounded-xl p-4 mb-8 ml-11 overflow-hidden border ${
                isLight
                  ? "bg-zinc-100 border-zinc-200"
                  : "bg-zinc-800/50 border-zinc-700"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="relative flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLight
                      ? "bg-zinc-200 ring-1 ring-zinc-300"
                      : "bg-zinc-700 ring-1 ring-zinc-600"
                  }`}>
                    <svg className={`w-5 h-5 ${isLight ? "text-zinc-600" : "text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Important</div>
                    <p className="text-sm text-zinc-400">
                      Make sure to save your credentials in a secure location. You won&apos;t be able to retrieve your password after the initial setup is complete.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div id="step-2" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4 mt-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isLight
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 text-zinc-900"
                  }`}>
                    2
                  </div>
                  <h2 className={`text-xl font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Configure Your Site</h2>
                </div>
                <p className={`mb-6 leading-relaxed pl-11 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  Once your site is created, you can configure various settings including permalink structure, timezone, language, and more. Access your site&apos;s configuration panel from the dashboard to customize these options to match your requirements.
                </p>
              </div>

              {/* Step 3 */}
              <div id="step-3" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4 mt-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isLight
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 text-zinc-900"
                  }`}>
                    3
                  </div>
                  <h2 className={`text-xl font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Install Essential Plugins</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8 pl-11">
                  {[
                    { name: "Wordfence Security", desc: "Firewall and malware scanner", color: "emerald", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
                    { name: "W3 Total Cache", desc: "Performance optimization", color: "sky", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
                    { name: "Smush", desc: "Image compression", color: "violet", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12z" },
                    { name: "Yoast SEO", desc: "Search engine optimization", color: "amber", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
                  ].map((plugin) => {
                    const colors = colorClasses[plugin.color];
                    return (
                      <div key={plugin.name} className={`group relative p-4 rounded-xl border transition-all overflow-hidden ${
                        isLight
                          ? "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                          : "bg-[#27272A]/50 border-[#3F3F46]/50 hover:border-[#3F3F46]"
                      }`}>
                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${colors.bg} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                        <div className="relative flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                            <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={plugin.icon} />
                            </svg>
                          </div>
                          <div>
                            <div className={`font-medium ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{plugin.name}</div>
                            <div className="text-xs text-zinc-500">{plugin.desc}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success Callout */}
              <div id="next-steps" className={`scroll-mt-24 relative rounded-xl p-4 mb-8 overflow-hidden border ${
                isLight
                  ? "bg-zinc-100 border-zinc-200"
                  : "bg-zinc-800/50 border-zinc-700"
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="relative flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isLight
                      ? "bg-zinc-200 ring-1 ring-zinc-300"
                      : "bg-zinc-700 ring-1 ring-zinc-600"
                  }`}>
                    <svg className={`w-5 h-5 ${isLight ? "text-zinc-600" : "text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-semibold mb-1 ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Congratulations!</div>
                    <p className="text-sm text-zinc-400">
                      Your WordPress site is now set up and ready to go. You can start creating content, customizing your theme, and growing your online presence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Was this helpful? */}
              <div className={`relative rounded-xl p-6 mb-8 overflow-hidden ${
                isLight ? "bg-zinc-100/50" : "bg-[#27272A]/50"
              }`}>
                <div className="text-center">
                  <p className={`text-sm mb-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Was this article helpful?</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setHelpfulFeedback(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        helpfulFeedback === true
                          ? isLight
                            ? "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300"
                            : "bg-zinc-700 text-zinc-200 ring-1 ring-zinc-600"
                          : isLight
                            ? "bg-zinc-200/50 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                            : "bg-[#3F3F46]/50 text-zinc-400 hover:bg-[#3F3F46] hover:text-zinc-200"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                      </svg>
                      Yes
                    </button>
                    <button
                      onClick={() => setHelpfulFeedback(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        helpfulFeedback === false
                          ? isLight
                            ? "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300"
                            : "bg-zinc-700 text-zinc-200 ring-1 ring-zinc-600"
                          : isLight
                            ? "bg-zinc-200/50 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                            : "bg-[#3F3F46]/50 text-zinc-400 hover:bg-[#3F3F46] hover:text-zinc-200"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                      </svg>
                      No
                    </button>
                  </div>
                  {helpfulFeedback !== null && (
                    <p className="text-xs text-zinc-500 mt-3">Thanks for your feedback!</p>
                  )}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className={`flex justify-between items-center pt-6 border-t ${
                isLight ? "border-zinc-200" : "border-[#2A2A2E]"
              }`}>
                <button className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isLight ? "hover:bg-zinc-100" : "hover:bg-[#27272A]"
                }`}>
                  <svg className={`w-5 h-5 transition-colors ${
                    isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-300"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-zinc-500">Previous</div>
                    <div className={`text-sm font-medium transition-colors ${
                      isLight ? "text-zinc-700 group-hover:text-zinc-900" : "text-zinc-300 group-hover:text-zinc-100"
                    }`}>Introduction</div>
                  </div>
                </button>
                <button className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isLight ? "hover:bg-zinc-100" : "hover:bg-[#27272A]"
                }`}>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500">Next</div>
                    <div className={`text-sm font-medium transition-colors ${
                      isLight
                        ? "text-zinc-700 group-hover:text-zinc-900"
                        : "text-zinc-300 group-hover:text-zinc-100"
                    }`}>Creating Your First Site</div>
                  </div>
                  <svg className={`w-5 h-5 transition-colors ${
                    isLight
                      ? "text-zinc-600 group-hover:text-zinc-800"
                      : "text-zinc-400 group-hover:text-zinc-200"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Table of Contents */}
        <div className="w-56 shrink-0 hidden xl:block">
          <div className="sticky top-24">
            <div className={`relative rounded-2xl border p-4 overflow-hidden ${
              isLight
                ? "bg-white border-zinc-200"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            }`}>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-zinc-500/10 to-transparent rounded-full translate-y-1/3 translate-x-1/3" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">On this page</span>
                </div>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === item.id
                          ? isLight
                            ? "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300"
                            : "bg-zinc-700 text-zinc-200 ring-1 ring-zinc-600"
                          : isLight
                            ? "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-[#27272A]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Help Card */}
            <div className={`mt-4 relative rounded-2xl border p-4 overflow-hidden ${
              isLight
                ? "bg-white border-zinc-200"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            }`}>
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-zinc-500/10 to-transparent rounded-full -translate-y-1/3 -translate-x-1/3" />

              <div className="relative text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isLight
                    ? "bg-zinc-200 ring-1 ring-zinc-300"
                    : "bg-zinc-700 ring-1 ring-zinc-600"
                }`}>
                  <svg className={`w-6 h-6 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className={`text-sm mb-3 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Need help? Our support team is available 24/7</p>
                <button className={`w-full h-9 rounded-xl text-sm font-semibold transition-all ${
                  isLight
                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                }`}>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
