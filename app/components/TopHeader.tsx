"use client";

import Link from "next/link";
import {
  Input,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";

const notifications = [
  { type: "success", title: "Backup completed", desc: "limewp.com backup finished", time: "2 min ago", unread: true },
  { type: "warning", title: "SSL expiring", desc: "supernova.guru cert expires in 7 days", time: "1 hour ago", unread: true },
  { type: "update", title: "WordPress 6.7", desc: "New version available", time: "3 hours ago", unread: true },
  { type: "info", title: "Traffic spike", desc: "limewp.com traffic up 150%", time: "Yesterday", unread: false },
  { type: "success", title: "Payment successful", desc: "$49.00 processed", time: "Jan 20, 2026", unread: false },
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

export default function TopHeader() {
  const { resolvedTheme, accentColor, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };
  const unreadCount = notifications.filter(n => n.unread).length;

  // Get accent-specific classes for focus states
  const accentFocusClasses = {
    emerald: "group-data-[focus=true]:!border-emerald-500/40 group-data-[focus=true]:!ring-emerald-500/20",
    sky: "group-data-[focus=true]:!border-sky-500/40 group-data-[focus=true]:!ring-sky-500/20",
    violet: "group-data-[focus=true]:!border-violet-500/40 group-data-[focus=true]:!ring-violet-500/20",
    amber: "group-data-[focus=true]:!border-amber-500/40 group-data-[focus=true]:!ring-amber-500/20",
    pink: "group-data-[focus=true]:!border-pink-500/40 group-data-[focus=true]:!ring-pink-500/20",
  };

  return (
    <header className={`h-16 px-6 flex items-center justify-between fixed top-0 right-0 left-[260px] z-50 border-b transition-colors ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-r from-[#18181B] to-[#1a1a1d] border-white/[0.06]"
    }`}>
      {/* Left Side - Search */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity ${
            isLight
              ? "bg-gradient-to-r from-emerald-500/5 to-sky-500/5"
              : "bg-gradient-to-r from-emerald-500/10 to-sky-500/10"
          }`} />
          <Input
            type="search"
            placeholder="Search sites, docs, settings..."
            variant="bordered"
            radius="lg"
            size="sm"
            startContent={
              <svg className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            endContent={
              <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-lg border flex-shrink-0 ${
                isLight
                  ? "text-zinc-400 bg-zinc-100 border-zinc-200"
                  : "text-zinc-500 bg-[#18181B] border-[#3F3F46]"
              }`}>
                <span className="text-[11px]">⌘</span>K
              </kbd>
            }
            classNames={{
              base: "w-[320px]",
              inputWrapper: [
                "!rounded-xl",
                isLight ? "bg-zinc-50" : "bg-[#1E1E21]",
                isLight ? "border-zinc-200" : "border-[#2A2A2E]",
                isLight ? "hover:border-zinc-300" : "hover:border-[#3F3F46]",
                accentFocusClasses[accentColor],
                "group-data-[focus=true]:!ring-1",
                "!outline-none",
                "h-10",
                "transition-all",
                "shadow-sm",
              ],
              input: [
                "text-sm",
                isLight ? "text-zinc-800" : "text-zinc-100",
                isLight ? "placeholder:text-zinc-400" : "placeholder:text-zinc-500",
                "!px-2",
                "!outline-none",
                "!ring-0",
              ],
            }}
          />
        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[380px] ${
              isLight
                ? "bg-white border border-zinc-200"
                : "bg-[#1E1E21] border border-[#2A2A2E]"
            }`
          }}
        >
          <DropdownTrigger>
            <button className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
              isLight
                ? "bg-zinc-100/50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 border-transparent hover:border-zinc-200"
                : "bg-[#27272A]/50 hover:bg-[#27272A] text-zinc-400 hover:text-zinc-200 border-transparent hover:border-[#3F3F46]"
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ${
                  isLight ? "ring-white" : "ring-[#18181B]"
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
              { key: "header", type: "header" as const },
              ...notifications.slice(0, 4).map((n, i) => ({ ...n, key: `notif-${i}`, type: "notification" as const })),
              { key: "view-all", type: "footer" as const },
            ]}
          >
            {(item) => {
              if (item.type === "header") {
                return (
                  <DropdownItem key={item.key} isReadOnly className="p-0 cursor-default data-[hover=true]:bg-transparent" textValue="Notifications header">
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${
                      isLight
                        ? "border-zinc-200 bg-zinc-50"
                        : "border-[#2A2A2E] bg-gradient-to-r from-[#1E1E21] to-[#1a1a1d]"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                          </svg>
                        </div>
                        <div>
                          <span className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>Notifications</span>
                          <p className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Stay updated with your sites</p>
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg ring-1 ring-emerald-500/20">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </DropdownItem>
                );
              }
              if (item.type === "footer") {
                return (
                  <DropdownItem key={item.key} className="p-0 data-[hover=true]:bg-transparent" textValue="View all">
                    <Link href="/notifications" className={`flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors ${
                      isLight ? "bg-gradient-to-t from-violet-500/[0.03] to-transparent" : "bg-gradient-to-t from-violet-500/[0.05] to-transparent"
                    }`}>
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
                    isLight ? "border-zinc-100" : "border-[#2A2A2E]/50"
                  } ${notification.unread ? (isLight ? 'bg-emerald-500/[0.02]' : 'bg-emerald-500/[0.03]') : ''}`}
                  textValue={notification.title}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${iconColors[notification.type].bg} ${iconColors[notification.type].text} ring-1 ${iconColors[notification.type].ring} flex items-center justify-center flex-shrink-0`}>
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${notification.unread ? (isLight ? 'text-zinc-900' : 'text-zinc-100') : (isLight ? 'text-zinc-500' : 'text-zinc-400')}`}>{notification.title}</span>
                        {notification.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{notification.desc}</p>
                      <span className={`text-[10px] mt-1 block ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>{notification.time}</span>
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
          className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
            isLight
              ? "bg-zinc-100/50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 border-transparent hover:border-zinc-200"
              : "bg-[#27272A]/50 hover:bg-[#27272A] text-zinc-400 hover:text-zinc-200 border-transparent hover:border-[#3F3F46]"
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
        <div className={`w-px h-6 mx-1 ${isLight ? "bg-zinc-200" : "bg-[#2A2A2E]"}`} />

        {/* User Menu */}
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: `rounded-2xl shadow-2xl shadow-black/30 p-0 min-w-[260px] ${
              isLight
                ? "bg-white border border-zinc-200"
                : "bg-[#1E1E21] border border-[#2A2A2E]"
            }`
          }}
        >
          <DropdownTrigger>
            <button className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl border transition-all group ${
              isLight
                ? "bg-zinc-100/30 hover:bg-zinc-100 border-transparent hover:border-zinc-200"
                : "bg-[#27272A]/30 hover:bg-[#27272A] border-transparent hover:border-[#3F3F46]"
            }`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                <Avatar
                  name="LK"
                  size="sm"
                  classNames={{
                    base: "relative w-9 h-9 bg-gradient-to-br from-emerald-400 to-sky-500 ring-2 ring-white/10",
                    name: "text-white text-[11px] font-bold",
                  }}
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ${isLight ? "ring-white" : "ring-[#18181B]"}`} />
              </div>
              <div className="text-left hidden sm:block">
                <div className={`text-sm font-semibold transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-200 group-hover:text-white"}`}>Lime</div>
                <div className={`text-[10px] flex items-center gap-1 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Business Plan
                </div>
              </div>
              <svg className={`w-4 h-4 transition-colors ml-1 ${isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />
                <div className={`relative flex items-center gap-4 px-5 py-5 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-xl blur-lg opacity-40" />
                    <Avatar
                      name="LK"
                      size="lg"
                      classNames={{
                        base: "relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-sky-500 ring-2 ring-white/10",
                        name: "text-white text-lg font-bold",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className={`text-base font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}>Lime Starter</div>
                    <div className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>lime@example.com</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md ring-1 ring-emerald-500/20">
                        Business Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              key="profile"
              className={`px-4 py-3 rounded-none ${isLight ? "data-[hover=true]:bg-zinc-100/50" : "data-[hover=true]:bg-[#27272A]/50"}`}
              textValue="My Profile"
              startContent={
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              }
            >
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>My Profile</span>
                <span className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Manage your account details</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="settings"
              className={`px-4 py-3 rounded-none ${isLight ? "data-[hover=true]:bg-zinc-100/50" : "data-[hover=true]:bg-[#27272A]/50"}`}
              textValue="Account Settings"
              startContent={
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              }
            >
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Settings</span>
                <span className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Preferences & security</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="billing"
              className={`px-4 py-3 rounded-none ${isLight ? "data-[hover=true]:bg-zinc-100/50" : "data-[hover=true]:bg-[#27272A]/50"}`}
              textValue="Billing & Plans"
              startContent={
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
              }
            >
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Billing & Plans</span>
                <span className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Manage subscription</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="help"
              className={`px-4 py-3 rounded-none ${isLight ? "data-[hover=true]:bg-zinc-100/50" : "data-[hover=true]:bg-[#27272A]/50"}`}
              textValue="Help & Support"
              startContent={
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
              }
            >
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>Help & Support</span>
                <span className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Get assistance</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="signout"
              className={`px-4 py-3.5 rounded-none border-t mt-1 ${isLight ? "border-zinc-200 data-[hover=true]:bg-red-500/5" : "border-[#2A2A2E] data-[hover=true]:bg-red-500/5"}`}
              textValue="Sign Out"
              startContent={
                <div className="w-9 h-9 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-red-400">Sign Out</span>
                <span className={`text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>End your session</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
