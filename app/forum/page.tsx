"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";

type Category = {
  title: string;
  desc: string;
  threads: string;
  replies: string;
  color: string;
  icon: string;
};

type ThreadTag = {
  label: string;
  color: string;
};

type Thread = {
  id: string;
  initials: string;
  gradient: string;
  title: string;
  author: string;
  category: string;
  time: string;
  excerpt: string;
  tags: ThreadTag[];
  comments: number;
  views: number;
  isPinned?: boolean;
};

type Contributor = {
  initials: string;
  gradient: string;
  name: string;
  helpful: string;
  badge: string | null;
  badgeColor: string;
};

const categories: Category[] = [
  {
    title: "General Discussion",
    desc: "Chat about anything related to WordPress and web hosting",
    threads: "1,234",
    replies: "8,567",
    color: "emerald",
    icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  },
  {
    title: "Technical Support",
    desc: "Get help with hosting issues, errors, and configurations",
    threads: "2,456",
    replies: "15,234",
    color: "sky",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
  },
  {
    title: "Feature Requests",
    desc: "Share ideas and vote on new features for LimeWP",
    threads: "456",
    replies: "2,890",
    color: "violet",
    icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
  {
    title: "Showcase",
    desc: "Show off your WordPress sites built on LimeWP",
    threads: "189",
    replies: "1,456",
    color: "amber",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
];

const threads: Thread[] = [
  {
    id: "1",
    initials: "JD",
    gradient: "from-zinc-500 to-zinc-600",
    title: "How to configure Redis object caching for better performance?",
    author: "John Doe",
    category: "Technical Support",
    time: "2 hours ago",
    excerpt: "I've been trying to set up Redis for my WordPress site but running into some configuration issues. Has anyone successfully implemented this with LimeWP?",
    tags: [],
    comments: 12,
    views: 156,
    isPinned: true,
  },
  {
    id: "2",
    initials: "SM",
    gradient: "from-zinc-500 to-zinc-600",
    title: "Best practices for WordPress multisite on LimeWP",
    author: "Sarah M.",
    category: "General Discussion",
    time: "5 hours ago",
    excerpt: "I'm planning to set up a multisite network and would love to hear from others who have done this...",
    tags: [{ label: "Solved", color: "emerald" }],
    comments: 24,
    views: 342,
  },
  {
    id: "3",
    initials: "MK",
    gradient: "from-zinc-500 to-zinc-600",
    title: "Feature Request: Staging environment one-click deploy",
    author: "Mike K.",
    category: "Feature Requests",
    time: "1 day ago",
    excerpt: "It would be great to have a one-click deploy from staging to production with automatic backup...",
    tags: [{ label: "Popular", color: "amber" }],
    comments: 45,
    views: 567,
  },
  {
    id: "4",
    initials: "AL",
    gradient: "from-zinc-500 to-zinc-600",
    title: "Showcase: My e-commerce site built with WooCommerce",
    author: "Amy L.",
    category: "Showcase",
    time: "2 days ago",
    excerpt: "Just launched my online store using WooCommerce on LimeWP. Here's how I optimized it...",
    tags: [{ label: "Featured", color: "violet" }],
    comments: 18,
    views: 234,
  },
  {
    id: "5",
    initials: "RJ",
    gradient: "from-zinc-500 to-zinc-600",
    title: "SSL certificate not renewing automatically - Help needed",
    author: "Rob J.",
    category: "Technical Support",
    time: "3 days ago",
    excerpt: "My SSL cert didn't auto-renew and now my site shows security warnings. What should I do?",
    tags: [{ label: "Solved", color: "emerald" }],
    comments: 8,
    views: 189,
  },
];

const contributors: Contributor[] = [
  { initials: "JD", gradient: "from-zinc-500 to-zinc-600", name: "John Doe", helpful: "142 helpful", badge: "MVP", badgeColor: "emerald" },
  { initials: "SM", gradient: "from-zinc-500 to-zinc-600", name: "Sarah M.", helpful: "98 helpful", badge: "Expert", badgeColor: "violet" },
  { initials: "MK", gradient: "from-zinc-500 to-zinc-600", name: "Mike K.", helpful: "76 helpful", badge: "Expert", badgeColor: "sky" },
  { initials: "AL", gradient: "from-zinc-500 to-zinc-600", name: "Amy L.", helpful: "54 helpful", badge: null, badgeColor: "" },
];

const trendingTags = ["performance", "ssl", "migration", "woocommerce", "caching", "php8", "backup", "dns"];

const colorClasses: Record<string, { bg: string; text: string; ring: string; activeBg: string }> = {
  emerald: { bg: "bg-zinc-500/10", text: "text-zinc-400", ring: "ring-zinc-500/20", activeBg: "bg-zinc-500/15" },
  sky: { bg: "bg-zinc-500/10", text: "text-zinc-400", ring: "ring-zinc-500/20", activeBg: "bg-zinc-500/15" },
  violet: { bg: "bg-zinc-500/10", text: "text-zinc-400", ring: "ring-zinc-500/20", activeBg: "bg-zinc-500/15" },
  amber: { bg: "bg-zinc-500/10", text: "text-zinc-400", ring: "ring-zinc-500/20", activeBg: "bg-zinc-500/15" },
  rose: { bg: "bg-zinc-500/10", text: "text-zinc-400", ring: "ring-zinc-500/20", activeBg: "bg-zinc-500/15" },
};

export default function ForumPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [activeTab, setActiveTab] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Popular" },
    { id: "unanswered", label: "Unanswered" },
    { id: "solved", label: "Solved" },
  ];

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? "bg-zinc-200 ring-1 ring-zinc-300" : "bg-zinc-700 ring-1 ring-zinc-600"}`}>
            <svg className={`w-6 h-6 ${isLight ? "text-zinc-600" : "text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>
              Community Forum
            </h1>
            <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Connect, share, and learn with the LimeWP community</p>
          </div>
        </div>
        <button className={`group relative h-10 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2 ${isLight ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Discussion
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => {
          const colors = colorClasses[cat.color];
          return (
            <div
              key={cat.title}
              className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden ${
                isLight
                  ? "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-black/20"
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colors.bg} rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={cat.icon} />
                  </svg>
                </div>
                <h3 className={`font-semibold transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>{cat.title}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{cat.desc}</p>
                <div className={`flex items-center gap-3 mt-4 pt-3 border-t ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
                  <span className="text-[11px] text-zinc-500">
                    <span className={`font-semibold ${colors.text}`}>{cat.threads}</span> threads
                  </span>
                  <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>·</span>
                  <span className="text-[11px] text-zinc-500">
                    <span className={`font-semibold ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>{cat.replies}</span> replies
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Discussions Panel */}
        <div className="flex-1 min-w-0">
          <div className={`rounded-2xl overflow-hidden ${isLight ? "bg-white border border-zinc-200" : "bg-[#18181B] border border-[#27272A]"}`}>
            {/* Tabs Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? isLight
                          ? "bg-zinc-100 text-zinc-900"
                          : "bg-[#27272A] text-white"
                        : isLight
                          ? "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-[#27272A]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated 2 min ago
              </div>
            </div>

            {/* Thread List */}
            <div className={`divide-y ${isLight ? "divide-zinc-200" : "divide-[#27272A]"}`}>
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`group px-5 py-4 transition-colors cursor-pointer ${isLight ? "hover:bg-zinc-50" : "hover:bg-[#1E1E21]"}`}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${thread.gradient} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ring-2 ring-black/20`}>
                      {thread.initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        {thread.isPinned && (
                          <span className="flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16 4h2a2 2 0 012 2v1a1 1 0 01-1 1h-.586l-.707.707A1 1 0 0117 9v2.586l1.707 1.707a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414 0L14.586 15h-1.172l-3.293 3.293a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414L10.586 13V11a1 1 0 00-.293-.707L9.586 9.586l-.707.707A1 1 0 018 10H7a2 2 0 01-2-2V6a2 2 0 012-2h2a1 1 0 001-1V2a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1z" />
                            </svg>
                          </span>
                        )}
                        <h4 className={`font-semibold transition-colors leading-snug ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>
                          {thread.title}
                        </h4>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{thread.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className={`text-xs font-medium ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>{thread.author}</span>
                        <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>·</span>
                        <span className="text-xs text-zinc-500">{thread.category}</span>
                        <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>·</span>
                        <span className="text-xs text-zinc-500">{thread.time}</span>
                        {thread.tags.map((tag) => {
                          const tagColors = colorClasses[tag.color];
                          return (
                            <span
                              key={tag.label}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${tagColors.bg} ${tagColors.text}`}
                            >
                              {tag.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                        <span className="text-sm font-medium">{thread.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">{thread.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className={`px-5 py-4 border-t ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isLight
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800"
                  : "bg-[#27272A]/50 hover:bg-[#27272A] text-zinc-400 hover:text-zinc-200"
              }`}>
                Load More Discussions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-5">
          {/* Search & New Discussion */}
          <div className={`rounded-2xl p-4 ${isLight ? "bg-white border border-zinc-200" : "bg-[#18181B] border border-[#27272A]"}`}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500/50 focus:ring-1 focus:ring-zinc-500/20 transition-all ${
                  isLight
                    ? "bg-zinc-100 border border-zinc-200 text-zinc-800"
                    : "bg-[#27272A]/50 border border-[#3F3F46]/50 text-zinc-300"
                }`}
              />
            </div>
            <button className={`w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${isLight ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Start Discussion
            </button>
          </div>

          {/* Forum Stats */}
          <div className={`rounded-2xl overflow-hidden ${isLight ? "bg-white border border-zinc-200" : "bg-[#18181B] border border-[#27272A]"}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Forum Stats</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              {[
                { value: "4,335", label: "Discussions", color: "emerald" },
                { value: "28.1K", label: "Replies", color: "sky" },
                { value: "12.5K", label: "Members", color: "violet" },
                { value: "89%", label: "Solved Rate", color: "amber" },
              ].map((stat) => {
                const statColors = colorClasses[stat.color];
                return (
                  <div key={stat.label} className={`text-center p-3 rounded-xl ${isLight ? "bg-zinc-100" : "bg-[#27272A]/30"}`}>
                    <div className={`text-lg font-bold ${statColors.text}`}>{stat.value}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Contributors */}
          <div className={`rounded-2xl overflow-hidden ${isLight ? "bg-white border border-zinc-200" : "bg-[#18181B] border border-[#27272A]"}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Top Contributors</span>
            </div>
            <div className="p-4 space-y-3">
              {contributors.map((c, index) => (
                <div key={c.name} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-black/20 group-hover:scale-105 transition-transform`}>
                      {c.initials}
                    </div>
                    {index < 3 && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        index === 0 ? "bg-amber-500 text-amber-950" : index === 1 ? "bg-zinc-400 text-zinc-900" : "bg-amber-700 text-amber-100"
                      }`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium transition-colors truncate ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-200 group-hover:text-white"}`}>{c.name}</div>
                    <div className="text-[11px] text-zinc-500">{c.helpful}</div>
                  </div>
                  {c.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${colorClasses[c.badgeColor].bg} ${colorClasses[c.badgeColor].text}`}>
                      {c.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className={`rounded-2xl overflow-hidden ${isLight ? "bg-white border border-zinc-200" : "bg-[#18181B] border border-[#27272A]"}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Trending Tags</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all border border-transparent ${
                    isLight
                      ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 hover:border-zinc-300"
                      : "bg-[#27272A]/50 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
