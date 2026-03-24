"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

/* ────────────────────────── Types ────────────────────────── */

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
type TicketCategory = "Billing" | "Technical" | "Account" | "Other";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  updated: string;
  created: string;
  description: string;
}

interface ConversationMessage {
  sender: "user" | "support";
  name: string;
  message: string;
  timestamp: string;
}

/* ────────────────────────── Data ────────────────────────── */

const INITIAL_TICKETS: Ticket[] = [
  { id: "TKT-1042", subject: "SSL certificate not working on staging", status: "Open", priority: "High", category: "Technical", updated: "1 hour ago", created: "Mar 24, 2026", description: "After deploying my staging site, the SSL certificate shows as invalid. Visitors get a browser warning when trying to access the site." },
  { id: "TKT-1041", subject: "Billing cycle question", status: "Open", priority: "Low", category: "Billing", updated: "3 hours ago", created: "Mar 24, 2026", description: "I upgraded from Starter to Business plan mid-cycle and I have a question about how the prorated charges are calculated." },
  { id: "TKT-1040", subject: "WordPress core update failed", status: "In Progress", priority: "Urgent", category: "Technical", updated: "5 hours ago", created: "Mar 23, 2026", description: "Attempted to update WordPress from 6.4 to 6.5 via the dashboard. The update process got stuck at 50% and now the site shows a maintenance mode page." },
  { id: "TKT-1039", subject: "Need help with DNS configuration", status: "In Progress", priority: "Medium", category: "Technical", updated: "8 hours ago", created: "Mar 23, 2026", description: "I transferred my domain to a new registrar and need to update DNS records. Not sure which records to add for my WordPress site." },
  { id: "TKT-1038", subject: "Two-factor authentication locked out", status: "Open", priority: "High", category: "Account", updated: "12 hours ago", created: "Mar 22, 2026", description: "I lost my phone and can no longer access my 2FA codes. I need help regaining access to my account." },
  { id: "TKT-1037", subject: "Request for site migration assistance", status: "Resolved", priority: "Medium", category: "Technical", updated: "1 day ago", created: "Mar 21, 2026", description: "I need help migrating my WordPress site from my old hosting provider to LimeWP. The site is about 2GB with a large database." },
  { id: "TKT-1036", subject: "Refund request for add-on service", status: "Resolved", priority: "Low", category: "Billing", updated: "2 days ago", created: "Mar 20, 2026", description: "I accidentally purchased the CDN add-on and would like a refund. I haven't used the service at all." },
  { id: "TKT-1035", subject: "Email deliverability issues", status: "Closed", priority: "Medium", category: "Technical", updated: "3 days ago", created: "Mar 18, 2026", description: "Emails sent from my WordPress contact form are landing in spam folders. I need help configuring DKIM and SPF records." },
  { id: "TKT-1034", subject: "Change account email address", status: "Closed", priority: "Low", category: "Account", updated: "5 days ago", created: "Mar 16, 2026", description: "I would like to update the primary email address associated with my LimeWP account from my old email to a new one." },
  { id: "TKT-1033", subject: "High server response time", status: "Resolved", priority: "High", category: "Technical", updated: "1 week ago", created: "Mar 14, 2026", description: "My site's TTFB has increased to over 3 seconds. Performance was fine until a few days ago. No recent changes to plugins or themes." },
];

