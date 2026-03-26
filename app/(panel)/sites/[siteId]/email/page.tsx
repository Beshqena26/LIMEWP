"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

/* ══════════════════════════════════ Types ══════════════════════════════════ */

interface EmailAccount {
  id: string;
  address: string;
  quotaUsed: number;
  quotaTotal: number;
  status: "Active" | "Suspended";
  lastActive: string;
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
  startDate: string;
  endDate: string;
  enabled: boolean;
}

type SpamLevel = "off" | "low" | "medium" | "high";

interface SpamSettings {
  level: SpamLevel;
  autoDelete: boolean;
  blockExecutables: boolean;
  blacklist: string;
  whitelist: string;
}

/* ══════════════════════════════════ Mock Data ══════════════════════════════════ */

const ACCOUNTS: EmailAccount[] = [
  { id: "e1", address: "admin@limewp.com", quotaUsed: 450, quotaTotal: 1024, status: "Active", lastActive: "2 min ago" },
  { id: "e2", address: "info@limewp.com", quotaUsed: 280, quotaTotal: 512, status: "Active", lastActive: "1 hour ago" },
  { id: "e3", address: "support@limewp.com", quotaUsed: 120, quotaTotal: 512, status: "Active", lastActive: "3 hours ago" },
  { id: "e4", address: "noreply@limewp.com", quotaUsed: 50, quotaTotal: 256, status: "Suspended", lastActive: "2 weeks ago" },
  { id: "e5", address: "dev@limewp.com", quotaUsed: 310, quotaTotal: 1024, status: "Active", lastActive: "5 min ago" },
];

const FORWARDERS: Forwarder[] = [
  { id: "f1", source: "sales@limewp.com", destination: "admin@limewp.com" },
  { id: "f2", source: "billing@limewp.com", destination: "info@limewp.com" },
  { id: "f3", source: "hello@limewp.com", destination: "admin@limewp.com, info@limewp.com" },
];

const AUTORESPONDERS: Autoresponder[] = [
  { id: "ar1", email: "support@limewp.com", subject: "We received your message", startDate: "Mar 1, 2026", endDate: "Mar 31, 2026", enabled: true },
  { id: "ar2", email: "info@limewp.com", subject: "Out of office", startDate: "Mar 20, 2026", endDate: "Mar 27, 2026", enabled: false },
];

const MAIL_CONFIG = {
  imap: { host: "mail.limewp.com", port: "993", ssl: true },
  smtp: { host: "mail.limewp.com", port: "465", ssl: true },
  pop3: { host: "mail.limewp.com", port: "995", ssl: true },
};

const DNS_RECORDS = {
  spf: { configured: true, value: "v=spf1 include:limewp.com ~all" },
  dkim: { configured: true, selector: "default._domainkey", value: "v=DKIM1; k=rsa; p=MIGfMA0GCS..." },
  dmarc: { configured: false, value: "v=DMARC1; p=none; rua=mailto:admin@limewp.com" },
};

const QUOTA_STEPS = [256, 512, 1024, 2048, 5120];

/* ══════════════════════════════════ Helpers ══════════════════════════════════ */

function formatMB(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
}

function quotaColor(used: number, total: number): string {
  const pct = (used / total) * 100;
  if (pct > 80) return "bg-rose-500";
  if (pct > 50) return "bg-amber-500";
  return "bg-emerald-500";
}

function quotaTextColor(used: number, total: number): string {
  const pct = (used / total) * 100;
  if (pct > 80) return "text-rose-400";
  if (pct > 50) return "text-amber-400";
  return "text-emerald-400";
}

