"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Avatar, Chip } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import {
  users as initialUsers,
  userStats,
  userColorMap,
  rolePermissions,
  ROLES,
  USER_ACTIVITIES,
  type User,
  type UserActivity,
} from "@/data/site/users";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

type StatusFilter = "all" | "active" | "suspended" | "pending";

interface UsersTabProps {
  siteId: string;
}

export function UsersTab({ siteId }: UsersTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // ── Shared styles ──
  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  // ── State ──
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  // Add user form
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<string>(ROLES[4]);
  const [addPassword, setAddPassword] = useState("");
  const [addWelcomeEmail, setAddWelcomeEmail] = useState(true);
  const [addRequire2FA, setAddRequire2FA] = useState(false);

  // Confirm dialogs
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
    requireTypedConfirmation?: string;
  }>({
    title: "",
    message: "",
    confirmText: "Confirm",
    variant: "danger",
    onConfirm: () => {},
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ── Spinner ──
  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  // ── Computed ──
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
  }, [usersList, searchQuery, statusFilter, roleFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: usersList.length, active: 0, suspended: 0, pending: 0 };
    usersList.forEach((u) => {
      counts[u.status]++;
    });
    return counts;
  }, [usersList]);

  const activeCount = useMemo(() => usersList.filter((u) => u.isOnline).length, [usersList]);
  const twoFactorEnabled = useMemo(() => usersList.filter((u) => u.twoFactor).length, [usersList]);
  const twoFactorDisabled = useMemo(() => usersList.filter((u) => !u.twoFactor).length, [usersList]);
  const emailUnverified = useMemo(() => usersList.filter((u) => !u.emailVerified).length, [usersList]);
  const totalSessions = useMemo(() => usersList.reduce((s, u) => s + u.sessions, 0), [usersList]);

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.has(u.id));

  // ── Handlers ──
  const openConfirm = useCallback(
    (config: typeof confirmConfig) => {
      setConfirmConfig(config);
      setConfirmOpen(true);
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setConfirmLoading(false);
  }, []);

  const handleRoleChange = useCallback(
    (userId: string, newRole: string) => {
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (detailUser && detailUser.id === userId) {
        setDetailUser((prev) => (prev ? { ...prev, role: newRole } : prev));
      }
      showToast.success(`Role updated to ${newRole}`);
    },
    [detailUser]
  );

  const handleStatusToggle = useCallback(
    (user: User) => {
      const newStatus = user.status === "active" ? "suspended" : "active";
      const action = newStatus === "suspended" ? "Suspend" : "Activate";
      openConfirm({
        title: `${action} User`,
        message: `Are you sure you want to ${action.toLowerCase()} ${user.displayName}? ${newStatus === "suspended" ? "They will be locked out of their account." : "They will regain access to their account."}`,
        confirmText: action,
        variant: newStatus === "suspended" ? "warning" : "info",
        onConfirm: () => {
          setConfirmLoading(true);
          setTimeout(() => {
            setUsersList((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
            );
            if (detailUser && detailUser.id === user.id) {
              setDetailUser((prev) => (prev ? { ...prev, status: newStatus } : prev));
            }
            showToast.success(`${user.displayName} has been ${newStatus === "suspended" ? "suspended" : "activated"}`);
            closeConfirm();
          }, 600);
        },
      });
    },
    [openConfirm, closeConfirm, detailUser]
  );

  const handleResetPassword = useCallback(
    (user: User) => {
      openConfirm({
        title: "Reset Password",
        message: `Send a password reset email to ${user.email}?`,
        confirmText: "Send Reset",
        variant: "warning",
        onConfirm: () => {
          setConfirmLoading(true);
          setTimeout(() => {
            showToast.success(`Password reset email sent to ${user.email}`);
            closeConfirm();
          }, 600);
        },
      });
    },
    [openConfirm, closeConfirm]
  );

  const handleDeleteUser = useCallback(
    (user: User) => {
      openConfirm({
        title: "Delete User",
        message: `This will permanently delete ${user.displayName} and all their content. This action cannot be undone.`,
        confirmText: "Delete",
        variant: "danger",
        requireTypedConfirmation: "DELETE",
        onConfirm: () => {
          setConfirmLoading(true);
          setTimeout(() => {
            setUsersList((prev) => prev.filter((u) => u.id !== user.id));
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(user.id);
              return next;
            });
            if (detailUser?.id === user.id) setDetailUser(null);
            showToast.success(`${user.displayName} has been deleted`);
            closeConfirm();
          }, 600);
        },
      });
    },
    [openConfirm, closeConfirm, detailUser]
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    openConfirm({
      title: "Delete Selected Users",
      message: `This will permanently delete ${selectedIds.size} user(s) and all their content. This cannot be undone.`,
      confirmText: "Delete All",
      variant: "danger",
      requireTypedConfirmation: "DELETE",
      onConfirm: () => {
        setConfirmLoading(true);
        setTimeout(() => {
          setUsersList((prev) => prev.filter((u) => !selectedIds.has(u.id)));
          if (detailUser && selectedIds.has(detailUser.id)) setDetailUser(null);
          showToast.success(`${selectedIds.size} user(s) deleted`);
          setSelectedIds(new Set());
          closeConfirm();
        }, 600);
      },
    });
  }, [selectedIds, openConfirm, closeConfirm, detailUser]);

  const handleBulkRoleChange = useCallback(
    (newRole: string) => {
      if (selectedIds.size === 0) return;
      setUsersList((prev) =>
        prev.map((u) => (selectedIds.has(u.id) ? { ...u, role: newRole } : u))
      );
      if (detailUser && selectedIds.has(detailUser.id)) {
        setDetailUser((prev) => (prev ? { ...prev, role: newRole } : prev));
      }
      showToast.success(`${selectedIds.size} user(s) updated to ${newRole}`);
      setSelectedIds(new Set());
    },
    [selectedIds, detailUser]
  );

  const handleForceLogout = useCallback(
    (user: User) => {
      openConfirm({
        title: "Force Logout",
        message: `End all active sessions for ${user.displayName}?`,
        confirmText: "Force Logout",
        variant: "warning",
        onConfirm: () => {
          setConfirmLoading(true);
          setTimeout(() => {
            setUsersList((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, sessions: 0, isOnline: false } : u))
            );
            if (detailUser && detailUser.id === user.id) {
              setDetailUser((prev) => (prev ? { ...prev, sessions: 0, isOnline: false } : prev));
            }
            showToast.success(`All sessions ended for ${user.displayName}`);
            closeConfirm();
          }, 600);
        },
      });
    },
    [openConfirm, closeConfirm, detailUser]
  );

  const handleTransferOwnership = useCallback(
    (user: User) => {
      openConfirm({
        title: "Transfer Ownership",
        message: `Transfer site ownership to ${user.displayName}? They will become the new Administrator and your role will be changed to Editor.`,
        confirmText: "Transfer",
        variant: "danger",
        requireTypedConfirmation: "TRANSFER",
        onConfirm: () => {
          setConfirmLoading(true);
          setTimeout(() => {
            setUsersList((prev) =>
              prev.map((u) => (u.id === user.id ? { ...u, role: "Administrator" } : u))
            );
            if (detailUser && detailUser.id === user.id) {
              setDetailUser((prev) => (prev ? { ...prev, role: "Administrator" } : prev));
            }
            showToast.success(`Ownership transferred to ${user.displayName}`);
            closeConfirm();
          }, 600);
        },
      });
    },
    [openConfirm, closeConfirm, detailUser]
  );

  const handleAddUser = useCallback(() => {
    if (!addName.trim() || !addEmail.trim() || !addPassword.trim()) {
      showToast.error("Please fill in all required fields");
      return;
    }
    setAddLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        username: addName.toLowerCase().replace(/\s+/g, "_"),
        displayName: addName,
        email: addEmail,
        role: addRole,
        color: ["emerald", "sky", "violet", "amber", "rose"][Math.floor(Math.random() * 5)],
        gradient: "from-emerald-500 to-teal-500",
        lastLogin: "Just now",
        postsCount: 0,
        isOnline: false,
        twoFactor: addRequire2FA,
        status: "active",
        emailVerified: false,
        lastIp: "-",
        lastDevice: "-",
        lastLocation: "-",
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        sessions: 0,
      };
      setUsersList((prev) => [...prev, newUser]);
      showToast.success(`${addName} has been added`);
      setAddName("");
      setAddEmail("");
      setAddRole(ROLES[4]);
      setAddPassword("");
      setAddWelcomeEmail(true);
      setAddRequire2FA(false);
      setAddLoading(false);
      setShowAddModal(false);
    }, 800);
  }, [addName, addEmail, addRole, addPassword, addRequire2FA]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
    }
  }, [allFilteredSelected, filteredUsers]);

  // ── Keyboard / scroll lock ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (confirmOpen) return;
        if (showAddModal) {
          setShowAddModal(false);
          return;
        }
        if (detailUser) {
          setDetailUser(null);
          return;
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmOpen, showAddModal, detailUser]);

  useEffect(() => {
    if (detailUser || showAddModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailUser, showAddModal]);

  // ── Drawer toggle helpers ──
  const handleToggle2FA = useCallback(
    (user: User, val: boolean) => {
      setUsersList((prev) => prev.map((u) => (u.id === user.id ? { ...u, twoFactor: val } : u)));
      setDetailUser((prev) => (prev && prev.id === user.id ? { ...prev, twoFactor: val } : prev));
      showToast.success(val ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    },
    []
  );

  const handleToggleEmailVerified = useCallback(
    (user: User, val: boolean) => {
      setUsersList((prev) => prev.map((u) => (u.id === user.id ? { ...u, emailVerified: val } : u)));
      setDetailUser((prev) => (prev && prev.id === user.id ? { ...prev, emailVerified: val } : prev));
      showToast.success(val ? "Email marked as verified" : "Email marked as unverified");
    },
    []
  );

  // Keep detailUser synced with usersList
  useEffect(() => {
    if (detailUser) {
      const updated = usersList.find((u) => u.id === detailUser.id);
      if (updated) setDetailUser(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList]);

  // ── Status badge helper ──
  const statusBadge = (status: User["status"], clickable = false, onClick?: () => void) => {
    const map: Record<string, { bg: string; text: string; dot: string }> = {
      active: {
        bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
        text: isLight ? "text-emerald-700" : "text-emerald-400",
        dot: "bg-emerald-500",
      },
      suspended: {
        bg: isLight ? "bg-amber-50" : "bg-amber-500/10",
        text: isLight ? "text-amber-700" : "text-amber-400",
        dot: "bg-amber-500",
      },
      pending: {
        bg: isLight ? "bg-slate-100" : "bg-slate-500/10",
        text: isLight ? "text-slate-600" : "text-slate-400",
        dot: "bg-slate-400",
      },
    };
    const s = map[status];
    const Tag = clickable ? "button" : "span";
    return (
      <Tag
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
        onClick={clickable ? onClick : undefined}
        aria-label={clickable ? `Change status from ${status}` : undefined}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  // ── Permission matrix data ──
  const allPermissions = useMemo(() => {
    const set = new Set<string>();
    Object.values(rolePermissions).forEach((perms) => perms.forEach((p) => set.add(p)));
    return Array.from(set);
  }, []);

  // ── Render ──
  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Users</h2>
          <p className={`text-sm mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {usersList.length} users, {activeCount} active
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 px-5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
        >
          Add User
        </button>
      </div>

      {/* 2. Search + Filter Bar */}
      <div className={`${cardClass} p-4 space-y-3`}>
        {/* Search */}
        <div className="relative">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            id="user-search"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} !pl-10`}
          />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={labelClass}>Status:</span>
          {(["all", "active", "suspended", "pending"] as StatusFilter[]).map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? isLight
                      ? "bg-slate-800 text-white"
                      : "bg-white/10 text-white"
                    : isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-primary)] text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? (isLight ? "bg-white/20" : "bg-white/10") : (isLight ? "bg-slate-200" : "bg-white/5")}`}>
                  {statusCounts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={labelClass}>Role:</span>
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              roleFilter === "all"
                ? isLight ? "bg-slate-800 text-white" : "bg-white/10 text-white"
                : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-primary)] text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === r
                  ? isLight ? "bg-slate-800 text-white" : "bg-white/10 text-white"
                  : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-primary)] text-slate-400 hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Security Overview Strip */}
      <div className={`${cardClass} p-4`}>
        <div className="flex flex-wrap gap-6">
          {/* 2FA enabled */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{twoFactorEnabled} with 2FA enabled</span>
          </div>
          {/* 2FA disabled */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{twoFactorDisabled} without 2FA</span>
          </div>
          {/* Email unverified */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{emailUnverified} email unverified</span>
          </div>
          {/* Active sessions */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25h-13.5A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{totalSessions} active sessions</span>
          </div>
        </div>
      </div>

      {/* 5. Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className={`${cardClass} p-3 flex items-center gap-4`}>
          <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
            {selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="bulk-role-select" className="sr-only">Change role for selected users</label>
            <select
              id="bulk-role-select"
              onChange={(e) => {
                if (e.target.value) handleBulkRoleChange(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              className={`h-8 rounded-lg border text-xs font-medium px-2 outline-none ${isLight ? "bg-white border-slate-200 text-slate-700" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-300"}`}
            >
              <option value="" disabled>Change Role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={handleBulkDelete}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-primary)] text-slate-400 hover:text-slate-200"}`}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 4. Users Table */}
      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <th className="text-left px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 accent-emerald-600"
                  aria-label="Select all users"
                />
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>User</th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Role</th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Status</th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>2FA</th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Last Login</th>
              <th className={`text-right text-xs font-semibold uppercase tracking-wider px-4 py-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className={`px-4 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b last:border-b-0 cursor-pointer transition-colors ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"}`}
                  onClick={() => setDetailUser(user)}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="w-4 h-4 rounded border-slate-300 accent-emerald-600"
                      aria-label={`Select ${user.displayName}`}
                    />
                  </td>
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar
                          name={user.displayName}
                          size="sm"
                          classNames={{
                            base: `w-8 h-8 bg-gradient-to-br ${user.gradient}`,
                            name: "text-white text-xs font-bold",
                          }}
                        />
                        {user.isOnline && (
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 ${isLight ? "border-white" : "border-[var(--bg-primary)]"}`} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>{user.displayName}</p>
                        <p className={`text-xs truncate ${isLight ? "text-slate-400" : "text-slate-500"}`}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role — inline select */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <label htmlFor={`role-${user.id}`} className="sr-only">Role for {user.displayName}</label>
                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`h-7 px-2 rounded-lg text-xs font-semibold border outline-none cursor-pointer transition-colors ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                          : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-300 hover:border-[var(--border-primary)]"
                      }`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {statusBadge(user.status, true, () => handleStatusToggle(user))}
                  </td>
                  {/* 2FA */}
                  <td className="px-4 py-3">
                    {user.twoFactor ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                  {/* Last Login */}
                  <td className="px-4 py-3">
                    <div className="group relative">
                      <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{user.lastLogin}</span>
                      <div className={`absolute z-10 bottom-full left-0 mb-1 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ${isLight ? "bg-slate-800 text-white" : "bg-slate-700 text-slate-200"}`}>
                        {user.lastDevice}
                      </div>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => setDetailUser(user)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-white/5 text-slate-400"}`}
                        aria-label={`Edit ${user.displayName}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      {/* Reset password */}
                      <button
                        onClick={() => handleResetPassword(user)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-white/5 text-slate-400"}`}
                        aria-label={`Reset password for ${user.displayName}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-red-50 text-slate-500 hover:text-red-600" : "hover:bg-red-500/10 text-slate-400 hover:text-red-400"}`}
                        aria-label={`Delete ${user.displayName}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 8. Permission Matrix */}
      <div className={cardClass}>
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors rounded-2xl ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"}`}
          aria-expanded={showPermissions}
        >
          <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Role Permissions</h3>
          <svg
            className={`w-5 h-5 transition-transform ${showPermissions ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showPermissions && (
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                  <th className={`text-left text-xs font-semibold uppercase tracking-wider px-3 py-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Permission</th>
                  {ROLES.map((r) => (
                    <th key={r} className={`text-center text-xs font-semibold uppercase tracking-wider px-3 py-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm} className={`border-b last:border-b-0 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/30"}`}>
                    <td className={`text-sm px-3 py-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>{perm}</td>
                    {ROLES.map((r) => (
                      <td key={r} className="text-center px-3 py-2">
                        {rolePermissions[r]?.includes(perm) ? (
                          <svg className="w-4 h-4 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className={`text-sm ${isLight ? "text-slate-300" : "text-slate-600"}`}>--</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Detail Drawer */}
      {detailUser && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDetailUser(null)} aria-hidden="true" />
          {/* Drawer */}
          <div
            className={`w-[420px] max-w-full h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 ${
              isLight ? "bg-white border-l border-slate-200" : "bg-[var(--bg-primary)] border-l border-[var(--border-tertiary)]"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* a) Profile header */}
            <div className="relative">
              <div className={`h-24 bg-gradient-to-r ${detailUser.gradient}`} />
              <button
                onClick={() => setDetailUser(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="px-5 -mt-10">
                <Avatar
                  name={detailUser.displayName}
                  size="lg"
                  classNames={{
                    base: `w-16 h-16 bg-gradient-to-br ${detailUser.gradient} ring-4 ${isLight ? "ring-white" : "ring-[var(--bg-primary)]"}`,
                    name: "text-white text-lg font-bold",
                  }}
                />
                <h2 id="drawer-title" className={`text-lg font-bold mt-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{detailUser.displayName}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <Chip size="sm" variant="flat" classNames={{ base: "h-6", content: "text-xs font-semibold" }}>{detailUser.role}</Chip>
                  {statusBadge(detailUser.status)}
                </div>
              </div>
            </div>

            {/* b) Quick actions */}
            <div className="px-5 mt-5">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Edit", icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125", action: () => showToast.info("Edit mode activated") },
                  { label: "Reset PW", icon: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z", action: () => handleResetPassword(detailUser) },
                  { label: detailUser.status === "active" ? "Suspend" : "Activate", icon: detailUser.status === "active" ? "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", action: () => handleStatusToggle(detailUser) },
                  { label: "Logout", icon: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9", action: () => handleForceLogout(detailUser) },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors ${isLight ? "hover:bg-slate-50 text-slate-600" : "hover:bg-white/5 text-slate-400"}`}
                    aria-label={btn.label}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                    </svg>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* c) Info section */}
            <div className="px-5 mt-5">
              <div className={`${cardClass} p-4 space-y-3`}>
                <div className="flex justify-between items-center">
                  <span className={labelClass}>Email</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm ${isLight ? "text-slate-800" : "text-slate-200"}`}>{detailUser.email}</span>
                    {detailUser.emailVerified ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">Verified</span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">Unverified</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={labelClass}>Username</span>
                  <span className={`text-sm font-mono ${isLight ? "text-slate-800" : "text-slate-200"}`}>@{detailUser.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={labelClass}>Joined</span>
                  <span className={`text-sm ${isLight ? "text-slate-800" : "text-slate-200"}`}>{detailUser.joinedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={labelClass}>Posts</span>
                  <span className={`text-sm ${isLight ? "text-slate-800" : "text-slate-200"}`}>{detailUser.postsCount}</span>
                </div>
              </div>
            </div>

            {/* d) Security section */}
            <div className="px-5 mt-4">
              <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Security</h3>
              <div className={`${cardClass} p-4 space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Two-Factor Authentication</p>
                    <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Require 2FA for login</p>
                  </div>
                  <Toggle enabled={detailUser.twoFactor} onChange={(val) => handleToggle2FA(detailUser, val)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Email Verified</p>
                    <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Email address verification status</p>
                  </div>
                  <Toggle enabled={detailUser.emailVerified} onChange={(val) => handleToggleEmailVerified(detailUser, val)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Active Sessions</p>
                    <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>{detailUser.sessions} active</p>
                  </div>
                  {detailUser.sessions > 0 && (
                    <button
                      onClick={() => handleForceLogout(detailUser)}
                      className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                    >
                      Force Logout All
                    </button>
                  )}
                </div>
                <div className={`pt-3 border-t space-y-2 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                  <div className="flex justify-between">
                    <span className={labelClass}>Last IP</span>
                    <span className={`text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>{detailUser.lastIp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={labelClass}>Last Device</span>
                    <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{detailUser.lastDevice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={labelClass}>Location</span>
                    <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{detailUser.lastLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* e) Activity log */}
            <div className="px-5 mt-4">
              <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Recent Activity</h3>
              <div className={`${cardClass} p-4`}>
                {(USER_ACTIVITIES[detailUser.id] ?? []).length === 0 ? (
                  <p className={`text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No recent activity</p>
                ) : (
                  <div className={`space-y-0 border-l-2 ml-1.5 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    {(USER_ACTIVITIES[detailUser.id] ?? []).map((activity, idx) => (
                      <div key={idx} className="relative pl-5 pb-4 last:pb-0">
                        <span className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${isLight ? "bg-slate-300" : "bg-slate-500"}`} />
                        <p className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          {activity.action}{" "}
                          <span className={`font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activity.target}</span>
                        </p>
                        <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{activity.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* f) Danger zone */}
            <div className="px-5 mt-4 pb-8">
              <h3 className="text-sm font-semibold mb-3 text-red-500">Danger Zone</h3>
              <div className={`rounded-2xl border p-4 space-y-3 ${isLight ? "border-red-200 bg-red-50/50" : "border-red-500/20 bg-red-500/5"}`}>
                {detailUser.role !== "Administrator" && (
                  <button
                    onClick={() => handleTransferOwnership(detailUser)}
                    className={`w-full h-9 rounded-xl text-sm font-semibold border transition-colors ${isLight ? "border-red-200 text-red-600 hover:bg-red-100" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
                  >
                    Transfer Ownership
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(detailUser)}
                  className="w-full h-9 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
              isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
            }`}
          >
            <h3 id="add-user-title" className={`text-lg font-bold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Add User</h3>

            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label htmlFor="add-name" className={`${labelClass} block mb-1.5`}>Display Name</label>
                <input
                  id="add-name"
                  type="text"
                  placeholder="Full name"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className={inputClass}
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="add-email" className={`${labelClass} block mb-1.5`}>Email</label>
                <input
                  id="add-email"
                  type="email"
                  placeholder="user@example.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              {/* Role */}
              <div>
                <label htmlFor="add-role" className={`${labelClass} block mb-1.5`}>Role</label>
                <select
                  id="add-role"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className={inputClass}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {/* Password */}
              <div>
                <label htmlFor="add-password" className={`${labelClass} block mb-1.5`}>Password</label>
                <input
                  id="add-password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              {/* Checkboxes */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addWelcomeEmail}
                    onChange={(e) => setAddWelcomeEmail(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-emerald-600"
                  />
                  <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Send welcome email</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addRequire2FA}
                    onChange={(e) => setAddRequire2FA(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-emerald-600"
                  />
                  <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>Require two-factor authentication</span>
                </label>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={addLoading}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={addLoading}
                className="h-10 px-5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addLoading ? (
                  <>
                    {spinner}
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        requireTypedConfirmation={confirmConfig.requireTypedConfirmation}
        isLoading={confirmLoading}
      />
    </div>
  );
}

export default UsersTab;