const MOCK_CONVERSATIONS: Record<string, ConversationMessage[]> = {
  "TKT-1042": [
    { sender: "user", name: "You", message: "Hi, my SSL certificate is showing as invalid on my staging site. I've tried clearing browser cache but the issue persists.", timestamp: "Mar 24, 2026 at 10:30 AM" },
    { sender: "support", name: "Sarah M.", message: "Hello! I can see the issue. Your staging environment SSL needs to be provisioned separately. Let me check your configuration now.", timestamp: "Mar 24, 2026 at 10:45 AM" },
    { sender: "support", name: "Sarah M.", message: "I've initiated an SSL certificate renewal for your staging subdomain. It should propagate within 15 minutes. Please let me know if it resolves!", timestamp: "Mar 24, 2026 at 10:52 AM" },
  ],
  "TKT-1040": [
    { sender: "user", name: "You", message: "My WordPress update got stuck at 50% and now the site shows 'Briefly unavailable for scheduled maintenance'. Please help!", timestamp: "Mar 23, 2026 at 2:15 PM" },
    { sender: "support", name: "Alex K.", message: "I understand this is urgent. I'm accessing your server now to check the state of the update. Please don't attempt any further actions on the site.", timestamp: "Mar 23, 2026 at 2:22 PM" },
    { sender: "support", name: "Alex K.", message: "I've removed the maintenance file and rolled back the partial update. Your site is back online. I'm now investigating why the update failed - it appears to be a plugin compatibility issue with WP 6.5.", timestamp: "Mar 23, 2026 at 2:45 PM" },
  ],
};

const FAQ_ITEMS = [
  { q: "How do I migrate my existing WordPress site to LimeWP?", a: "We offer free migration for all new accounts. Simply submit a migration request from your dashboard with your current host details, and our team will handle everything within 24 hours with zero downtime." },
  { q: "What happens if I exceed my bandwidth or storage limits?", a: "We'll notify you when you reach 80% of your limits. If you exceed them, your site stays online but you'll need to upgrade your plan or purchase additional resources. We never take sites offline for overages." },
  { q: "How do automatic backups work?", a: "We perform daily incremental backups retained for 30 days. Business and Enterprise plans include real-time backups triggered by every change. You can restore any backup with one click from your dashboard." },
  { q: "Can I install custom plugins and themes?", a: "Yes! You have full access to install any WordPress plugin or theme. We only restrict known malicious or heavily resource-intensive plugins. Our team can review any plugin compatibility on request." },
  { q: "What is your uptime guarantee?", a: "We guarantee 99.99% uptime backed by our SLA. In the rare event of downtime exceeding this, we provide service credits automatically. Our infrastructure spans multiple data centers for redundancy." },
  { q: "How do I set up a staging environment?", a: "Business and Enterprise plans include staging environments. Go to your site dashboard, click 'Staging' in the sidebar, and create a clone with one click. Push changes to production when ready." },
  { q: "Do you support WP-CLI and SSH access?", a: "Yes, SSH access and WP-CLI are available on all plans. You can find your SSH credentials in the site dashboard under 'Access Details'. SFTP is also available for file management." },
  { q: "What security measures are in place?", a: "We provide free SSL certificates, a Web Application Firewall (WAF), malware scanning, DDoS protection, and automatic security patching. Enterprise plans include advanced threat detection and IP whitelisting." },
];

const TICKETS_PER_PAGE = 5;

/* ────────────────────────── Helpers ────────────────────────── */

function getStatusStyle(status: TicketStatus, isLight: boolean) {
  switch (status) {
    case "Open": return {
      dot: "bg-sky-500", text: isLight ? "text-sky-700" : "text-sky-400",
      bg: isLight ? "bg-sky-50" : "bg-sky-900/20", ring: isLight ? "ring-sky-200" : "ring-sky-700",
    };
    case "In Progress": return {
      dot: "bg-amber-500", text: isLight ? "text-amber-700" : "text-amber-400",
      bg: isLight ? "bg-amber-50" : "bg-amber-900/20", ring: isLight ? "ring-amber-200" : "ring-amber-700",
    };
    case "Resolved": return {
      dot: "bg-emerald-500", text: isLight ? "text-emerald-700" : "text-emerald-400",
      bg: isLight ? "bg-emerald-50" : "bg-emerald-900/20", ring: isLight ? "ring-emerald-200" : "ring-emerald-700",
    };
    case "Closed": return {
      dot: isLight ? "bg-slate-400" : "bg-slate-500", text: isLight ? "text-slate-600" : "text-slate-400",
      bg: isLight ? "bg-slate-100" : "bg-slate-800", ring: isLight ? "ring-slate-200" : "ring-slate-700",
    };
  }
}

