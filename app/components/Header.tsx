"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/lib/context/NotificationContext";
import { NOTIFICATION_STYLES, type NotificationType } from "@/data/notifications";
import {
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
import MobileSidebar from "./MobileSidebar";
import { CommandPalette } from "./ui/CommandPalette";

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

function NotificationIcon({ type }: { type: NotificationType }) {
  const style = NOTIFICATION_STYLES[type];
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={style.iconPath} />
    </svg>
  );
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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, accentColor, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const toggleTheme = () => setTheme(isLight ? "dark" : "light");

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
      isLight
        ? "bg-white border-slate-200"
        : "bg-gradient-to-r from-[var(--bg-primary)] to-[var(--gradient-card-to)] border-white/[0.06]"
    }`}>
      <div className="max-w-[1440px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center">
      {/* Left Side - Hamburger, Logo and Navigation */}
      <div className="flex items-center gap-2 md:gap-6 flex-1">
        {/* Mobile Hamburger - LEFT side */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open menu"
          className={`lg:hidden min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
              : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200 border-transparent hover:border-[var(--border-primary)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

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
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
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
                      : "bg-[var(--bg-elevated)] text-slate-500"
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
                : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]"
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
                          : "hover:bg-[var(--bg-elevated)]"
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
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className={`md:hidden min-w-[44px] min-h-[44px] w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
              : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200 border-transparent hover:border-[var(--border-primary)]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Search Trigger Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className={`hidden md:flex items-center gap-2 w-[200px] lg:w-[260px] h-9 px-3 rounded-xl border text-sm transition-all ${
            isLight
              ? "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500"
              : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] text-slate-500"
          }`}
        >
          <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left">Search...</span>
          <kbd aria-hidden="true" className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-lg border flex-shrink-0 ${
            isLight
              ? "text-slate-500 bg-white border-slate-200"
              : "text-slate-500 bg-[var(--bg-primary)] border-[var(--border-primary)]"
          }`}>
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>

        {/* Notifications */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[360px] ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]"
            }`
          }}
        >
          <DropdownTrigger>
            <button aria-label="Notifications" className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
              isLight
                ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
                : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200 border-transparent hover:border-[var(--border-primary)]"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ${
                  isLight ? "ring-white" : "ring-[var(--bg-primary)]"
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
            onAction={(key) => {
              const k = String(key);
              if (k.startsWith("notif-")) {
                const notif = notifications.slice(0, 8).find((_, i) => `notif-${i}` === k);
                if (notif) markAsRead(notif.id);
              }
            }}
            items={[
              { key: "header", itemType: "header" as const },
              ...notifications.slice(0, 8).map((n, i) => ({ ...n, key: `notif-${i}`, itemType: "notification" as const })),
              { key: "view-all", itemType: "footer" as const },
            ]}
          >
            {(item) => {
              if (item.itemType === "header") {
                return (
                  <DropdownItem key={item.key} isReadOnly className="p-0 cursor-default data-[hover=true]:bg-transparent" textValue="Notifications header">
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${
                      isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--gradient-card-to)]"
                    }`}>
                      <span className={`text-sm font-semibold ${isLight ? "text-slate-900" : "text-slate-100"}`}>Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                              className={`text-[10px] font-medium transition-colors ${
                                isLight
                                  ? "text-emerald-700 hover:text-emerald-800"
                                  : "text-emerald-400 hover:text-emerald-300"
                              }`}
                            >
                              Mark all read
                            </button>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ring-1 ${
                              isLight
                                ? "text-emerald-700 bg-emerald-100 ring-emerald-200"
                                : "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20"
                            }`}>
                              {unreadCount} new
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </DropdownItem>
                );
              }
              if (item.itemType === "footer") {
                return (
                  <DropdownItem key={item.key} className="p-0 data-[hover=true]:bg-transparent" textValue="View all">
                    <Link href="/notifications" className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors`}>
                      View all notifications
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </DropdownItem>
                );
              }
              const notification = item as typeof notifications[0] & { key: string };
              const nStyle = NOTIFICATION_STYLES[notification.type];
              return (
                <DropdownItem
                  key={notification.key}
                  className={`px-4 py-3 rounded-none border-b ${
                    isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"
                  } ${notification.unread ? `border-l-2 border-l-emerald-500 ${isLight ? 'bg-emerald-500/[0.02]' : 'bg-emerald-500/[0.03]'}` : ''}`}
                  textValue={notification.title}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${nStyle.bg} ${nStyle.text} ring-1 ${nStyle.ring} flex items-center justify-center flex-shrink-0`}>
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${notification.unread ? (isLight ? 'text-slate-900' : 'text-slate-100') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>{notification.title}</span>
                        {notification.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs truncate mt-0.5 text-slate-500">{notification.description}</p>
                      <span className={`text-[10px] mt-1 block ${isLight ? "text-slate-400" : "text-slate-600"}`}>{notification.time}</span>
                    </div>
                  </div>
                </DropdownItem>
              );
            }}
          </DropdownMenu>
        </Dropdown>

        {/* Theme Toggle - hidden on mobile (available in drawer) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`hidden md:flex w-9 h-9 rounded-lg items-center justify-center transition-all border ${
            isLight
              ? "bg-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent hover:border-slate-200"
              : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200 border-transparent hover:border-[var(--border-primary)]"
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

        {/* Divider - hidden on mobile */}
        <div className={`hidden md:block w-px h-6 ${isLight ? "bg-slate-200" : "bg-[var(--bg-overlay)]"}`} />

        {/* User Menu */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[240px] ${
              isLight
                ? "bg-white border border-slate-200"
                : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]"
            }`
          }}
        >
          <DropdownTrigger>
            <button aria-label="User menu" className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all group ${
              isLight
                ? "bg-slate-100/30 hover:bg-slate-100 border-transparent hover:border-slate-200"
                : "bg-[var(--bg-elevated)]/30 hover:bg-[var(--bg-elevated)] border-transparent hover:border-[var(--border-primary)]"
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
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-primary)]"}`} />
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
              <div className={`flex items-center gap-3 px-4 py-4 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
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
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[var(--bg-elevated)]/50"}`}
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
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[var(--bg-elevated)]/50"}`}
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
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[var(--bg-elevated)]/50"}`}
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
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[var(--bg-elevated)]/50"}`}
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
              className={`px-4 py-2 rounded-none ${isLight ? "data-[hover=true]:bg-slate-100/50" : "data-[hover=true]:bg-[var(--bg-elevated)]/50"}`}
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
              className={`px-4 py-2.5 rounded-none border-t mt-1 ${isLight ? "border-slate-200 data-[hover=true]:bg-red-500/5" : "border-[var(--border-tertiary)] data-[hover=true]:bg-red-500/5"}`}
              textValue="Sign Out"
              onPress={() => router.push("/")}
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

      </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Command Palette */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
