"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Toggle } from "../components/ui/Toggle";
import Link from "next/link";

/* ──────────────────────────── Data ──────────────────────────── */

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: string;
  proxy: boolean;
  modified: string;
  priority?: number;
}

const dnsRecordsData: DnsRecord[] = [
  { id: "r1", type: "A", name: "@", content: "185.199.108.153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { id: "r2", type: "CNAME", name: "www", content: "limewp.com", ttl: "3600", proxy: true, modified: "1 day ago" },
  { id: "r3", type: "MX", name: "@", content: "mail.limewp.com", ttl: "3600", proxy: false, modified: "3 days ago", priority: 10 },
  { id: "r4", type: "TXT", name: "@", content: "v=spf1 include:_spf.google.com ~all", ttl: "3600", proxy: false, modified: "1 week ago" },
  { id: "r5", type: "AAAA", name: "@", content: "2606:50c0:8000::153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { id: "r6", type: "A", name: "api", content: "185.199.109.153", ttl: "3600", proxy: true, modified: "5 days ago" },
  { id: "r7", type: "CNAME", name: "mail", content: "ghs.google.com", ttl: "3600", proxy: false, modified: "2 weeks ago" },
  { id: "r8", type: "TXT", name: "_dmarc", content: "v=DMARC1; p=quarantine; rua=mailto:dmarc@limewp.com", ttl: "3600", proxy: false, modified: "1 week ago" },
  { id: "r9", type: "NS", name: "@", content: "ns1.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
  { id: "r10", type: "NS", name: "@", content: "ns2.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
];

const domains = [
  { name: "limewp.com", records: 10, status: "Active", ssl: "Active", nameservers: "LimeWP" },
  { name: "supernova.guru", records: 4, status: "Active", ssl: "Pending", nameservers: "LimeWP" },
];

const propagationServers = [
  { location: "US East", flag: "\u{1F1FA}\u{1F1F8}", status: "propagated", latency: "12ms" },
  { location: "US West", flag: "\u{1F1FA}\u{1F1F8}", status: "propagated", latency: "18ms" },
  { location: "Europe", flag: "\u{1F1EA}\u{1F1FA}", status: "propagated", latency: "45ms" },
  { location: "Asia", flag: "\u{1F1EF}\u{1F1F5}", status: "propagated", latency: "89ms" },
];

const RECORD_TYPES = [
  { value: "A", label: "A Record", color: "emerald", desc: "Maps domain to IPv4 address" },
  { value: "CNAME", label: "CNAME", color: "sky", desc: "Alias to another domain" },
  { value: "MX", label: "MX Record", color: "violet", desc: "Mail server routing" },
  { value: "TXT", label: "TXT Record", color: "amber", desc: "Text verification data" },
  { value: "AAAA", label: "AAAA Record", color: "rose", desc: "Maps domain to IPv6 address" },
  { value: "NS", label: "NS Record", color: "slate", desc: "Nameserver delegation" },
];

const TTL_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "60", label: "1 min" },
  { value: "300", label: "5 min" },
  { value: "3600", label: "1 hour" },
  { value: "86400", label: "1 day" },
];

const QUICK_TEMPLATES = [
  { name: "Google Workspace", icon: "G", color: "bg-blue-500", records: 3 },
  { name: "Microsoft 365", icon: "M", color: "bg-sky-600", records: 4 },
  { name: "Zoho Mail", icon: "Z", color: "bg-red-500", records: 2 },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  A: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  CNAME: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  MX: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  TXT: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  AAAA: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20" },
  NS: { bg: "bg-slate-500/10", text: "text-slate-400", ring: "ring-slate-500/20" },
};

const TYPE_PILL_COLORS: Record<string, { active: string; inactive: string }> = {
  A: { active: "bg-emerald-500 text-white", inactive: "text-emerald-400" },
  CNAME: { active: "bg-sky-500 text-white", inactive: "text-sky-400" },
  MX: { active: "bg-violet-500 text-white", inactive: "text-violet-400" },
  TXT: { active: "bg-amber-500 text-white", inactive: "text-amber-400" },
  AAAA: { active: "bg-rose-500 text-white", inactive: "text-rose-400" },
  NS: { active: "bg-slate-500 text-white", inactive: "text-slate-400" },
};

function formatTTL(ttl: string) {
  if (ttl === "auto") return "Auto";
  const n = parseInt(ttl);
  if (n >= 86400) return `${n / 86400}d`;
  if (n >= 3600) return `${n / 3600}h`;
  if (n >= 60) return `${n / 60}m`;
  return `${n}s`;
}

function getPlaceholderForType(type: string): string {
  switch (type) {
    case "A": return "192.0.2.1";
    case "AAAA": return "2001:db8::1";
    case "CNAME": return "example.com";
    case "MX": return "mail.example.com";
    case "TXT": return "v=spf1 include:...";
    case "NS": return "ns1.example.com";
    default: return "Value";
  }
}

/* ──────────────────────────── Component ──────────────────────────── */

export default function DnsManagementPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Core state
  const [records, setRecords] = useState<DnsRecord[]>(dnsRecordsData);
  const [selectedDomain, setSelectedDomain] = useState("limewp.com");
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Modals & targets
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<DnsRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DnsRecord | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPropagationModal, setShowPropagationModal] = useState(false);
  const [propagationTest, setPropagationTest] = useState("");

  // Feature toggles
  const [dnssecEnabled, setDnssecEnabled] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // Domain selector dropdown
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);

  // Templates section
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [templateConfirm, setTemplateConfirm] = useState<typeof QUICK_TEMPLATES[number] | null>(null);

  // Propagation check
  const [propagationChecking, setPropagationChecking] = useState(false);

  // Import zone
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<string>("");
  const [importLoading, setImportLoading] = useState(false);

  // Form state
  const [formType, setFormType] = useState("A");
  const [formName, setFormName] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTTL, setFormTTL] = useState("3600");
  const [formProxy, setFormProxy] = useState(false);
  const [formPriority, setFormPriority] = useState("10");

  // Derived
  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (typeFilter !== "All") {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [records, searchFilter, typeFilter]);

  const recordTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [records]);

  const aRecordCount = recordTypeCounts["A"] || 0;

  const allFilteredSelected = filteredRecords.length > 0 && filteredRecords.every((r) => selectedRecords.has(r.id));

  // Reset form
  const resetForm = useCallback(() => {
    setFormType("A");
    setFormName("");
    setFormContent("");
    setFormTTL("3600");
    setFormProxy(false);
    setFormPriority("10");
  }, []);

  // Open add modal
  const openAddModal = useCallback(() => {
    resetForm();
    setShowAddModal(true);
  }, [resetForm]);

  // Open edit modal
  const openEditModal = useCallback((record: DnsRecord) => {
    setFormType(record.type);
    setFormName(record.name);
    setFormContent(record.content);
    setFormTTL(record.ttl);
    setFormProxy(record.proxy);
    setFormPriority(record.priority?.toString() || "10");
    setEditTarget(record);
  }, []);

  // Save record (add or edit)
  const handleSaveRecord = useCallback(() => {
    if (!formName.trim() || !formContent.trim()) {
      showToast.error("Name and content are required");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      if (editTarget) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === editTarget.id
              ? {
                  ...r,
                  type: formType,
                  name: formName.trim(),
                  content: formContent.trim(),
                  ttl: formTTL,
                  proxy: formProxy,
                  priority: formType === "MX" ? parseInt(formPriority) : undefined,
                  modified: "Just now",
                }
              : r
          )
        );
        showToast.success(`${formType} record updated successfully`);
        setEditTarget(null);
      } else {
        const newRecord: DnsRecord = {
          id: `r${Date.now()}`,
          type: formType,
          name: formName.trim(),
          content: formContent.trim(),
          ttl: formTTL,
          proxy: formProxy,
          modified: "Just now",
          priority: formType === "MX" ? parseInt(formPriority) : undefined,
        };
        setRecords((prev) => [...prev, newRecord]);
        showToast.success(`${formType} record added successfully`);
        setShowAddModal(false);
      }
      resetForm();
      setActionLoading(false);
    }, 600);
  }, [editTarget, formType, formName, formContent, formTTL, formProxy, formPriority, resetForm]);

  // Delete record
  const handleDeleteRecord = useCallback(() => {
    if (!deleteTarget) return;
    setActionLoading(true);
    setTimeout(() => {
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setSelectedRecords((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      showToast.success(`${deleteTarget.type} record for "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      setActionLoading(false);
    }, 500);
  }, [deleteTarget]);

  // Bulk delete
  const handleBulkDelete = useCallback(() => {
    setActionLoading(true);
    setTimeout(() => {
      setRecords((prev) => prev.filter((r) => !selectedRecords.has(r.id)));
      showToast.success(`${selectedRecords.size} records deleted`);
      setSelectedRecords(new Set());
      setActionLoading(false);
    }, 500);
  }, [selectedRecords]);

  // Toggle select
  const toggleSelect = useCallback((id: string) => {
    setSelectedRecords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Select all filtered
  const toggleSelectAll = useCallback(() => {
    if (allFilteredSelected) {
      setSelectedRecords((prev) => {
        const next = new Set(prev);
        filteredRecords.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedRecords((prev) => {
        const next = new Set(prev);
        filteredRecords.forEach((r) => next.add(r.id));
        return next;
      });
    }
  }, [allFilteredSelected, filteredRecords]);

  // Toggle proxy on a record
  const toggleRecordProxy = useCallback((id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, proxy: !r.proxy, modified: "Just now" } : r))
    );
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("Copied to clipboard");
  }, []);

  // Add template records
  const handleAddTemplate = useCallback(() => {
    if (!templateConfirm) return;
    setActionLoading(true);
    setTimeout(() => {
      const templateRecords: DnsRecord[] = [];
      if (templateConfirm.name === "Google Workspace") {
        templateRecords.push(
          { id: `t${Date.now()}-1`, type: "MX", name: "@", content: "aspmx.l.google.com", ttl: "3600", proxy: false, modified: "Just now", priority: 1 },
          { id: `t${Date.now()}-2`, type: "MX", name: "@", content: "alt1.aspmx.l.google.com", ttl: "3600", proxy: false, modified: "Just now", priority: 5 },
          { id: `t${Date.now()}-3`, type: "TXT", name: "@", content: "v=spf1 include:_spf.google.com ~all", ttl: "3600", proxy: false, modified: "Just now" }
        );
      } else if (templateConfirm.name === "Microsoft 365") {
        templateRecords.push(
          { id: `t${Date.now()}-1`, type: "MX", name: "@", content: "limewp-com.mail.protection.outlook.com", ttl: "3600", proxy: false, modified: "Just now", priority: 0 },
          { id: `t${Date.now()}-2`, type: "TXT", name: "@", content: "v=spf1 include:spf.protection.outlook.com -all", ttl: "3600", proxy: false, modified: "Just now" },
          { id: `t${Date.now()}-3`, type: "CNAME", name: "autodiscover", content: "autodiscover.outlook.com", ttl: "3600", proxy: false, modified: "Just now" },
          { id: `t${Date.now()}-4`, type: "CNAME", name: "lyncdiscover", content: "webdir.online.lync.com", ttl: "3600", proxy: false, modified: "Just now" }
        );
      } else {
        templateRecords.push(
          { id: `t${Date.now()}-1`, type: "MX", name: "@", content: "mx.zoho.com", ttl: "3600", proxy: false, modified: "Just now", priority: 10 },
          { id: `t${Date.now()}-2`, type: "MX", name: "@", content: "mx2.zoho.com", ttl: "3600", proxy: false, modified: "Just now", priority: 20 }
        );
      }
      setRecords((prev) => [...prev, ...templateRecords]);
      showToast.success(`${templateConfirm.name} records added (${templateRecords.length} records)`);
      setTemplateConfirm(null);
      setActionLoading(false);
    }, 600);
  }, [templateConfirm]);

  // Propagation check
  const handleCheckPropagation = useCallback(() => {
    setPropagationChecking(true);
    setTimeout(() => {
      setPropagationChecking(false);
      showToast.success("All servers propagated successfully");
    }, 2000);
  }, []);

  // Import zone file
  const handleImportZone = useCallback(() => {
    if (!importFile) return;
    setImportLoading(true);
    setTimeout(() => {
      const importedRecords: DnsRecord[] = [
        { id: `imp${Date.now()}-1`, type: "A", name: "shop", content: "185.199.110.153", ttl: "3600", proxy: true, modified: "Just now" },
        { id: `imp${Date.now()}-2`, type: "CNAME", name: "blog", content: "limewp.com", ttl: "3600", proxy: true, modified: "Just now" },
        { id: `imp${Date.now()}-3`, type: "MX", name: "@", content: "mail2.limewp.com", ttl: "3600", proxy: false, modified: "Just now", priority: 20 },
      ];
      setRecords((prev) => [...prev, ...importedRecords]);
      showToast.success(`Imported ${importedRecords.length} records from zone file`);
      setShowImportModal(false);
      setImportFile("");
      setImportLoading(false);
    }, 1200);
  }, [importFile]);

  // Close modals on Escape + body scroll lock
  useEffect(() => {
    const isModalOpen = showAddModal || editTarget !== null || showPropagationModal || showImportModal;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddModal, editTarget, showPropagationModal, showImportModal]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showImportModal) setShowImportModal(false);
        if (showAddModal) setShowAddModal(false);
        if (editTarget) setEditTarget(null);
        if (showPropagationModal) setShowPropagationModal(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showAddModal, editTarget, showPropagationModal]);

  /* ──────────────── Style classes ──────────────── */

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
  }`;

  /* ──────────────── Record modal (shared Add/Edit) ──────────────── */

  const isModalOpen = showAddModal || editTarget !== null;
  const modalTitle = editTarget ? "Edit DNS Record" : "Add DNS Record";
  const modalTitleId = editTarget ? "edit-record-title" : "add-record-title";

  const renderRecordModal = () => {
    if (!isModalOpen) return null;

    const showProxy = formType === "A" || formType === "AAAA" || formType === "CNAME";

    return (
      <div className={modalOverlayClass}>
        <div
          className={modalBackdropClass}
          onClick={() => {
            if (!actionLoading) {
              setShowAddModal(false);
              setEditTarget(null);
            }
          }}
          aria-hidden="true"
        />
        <div
          className={modalCardClass}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
        >
          {/* Modal header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <h2 id={modalTitleId} className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {modalTitle}
            </h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditTarget(null);
              }}
              aria-label="Close modal"
              className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Record type cards */}
            <div>
              <label className={labelClass}>Record Type</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {RECORD_TYPES.map((rt) => {
                  const tc = TYPE_COLORS[rt.value];
                  const selected = formType === rt.value;
                  return (
                    <button
                      key={rt.value}
                      onClick={() => setFormType(rt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all hover:-translate-y-px ${
                        selected
                          ? `${tc.ring} ring-2 ${isLight ? "border-slate-300 bg-slate-50" : "border-[var(--border-primary)] bg-[var(--bg-elevated)]"}`
                          : `border-transparent ${isLight ? "bg-slate-50 hover:bg-slate-100" : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)]"}`
                      }`}
                    >
                      <span className={`text-sm font-bold font-mono ${tc.text}`}>{rt.value}</span>
                      <p className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{rt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="dns-name" className={labelClass}>Name</label>
              <input
                id="dns-name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="@ or subdomain"
                className={`${inputClass} font-mono mt-1.5`}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="dns-content" className={labelClass}>Content</label>
              <input
                id="dns-content"
                type="text"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder={getPlaceholderForType(formType)}
                className={`${inputClass} font-mono mt-1.5`}
              />
            </div>

            {/* Priority (MX only) */}
            {formType === "MX" && (
              <div>
                <label htmlFor="dns-priority" className={labelClass}>Priority</label>
                <input
                  id="dns-priority"
                  type="number"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  placeholder="10"
                  className={`${inputClass} mt-1.5`}
                />
              </div>
            )}

            {/* TTL */}
            <div>
              <label className={labelClass}>TTL</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {TTL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormTTL(opt.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      formTTL === opt.value
                        ? `text-white ${accent.button}`
                        : isLight
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-[var(--bg-elevated)] text-slate-400 hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Proxy toggle */}
            {showProxy && (
              <div className="flex items-center justify-between">
                <div>
                  <label className={labelClass}>Proxy through LimeWP</label>
                  <p className={`text-[11px] mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>Hide origin IP and enable CDN</p>
                </div>
                <Toggle enabled={formProxy} onChange={setFormProxy} />
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditTarget(null);
              }}
              disabled={actionLoading}
              className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRecord}
              disabled={actionLoading}
              className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all text-white flex items-center gap-2 disabled:opacity-50 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              {actionLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : editTarget ? (
                "Update Record"
              ) : (
                "Add Record"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ──────────────── Propagation Modal ──────────────── */

  const renderPropagationModal = () => {
    if (!showPropagationModal) return null;

    return (
      <div className={modalOverlayClass}>
        <div className={modalBackdropClass} onClick={() => setShowPropagationModal(false)} aria-hidden="true" />
        <div
          className={modalCardClass}
          role="dialog"
          aria-modal="true"
          aria-labelledby="propagation-modal-title"
        >
          <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <h2 id="propagation-modal-title" className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              DNS Propagation Check
            </h2>
            <button
              onClick={() => setShowPropagationModal(false)}
              aria-label="Close propagation modal"
              className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label htmlFor="propagation-record" className={labelClass}>Record to check</label>
              <input
                id="propagation-record"
                type="text"
                value={propagationTest}
                onChange={(e) => setPropagationTest(e.target.value)}
                placeholder="e.g. limewp.com"
                className={`${inputClass} mt-1.5`}
              />
            </div>

            <div className="space-y-2.5">
              {propagationServers.map((server, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{server.flag}</span>
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{server.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>{server.latency}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${propagationChecking ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <button
              onClick={() => setShowPropagationModal(false)}
              className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}
            >
              Close
            </button>
            <button
              onClick={handleCheckPropagation}
              disabled={propagationChecking}
              className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all text-white flex items-center gap-2 disabled:opacity-50 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              {propagationChecking ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Checking...
                </>
              ) : (
                "Check Propagation"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ──────────────── Main Render ──────────────── */

  return (
    <AppShell>
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>DNS Management</h1>
          <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-500"}`}>
            Configure DNS records, monitor propagation, and manage zones for your domains.
          </p>
        </div>

        {/* Domain selector */}
        <div className="relative">
          <button
            onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
              isLight ? "bg-white border border-slate-200 hover:border-slate-300" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
              <svg className={`w-4 h-4 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8" />
              </svg>
            </div>
            <div className="text-left">
              <div className={`text-[10px] uppercase tracking-wider font-medium ${isLight ? "text-slate-400" : "text-slate-500"}`}>Domain</div>
              <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{selectedDomain}</div>
            </div>
            <svg className={`w-4 h-4 ml-1 transition-transform ${domainDropdownOpen ? "rotate-180" : ""} ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {domainDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDomainDropdownOpen(false)} aria-hidden="true" />
              <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl z-40 py-1 ${
                isLight ? "bg-white border-slate-200" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
              }`}>
                {domains.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => {
                      setSelectedDomain(d.name);
                      setDomainDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      selectedDomain === d.name
                        ? isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                        : isLight ? "hover:bg-slate-50" : "hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{d.name}</span>
                    <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>{d.records} records</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 2. Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Records",
            value: records.length.toString(),
            icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
            color: "emerald",
          },
          {
            label: "A Records",
            value: aRecordCount.toString(),
            icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7",
            color: "sky",
          },
          {
            label: "Propagation",
            value: "100%",
            icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "violet",
          },
          {
            label: "DNSSEC",
            value: dnssecEnabled ? "Enabled" : "Disabled",
            icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
            color: "amber",
          },
        ].map((stat) => {
          const sc = TYPE_COLORS[stat.label === "A Records" ? "A" : stat.label === "Propagation" ? "MX" : stat.label === "DNSSEC" ? "TXT" : "A"] || TYPE_COLORS.A;
          return (
            <div key={stat.label} className={`${cardClass} p-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
                }`}>
                  <svg className={`w-5 h-5 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className={`text-[10px] uppercase tracking-wider font-medium ${isLight ? "text-slate-400" : "text-slate-500"}`}>{stat.label}</div>
                  <div className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Action bar ── */}
      <div className={`${cardClass} p-4 mb-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              id="dns-search"
              type="text"
              placeholder="Search by name, content, or type..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                isLight
                  ? "bg-slate-50 text-slate-800 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-300 border border-slate-200"
                  : "bg-[var(--bg-elevated)] text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--border-primary)] border border-[var(--border-tertiary)]"
              }`}
            />
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <button
              onClick={() => setTypeFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === "All"
                  ? `text-white ${accent.button}`
                  : isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-400 hover:bg-[var(--bg-secondary)]"
              }`}
            >
              All
              <span className="ml-1 opacity-70">{records.length}</span>
            </button>
            {RECORD_TYPES.map((rt) => {
              const count = recordTypeCounts[rt.value] || 0;
              const isActive = typeFilter === rt.value;
              const pillColor = TYPE_PILL_COLORS[rt.value];
              return (
                <button
                  key={rt.value}
                  onClick={() => setTypeFilter(rt.value === typeFilter ? "All" : rt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    isActive
                      ? pillColor.active
                      : `${isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)]"} ${pillColor.inactive}`
                  }`}
                >
                  {rt.value}
                  <span className={`ml-1 text-[10px] ${isActive ? "opacity-80" : "opacity-60"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={openAddModal}
              className={`h-9 px-4 rounded-xl text-sm font-semibold transition-all text-white flex items-center gap-2 hover:-translate-y-px ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Record
            </button>
            <button
              onClick={() => {
                setTemplatesExpanded(!templatesExpanded);
                if (!templatesExpanded) {
                  setTimeout(() => document.getElementById("templates-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
                }
              }}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-all hover:-translate-y-px flex items-center gap-2 ${
                isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              Templates
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-all hover:-translate-y-px flex items-center gap-2 ${
                isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Import
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. Bulk action bar ── */}
      {selectedRecords.size > 0 && (
        <div className={`${cardClass} p-3 mb-4 flex items-center justify-between`}>
          <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {selectedRecords.size} record{selectedRecords.size !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={actionLoading}
            className="h-8 px-4 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete Selected
          </button>
        </div>
      )}

      {/* ── 4. DNS Records Table ── */}
      <div className={`${cardClass} overflow-hidden mb-6`}>
        {/* Table header */}
        <div className={`grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wider ${
          isLight ? "bg-slate-50 text-slate-500 border-b border-slate-200" : "bg-[var(--bg-elevated)] text-slate-500 border-b border-[var(--border-tertiary)]"
        }`}>
          <div className="col-span-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={allFilteredSelected && filteredRecords.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 dark:border-slate-600 w-4 h-4 cursor-pointer accent-emerald-500"
              aria-label="Select all records"
            />
          </div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-3">Content</div>
          <div className="col-span-1">TTL</div>
          <div className="col-span-1">Proxy</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table body */}
        <div className={`divide-y ${isLight ? "divide-slate-100" : "divide-white/[0.04]"}`}>
          {filteredRecords.length === 0 ? (
            <div className={`px-5 py-16 text-center ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const tc = TYPE_COLORS[record.type] || TYPE_COLORS.A;
              const isSelected = selectedRecords.has(record.id);
              const showProxyToggle = record.type === "A" || record.type === "AAAA" || record.type === "CNAME";

              return (
                <div
                  key={record.id}
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors ${
                    isSelected
                      ? isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                      : isLight ? "hover:bg-slate-50/60" : "hover:bg-[var(--bg-elevated)]/40"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(record.id)}
                      className="rounded border-slate-300 dark:border-slate-600 w-4 h-4 cursor-pointer accent-emerald-500"
                      aria-label={`Select ${record.type} record for ${record.name}`}
                    />
                  </div>

                  {/* Type badge */}
                  <div className="col-span-1">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-mono font-bold ring-1 ${tc.bg} ${tc.text} ${tc.ring}`}>
                      {record.type}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="col-span-2">
                    <span className={`font-mono text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{record.name}</span>
                  </div>

                  {/* Content + copy */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-mono text-sm truncate ${isLight ? "text-slate-600" : "text-slate-400"}`}>{record.content}</span>
                      <button
                        onClick={() => copyToClipboard(record.content)}
                        aria-label={`Copy content: ${record.content}`}
                        className={`p-1 rounded-md flex-shrink-0 transition-colors ${
                          isLight ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-slate-600 hover:text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* TTL */}
                  <div className="col-span-1">
                    <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-500"}`}>{formatTTL(record.ttl)}</span>
                  </div>

                  {/* Proxy */}
                  <div className="col-span-1">
                    {showProxyToggle ? (
                      <button
                        onClick={() => toggleRecordProxy(record.id)}
                        aria-label={`Toggle proxy for ${record.name}: currently ${record.proxy ? "on" : "off"}`}
                        className="flex items-center gap-1.5"
                      >
                        {record.proxy ? (
                          <span className="flex items-center gap-1.5 text-orange-400">
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                            </svg>
                            <span className="text-xs font-semibold">On</span>
                          </span>
                        ) : (
                          <span className={`flex items-center gap-1.5 ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                            </svg>
                            <span className="text-xs font-medium">Off</span>
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-600"}`}>--</span>
                    )}
                  </div>

                  {/* Modified */}
                  <div className="col-span-2">
                    <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-500"}`}>{record.modified}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(record)}
                      aria-label={`Edit ${record.type} record for ${record.name}`}
                      className={`p-2 rounded-lg transition-all hover:-translate-y-px ${
                        isLight ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(record)}
                      aria-label={`Delete ${record.type} record for ${record.name}`}
                      className={`p-2 rounded-lg transition-all hover:-translate-y-px ${
                        isLight ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 6. Quick Templates section (collapsible) ── */}
      {templatesExpanded && (
        <div id="templates-section" className={`${cardClass} p-5 mb-6`}>
          <h3 className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Quick Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {QUICK_TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => setTemplateConfirm(tpl)}
                className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-px ${
                  isLight
                    ? "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                    : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg ${tpl.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {tpl.icon}
                  </div>
                  <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{tpl.name}</span>
                </div>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  {tpl.records} records will be added
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. DNS Propagation card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${cardClass} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>DNS Propagation</h3>
            <button
              onClick={() => {
                setPropagationTest(selectedDomain);
                setShowPropagationModal(true);
              }}
              className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all text-white flex items-center gap-1.5 hover:-translate-y-px ${accent.button} ${accent.buttonHover}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Check Propagation
            </button>
          </div>

          {/* Progress bar */}
          <div className={`h-1.5 rounded-full mb-5 overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
            <div className="h-full w-full rounded-full bg-emerald-500 transition-all" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {propagationServers.map((server, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"
                }`}
              >
                <span className="text-lg">{server.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{server.location}</div>
                  <div className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>{server.latency}</div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. DNSSEC card ── */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>DNSSEC</h3>
            <Toggle
              enabled={dnssecEnabled}
              onChange={(v) => {
                setDnssecEnabled(v);
                showToast.success(v ? "DNSSEC enabled" : "DNSSEC disabled");
              }}
            />
          </div>

          <div className={`p-4 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                dnssecEnabled
                  ? "bg-emerald-500/10"
                  : isLight ? "bg-slate-100" : "bg-slate-800"
              }`}>
                <svg className={`w-5 h-5 ${dnssecEnabled ? "text-emerald-500" : isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={
                    dnssecEnabled
                      ? "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      : "M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zM12 15.75h.008v.008H12v-.008z"
                  } />
                </svg>
              </div>
              <div>
                <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  {dnssecEnabled ? "Active" : "Inactive"}
                </div>
                <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                  {dnssecEnabled
                    ? "Your domain is protected against DNS spoofing"
                    : "Enable DNSSEC to protect against spoofing"}
                </div>
              </div>
            </div>
          </div>

          {dnssecEnabled && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Algorithm</span>
                <span className={`text-xs font-mono font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>ECDSAP256SHA256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>Key Tag</span>
                <span className={`text-xs font-mono font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>2371</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Add/Edit Record Modal */}
      {renderRecordModal()}

      {/* Propagation Modal */}
      {renderPropagationModal()}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRecord}
        title="Delete DNS Record"
        message={deleteTarget ? `Are you sure you want to delete the ${deleteTarget.type} record for "${deleteTarget.name}" pointing to "${deleteTarget.content}"? This action cannot be undone.` : ""}
        confirmText="Delete Record"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Template Confirm */}
      <ConfirmDialog
        open={templateConfirm !== null}
        onClose={() => setTemplateConfirm(null)}
        onConfirm={handleAddTemplate}
        title={`Add ${templateConfirm?.name} records?`}
        message={templateConfirm ? `This will add ${templateConfirm.records} DNS records for ${templateConfirm.name} to ${selectedDomain}. You can edit or delete them later.` : ""}
        confirmText="Add Records"
        variant="info"
        isLoading={actionLoading}
      />

      {/* Import Zone File Modal */}
      {showImportModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { setShowImportModal(false); setImportFile(""); }} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="import-zone-title">
            <div className="p-6">
              <h3 id="import-zone-title" className={`text-lg font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Import Zone File</h3>
              <p className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Upload a BIND zone file to import DNS records for {selectedDomain}.</p>

              {/* Drop zone */}
              <label
                className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  importFile
                    ? isLight
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-emerald-500/50 bg-emerald-500/5"
                    : isLight
                      ? "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100"
                      : "border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-[var(--bg-elevated)]"
                }`}
              >
                {importFile ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{importFile}</span>
                    <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Click to change file</span>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
                      <svg className={`w-6 h-6 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>Drop zone file here or click to browse</span>
                    <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>Supports .txt and .zone files (BIND format)</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".txt,.zone"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImportFile(file.name);
                  }}
                />
              </label>

              {/* Info note */}
              <div className={`mt-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
                isLight ? "bg-amber-50 text-amber-700" : "bg-amber-500/10 text-amber-400"
              }`}>
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Duplicate records will be skipped. Existing records won&apos;t be modified.
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => { setShowImportModal(false); setImportFile(""); }}
                  className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                    isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportZone}
                  disabled={!importFile || importLoading}
                  className={`h-9 px-5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover}`}
                >
                  {importLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Importing...
                    </>
                  ) : "Import Records"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