function getPriorityStyle(priority: TicketPriority, isLight: boolean) {
  switch (priority) {
    case "Low": return {
      text: isLight ? "text-slate-600" : "text-slate-400",
      bg: isLight ? "bg-slate-100" : "bg-slate-800", ring: isLight ? "ring-slate-200" : "ring-slate-700",
    };
    case "Medium": return {
      text: isLight ? "text-sky-700" : "text-sky-400",
      bg: isLight ? "bg-sky-50" : "bg-sky-900/20", ring: isLight ? "ring-sky-200" : "ring-sky-700",
    };
    case "High": return {
      text: isLight ? "text-amber-700" : "text-amber-400",
      bg: isLight ? "bg-amber-50" : "bg-amber-900/20", ring: isLight ? "ring-amber-200" : "ring-amber-700",
    };
    case "Urgent": return {
      text: isLight ? "text-rose-700" : "text-rose-400",
      bg: isLight ? "bg-rose-50" : "bg-rose-900/20", ring: isLight ? "ring-rose-200" : "ring-rose-700",
    };
  }
}

/* ────────────────────────── Component ────────────────────────── */

export default function SupportPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // ── State ──
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TicketStatus>("All");
  const [page, setPage] = useState(1);

  // New Ticket modal
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<TicketCategory>("Technical");
  const [newPriority, setNewPriority] = useState<TicketPriority>("Medium");
  const [newDescription, setNewDescription] = useState("");
  const [newAttachment, setNewAttachment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Ticket detail modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [conversations, setConversations] = useState<Record<string, ConversationMessage[]>>(MOCK_CONVERSATIONS);

  // Close ticket confirm
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);

  // FAQ accordion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // ── Filtering & Pagination ──
  const filteredTickets = useMemo(() => {
    let result = tickets;
    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (searchFilter) {
      const lower = searchFilter.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(lower) ||
          t.subject.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [tickets, searchFilter, statusFilter]);

  const totalPages = Math.max(Math.ceil(filteredTickets.length / TICKETS_PER_PAGE), 1);
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * TICKETS_PER_PAGE,
    page * TICKETS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [searchFilter, statusFilter]);

  // ── Modal escape key & body scroll lock ──
  const anyModalOpen = showNewTicket || !!selectedTicket;

  useEffect(() => {
    if (!anyModalOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showCloseConfirm) { setShowCloseConfirm(false); return; }
        if (selectedTicket) { setSelectedTicket(null); setReplyText(""); return; }
        if (showNewTicket) { setShowNewTicket(false); return; }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [anyModalOpen, showCloseConfirm, selectedTicket, showNewTicket]);

  // ── Handlers ──
  const handleSubmitTicket = useCallback(() => {
    if (!newSubject.trim() || !newDescription.trim()) {
      showToast.error("Please fill in subject and description");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TKT-${1043 + tickets.length - INITIAL_TICKETS.length}`,
        subject: newSubject.trim(),
        status: "Open",
        priority: newPriority,
        category: newCategory,
        updated: "Just now",
        created: "Mar 24, 2026",
        description: newDescription.trim(),
      };
      setTickets((prev) => [newTicket, ...prev]);
      setShowNewTicket(false);
      setNewSubject("");
      setNewCategory("Technical");
      setNewPriority("Medium");
      setNewDescription("");
      setNewAttachment(null);
      setSubmitting(false);
      showToast.success("Ticket submitted successfully!");
    }, 1200);
  }, [newSubject, newDescription, newPriority, newCategory, tickets.length]);

  const handleSendReply = useCallback(() => {
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);
    setTimeout(() => {
      const newMsg: ConversationMessage = {
        sender: "user",
        name: "You",
        message: replyText.trim(),
        timestamp: "Mar 24, 2026 at " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      };
      setConversations((prev) => ({
        ...prev,
        [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newMsg],
      }));
      setReplyText("");
      setReplying(false);
      showToast.success("Reply sent!");
    }, 800);
  }, [replyText, selectedTicket]);

  const handleCloseTicket = useCallback(() => {
    if (!selectedTicket) return;
    setClosingTicket(true);
    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) => t.id === selectedTicket.id ? { ...t, status: "Closed" as TicketStatus, updated: "Just now" } : t)
      );
      setSelectedTicket(null);
      setShowCloseConfirm(false);
      setClosingTicket(false);
      setReplyText("");
      showToast.success("Ticket closed successfully");
    }, 800);
  }, [selectedTicket]);

  const handleStartChat = useCallback(() => {
    showToast.info("Connecting to support agent...");
  }, []);

  // ── Style classes ──
  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const textareaClass = `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none resize-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400 placeholder:text-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)] placeholder:text-slate-500"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;
  const modalCardWideClass = `relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  // ── Stats ──
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const resolvedThisMonth = tickets.filter((t) => t.status === "Resolved").length;

  const statItems = [
    { label: "Open Tickets", value: String(openCount), color: "sky", icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" },
    { label: "Avg Response Time", value: "2 hours", color: "emerald", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Satisfaction Rate", value: "98%", color: "violet", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
    { label: "Resolved This Month", value: String(resolvedThisMonth), color: "amber", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const STATUS_FILTERS: ("All" | TicketStatus)[] = ["All", "Open", "In Progress", "Resolved", "Closed"];
  const CATEGORIES: TicketCategory[] = ["Billing", "Technical", "Account", "Other"];
  const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Support Center
          </h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
            Get help from our team or browse documentation
          </p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className={`group relative h-10 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] hover:-translate-y-px flex items-center gap-2 ${accent.button} ${accent.buttonHover} text-white shadow-lg ${accent.buttonShadow}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((stat) => {
          const c = getColorClasses(stat.color);
          return (
            <div key={stat.label} className={`${cardClass} p-4 hover:-translate-y-px hover:shadow-lg transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ${c.text} ring-1 ${c.ring}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</p>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Live Chat */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-px ${
          isLight
            ? "bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-emerald-100/50"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-emerald-800 hover:shadow-emerald-900/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-emerald-900/30 text-emerald-400 ring-1 ring-emerald-700"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"}`}>Live Chat</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>Chat with our support team in real-time</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className={`text-sm font-medium ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>Online Now</span>
            </div>
            <button
              onClick={handleStartChat}
              className="w-full mt-5 h-10 rounded-xl text-sm font-semibold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* Email Support */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-px ${
          isLight
            ? "bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sky-100/50"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-sky-800 hover:shadow-sky-900/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : "bg-sky-900/30 text-sky-400 ring-1 ring-sky-700"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"}`}>Email Support</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>Send us an email and we&apos;ll respond quickly</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${isLight ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : "bg-sky-900/20 text-sky-400 ring-1 ring-sky-700"}`}>Avg. 2h Response</span>
            </div>
            <p className={`text-sm font-medium mt-2 ${isLight ? "text-sky-600" : "text-sky-400"}`}>support@limewp.com</p>
            <button
              onClick={() => showToast.info("Opening email client...")}
              className={`w-full mt-4 h-10 rounded-xl text-sm font-semibold transition-all border ${isLight ? "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 hover:border-sky-300" : "bg-sky-900/20 hover:bg-sky-900/30 text-sky-400 border-sky-800 hover:border-sky-700"}`}
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-px ${
          isLight
            ? "bg-white border border-slate-200 hover:border-violet-300 hover:shadow-violet-100/50"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-violet-800 hover:shadow-violet-900/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-violet-50 text-violet-600 ring-1 ring-violet-200" : "bg-violet-900/30 text-violet-400 ring-1 ring-violet-700"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"}`}>Knowledge Base</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>Browse our guides and tutorials</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${isLight ? "bg-violet-50 text-violet-600 ring-1 ring-violet-200" : "bg-violet-900/20 text-violet-400 ring-1 ring-violet-700"}`}>200+ Articles</span>
            </div>
            <button
              onClick={() => showToast.info("Opening knowledge base...")}
              className={`w-full mt-5 h-10 rounded-xl text-sm font-semibold transition-all border ${isLight ? "bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200 hover:border-violet-300" : "bg-violet-900/20 hover:bg-violet-900/30 text-violet-400 border-violet-800 hover:border-violet-700"}`}
            >
              Browse Docs
            </button>
          </div>
        </div>
      </div>

      {/* ── Tickets Section ── */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : "bg-sky-900/20 text-sky-400 ring-1 ring-sky-700"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Support Tickets</h2>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-500"}`}>Track and manage your support requests</p>
              </div>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${
              isLight ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-slate-400"
            }`}>
              {filteredTickets.length} {filteredTickets.length === 1 ? "Ticket" : "Tickets"}
            </span>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((s) => {
                const active = statusFilter === s;
                const filterStyle = s === "All" ? null : getStatusStyle(s as TicketStatus, isLight);
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 h-10 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      active
                        ? filterStyle
                          ? `${filterStyle.bg} ${filterStyle.text} ring-1 ${filterStyle.ring}`
                          : isLight ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
                        : isLight ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Ticket", "Subject", "Priority", "Status", "Updated", ""].map((col) => (
                    <th
                      key={col}
                      className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 first:rounded-l-xl last:rounded-r-xl ${
                        isLight ? "bg-slate-50 text-slate-500" : "bg-[var(--bg-elevated)]/50 text-slate-500"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className={`w-12 h-12 rounded-xl text-slate-500 flex items-center justify-center mx-auto mb-3 ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-sm">No tickets found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((ticket) => {
                    const ss = getStatusStyle(ticket.status, isLight);
                    const ps = getPriorityStyle(ticket.priority, isLight);
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer transition-colors ${
                          isLight
                            ? "border-b border-slate-100 hover:bg-slate-50"
                            : "border-b border-[var(--border-secondary)] hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span className={`font-mono font-medium text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{ticket.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{ticket.subject}</span>
                          <span className={`block text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{ticket.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ${ps.bg} ${ps.text} ${ps.ring}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ${ss.bg} ${ss.text} ${ss.ring}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-500"}`}>{ticket.updated}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    p === page
                      ? isLight ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900"
                      : isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── FAQ Section ── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`${cardClass} p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-violet-50 text-violet-600 ring-1 ring-violet-200" : "bg-violet-900/20 text-violet-400 ring-1 ring-violet-700"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Frequently Asked Questions</h2>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-500"}`}>Quick answers to common questions</p>
              </div>
            </div>

            <div className="space-y-2">
              {FAQ_ITEMS.map((faq, i) => {
                const isExpanded = expandedFaq === i;
                const colors = ["sky", "emerald", "violet", "amber", "rose", "pink", "cyan", "indigo"];
                const c = getColorClasses(colors[i % colors.length]);
                return (
                  <div key={i} className={`rounded-xl border transition-all ${
                    isExpanded
                      ? isLight ? "border-slate-300 bg-slate-50/50" : "border-[var(--border-secondary)] bg-white/[0.02]"
                      : isLight ? "border-slate-100 hover:border-slate-200" : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                  }`}>
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : i)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${c.bg} ${c.text}`}>
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{faq.q}</span>
                      <svg
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-48" : "max-h-0"}`}
                    >
                      <p className={`px-4 pb-4 pl-14 text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="space-y-6">
          <div className={`${cardClass} p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-emerald-900/20 text-emerald-400 ring-1 ring-emerald-700"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Contact Us</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-sky-50 text-sky-600" : "bg-sky-900/20 text-sky-400"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Phone</p>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>+1 (888) 546-3977</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-amber-50 text-amber-600" : "bg-amber-900/20 text-amber-400"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Email</p>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>support@limewp.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-900/20 text-emerald-400"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Hours</p>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>24/7 for Enterprise</p>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Mon-Fri 9am-8pm ET for others</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={`my-5 border-t ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"}`} />

            {/* Social Links */}
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-500" : "text-slate-500"}`}>Community</p>
            <div className="flex gap-2">
              <button
                onClick={() => showToast.info("Opening Twitter...")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${isLight ? "bg-sky-50 text-sky-600 hover:bg-sky-100 ring-1 ring-sky-200" : "bg-sky-900/20 text-sky-400 hover:bg-sky-900/30 ring-1 ring-sky-800"}`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={() => showToast.info("Opening Discord...")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${isLight ? "bg-violet-50 text-violet-600 hover:bg-violet-100 ring-1 ring-violet-200" : "bg-violet-900/20 text-violet-400 hover:bg-violet-900/30 ring-1 ring-violet-800"}`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className={`${cardClass} p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-emerald-900/20 text-emerald-400 ring-1 ring-emerald-700"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>System Status</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className={`text-xs font-medium ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>All systems operational</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Web Servers", status: "Operational" },
                { name: "Database Cluster", status: "Operational" },
                { name: "CDN Network", status: "Operational" },
                { name: "Email Service", status: "Operational" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{s.name}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ NEW TICKET MODAL ═══════════════════════ */}
      {showNewTicket && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowNewTicket(false)} />
          <div className={`${modalCardClass} animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 px-6 pt-6 pb-4 border-b ${isLight ? "bg-white border-slate-100" : "bg-[var(--bg-primary)] border-[var(--border-primary)]"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg} ${accent.text}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>New Support Ticket</h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Describe your issue and we&apos;ll help you out</p>
                  </div>
                </div>
                <button onClick={() => setShowNewTicket(false)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Subject */}
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-slate-700" : "text-slate-300"}`}>Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-slate-700" : "text-slate-300"}`}>Category</label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => {
                    const active = newCategory === cat;
                    const catColors: Record<TicketCategory, string> = {
                      Billing: "amber",
                      Technical: "sky",
                      Account: "violet",
                      Other: "zinc",
                    };
                    const c = getColorClasses(catColors[cat]);
                    return (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? `${c.bg} ${c.text} ring-1 ${c.ring}`
                            : isLight ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-slate-700" : "text-slate-300"}`}>Priority</label>
                <div className="flex gap-2 flex-wrap">
                  {PRIORITIES.map((pri) => {
                    const active = newPriority === pri;
                    const ps = getPriorityStyle(pri, isLight);
                    return (
                      <button
                        key={pri}
                        onClick={() => setNewPriority(pri)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? `${ps.bg} ${ps.text} ring-1 ${ps.ring}`
                            : isLight ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        {pri}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-slate-700" : "text-slate-300"}`}>Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide details about your issue..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={textareaClass}
                />
              </div>

              {/* Attachment Dropzone */}
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-slate-700" : "text-slate-300"}`}>Attachments</label>
                <div
                  onClick={() => {
                    setNewAttachment("screenshot.png");
                    showToast.success("File attached: screenshot.png");
                  }}
                  className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                    newAttachment
                      ? isLight ? "border-emerald-300 bg-emerald-50/50" : "border-emerald-700 bg-emerald-900/10"
                      : isLight ? "border-slate-200 hover:border-slate-300 bg-slate-50" : "border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-[var(--bg-elevated)]/30"
                  }`}
                >
                  {newAttachment ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className={`w-5 h-5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`text-sm font-medium ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>{newAttachment}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setNewAttachment(null); }}
                        className={`ml-2 text-xs ${isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className={`w-8 h-8 mx-auto mb-2 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>Drop files here or click to browse</p>
                      <p className={`text-xs mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>PNG, JPG, PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"}`}>
              <button
                onClick={() => setShowNewTicket(false)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                disabled={submitting}
                className={`h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} shadow-lg ${accent.buttonShadow}`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════ TICKET DETAIL MODAL ═══════════════════════ */}
      {selectedTicket && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { setSelectedTicket(null); setReplyText(""); }} />
          <div className={`${modalCardWideClass} animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col`}>
            {/* Header */}
            <div className={`flex-shrink-0 px-6 pt-6 pb-4 border-b ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`font-mono text-sm font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>{selectedTicket.id}</span>
                    {(() => {
                      const ss = getStatusStyle(selectedTicket.status, isLight);
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ${ss.bg} ${ss.text} ${ss.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {selectedTicket.status}
                        </span>
                      );
                    })()}
                    {(() => {
                      const ps = getPriorityStyle(selectedTicket.priority, isLight);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ${ps.bg} ${ps.text} ${ps.ring}`}>
                          {selectedTicket.priority}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{selectedTicket.subject}</h3>
                  <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                    Created {selectedTicket.created} &middot; {selectedTicket.category}
                  </p>
                </div>
                <button onClick={() => { setSelectedTicket(null); setReplyText(""); }} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-4 ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Description */}
              <div className={`rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-100" : "bg-[var(--bg-elevated)]/50 border border-[var(--border-primary)]"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Description</p>
                <p className={`text-sm leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>{selectedTicket.description}</p>
              </div>

              {/* Conversation Thread */}
              {(conversations[selectedTicket.id] || []).length > 0 && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Conversation</p>
                  <div className="space-y-3">
                    {(conversations[selectedTicket.id] || []).map((msg, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-4 ${
                          msg.sender === "user"
                            ? isLight ? "bg-sky-50/60 border border-sky-100 ml-6" : "bg-sky-900/10 border border-sky-900/30 ml-6"
                            : isLight ? "bg-white border border-slate-200 mr-6" : "bg-[var(--bg-elevated)]/30 border border-[var(--border-primary)] mr-6"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              msg.sender === "user"
                                ? isLight ? "bg-sky-100 text-sky-600" : "bg-sky-900/30 text-sky-400"
                                : isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-900/30 text-emerald-400"
                            }`}>
                              {msg.name.charAt(0)}
                            </div>
                            <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{msg.name}</span>
                            {msg.sender === "support" && (
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-900/20 text-emerald-400"}`}>Staff</span>
                            )}
                          </div>
                          <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>{msg.timestamp}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply box */}
              {selectedTicket.status !== "Closed" && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Reply</p>
                  <textarea
                    rows={3}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={textareaClass}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 px-6 py-4 border-t flex items-center justify-between ${isLight ? "border-slate-100" : "border-[var(--border-primary)]"}`}>
              <div>
                {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                  <button
                    onClick={() => setShowCloseConfirm(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-semibold transition-colors ${
                      isLight ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600" : "bg-[var(--bg-elevated)] text-slate-400 hover:bg-red-900/20 hover:text-red-400"
                    }`}
                  >
                    Close Ticket
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedTicket(null); setReplyText(""); }}
                  className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                    isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Close
                </button>
                {selectedTicket.status !== "Closed" && (
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || replying}
                    className={`h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover} shadow-lg ${accent.buttonShadow}`}
                  >
                    {replying ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        Send Reply
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Close Ticket ConfirmDialog */}
          <ConfirmDialog
            open={showCloseConfirm}
            onClose={() => setShowCloseConfirm(false)}
            onConfirm={handleCloseTicket}
            title="Close Ticket"
            message={`Are you sure you want to close ticket ${selectedTicket.id}? You can reopen it later by contacting support.`}
            confirmText="Close Ticket"
            cancelText="Keep Open"
            variant="warning"
            isLoading={closingTicket}
          />
        </div>
      )}
    </AppShell>
  );
}
