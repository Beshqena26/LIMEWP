"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Input,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { ROUTES } from "@/config/routes";
import { NAV_GROUPS, NAV_ICONS } from "@/config/navigation";
import { useTheme } from "@/lib/context/ThemeContext";

// Accent color configuration for navigation items
const ACCENT_STYLES = {
  emerald: {
    indicator: "bg-emerald-500",
    activeBg: "bg-emerald-500/10",
    activeRing: "ring-emerald-500/20",
    text: "text-emerald-500",
    hoverBg: "hover:bg-emerald-500/10",
    hoverText: "hover:text-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
    btn: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 ring-emerald-500/20",
  },
  sky: {
    indicator: "bg-sky-500",
    activeBg: "bg-sky-500/10",
    activeRing: "ring-sky-500/20",
    text: "text-sky-500",
    hoverBg: "hover:bg-sky-500/10",
    hoverText: "hover:text-sky-500",
    gradient: "from-sky-500 to-sky-600",
    shadow: "shadow-sky-500/20",
    btn: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 ring-sky-500/20",
  },
  violet: {
    indicator: "bg-violet-500",
    activeBg: "bg-violet-500/10",
    activeRing: "ring-violet-500/20",
    text: "text-violet-500",
    hoverBg: "hover:bg-violet-500/10",
    hoverText: "hover:text-violet-500",
    gradient: "from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/20",
    btn: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 ring-violet-500/20",
  },
  amber: {
    indicator: "bg-amber-500",
    activeBg: "bg-amber-500/10",
    activeRing: "ring-amber-500/20",
    text: "text-amber-500",
    hoverBg: "hover:bg-amber-500/10",
    hoverText: "hover:text-amber-500",
    gradient: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20",
    btn: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 ring-amber-500/20",
  },
  pink: {
    indicator: "bg-pink-500",
    activeBg: "bg-pink-500/10",
    activeRing: "ring-pink-500/20",
    text: "text-pink-500",
    hoverBg: "hover:bg-pink-500/10",
    hoverText: "hover:text-pink-500",
    gradient: "from-pink-500 to-pink-600",
    shadow: "shadow-pink-500/20",
    btn: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 ring-pink-500/20",
  },
};

const notifications = [
  { type: "success", title: "Backup completed", desc: "limewp.com backup finished", time: "2 min ago", unread: true },
  { type: "warning", title: "SSL expiring", desc: "supernova.guru cert expires in 7 days", time: "1 hour ago", unread: true },
  { type: "update", title: "WordPress 6.7", desc: "New version available", time: "3 hours ago", unread: true },
  { type: "info", title: "Traffic spike", desc: "limewp.com traffic up 150%", time: "Yesterday", unread: false },
];

const iconColors: Record<string, { bg: string; text: string; ring: string }> = {
  success: { bg: "bg-emerald-500/15", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  warning: { bg: "bg-amber-500/15", text: "text-amber-400", ring: "ring-amber-500/20" },
  update: { bg: "bg-violet-500/15", text: "text-violet-400", ring: "ring-violet-500/20" },
  info: { bg: "bg-sky-500/15", text: "text-sky-400", ring: "ring-sky-500/20" },
};

function NotificationIcon({ type }: { type: string }) {
  const props = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "w-4 h-4" };
  if (type === "success") return <svg {...props}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (type === "warning") return <svg {...props}><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
  if (type === "update") return <svg {...props}><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>;
  return <svg {...props}><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
}

// Flatten all nav items for the header
const ALL_NAV_ITEMS = NAV_GROUPS.flatMap(group => group.items);

// Home item (first in nav)
const HOME_ITEM = ALL_NAV_ITEMS.find(item => item.label === "Home");

// Items to show directly in the header nav (excluding Home, Settings, Resources and Support group items)
const DIRECT_NAV_ITEMS = ALL_NAV_ITEMS.filter(
  item => !["Home", "Settings", "Documentation", "API Reference", "Community Forum", "Support"].includes(item.label)
);

// Items for the Resources dropdown
const RESOURCES_ITEMS = ALL_NAV_ITEMS.filter(
  item => ["Documentation", "API Reference", "Community Forum", "Support"].includes(item.label)
);

