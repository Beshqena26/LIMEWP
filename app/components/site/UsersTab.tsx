"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { Button, Avatar, Chip } from "@heroui/react";
import { userStats, userColorMap, users, rolePermissions } from "@/data/site/users";
import { showToast } from "@/lib/toast";

interface UsersTabProps {
  siteId: string;
}

export function UsersTab({ siteId }: UsersTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {userStats.map((stat) => {
          const colors = userColorMap[stat.color];
          return (
            <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
              isLight
                ? "bg-white border-slate-200 hover:border-slate-300"
                : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>WordPress Users</h3>
          <Chip
            size="sm"
            classNames={{
              base: "bg-sky-500/10 border-0",
              content: "text-sky-400 font-semibold text-[10px]"
            }}
          >
            {users.filter(u => u.isOnline).length} online
          </Chip>
        </div>
        <Button
          color="success"
          className="font-semibold text-white shadow-lg shadow-emerald-500/20"
          onPress={() => showToast.success("User added")}
          startContent={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          }
        >
          Add User
        </Button>
      </div>

      {/* User Cards */}
      <div className="space-y-3">
        {users.map((user) => {
          const colors = userColorMap[user.color];
          const permissions = rolePermissions[user.role] || [];
          return (
            <div
              key={user.id}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
              }`}
            >
              {/* Corner Glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50`} />

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-current to-current rounded-xl blur-lg opacity-30" style={{ color: user.color === "emerald" ? "#10b981" : user.color === "sky" ? "#0ea5e9" : user.color === "violet" ? "#8b5cf6" : user.color === "amber" ? "#f59e0b" : "#f43f5e" }} />
                    <Avatar
                      name={user.displayName.split(" ").map(n => n[0]).join("")}
                      size="lg"
                      classNames={{
                        base: `relative w-14 h-14 bg-gradient-to-br ${user.gradient} ring-2 ring-white/10 group-hover:scale-105 transition-transform`,
                        name: "text-white text-lg font-bold",
                      }}
                    />
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[var(--bg-secondary)]"}`}></span>
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-[15px] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{user.displayName}</span>
                      {user.twoFactor && (
                        <span className="w-5 h-5 rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                          </span>

                      )}
                      <Chip
                        size="sm"
                        classNames={{
                          base: `${colors.bg} border-0 h-5`,
                          content: `${colors.text} font-semibold text-[10px] px-0`
                        }}
                      >
                        {user.role}
                      </Chip>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-slate-500 font-mono">@{user.username}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Last login: {user.lastLogin}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span>{user.postsCount} posts</span>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="flex items-center gap-2 mt-3">
                      {permissions.slice(0, 3).map((perm) => (
                        <span
                          key={perm}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${
                            isLight
                              ? "text-slate-500 bg-slate-100 ring-slate-200"
                              : "text-slate-400 bg-[var(--bg-elevated)] ring-[var(--border-primary)]"
                          }`}
                        >
                          {perm}
                        </span>
                      ))}
                      {permissions.length > 3 && (
                        <span className="text-[10px] font-medium text-slate-500">+{permissions.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => showToast.info("Editing user...")} className="h-9 px-3.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-all ring-1 ring-sky-500/20 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit
                      </button>

                    <button onClick={() => showToast.success("Password reset email sent")} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-slate-100 hover:bg-amber-500/10 ring-slate-200 hover:ring-amber-500/30"
                        : "bg-[var(--bg-elevated)]/70 hover:bg-amber-500/10 ring-[var(--border-primary)] hover:ring-amber-500/30"
                    }`}>
                        <svg className="w-4 h-4 text-slate-400 hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                      </button>

                    <button onClick={() => showToast.warning("User deleted")} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-slate-100 hover:bg-rose-500/10 ring-slate-200 hover:ring-rose-500/30"
                        : "bg-[var(--bg-elevated)]/70 hover:bg-rose-500/10 ring-[var(--border-primary)] hover:ring-rose-500/30"
                    }`}>
                        <svg className="w-4 h-4 text-slate-400 hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
