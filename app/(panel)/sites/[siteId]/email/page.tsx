"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

/* ────────────── types ────────────── */

interface EmailAccount {
  id: string;
  address: string;
  quotaUsed: number; // MB
  quotaTotal: number; // MB
  status: "Active" | "Suspended";
}

interface Forwarder {
  id: string;
  source: string;
  destination: string;
}

interface Autoresponder {
  id: string;
  email: string;
  subject: string;
  body: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

/* ────────────── mock data ────────────── */

const INITIAL_ACCOUNTS: EmailAccount[] = [
  { id: "1", address: "info@example.com", quotaUsed: 820, quotaTotal: 2048, status: "Active" },
  { id: "2", address: "support@example.com", quotaUsed: 1540, quotaTotal: 5120, status: "Active" },
  { id: "3", address: "admin@example.com", quotaUsed: 210, quotaTotal: 1024, status: "Suspended" },
];

const INITIAL_FORWARDERS: Forwarder[] = [
  { id: "1", source: "sales@example.com", destination: "info@example.com" },
  { id: "2", source: "billing@example.com", destination: "admin@example.com" },
];

const INITIAL_AUTORESPONDERS: Autoresponder[] = [
  { id: "1", email: "support@example.com", subject: "We received your message", body: "<p>Thank you for contacting us. We will get back to you within 24 hours.</p>", active: true, startDate: "2026-01-01", endDate: "2026-12-31" },
  { id: "2", email: "info@example.com", subject: "Out of Office", body: "<p>I am currently out of the office and will return on Monday.</p>", active: false, startDate: "2026-03-15", endDate: "2026-03-22" },
];

const DOMAIN = "example.com";

const MAIL_CONFIG = [
  { label: "IMAP Server", value: "mail.example.com", port: "993 (SSL)" },
  { label: "SMTP Server", value: "mail.example.com", port: "465 (SSL)" },
  { label: "POP3 Server", value: "mail.example.com", port: "995 (SSL)" },
];

const QUOTA_STEPS = [100, 256, 512, 1024, 2048, 5120];

/* ────────────── password strength ────────────── */

function getPasswordStrength(pw: string): { label: string; pct: number; color: string; barClass: string } {
  if (!pw) return { label: "", pct: 0, color: "", barClass: "" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  if (pw.length >= 10 && hasUpper && hasLower && hasNumber && hasSpecial) return { label: "Strong", pct: 100, color: "text-emerald-500", barClass: "bg-emerald-500" };
  if (pw.length >= 8 && hasNumber) return { label: "Good", pct: 75, color: "text-sky-500", barClass: "bg-sky-500" };
  if (pw.length >= 6) return { label: "Fair", pct: 50, color: "text-amber-500", barClass: "bg-amber-500" };
  return { label: "Weak", pct: 25, color: "text-rose-500", barClass: "bg-rose-500" };
}

/* ────────────── tabs ────────────── */

const EMAIL_TABS = [
  { id: "accounts", label: "Email Accounts", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", color: "sky" },
  { id: "forwarders", label: "Forwarders", icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5", color: "violet" },
  { id: "autoresponders", label: "Autoresponders", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z", color: "amber" },
  { id: "spam", label: "Spam & Security", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: "rose" },
];

const TAB_COLORS: Record<string, { activeBg: string; activeText: string; ring: string }> = {
  sky: { activeBg: "bg-sky-500/15", activeText: "text-sky-400", ring: "ring-sky-500/20" },
  violet: { activeBg: "bg-violet-500/15", activeText: "text-violet-400", ring: "ring-violet-500/20" },
  amber: { activeBg: "bg-amber-500/15", activeText: "text-amber-400", ring: "ring-amber-500/20" },
  rose: { activeBg: "bg-rose-500/15", activeText: "text-rose-400", ring: "ring-rose-500/20" },
};

/* ────────────── spam filter levels ────────────── */

const SPAM_LEVELS = [
  { id: "off" as const, label: "Off", color: "bg-slate-500/10 text-slate-400 ring-slate-500/20" },
  { id: "low" as const, label: "Low", color: "bg-sky-500/10 text-sky-400 ring-sky-500/20" },
  { id: "medium" as const, label: "Medium", color: "bg-amber-500/10 text-amber-400 ring-amber-500/20" },
  { id: "high" as const, label: "High", color: "bg-rose-500/10 text-rose-400 ring-rose-500/20" },
  { id: "aggressive" as const, label: "Aggressive", color: "bg-red-500/10 text-red-400 ring-red-500/20" },
];

/* ────────────── helpers ────────────── */

function formatQuota(mb: number) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function getQuotaColor(pct: number) {
  if (pct >= 90) return "bg-rose-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

/* ────────────── component ────────────── */

export function EmailTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Tab state
  const [activeTab, setActiveTab] = useState("accounts");

  // Data state
  const [accounts, setAccounts] = useState<EmailAccount[]>(INITIAL_ACCOUNTS);
  const [forwarders, setForwarders] = useState<Forwarder[]>(INITIAL_FORWARDERS);
  const [autoresponders, setAutoresponders] = useState<Autoresponder[]>(INITIAL_AUTORESPONDERS);

  // Account modal
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<EmailAccount | null>(null);
  const [acctLocal, setAcctLocal] = useState("");
  const [acctPassword, setAcctPassword] = useState("");
  const [acctQuota, setAcctQuota] = useState(1024);
  const [savingAccount, setSavingAccount] = useState(false);

  // Forwarder modal
  const [showForwarderModal, setShowForwarderModal] = useState(false);
  const [fwdSource, setFwdSource] = useState("");
  const [fwdDest, setFwdDest] = useState("");
  const [savingForwarder, setSavingForwarder] = useState(false);

  // Autoresponder modal
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [editingAutoresponder, setEditingAutoresponder] = useState<Autoresponder | null>(null);
  const [autoEmail, setAutoEmail] = useState("");
  const [autoSubject, setAutoSubject] = useState("");
  const [autoBody, setAutoBody] = useState("");
  const [autoStart, setAutoStart] = useState("");
  const [autoEnd, setAutoEnd] = useState("");
  const [savingAuto, setSavingAuto] = useState(false);

  // Spam & Security
  const [spamLevel, setSpamLevel] = useState<"off" | "low" | "medium" | "high" | "aggressive">("medium");
  const [autoDeleteSpam, setAutoDeleteSpam] = useState(true);
  const [blockExecutables, setBlockExecutables] = useState(true);
  const [blacklist, setBlacklist] = useState("spam-domain.com, phisher@evil.com");
  const [whitelist, setWhitelist] = useState("trusted-partner.com");
  const [savingSpam, setSavingSpam] = useState(false);

  // DKIM/SPF/DMARC
  const [expandedDns, setExpandedDns] = useState<string | null>(null);
  const [generatingDkim, setGeneratingDkim] = useState(false);
  const [dkimConfigured, setDkimConfigured] = useState(false);

  // Webmail dropdown
  const [showWebmailDropdown, setShowWebmailDropdown] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; label: string } | null>(null);

  /* ── account handlers ── */

  const openCreateAccount = useCallback(() => {
    setEditingAccount(null);
    setAcctLocal("");
    setAcctPassword("");
    setAcctQuota(1024);
    setShowAccountModal(true);
  }, []);

  const openEditAccount = useCallback((acct: EmailAccount) => {
    setEditingAccount(acct);
    setAcctLocal(acct.address.split("@")[0]);
    setAcctPassword("");
    setAcctQuota(acct.quotaTotal);
    setShowAccountModal(true);
  }, []);

  const handleSaveAccount = useCallback(async () => {
    if (!acctLocal.trim()) { showToast.error("Email address is required"); return; }
    if (!editingAccount && !acctPassword.trim()) { showToast.error("Password is required"); return; }
    setSavingAccount(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (editingAccount) {
      setAccounts((prev) => prev.map((a) => a.id === editingAccount.id ? { ...a, address: `${acctLocal}@${DOMAIN}`, quotaTotal: acctQuota } : a));
      showToast.success("Email account updated");
    } else {
      const newAcct: EmailAccount = { id: String(Date.now()), address: `${acctLocal}@${DOMAIN}`, quotaUsed: 0, quotaTotal: acctQuota, status: "Active" };
      setAccounts((prev) => [...prev, newAcct]);
      showToast.success("Email account created");
    }
    setSavingAccount(false);
    setShowAccountModal(false);
  }, [acctLocal, acctPassword, acctQuota, editingAccount]);

  /* ── forwarder handlers ── */

  const handleSaveForwarder = useCallback(async () => {
    if (!fwdSource.trim() || !fwdDest.trim()) { showToast.error("Both source and destination are required"); return; }
    setSavingForwarder(true);
    await new Promise((r) => setTimeout(r, 1500));
    setForwarders((prev) => [...prev, { id: String(Date.now()), source: fwdSource.includes("@") ? fwdSource : `${fwdSource}@${DOMAIN}`, destination: fwdDest }]);
    showToast.success("Forwarder created");
    setSavingForwarder(false);
    setShowForwarderModal(false);
    setFwdSource("");
    setFwdDest("");
  }, [fwdSource, fwdDest]);

  /* ── autoresponder handlers ── */

  const openCreateAutoresponder = useCallback(() => {
    setEditingAutoresponder(null);
    setAutoEmail("");
    setAutoSubject("");
    setAutoBody("");
    setAutoStart("");
    setAutoEnd("");
    setShowAutoModal(true);
  }, []);

  const openEditAutoresponder = useCallback((ar: Autoresponder) => {
    setEditingAutoresponder(ar);
    setAutoEmail(ar.email);
    setAutoSubject(ar.subject);
    setAutoBody(ar.body);
    setAutoStart(ar.startDate);
    setAutoEnd(ar.endDate);
    setShowAutoModal(true);
  }, []);

  const handleSaveAuto = useCallback(async () => {
    if (!autoEmail || !autoSubject.trim()) { showToast.error("Email and subject are required"); return; }
    setSavingAuto(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (editingAutoresponder) {
      setAutoresponders((prev) => prev.map((a) => a.id === editingAutoresponder.id ? { ...a, email: autoEmail, subject: autoSubject, body: autoBody, startDate: autoStart, endDate: autoEnd } : a));
      showToast.success("Autoresponder updated");
    } else {
      setAutoresponders((prev) => [...prev, { id: String(Date.now()), email: autoEmail, subject: autoSubject, body: autoBody, active: true, startDate: autoStart, endDate: autoEnd }]);
      showToast.success("Autoresponder created");
    }
    setSavingAuto(false);
    setShowAutoModal(false);
    setAutoEmail("");
    setAutoSubject("");
    setAutoBody("");
    setAutoStart("");
    setAutoEnd("");
    setEditingAutoresponder(null);
  }, [autoEmail, autoSubject, autoBody, autoStart, autoEnd, editingAutoresponder]);

  /* ── spam settings handler ── */

  const handleSaveSpam = useCallback(async () => {
    setSavingSpam(true);
    await new Promise((r) => setTimeout(r, 1500));
    showToast.success("Spam & security settings saved");
    setSavingSpam(false);
  }, []);

  /* ── DKIM generate handler ── */

  const handleGenerateDkim = useCallback(async () => {
    setGeneratingDkim(true);
    await new Promise((r) => setTimeout(r, 2000));
    setDkimConfigured(true);
    showToast.success("DKIM key generated successfully");
    setGeneratingDkim(false);
  }, []);

  const handleToggleAutoresponder = useCallback((id: string) => {
    setAutoresponders((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
    const ar = autoresponders.find((a) => a.id === id);
    showToast.success(`Autoresponder ${ar?.active ? "disabled" : "enabled"}`);
  }, [autoresponders]);

  /* ── delete handler ── */

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "account") setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    if (deleteTarget.type === "forwarder") setForwarders((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    if (deleteTarget.type === "autoresponder") setAutoresponders((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    showToast.success(`${deleteTarget.label} deleted`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  /* ── copy helper ── */

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("Copied to clipboard");
  }, []);

  // Escape key for modals
  useEffect(() => {
    const anyModal = showAccountModal || showForwarderModal || showAutoModal;
    if (!anyModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowAccountModal(false); setShowForwarderModal(false); setShowAutoModal(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showAccountModal, showForwarderModal, showAutoModal]);

  // Body scroll lock
  useEffect(() => {
    const anyModal = showAccountModal || showForwarderModal || showAutoModal;
    if (anyModal) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showAccountModal, showForwarderModal, showAutoModal]);

  /* ── shared styles ── */

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const textareaClass = `w-full rounded-xl border px-3 py-3 text-sm font-medium outline-none transition-colors resize-y min-h-[100px] ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400 placeholder:text-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)] placeholder:text-slate-500"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const thClass = `text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const tdClass = `px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`;

  const btnPrimary = `h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`;
  const btnSecondary = `h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
    isLight
      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
      : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
  }`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  /* ── action button row for each tab ── */

  const actionBtn = (label: string, onClick: () => void) => (
    <button onClick={onClick} className={btnPrimary}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {label}
    </button>
  );

  const deleteBtn = (onClick: () => void) => (
    <button onClick={onClick} aria-label="Delete" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
      isLight ? "text-slate-400 hover:bg-red-50 hover:text-red-500" : "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
    }`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );

  const editBtn = (onClick: () => void) => (
    <button onClick={onClick} aria-label="Edit" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
      isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"
    }`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    </button>
  );

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Email Management
          </h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            Manage email accounts for{" "}
            <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {decodeURIComponent(siteId)}
            </span>
          </p>
        </div>
      </div>

      {/* Email Usage Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Accounts", value: String(accounts.length), iconColor: "text-sky-400", iconBg: isLight ? "bg-sky-50" : "bg-sky-500/10", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
          { label: "Storage Used", value: "1.2 / 5 GB", iconColor: "text-violet-400", iconBg: isLight ? "bg-violet-50" : "bg-violet-500/10", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125", progress: 24 },
          { label: "Emails Sent (30d)", value: "2,847", iconColor: "text-emerald-400", iconBg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" },
          { label: "Emails Received (30d)", value: "8,234", iconColor: "text-amber-400", iconBg: isLight ? "bg-amber-50" : "bg-amber-500/10", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
        ].map((stat) => (
          <div key={stat.label} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
              <svg className={`w-5 h-5 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{stat.label}</p>
              <p className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</p>
              {"progress" in stat && stat.progress !== undefined && (
                <div className={`h-1.5 rounded-full mt-1 overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                  <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${stat.progress}%` }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {EMAIL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const styles = TAB_COLORS[tab.color];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? `${styles.activeBg} ${styles.activeText} ring-1 ${styles.ring}`
                  : isLight
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-200"
              }`}
            >
              <svg
                className={`w-4 h-4 transition-colors ${isActive ? styles.activeText : isLight ? "text-slate-500 group-hover:text-slate-600" : "text-slate-500 group-hover:text-slate-400"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
              >
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div key={activeTab} className="animate-in fade-in slide-in-from-right-2 duration-300">

        {/* ═══════════ TAB 1: Email Accounts ═══════════ */}
        {activeTab === "accounts" && (
          <>
            <div className="flex justify-end mb-4">
              {actionBtn("Create Account", openCreateAccount)}
            </div>

            <div className={`${cardClass} overflow-hidden mb-8`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <th className={thClass}>Email Address</th>
                      <th className={thClass}>Quota</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acct) => {
                      const pct = (acct.quotaUsed / acct.quotaTotal) * 100;
                      return (
                        <tr key={acct.id} className={`border-b last:border-b-0 transition-colors ${
                          isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                        }`}>
                          <td className={`px-6 py-4 text-sm font-medium font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                            {acct.address}
                          </td>
                          <td className="px-6 py-4">
                            <div className="min-w-[160px]">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                                  {formatQuota(acct.quotaUsed)} / {formatQuota(acct.quotaTotal)}
                                </span>
                                <span className={`text-xs font-semibold ${
                                  pct >= 90 ? "text-rose-500" : pct >= 70 ? "text-amber-500" : "text-emerald-500"
                                }`}>
                                  {Math.round(pct)}%
                                </span>
                              </div>
                              <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${getQuotaColor(pct)}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${
                              acct.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${acct.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                              {acct.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {editBtn(() => openEditAccount(acct))}
                              {deleteBtn(() => setDeleteTarget({ type: "account", id: acct.id, label: acct.address }))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {accounts.length === 0 && (
                      <tr><td colSpan={4} className={`px-6 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No email accounts yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ TAB 2: Forwarders ═══════════ */}
        {activeTab === "forwarders" && (
          <>
            <div className="flex justify-end mb-4">
              {actionBtn("Add Forwarder", () => { setFwdSource(""); setFwdDest(""); setShowForwarderModal(true); })}
            </div>

            <div className={`${cardClass} overflow-hidden mb-8`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <th className={thClass}>Source Email</th>
                      <th className={thClass}>Destination Email</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forwarders.map((fwd) => (
                      <tr key={fwd.id} className={`border-b last:border-b-0 transition-colors ${
                        isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                      }`}>
                        <td className={`px-6 py-4 text-sm font-medium font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {fwd.source}
                        </td>
                        <td className={`px-6 py-4 text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            {fwd.destination}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {deleteBtn(() => setDeleteTarget({ type: "forwarder", id: fwd.id, label: `${fwd.source} → ${fwd.destination}` }))}
                        </td>
                      </tr>
                    ))}
                    {forwarders.length === 0 && (
                      <tr><td colSpan={3} className={`px-6 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No forwarders configured</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ TAB 3: Autoresponders ═══════════ */}
        {activeTab === "autoresponders" && (
          <>
            <div className="flex justify-end mb-4">
              {actionBtn("Add Autoresponder", openCreateAutoresponder)}
            </div>

            <div className={`${cardClass} overflow-hidden mb-8`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <th className={thClass}>Email</th>
                      <th className={thClass}>Subject</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autoresponders.map((ar) => (
                      <tr key={ar.id} className={`border-b last:border-b-0 transition-colors ${
                        isLight ? "border-slate-100 hover:bg-slate-50" : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                      }`}>
                        <td className={`px-6 py-4 text-sm font-medium font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {ar.email}
                        </td>
                        <td className={tdClass}>{ar.subject}</td>
                        <td className="px-6 py-4">
                          <Toggle enabled={ar.active} onChange={() => handleToggleAutoresponder(ar.id)} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {editBtn(() => openEditAutoresponder(ar))}
                            {deleteBtn(() => setDeleteTarget({ type: "autoresponder", id: ar.id, label: `${ar.email} autoresponder` }))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {autoresponders.length === 0 && (
                      <tr><td colSpan={4} className={`px-6 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No autoresponders configured</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══════════ TAB 4: Spam & Security ═══════════ */}
        {activeTab === "spam" && (
          <>
            {/* Spam Filter Settings */}
            <div className={`${cardClass} p-6 mb-6`}>
              <h3 className={`text-sm font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Spam Filter Settings
              </h3>

              {/* Spam filter level pills */}
              <div className="mb-5">
                <label className={`${labelClass} mb-2 block`}>Spam Filter Level</label>
                <div className="flex flex-wrap gap-2">
                  {SPAM_LEVELS.map((level) => {
                    const isActive = spamLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => setSpamLevel(level.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ring-1 ${
                          isActive
                            ? level.color
                            : isLight
                              ? "bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100"
                              : "bg-[var(--bg-primary)] text-slate-500 ring-[var(--border-tertiary)] hover:text-slate-300"
                        }`}
                      >
                        {level.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Auto-delete spam after 30 days</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>Automatically purge messages marked as spam</p>
                  </div>
                  <Toggle enabled={autoDeleteSpam} onChange={setAutoDeleteSpam} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Block attachments with executable extensions</p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>Reject .exe, .bat, .cmd, .scr, .js attachments</p>
                  </div>
                  <Toggle enabled={blockExecutables} onChange={setBlockExecutables} />
                </div>
              </div>

              {/* Blacklist */}
              <div className="mb-4">
                <label className={`${labelClass} mb-1.5 block`}>Custom Blacklist</label>
                <p className={`text-xs mb-1.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Comma-separated domains or emails to block</p>
                <textarea
                  value={blacklist}
                  onChange={(e) => setBlacklist(e.target.value)}
                  rows={3}
                  placeholder="spam-domain.com, bad@actor.com"
                  className={textareaClass}
                />
              </div>

              {/* Whitelist */}
              <div className="mb-5">
                <label className={`${labelClass} mb-1.5 block`}>Custom Whitelist</label>
                <p className={`text-xs mb-1.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Comma-separated domains or emails to always allow</p>
                <textarea
                  value={whitelist}
                  onChange={(e) => setWhitelist(e.target.value)}
                  rows={3}
                  placeholder="trusted-partner.com, friend@example.com"
                  className={textareaClass}
                />
              </div>

              <div className="flex justify-end">
                <button onClick={handleSaveSpam} disabled={savingSpam} className={btnPrimary}>
                  {savingSpam ? <>{spinner} Saving…</> : "Save Settings"}
                </button>
              </div>
            </div>

            {/* DKIM / SPF / DMARC Configuration */}
            <div className={`${cardClass} p-6`}>
              <h3 className={`text-sm font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Email Authentication (DNS Records)
              </h3>

              <div className="space-y-3">
                {/* SPF */}
                {(() => {
                  const isExpanded = expandedDns === "spf";
                  return (
                    <div className={`rounded-xl border transition-all ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <button
                        onClick={() => setExpandedDns(isExpanded ? null : "spf")}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 ring-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Configured
                          </span>
                          <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>SPF Record</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className={`px-4 pb-4 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                          <div className="pt-3 space-y-2">
                            <p className={labelClass}>Record Type: TXT</p>
                            <p className={labelClass}>Host: @</p>
                            <div className={`rounded-lg p-3 flex items-center justify-between gap-2 ${isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]/50"}`}>
                              <code className={`text-xs font-mono break-all ${isLight ? "text-slate-700" : "text-slate-200"}`}>v=spf1 include:_spf.limewp.com ~all</code>
                              <button onClick={() => copyToClipboard("v=spf1 include:_spf.limewp.com ~all")} className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* DKIM */}
                {(() => {
                  const isExpanded = expandedDns === "dkim";
                  return (
                    <div className={`rounded-xl border transition-all ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <button
                        onClick={() => setExpandedDns(isExpanded ? null : "dkim")}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${
                            dkimConfigured
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dkimConfigured ? "bg-emerald-400" : "bg-amber-400"}`} />
                            {dkimConfigured ? "Configured" : "Not Set"}
                          </span>
                          <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>DKIM Record</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className={`px-4 pb-4 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                          <div className="pt-3 space-y-2">
                            <p className={labelClass}>Selector: limewp._domainkey</p>
                            <p className={labelClass}>Record Type: TXT</p>
                            {dkimConfigured ? (
                              <div className={`rounded-lg p-3 flex items-center justify-between gap-2 ${isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]/50"}`}>
                                <code className={`text-xs font-mono break-all ${isLight ? "text-slate-700" : "text-slate-200"}`}>v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...</code>
                                <button onClick={() => copyToClipboard("v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...")} className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"}`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                                </button>
                              </div>
                            ) : (
                              <button onClick={handleGenerateDkim} disabled={generatingDkim} className={btnPrimary}>
                                {generatingDkim ? <>{spinner} Generating…</> : "Generate DKIM Key"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* DMARC */}
                {(() => {
                  const isExpanded = expandedDns === "dmarc";
                  return (
                    <div className={`rounded-xl border transition-all ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <button
                        onClick={() => setExpandedDns(isExpanded ? null : "dmarc")}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 ring-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Configured
                          </span>
                          <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>DMARC Record</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className={`px-4 pb-4 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                          <div className="pt-3 space-y-2">
                            <p className={labelClass}>Record Type: TXT</p>
                            <p className={labelClass}>Host: _dmarc</p>
                            <div className={`rounded-lg p-3 flex items-center justify-between gap-2 ${isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]/50"}`}>
                              <code className={`text-xs font-mono break-all ${isLight ? "text-slate-700" : "text-slate-200"}`}>v=DMARC1; p=quarantine; rua=mailto:dmarc@limewp.com</code>
                              <button onClick={() => copyToClipboard("v=DMARC1; p=quarantine; rua=mailto:dmarc@limewp.com")} className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════════ Quick Access Section ═══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Open Webmail */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Open Webmail
            </h3>
            <p className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Choose your preferred webmail client
            </p>
            <div className="relative">
              <button
                onClick={() => setShowWebmailDropdown(!showWebmailDropdown)}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open Webmail
                <svg className={`w-3.5 h-3.5 transition-transform ${showWebmailDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showWebmailDropdown && (
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 rounded-xl border shadow-xl z-10 overflow-hidden ${
                  isLight ? "bg-white border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)]"
                }`}>
                  <button
                    onClick={() => { showToast.info("Opening Roundcube webmail..."); setShowWebmailDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2.5 ${
                      isLight ? "text-slate-700 hover:bg-slate-50" : "text-slate-200 hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Roundcube
                  </button>
                  <button
                    onClick={() => { showToast.info("Opening Rainloop webmail..."); setShowWebmailDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2.5 border-t ${
                      isLight ? "text-slate-700 hover:bg-slate-50 border-slate-100" : "text-slate-200 hover:bg-[var(--bg-elevated)] border-[var(--border-tertiary)]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    Rainloop
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mail Configuration */}
        <div className={cardClass}>
          <div className="p-6">
            <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Mail Configuration
            </h3>
            <div className="space-y-3">
              {MAIL_CONFIG.map((item) => (
                <div key={item.label} className={`rounded-xl p-3 border flex items-center justify-between ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <div>
                    <p className={labelClass}>{item.label}</p>
                    <p className={`text-sm font-semibold font-mono mt-0.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {item.value}
                    </p>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      Port: {item.port}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.value)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-[var(--bg-elevated)] hover:text-slate-300"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Create/Edit Account Modal ═══════════ */}
      {showAccountModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !savingAccount && setShowAccountModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="email-account-modal-title">
            <h3 id="email-account-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {editingAccount ? "Edit Email Account" : "Create Email Account"}
            </h3>

            <div className="space-y-4">
              {/* Email address */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    value={acctLocal}
                    onChange={(e) => setAcctLocal(e.target.value)}
                    placeholder="username"
                    className={inputClass}
                    autoFocus
                  />
                  <span className={`flex items-center px-3 rounded-xl border text-sm font-mono whitespace-nowrap ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-500"
                      : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-400"
                  }`}>
                    @{DOMAIN}
                  </span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>{editingAccount ? "New Password (leave empty to keep)" : "Password"}</label>
                <input
                  type="password"
                  value={acctPassword}
                  onChange={(e) => setAcctPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} mt-1.5`}
                />
                {acctPassword && (() => {
                  const strength = getPasswordStrength(acctPassword);
                  return (
                    <div className="mt-2">
                      <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${strength.barClass}`}
                          style={{ width: `${strength.pct}%` }}
                        />
                      </div>
                      <p className={`text-xs font-medium mt-1 ${strength.color}`}>{strength.label}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Quota slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Quota</label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-200"
                  }`}>{formatQuota(acctQuota)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {QUOTA_STEPS.map((n, i) => {
                    const activeIdx = QUOTA_STEPS.indexOf(acctQuota);
                    const isFilled = i <= activeIdx;
                    const isActive = n === acctQuota;
                    return (
                      <button
                        key={n}
                        onClick={() => setAcctQuota(n)}
                        className="flex-1 flex flex-col items-center gap-1.5 group"
                      >
                        <div className={`w-full h-2 rounded-full transition-all ${
                          isFilled
                            ? isLight ? "bg-slate-600" : "bg-slate-300"
                            : isLight ? "bg-slate-200 group-hover:bg-slate-300" : "bg-slate-700 group-hover:bg-slate-600"
                        } ${isActive ? "ring-2 ring-offset-1 " + (isLight ? "ring-slate-400 ring-offset-white" : "ring-slate-500 ring-offset-[#0f1729]") : ""}`} />
                        <span className={`text-[10px] font-medium transition-colors ${
                          isActive
                            ? isLight ? "text-slate-800 font-bold" : "text-slate-100 font-bold"
                            : isLight ? "text-slate-400 group-hover:text-slate-600" : "text-slate-600 group-hover:text-slate-400"
                        }`}>
                          {formatQuota(n)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowAccountModal(false)} disabled={savingAccount} className={btnSecondary}>Cancel</button>
              <button onClick={handleSaveAccount} disabled={savingAccount} className={btnPrimary}>
                {savingAccount ? <>{spinner} Saving…</> : editingAccount ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Add Forwarder Modal ═══════════ */}
      {showForwarderModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !savingForwarder && setShowForwarderModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="email-forwarder-modal-title">
            <h3 id="email-forwarder-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Add Forwarder
            </h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Source Email</label>
                <input
                  type="text"
                  value={fwdSource}
                  onChange={(e) => setFwdSource(e.target.value)}
                  placeholder={`alias@${DOMAIN}`}
                  className={`${inputClass} mt-1.5`}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClass}>Destination Email</label>
                <input
                  type="email"
                  value={fwdDest}
                  onChange={(e) => setFwdDest(e.target.value)}
                  placeholder="user@example.com"
                  className={`${inputClass} mt-1.5`}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForwarderModal(false)} disabled={savingForwarder} className={btnSecondary}>Cancel</button>
              <button onClick={handleSaveForwarder} disabled={savingForwarder} className={btnPrimary}>
                {savingForwarder ? <>{spinner} Saving…</> : "Add Forwarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Add Autoresponder Modal ═══════════ */}
      {showAutoModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !savingAuto && setShowAutoModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="email-autoresponder-modal-title">
            <h3 id="email-autoresponder-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {editingAutoresponder ? "Edit Autoresponder" : "Add Autoresponder"}
            </h3>

            <div className="space-y-4">
              {/* Email select */}
              <div>
                <label className={labelClass}>Email Account</label>
                <div className="relative mt-1.5">
                  <select
                    value={autoEmail}
                    onChange={(e) => setAutoEmail(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select email…</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.address}>{a.address}</option>
                    ))}
                  </select>
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className={labelClass}>Subject</label>
                <input
                  type="text"
                  value={autoSubject}
                  onChange={(e) => setAutoSubject(e.target.value)}
                  placeholder="e.g. Out of Office"
                  className={`${inputClass} mt-1.5`}
                />
              </div>

              {/* Body */}
              <div>
                <label className={labelClass}>Message Body (HTML)</label>
                <textarea
                  value={autoBody}
                  onChange={(e) => setAutoBody(e.target.value)}
                  placeholder="<p>Thank you for your email...</p>"
                  rows={4}
                  className={`${textareaClass} mt-1.5`}
                />
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    value={autoStart}
                    onChange={(e) => setAutoStart(e.target.value)}
                    className={`${inputClass} mt-1.5`}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    value={autoEnd}
                    onChange={(e) => setAutoEnd(e.target.value)}
                    className={`${inputClass} mt-1.5`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowAutoModal(false)} disabled={savingAuto} className={btnSecondary}>Cancel</button>
              <button onClick={handleSaveAuto} disabled={savingAuto} className={btnPrimary}>
                {savingAuto ? <>{spinner} Saving…</> : editingAutoresponder ? "Update Autoresponder" : "Add Autoresponder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Delete Confirm ═══════════ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.label}?`}
        message="This action cannot be undone. All associated data will be permanently removed."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

export default function EmailManagementPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <AppShell>
      <Link href={`/site?name=${encodeURIComponent(siteId)}`} className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Back to {decodeURIComponent(siteId)}
      </Link>
      <EmailTab siteId={siteId} />
    </AppShell>
  );
}