// Quick search suggestions
const SEARCH_SUGGESTIONS = [
  { label: "Go to Dashboard", href: ROUTES.DASHBOARD, icon: NAV_ICONS.home, type: "navigation" },
  { label: "Manage Services", href: ROUTES.SERVICES, icon: NAV_ICONS.services, type: "navigation" },
  { label: "View Billing", href: ROUTES.BILLING, icon: NAV_ICONS.billing, type: "navigation" },
  { label: "DNS Settings", href: ROUTES.DNS, icon: NAV_ICONS.dns, type: "navigation" },
  { label: "Documentation", href: ROUTES.DOCS, icon: NAV_ICONS.docs, type: "resource" },
  { label: "API Reference", href: ROUTES.API_REFERENCE, icon: NAV_ICONS.apiReference, type: "resource" },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, accentColor, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setTheme(isLight ? "dark" : "light");
  const unreadCount = notifications.filter(n => n.unread).length;

  // Cmd+K / Ctrl+K keyboard shortcut and Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Filter suggestions based on query
  const filteredSuggestions = searchQuery.trim()
    ? SEARCH_SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  const accentFocusClasses = {
    emerald: "group-data-[focus=true]:!border-emerald-500/40 group-data-[focus=true]:!ring-emerald-500/20",
    sky: "group-data-[focus=true]:!border-sky-500/40 group-data-[focus=true]:!ring-sky-500/20",
    violet: "group-data-[focus=true]:!border-violet-500/40 group-data-[focus=true]:!ring-violet-500/20",
    amber: "group-data-[focus=true]:!border-amber-500/40 group-data-[focus=true]:!ring-amber-500/20",
    pink: "group-data-[focus=true]:!border-pink-500/40 group-data-[focus=true]:!ring-pink-500/20",
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
      isLight
        ? "bg-white border-slate-200"
        : "bg-gradient-to-r from-[#0f1117] to-[#181b28] border-white/[0.06]"
    }`}>
      <div className="max-w-[1440px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center">
      {/* Left Side - Logo and Navigation */}
      <div className="flex items-center gap-6 flex-1">
        <Link href={ROUTES.DASHBOARD} className="group flex-shrink-0">
          <Image
            src="/limewp-logo.svg"
            alt="LimeWP"
            width={120}
            height={32}
            className={`group-hover:opacity-90 transition-opacity ${isLight ? "brightness-0" : ""}`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Home Link */}
          {HOME_ITEM && (() => {
            const isActive = pathname === HOME_ITEM.href;
            return (
              <Link
                href={HOME_ITEM.href}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? isLight
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-900"
                    : isLight
                    ? `text-slate-600 ${accent.hoverBg} ${accent.hoverText}`
                    : `text-slate-400 ${accent.hoverBg} ${accent.hoverText}`
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={HOME_ITEM.icon} />
                </svg>
                <span>{HOME_ITEM.label}</span>
              </Link>
            );
          })()}

          {/* Other Nav Items */}
          {DIRECT_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? isLight
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-900"
                    : isLight
                    ? `text-slate-600 ${accent.hoverBg} ${accent.hoverText}`
                    : `text-slate-400 ${accent.hoverBg} ${accent.hoverText}`
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? isLight
                        ? "bg-white/20 text-white"
                        : "bg-slate-900/20 text-slate-900"
                      : isLight
                      ? "bg-slate-200 text-slate-500"
                      : "bg-[#1a1d27] text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Resources Dropdown */}
          <Popover placement="bottom-start">
            <PopoverTrigger>
              {(() => {
                const isResourcesActive = RESOURCES_ITEMS.some(item => pathname === item.href);
                return (
                  <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    isResourcesActive
                      ? isLight
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-900"
                      : isLight
                      ? `text-slate-600 ${accent.hoverBg} ${accent.hoverText}`
                      : `text-slate-400 ${accent.hoverBg} ${accent.hoverText}`
                  }`}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={NAV_ICONS.docs} />
                    </svg>
                    <span>Resources</span>
                    <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={NAV_ICONS.chevronDown} />
                    </svg>
                  </button>
                );
              })()}
            </PopoverTrigger>
            <PopoverContent className={`p-2 rounded-xl shadow-2xl shadow-black/20 w-fit ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[#1e2130] border border-[#282b3a]"
            }`}>
              <div className="space-y-1">
                {RESOURCES_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? isLight
                            ? "bg-slate-800"
                            : "bg-slate-100"
                          : isLight
                          ? "hover:bg-slate-100"
                          : "hover:bg-[#1a1d27]"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${isActive ? (isLight ? "text-white" : "text-slate-900") : isLight ? "text-slate-500" : "text-slate-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={item.icon} />
                      </svg>
                      <span className={`text-sm font-medium ${
                        isActive
                          ? isLight ? "text-white" : "text-slate-900"
                          : isLight ? "text-slate-700" : "text-slate-200"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </div>

      {/* Right Side - Search, Notifications, Theme, User */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search with Dropdown */}
        <div ref={searchContainerRef} className="relative hidden md:block w-[200px] lg:w-[260px]">
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search..."
            variant="bordered"
            radius="lg"
            size="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            startContent={
              <svg className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            endContent={
              <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-lg border flex-shrink-0 ${
                isLight
                  ? "text-slate-400 bg-slate-100 border-slate-200"
                  : "text-slate-500 bg-[#0f1117] border-[#334155]"
              }`}>
                <span className="text-[11px]">⌘</span>K
              </kbd>
            }
            classNames={{
              base: "w-full",
              inputWrapper: [
                "!rounded-xl",
                isLight ? "bg-slate-50" : "bg-[#1e2130]",
                isLight ? "border-slate-200" : "border-[#282b3a]",
                isLight ? "hover:border-slate-300" : "hover:border-[#334155]",
                accentFocusClasses[accentColor],
                "group-data-[focus=true]:!ring-1",
                "!outline-none",
                "h-9",
                "transition-all",
              ],
              input: [
                "text-sm",
                isLight ? "text-slate-800" : "text-slate-100",
                isLight ? "placeholder:text-slate-400" : "placeholder:text-slate-500",
                "!px-2",
                "!outline-none",
                "!ring-0",
              ],
            }}
          />

          {/* Search Dropdown */}
          {searchOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50 ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[#1e2130] border border-[#282b3a]"
            }`}>
              <div className="py-1.5 w-full">
                {/* Quick Actions Header */}
                <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}>
                  {searchQuery.trim() ? "Results" : "Quick Actions"}
                </div>

                {/* Suggestions List */}
                <div className="flex flex-col gap-0.5 px-1.5">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion) => (
                      <Link
                        key={suggestion.href}
                        href={suggestion.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all w-full ${
                          isLight
                            ? "hover:bg-slate-100"
                            : "hover:bg-[#1a1d27]"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${
                            suggestion.type === "navigation"
                              ? isLight ? "text-slate-400" : "text-slate-500"
                              : "text-violet-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={suggestion.icon} />
                        </svg>
                        <span className={`text-[13px] truncate flex-1 text-left ${
                          isLight ? "text-slate-700" : "text-slate-200"
                        }`}>
                          {suggestion.label}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className={`px-2 py-4 text-center w-full ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      <p className="text-xs">No results found</p>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className={`mt-1 pt-1.5 border-t flex items-center justify-center px-3 py-1.5 ${
                  isLight ? "border-slate-100" : "border-[#282b3a]"
                }`}>
                  <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    <kbd className={`px-1 py-0.5 rounded font-mono text-[9px] ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>esc</kbd> to close
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[360px] ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[#1e2130] border border-[#282b3a]"
            }`
          }}
        >
          <DropdownTrigger>
            <button className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
              isLight
                ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
                : "bg-[#1a1d27]/50 hover:bg-[#1a1d27] text-slate-400 hover:text-slate-200 border-transparent hover:border-[#334155]"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ${
                  isLight ? "ring-white" : "ring-[#0f1117]"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Notifications"
            classNames={{
              base: "p-0",
              list: "gap-0",
            }}
            items={[
              { key: "header", itemType: "header" as const },
              ...notifications.map((n, i) => ({ ...n, key: `notif-${i}`, itemType: "notification" as const })),
              { key: "view-all", itemType: "footer" as const },
            ]}
          >
            {(item) => {
              if (item.itemType === "header") {
                return (
                  <DropdownItem key={item.key} isReadOnly className="p-0 cursor-default data-[hover=true]:bg-transparent" textValue="Notifications header">
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${
                      isLight ? "border-slate-200 bg-slate-50" : "border-[#282b3a] bg-[#181b28]"
                    }`}>
                      <span className={`text-sm font-semibold ${isLight ? "text-slate-900" : "text-slate-100"}`}>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg ring-1 ring-emerald-500/20">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </DropdownItem>
                );
              }
              if (item.itemType === "footer") {
                return (
                  <DropdownItem key={item.key} className="p-0 data-[hover=true]:bg-transparent" textValue="View all">
                    <Link href="/support" className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors`}>
                      View all notifications
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </DropdownItem>
                );
              }
              const notification = item as typeof notifications[0] & { key: string; type: string };
              return (
                <DropdownItem
                  key={notification.key}
                  className={`px-4 py-3 rounded-none border-b ${
                    isLight ? "border-slate-100" : "border-[#282b3a]/50"
                  } ${notification.unread ? (isLight ? 'bg-emerald-500/[0.02]' : 'bg-emerald-500/[0.03]') : ''}`}
                  textValue={notification.title}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${iconColors[notification.type].bg} ${iconColors[notification.type].text} ring-1 ${iconColors[notification.type].ring} flex items-center justify-center flex-shrink-0`}>
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${notification.unread ? (isLight ? 'text-slate-900' : 'text-slate-100') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>{notification.title}</span>
                        {notification.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs truncate mt-0.5 text-slate-500">{notification.desc}</p>
                      <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-400" : "text-slate-600"}`}>{notification.time}</span>
                    </div>
                  </div>
                </DropdownItem>
              );
            }}
          </DropdownMenu>
        </Dropdown>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
              : "bg-[#1a1d27]/50 hover:bg-[#1a1d27] text-slate-400 hover:text-slate-200 border-transparent hover:border-[#334155]"
          }`}
          title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </button>

        {/* Divider */}
        <div className={`w-px h-6 ${isLight ? "bg-slate-200" : "bg-[#282b3a]"}`} />

        {/* User Menu */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[240px] ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[#1e2130] border border-[#282b3a]"
            }`
          }}
        >
          <DropdownTrigger>
            <button className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all group ${
              isLight
                ? "bg-slate-100/30 hover:bg-slate-100 border-transparent hover:border-slate-200"
                : "bg-[#1a1d27]/30 hover:bg-[#1a1d27] border-transparent hover:border-[#334155]"
            }`}>
              <div className="relative">
                <Avatar
                  name="LK"
                  size="sm"
                  classNames={{
                    base: "w-8 h-8 bg-gradient-to-br from-emerald-400 to-sky-500 ring-2 ring-white/10",
                    name: "text-white text-[10px] font-bold",
                  }}
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${isLight ? "ring-white" : "ring-[#0f1117]"}`} />
              </div>
              <div className="text-left hidden sm:block">
                <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>Lime</div>
              </div>
              <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User menu"
            classNames={{
              base: "p-0",
              list: "gap-0",
            }}
          >
            <DropdownItem key="user-info" isReadOnly className="p-0 cursor-default data-[hover=true]:bg-transparent" textValue="User info">
              <div className={`flex items-center gap-3 px-4 py-4 border-b ${isLight ? "border-slate-200" : "border-[#282b3a]"}`}>
                <Avatar
                  name="LK"
                  size="md"
                  classNames={{
                    base: "w-10 h-10 bg-gradient-to-br from-emerald-400 to-sky-500 ring-2 ring-white/10",
                    name: "text-white text-sm font-bold",
                  }}
                />
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-slate-900" : "text-slate-100"}`}>Lime Starter</div>
                  <div className="text-xs text-slate-500">lime@example.com</div>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem key="settings-header" isReadOnly className="p-0 cursor-default data-[hover=true]:bg-transparent" textValue="Settings">
              <div className={`px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                Settings
              </div>
            </DropdownItem>
            <DropdownItem
              key="profile"
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[#1a1d27]/50"}`}
              textValue="Profile"
              href={ROUTES.SETTINGS_PROFILE}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Profile</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="security"
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[#1a1d27]/50"}`}
              textValue="Security"
              href={ROUTES.SETTINGS_SECURITY}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Security</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="appearance"
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[#1a1d27]/50"}`}
              textValue="Appearance"
              href={ROUTES.SETTINGS_APPEARANCE}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                </svg>
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Appearance</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="notifications"
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[#1a1d27]/50"}`}
              textValue="Notifications"
              href={ROUTES.SETTINGS_NOTIFICATIONS}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Notifications</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="all-settings"
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[#1a1d27]/50"}`}
              textValue="All Settings"
              href={ROUTES.SETTINGS}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>All Settings</span>
                <svg className={`w-3.5 h-3.5 ml-auto ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </DropdownItem>
            <DropdownItem
              key="signout"
              className={`px-4 py-2.5 rounded-none border-t mt-1 ${isLight ? "border-slate-200 data-[hover=true]:bg-red-500/5" : "border-[#282b3a] data-[hover=true]:bg-red-500/5"}`}
              textValue="Sign Out"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="text-sm font-medium text-red-400">Sign Out</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
              : "bg-[#1a1d27]/50 hover:bg-[#1a1d27] text-slate-400 hover:text-slate-200 border-transparent hover:border-[#334155]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden absolute top-16 left-0 right-0 border-b ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-[#0f1117] border-[#282b3a]"
        }`}>
          <nav className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col gap-1">
            {DIRECT_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? isLight
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-900"
                      : isLight
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-slate-400 hover:bg-[#1a1d27]"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? isLight
                          ? "bg-white/20 text-white"
                          : "bg-slate-900/20 text-slate-900"
                        : "bg-violet-500/10 text-violet-500"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Resources Section in Mobile */}
            <div className={`mt-3 pt-3 border-t ${isLight ? "border-slate-200" : "border-[#282b3a]"}`}>
              <div className="px-4 py-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  Resources
                </span>
              </div>
              {RESOURCES_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isLight
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-900"
                        : isLight
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-slate-400 hover:bg-[#1a1d27]"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