function getPasswordStrength(pw: string): { label: string; pct: number; color: string; barClass: string } {
  if (!pw) return { label: "", pct: 0, color: "", barClass: "" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  if (pw.length >= 10 && hasUpper && hasLower && hasNumber && hasSpecial)
    return { label: "Strong", pct: 100, color: "text-emerald-500", barClass: "bg-emerald-500" };
  if (pw.length >= 8 && hasNumber)
    return { label: "Good", pct: 75, color: "text-sky-500", barClass: "bg-sky-500" };
  if (pw.length >= 6)
    return { label: "Fair", pct: 50, color: "text-amber-500", barClass: "bg-amber-500" };
  return { label: "Weak", pct: 25, color: "text-rose-500", barClass: "bg-rose-500" };
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  showToast.success("Copied to clipboard");
}

/* ══════════════════════════════════ Icons (SVG paths) ══════════════════════════════════ */

const ICONS = {
  mail: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  plus: "M12 4.5v15m7.5-7.5h-15",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  pencil: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125",
  trash: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  forward: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  reply: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
  server: "M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  clipboard: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184",
  pause: "M15.75 5.25v13.5m-7.5-13.5v13.5",
  play: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z",
  arrowRight: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3",
  xmark: "M6 18L18 6M6 6l12 12",
};

function Icon({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ══════════════════════════════════ Modal Shell ══════════════════════════════════ */

function Modal({ open, onClose, title, children, width = "max-w-lg" }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        className={`relative w-full ${width} rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
          isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
        }`}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
          <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/5 text-slate-500"}`}>
            <Icon d={ICONS.xmark} className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════ Input helper ══════════════════════════════════ */

function InputField({ label, value, onChange, type = "text", placeholder, mono, disabled, children }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  mono?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-10 px-3 text-sm rounded-xl border outline-none transition-all ${mono ? "font-mono" : ""} ${
          isLight
            ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 disabled:opacity-50"
            : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 disabled:opacity-50"
        }`}
      />
      {children}
    </div>
  );
}

/* ══════════════════════════════════ EmailTab (exported) ══════════════════════════════════ */

export function EmailTab({ siteId }: { siteId: string }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // ── State ──
  const [accounts, setAccounts] = useState<EmailAccount[]>(ACCOUNTS);
  const [forwarders, setForwarders] = useState<Forwarder[]>(FORWARDERS);
  const [autoresponders, setAutoresponders] = useState<Autoresponder[]>(AUTORESPONDERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [accountModal, setAccountModal] = useState<{ open: boolean; editing?: EmailAccount }>({ open: false });
  const [forwarderModal, setForwarderModal] = useState<{ open: boolean; editing?: Forwarder }>({ open: false });
  const [autoresponderModal, setAutoresponderModal] = useState<{ open: boolean; editing?: Autoresponder }>({ open: false });
  const [spamModal, setSpamModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: string; id: string; label: string }>({ open: false, type: "", id: "", label: "" });

  // Account form
  const [accForm, setAccForm] = useState({ address: "", password: "", quota: 512, status: "Active" as "Active" | "Suspended" });
  // Forwarder form
  const [fwdForm, setFwdForm] = useState({ source: "", destination: "" });
  // Autoresponder form
  const [arForm, setArForm] = useState({ email: "", subject: "", message: "", startDate: "", endDate: "", enabled: true });
  // Spam settings
  const [spam, setSpam] = useState<SpamSettings>({ level: "medium", autoDelete: false, blockExecutables: true, blacklist: "", whitelist: "" });

  const settingsRef = useRef<HTMLDivElement>(null);

  // ── Derived ──
  const activeAccounts = accounts.filter((a) => a.status === "Active").length;
  const suspendedAccounts = accounts.filter((a) => a.status === "Suspended").length;
  const totalStorageUsed = accounts.reduce((sum, a) => sum + a.quotaUsed, 0);
  const totalStorageTotal = accounts.reduce((sum, a) => sum + a.quotaTotal, 0);
  const filteredAccounts = accounts.filter((a) => a.address.toLowerCase().includes(searchQuery.toLowerCase()));

  // ── Card class ──
  const card = `rounded-2xl border transition-all duration-200 hover:-translate-y-px ${
    isLight ? "bg-white border-slate-200/80 shadow-sm" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)]"
  }`;
  const cardFlat = `rounded-2xl border ${isLight ? "bg-white border-slate-200/80 shadow-sm" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)]"}`;
  const sectionTitle = `text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`;
  const subtitle = `text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const muted = isLight ? "text-slate-400" : "text-slate-500";
  const btnPrimary = `h-9 px-4 rounded-xl text-sm font-semibold transition-all bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20`;
  const btnSecondary = `h-9 px-4 rounded-xl text-sm font-medium transition-colors ${
    isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-slate-300 hover:bg-white/10"
  }`;
  const btnSmall = `h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
    isLight ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" : "hover:bg-white/5 text-slate-500 hover:text-slate-300"
  }`;

  // ── Handlers ──
  const openCreateAccount = () => {
    setAccForm({ address: "", password: "", quota: 512, status: "Active" });
    setAccountModal({ open: true });
  };
  const openEditAccount = (acc: EmailAccount) => {
    setAccForm({ address: acc.address, password: "", quota: acc.quotaTotal, status: acc.status });
    setAccountModal({ open: true, editing: acc });
  };
  const saveAccount = () => {
    if (!accForm.address) { showToast.error("Email address is required"); return; }
    if (accountModal.editing) {
      setAccounts((prev) => prev.map((a) => a.id === accountModal.editing!.id ? { ...a, address: accForm.address, quotaTotal: accForm.quota, status: accForm.status } : a));
      showToast.success("Account updated");
    } else {
      if (!accForm.password) { showToast.error("Password is required"); return; }
      const newAcc: EmailAccount = { id: `e${Date.now()}`, address: accForm.address, quotaUsed: 0, quotaTotal: accForm.quota, status: accForm.status, lastActive: "Just now" };
      setAccounts((prev) => [...prev, newAcc]);
      showToast.success("Account created");
    }
    setAccountModal({ open: false });
  };

  const toggleAccountStatus = (id: string) => {
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a));
    showToast.success("Account status updated");
  };

  const openCreateForwarder = () => {
    setFwdForm({ source: "", destination: "" });
    setForwarderModal({ open: true });
  };
  const saveForwarder = () => {
    if (!fwdForm.source || !fwdForm.destination) { showToast.error("Both fields are required"); return; }
    if (forwarderModal.editing) {
      setForwarders((prev) => prev.map((f) => f.id === forwarderModal.editing!.id ? { ...f, source: fwdForm.source, destination: fwdForm.destination } : f));
      showToast.success("Forwarder updated");
    } else {
      setForwarders((prev) => [...prev, { id: `f${Date.now()}`, source: fwdForm.source, destination: fwdForm.destination }]);
      showToast.success("Forwarder created");
    }
    setForwarderModal({ open: false });
  };

  const openCreateAutoresponder = () => {
    setArForm({ email: "", subject: "", message: "", startDate: "", endDate: "", enabled: true });
    setAutoresponderModal({ open: true });
  };
  const openEditAutoresponder = (ar: Autoresponder) => {
    setArForm({ email: ar.email, subject: ar.subject, message: "", startDate: ar.startDate, endDate: ar.endDate, enabled: ar.enabled });
    setAutoresponderModal({ open: true, editing: ar });
  };
  const saveAutoresponder = () => {
    if (!arForm.email || !arForm.subject) { showToast.error("Email and subject are required"); return; }
    if (autoresponderModal.editing) {
      setAutoresponders((prev) => prev.map((a) => a.id === autoresponderModal.editing!.id ? { ...a, email: arForm.email, subject: arForm.subject, startDate: arForm.startDate, endDate: arForm.endDate, enabled: arForm.enabled } : a));
      showToast.success("Autoresponder updated");
    } else {
      setAutoresponders((prev) => [...prev, { id: `ar${Date.now()}`, email: arForm.email, subject: arForm.subject, startDate: arForm.startDate, endDate: arForm.endDate, enabled: arForm.enabled }]);
      showToast.success("Autoresponder created");
    }
    setAutoresponderModal({ open: false });
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirm;
    if (type === "account") setAccounts((prev) => prev.filter((a) => a.id !== id));
    if (type === "forwarder") setForwarders((prev) => prev.filter((f) => f.id !== id));
    if (type === "autoresponder") setAutoresponders((prev) => prev.filter((a) => a.id !== id));
    showToast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
    setDeleteConfirm({ open: false, type: "", id: "", label: "" });
  };

  const saveSpamSettings = () => {
    showToast.success("Spam settings saved");
    setSpamModal(false);
  };

  const passwordStrength = getPasswordStrength(accForm.password);

  // ── Render ──
  return (
    <div className="space-y-8">

      {/* ─── 1. Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-800" : "text-slate-50"}`}>Email Management</h1>
          <p className={`text-sm mt-1 ${subtitle}`}>{decodeURIComponent(siteId)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => settingsRef.current?.scrollIntoView({ behavior: "smooth" })} className={btnSecondary}>
            <Icon d={ICONS.cog} className="w-4 h-4 mr-1.5 inline" />
            Mail Settings
          </button>
          <button onClick={openCreateAccount} className={btnPrimary}>
            <Icon d={ICONS.plus} className="w-4 h-4 mr-1.5 inline" />
            Create Account
          </button>
        </div>
      </div>

      {/* ─── 2. Overview Banner ─── */}
      <div className={`${cardFlat} overflow-hidden`}>
        <div className={`p-6 ${isLight ? "bg-gradient-to-r from-sky-50/80 to-transparent" : "bg-gradient-to-r from-sky-500/5 to-transparent"}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: accounts + storage */}
            <div className="flex items-center gap-8">
              <div>
                <div className={`text-3xl font-bold tracking-tight ${isLight ? "text-slate-800" : "text-slate-50"}`}>
                  {accounts.length} <span className="text-lg font-medium">Accounts</span>
                </div>
                <p className={`text-sm mt-0.5 ${muted}`}>
                  {activeAccounts} active, {suspendedAccounts} suspended
                </p>
              </div>
              <div className={`h-12 w-px ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
              <div className="min-w-[160px]">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>{formatMB(totalStorageUsed)}</span>
                  <span className={muted}>/ {formatMB(totalStorageTotal)}</span>
                </div>
                <div className={`h-1.5 rounded-full mt-2 ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${quotaColor(totalStorageUsed, totalStorageTotal)}`}
                    style={{ width: `${Math.min(100, (totalStorageUsed / totalStorageTotal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Right: stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>2,847</span>
                <span className={`text-xs ${muted}`}>sent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>8,234</span>
                <span className={`text-xs ${muted}`}>received</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>12</span>
                <span className={`text-xs ${muted}`}>blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Accounts Table ─── */}
      <div className={card}>
        <div className={`px-6 py-4 flex items-center justify-between border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Icon d={ICONS.mail} className="w-4 h-4 text-sky-400" />
            </div>
            <h2 className={sectionTitle}>Accounts</h2>
          </div>
          <div className="relative">
            <Icon d={ICONS.search} className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-9 pl-9 pr-3 text-sm rounded-xl border outline-none transition-all w-56 ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-500 focus:border-sky-300 focus:ring-1 focus:ring-sky-200/50"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-200 placeholder-slate-500 focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
              }`}
            />
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
              <Icon d={ICONS.mail} className={`w-6 h-6 ${muted}`} />
            </div>
            <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>No email accounts found</p>
            <p className={`text-xs mt-1 ${muted}`}>{searchQuery ? "Try a different search term" : "Create your first email account to get started"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${muted}`}>
                  <th className="text-left px-6 py-3 font-medium">Email Address</th>
                  <th className="text-left px-6 py-3 font-medium">Quota</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Last Active</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-slate-50" : "divide-white/[0.04]"}`}>
                {filteredAccounts.map((acc) => {
                  const pct = Math.round((acc.quotaUsed / acc.quotaTotal) * 100);
                  return (
                    <tr key={acc.id} className={`transition-colors ${isLight ? "hover:bg-slate-50/50" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-6 py-3.5">
                        <span className={`text-sm font-mono font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{acc.address}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3 min-w-[140px]">
                          <div className={`flex-1 h-1.5 rounded-full ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                            <div className={`h-full rounded-full transition-all ${quotaColor(acc.quotaUsed, acc.quotaTotal)}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`text-xs tabular-nums ${quotaTextColor(acc.quotaUsed, acc.quotaTotal)}`}>{pct}%</span>
                        </div>
                        <p className={`text-xs mt-0.5 ${muted}`}>{formatMB(acc.quotaUsed)} / {formatMB(acc.quotaTotal)}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          acc.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-sm ${muted}`}>{acc.lastActive}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditAccount(acc)} className={btnSmall} title="Edit">
                            <Icon d={ICONS.pencil} className="w-4 h-4" />
                          </button>
                          <button onClick={() => toggleAccountStatus(acc.id)} className={btnSmall} title={acc.status === "Active" ? "Suspend" : "Activate"}>
                            <Icon d={acc.status === "Active" ? ICONS.pause : ICONS.play} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, type: "account", id: acc.id, label: acc.address })}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500" : "hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"}`}
                            title="Delete"
                          >
                            <Icon d={ICONS.trash} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── 4. Forwarders + Autoresponders (two columns) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Forwarders */}
        <div className={card}>
          <div className={`px-6 py-4 flex items-center justify-between border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Icon d={ICONS.forward} className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className={sectionTitle}>Forwarders</h2>
            </div>
            <button onClick={openCreateForwarder} className="h-8 px-3 rounded-lg text-xs font-semibold transition-all bg-violet-600 hover:bg-violet-500 text-white">
              <Icon d={ICONS.plus} className="w-3.5 h-3.5 mr-1 inline" />
              Add
            </button>
          </div>
          <div className={`divide-y ${isLight ? "divide-slate-50" : "divide-white/[0.04]"}`}>
            {forwarders.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className={`text-sm ${muted}`}>No forwarders configured</p>
              </div>
            ) : forwarders.map((fwd) => (
              <div key={fwd.id} className={`px-6 py-3.5 flex items-center gap-3 ${isLight ? "hover:bg-slate-50/50" : "hover:bg-white/[0.02]"} transition-colors`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-mono truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{fwd.source}</span>
                    <Icon d={ICONS.arrowRight} className={`w-3.5 h-3.5 flex-shrink-0 ${muted}`} />
                    <span className={`font-mono truncate ${muted}`}>{fwd.destination}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm({ open: true, type: "forwarder", id: fwd.id, label: fwd.source })}
                  className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${isLight ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500" : "hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"}`}
                >
                  <Icon d={ICONS.trash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Autoresponders */}
        <div className={card}>
          <div className={`px-6 py-4 flex items-center justify-between border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon d={ICONS.reply} className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className={sectionTitle}>Autoresponders</h2>
            </div>
            <button onClick={openCreateAutoresponder} className="h-8 px-3 rounded-lg text-xs font-semibold transition-all bg-amber-600 hover:bg-amber-500 text-white">
              <Icon d={ICONS.plus} className="w-3.5 h-3.5 mr-1 inline" />
              Add
            </button>
          </div>
          <div className={`divide-y ${isLight ? "divide-slate-50" : "divide-white/[0.04]"}`}>
            {autoresponders.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className={`text-sm ${muted}`}>No autoresponders configured</p>
              </div>
            ) : autoresponders.map((ar) => (
              <div key={ar.id} className={`px-6 py-3.5 flex items-center gap-3 ${isLight ? "hover:bg-slate-50/50" : "hover:bg-white/[0.02]"} transition-colors`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{ar.subject}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>{ar.email} &middot; {ar.startDate} &ndash; {ar.endDate}</p>
                </div>
                <Toggle enabled={ar.enabled} onChange={(val) => setAutoresponders((prev) => prev.map((a) => a.id === ar.id ? { ...a, enabled: val } : a))} />
                <button onClick={() => openEditAutoresponder(ar)} className={btnSmall}>
                  <Icon d={ICONS.pencil} className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ open: true, type: "autoresponder", id: ar.id, label: ar.subject })}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500" : "hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"}`}
                >
                  <Icon d={ICONS.trash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 5. Mail Server Configuration ─── */}
      <div ref={settingsRef} className={card}>
        <div className={`px-6 py-4 border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Icon d={ICONS.server} className="w-4 h-4 text-teal-400" />
            </div>
            <h2 className={sectionTitle}>Mail Server Configuration</h2>
          </div>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x ${isLight ? "divide-slate-100" : "divide-white/[0.04]"}`}>
          {(["imap", "smtp", "pop3"] as const).map((protocol) => {
            const cfg = MAIL_CONFIG[protocol];
            return (
              <div key={protocol} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-teal-600" : "text-teal-400"}`}>{protocol}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">SSL</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${muted}`}>Host</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>{cfg.host}</span>
                      <button onClick={() => copyToClipboard(cfg.host)} className={`p-1 rounded transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/5 text-slate-500"}`}>
                        <Icon d={ICONS.clipboard} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${muted}`}>Port</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>{cfg.port}</span>
                      <button onClick={() => copyToClipboard(cfg.port)} className={`p-1 rounded transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/5 text-slate-500"}`}>
                        <Icon d={ICONS.clipboard} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 6. Security & Authentication ─── */}
      <div className={card}>
        <div className={`px-6 py-4 border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icon d={ICONS.shield} className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className={sectionTitle}>Security & Authentication</h2>
            </div>
            <button onClick={() => setSpamModal(true)} className="h-8 px-3 rounded-lg text-xs font-semibold transition-all bg-rose-600 hover:bg-rose-500 text-white">
              <Icon d={ICONS.shield} className="w-3.5 h-3.5 mr-1 inline" />
              Spam Settings
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px">
          {/* SPF */}
          <div className={`px-6 py-5 ${isLight ? "md:border-r border-slate-100" : "md:border-r border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2 h-2 rounded-full ${DNS_RECORDS.spf.configured ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-300"}`}>SPF</span>
            </div>
            <div className={`text-xs font-mono break-all leading-relaxed ${muted}`}>{DNS_RECORDS.spf.value}</div>
            <button onClick={() => copyToClipboard(DNS_RECORDS.spf.value)} className={`mt-2 text-xs font-medium transition-colors ${isLight ? "text-emerald-600 hover:text-emerald-700" : "text-emerald-400 hover:text-emerald-300"}`}>
              Copy Record
            </button>
          </div>
          {/* DKIM */}
          <div className={`px-6 py-5 ${isLight ? "xl:border-r border-slate-100" : "xl:border-r border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2 h-2 rounded-full ${DNS_RECORDS.dkim.configured ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-300"}`}>DKIM</span>
            </div>
            <p className={`text-xs ${muted}`}>Selector: <span className="font-mono">{DNS_RECORDS.dkim.selector}</span></p>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => copyToClipboard(DNS_RECORDS.dkim.value)} className={`text-xs font-medium transition-colors ${isLight ? "text-emerald-600 hover:text-emerald-700" : "text-emerald-400 hover:text-emerald-300"}`}>
                Copy Key
              </button>
              <span className={muted}>&middot;</span>
              <button onClick={() => showToast.info("DKIM key regenerated")} className={`text-xs font-medium transition-colors ${isLight ? "text-sky-600 hover:text-sky-700" : "text-sky-400 hover:text-sky-300"}`}>
                Regenerate
              </button>
            </div>
          </div>
          {/* DMARC */}
          <div className={`px-6 py-5 ${isLight ? "md:border-r border-slate-100" : "md:border-r border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2 h-2 rounded-full ${DNS_RECORDS.dmarc.configured ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-300"}`}>DMARC</span>
            </div>
            <div className={`text-xs font-mono break-all leading-relaxed ${muted}`}>{DNS_RECORDS.dmarc.value}</div>
            <button onClick={() => copyToClipboard(DNS_RECORDS.dmarc.value)} className={`mt-2 text-xs font-medium transition-colors ${isLight ? "text-emerald-600 hover:text-emerald-700" : "text-emerald-400 hover:text-emerald-300"}`}>
              Copy Record
            </button>
          </div>
          {/* Spam Filter Level */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-300"}`}>Spam Filter</span>
            </div>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              spam.level === "high" ? "bg-rose-500/10 text-rose-500" :
              spam.level === "medium" ? "bg-amber-500/10 text-amber-500" :
              spam.level === "low" ? "bg-sky-500/10 text-sky-500" :
              `${isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-slate-400"}`
            }`}>
              {spam.level}
            </span>
            <button onClick={() => setSpamModal(true)} className={`block mt-2 text-xs font-medium transition-colors ${isLight ? "text-rose-600 hover:text-rose-700" : "text-rose-400 hover:text-rose-300"}`}>
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════ MODALS ══════════════════════════ */}

      {/* Create / Edit Account Modal */}
      <Modal open={accountModal.open} onClose={() => setAccountModal({ open: false })} title={accountModal.editing ? "Edit Account" : "Create Account"}>
        <div className="space-y-4">
          <InputField label="Email Address" value={accForm.address} onChange={(v) => setAccForm({ ...accForm, address: v })} placeholder="user@limewp.com" mono disabled={!!accountModal.editing} />
          <div>
            <InputField label="Password" value={accForm.password} onChange={(v) => setAccForm({ ...accForm, password: v })} type="password" placeholder={accountModal.editing ? "Leave blank to keep current" : "Enter password"} />
            {accForm.password && (
              <div className="mt-2">
                <div className={`h-1.5 rounded-full ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                  <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barClass}`} style={{ width: `${passwordStrength.pct}%` }} />
                </div>
                <p className={`text-xs mt-1 font-medium ${passwordStrength.color}`}>{passwordStrength.label}</p>
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Quota</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={QUOTA_STEPS.length - 1}
                value={QUOTA_STEPS.indexOf(accForm.quota) >= 0 ? QUOTA_STEPS.indexOf(accForm.quota) : 1}
                onChange={(e) => setAccForm({ ...accForm, quota: QUOTA_STEPS[Number(e.target.value)] })}
                className="flex-1 accent-sky-500"
              />
              <span className={`text-sm font-mono font-medium min-w-[64px] text-right ${isLight ? "text-slate-700" : "text-slate-200"}`}>{formatMB(accForm.quota)}</span>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Status</label>
            <div className="flex gap-2">
              {(["Active", "Suspended"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setAccForm({ ...accForm, status: s })}
                  className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                    accForm.status === s
                      ? s === "Active" ? "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20"
                      : isLight ? "bg-slate-50 text-slate-500 hover:bg-slate-100" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAccountModal({ open: false })} className={btnSecondary}>Cancel</button>
            <button onClick={saveAccount} className={btnPrimary}>{accountModal.editing ? "Save Changes" : "Create Account"}</button>
          </div>
        </div>
      </Modal>

      {/* Add Forwarder Modal */}
      <Modal open={forwarderModal.open} onClose={() => setForwarderModal({ open: false })} title={forwarderModal.editing ? "Edit Forwarder" : "Add Forwarder"}>
        <div className="space-y-4">
          <InputField label="Source Email" value={fwdForm.source} onChange={(v) => setFwdForm({ ...fwdForm, source: v })} placeholder="alias@limewp.com" mono />
          <InputField label="Destination Email(s)" value={fwdForm.destination} onChange={(v) => setFwdForm({ ...fwdForm, destination: v })} placeholder="user@limewp.com, other@example.com" mono />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setForwarderModal({ open: false })} className={btnSecondary}>Cancel</button>
            <button onClick={saveForwarder} className="h-9 px-4 rounded-xl text-sm font-semibold transition-all bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20">
              {forwarderModal.editing ? "Save Changes" : "Add Forwarder"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add / Edit Autoresponder Modal */}
      <Modal open={autoresponderModal.open} onClose={() => setAutoresponderModal({ open: false })} title={autoresponderModal.editing ? "Edit Autoresponder" : "Add Autoresponder"}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Email Account</label>
            <select
              value={arForm.email}
              onChange={(e) => setArForm({ ...arForm, email: e.target.value })}
              className={`w-full h-10 px-3 text-sm rounded-xl border outline-none transition-all ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
              }`}
            >
              <option value="">Select account...</option>
              {accounts.map((a) => <option key={a.id} value={a.address}>{a.address}</option>)}
            </select>
          </div>
          <InputField label="Subject" value={arForm.subject} onChange={(v) => setArForm({ ...arForm, subject: v })} placeholder="We received your message" />
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Message</label>
            <textarea
              value={arForm.message}
              onChange={(e) => setArForm({ ...arForm, message: e.target.value })}
              rows={4}
              placeholder="Thank you for reaching out..."
              className={`w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all resize-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
              }`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Start Date" value={arForm.startDate} onChange={(v) => setArForm({ ...arForm, startDate: v })} placeholder="Mar 1, 2026" />
            <InputField label="End Date" value={arForm.endDate} onChange={(v) => setArForm({ ...arForm, endDate: v })} placeholder="Mar 31, 2026" />
          </div>
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>Active</label>
            <Toggle enabled={arForm.enabled} onChange={(v) => setArForm({ ...arForm, enabled: v })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAutoresponderModal({ open: false })} className={btnSecondary}>Cancel</button>
            <button onClick={saveAutoresponder} className="h-9 px-4 rounded-xl text-sm font-semibold transition-all bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              {autoresponderModal.editing ? "Save Changes" : "Add Autoresponder"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Spam Settings Modal */}
      <Modal open={spamModal} onClose={() => setSpamModal(false)} title="Spam Settings" width="max-w-xl">
        <div className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Filter Level</label>
            <div className="flex gap-2">
              {(["off", "low", "medium", "high"] as SpamLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSpam({ ...spam, level })}
                  className={`h-9 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                    spam.level === level
                      ? level === "high" ? "bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/20"
                        : level === "medium" ? "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20"
                        : level === "low" ? "bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/20"
                        : isLight ? "bg-slate-200 text-slate-600 ring-1 ring-slate-300" : "bg-white/10 text-slate-300 ring-1 ring-white/10"
                      : isLight ? "bg-slate-50 text-slate-500 hover:bg-slate-100" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className={`flex items-center justify-between py-3 border-t border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <div>
              <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Auto-delete spam</p>
              <p className={`text-xs ${muted}`}>Automatically remove messages flagged as spam</p>
            </div>
            <Toggle enabled={spam.autoDelete} onChange={(v) => setSpam({ ...spam, autoDelete: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Block executables</p>
              <p className={`text-xs ${muted}`}>Reject emails with executable attachments</p>
            </div>
            <Toggle enabled={spam.blockExecutables} onChange={(v) => setSpam({ ...spam, blockExecutables: v })} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Blacklist (one per line)</label>
            <textarea
              value={spam.blacklist}
              onChange={(e) => setSpam({ ...spam, blacklist: e.target.value })}
              rows={3}
              placeholder="spam@example.com&#10;*@spamdomain.com"
              className={`w-full px-3 py-2.5 text-sm font-mono rounded-xl border outline-none transition-all resize-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/20"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/20"
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Whitelist (one per line)</label>
            <textarea
              value={spam.whitelist}
              onChange={(e) => setSpam({ ...spam, whitelist: e.target.value })}
              rows={3}
              placeholder="trusted@example.com&#10;*@trusteddomain.com"
              className={`w-full px-3 py-2.5 text-sm font-mono rounded-xl border outline-none transition-all resize-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20"
              }`}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSpamModal(false)} className={btnSecondary}>Cancel</button>
            <button onClick={saveSpamSettings} className="h-9 px-4 rounded-xl text-sm font-semibold transition-all bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20">
              Save Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: "", id: "", label: "" })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteConfirm.type}?`}
        message={`Are you sure you want to delete "${deleteConfirm.label}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

/* ══════════════════════════════════ Default Page Export ══════════════════════════════════ */

export default function EmailManagementPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <AppShell>
      <Link
        href={`/site?name=${encodeURIComponent(siteId)}`}
        className={`inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors ${
          isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        &larr; Back to {decodeURIComponent(siteId)}
      </Link>
      <EmailTab siteId={siteId} />
    </AppShell>
  );
}
