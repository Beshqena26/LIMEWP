"use client";

import { useState, useCallback } from "react";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { useNotifications } from "@/lib/context/NotificationContext";
import { NOTIFICATION_STYLES, type NotificationType } from "@/data/notifications";

type TabFilter = "all" | "unread" | "read";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const { notifications, unreadCount, markAsRead, markAllRead, deleteRead } = useNotifications();

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [page, setPage] = useState(1);

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  // Get unique types from notifications
  const activeTypes = Array.from(new Set(notifications.map((n) => n.type)));

  const filteredNotifications = notifications.filter((n) => {
    const matchTab = activeTab === "all" || (activeTab === "unread" ? n.unread : !n.unread);
    const matchType = typeFilter === "all" || n.type === typeFilter;
    return matchTab && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const readCount = notifications.filter((n) => !n.unread).length;

  const handleTabChange = useCallback(
    (tab: TabFilter) => {
      setActiveTab(tab);
      setPage(1);
    },
    []
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
    showToast.success("All notifications marked as read");
  }, [markAllRead]);

  const handleDeleteRead = useCallback(() => {
    deleteRead();
    showToast.success("Read notifications deleted");
    setPage(1);
  }, [deleteRead]);

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: readCount },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-bold mb-1 ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Notifications
            </h1>
            <p
              className={`text-sm ${
                isLight ? "text-slate-600" : "text-slate-500"
              }`}
            >
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={`h-10 px-5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover}`}
            >
              Mark all read
            </button>
            {readCount > 0 && (
              <button
                onClick={handleDeleteRead}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-all ${
                  isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-elevated)]/80 ring-1 ring-[var(--border-tertiary)]"
                }`}
              >
                Delete all read
              </button>
            )}
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`group relative flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20"
                    : isLight
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-200"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs tabular-nums ${
                    isActive
                      ? "text-sky-400/70"
                      : isLight
                        ? "text-slate-400"
                        : "text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setTypeFilter("all"); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === "all"
                ? isLight ? "bg-slate-800 text-white" : "bg-white/10 text-white"
                : isLight ? "text-slate-500 hover:bg-slate-100" : "text-slate-400 hover:bg-white/[0.04]"
            }`}
          >
            All types
          </button>
          {activeTypes.map((type) => {
            const s = NOTIFICATION_STYLES[type];
            const isActive = typeFilter === type;
            const count = notifications.filter((n) => n.type === type).length;
            return (
              <button
                key={type}
                onClick={() => { setTypeFilter(type); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
                  isActive
                    ? `${s.bg} ${s.text} ring-1 ${s.ring}`
                    : isLight ? "text-slate-500 hover:bg-slate-100" : "text-slate-400 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && <span className={`w-1.5 h-1.5 rounded-full ${s.text.replace("text-", "bg-")}`} />}
                {s.label}
                <span className={`text-[10px] ${isActive ? "opacity-70" : "opacity-50"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {paginatedNotifications.length === 0 ? (
            <div
              className={`${cardClass} p-12 flex flex-col items-center justify-center text-center`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isLight ? "bg-slate-100" : "bg-slate-800"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isLight ? "text-slate-400" : "text-slate-500"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </div>
              <p
                className={`text-sm font-medium ${
                  isLight ? "text-slate-600" : "text-slate-300"
                }`}
              >
                No notifications
              </p>
              <p
                className={`mt-1 text-xs ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {activeTab === "unread"
                  ? "You're all caught up!"
                  : activeTab === "read"
                    ? "No read notifications yet"
                    : "No notifications to display"}
              </p>
            </div>
          ) : (
            paginatedNotifications.map((notification) => {
              const style = NOTIFICATION_STYLES[notification.type];
              return (
                <button
                  key={notification.id}
                  onClick={() => {
                    if (notification.unread) markAsRead(notification.id);
                  }}
                  aria-label={`${notification.unread ? "Mark as read: " : ""}${notification.title}`}
                  className={`${cardClass} w-full text-left p-4 flex items-start gap-4 hover:scale-[1.005] cursor-pointer ${
                    notification.unread ? "border-l-2 border-l-emerald-500" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ring-1 ${style.ring}`}
                  >
                    <svg
                      className={`w-5 h-5 ${style.text}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={style.iconPath}
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          notification.unread ? "font-bold" : "font-medium"
                        } ${isLight ? "text-slate-800" : "text-slate-100"}`}
                      >
                        {notification.title}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${style.bg} ${style.text} ring-1 ${style.ring}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-sm ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {notification.description}
                    </p>
                  </div>

                  {/* Time */}
                  <span
                    className={`text-xs whitespace-nowrap shrink-0 ${
                      isLight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {notification.time}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}
            >
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-elevated)]/80 ring-1 ring-[var(--border-tertiary)]"
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-elevated)]/80 ring-1 ring-[var(--border-tertiary)]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
