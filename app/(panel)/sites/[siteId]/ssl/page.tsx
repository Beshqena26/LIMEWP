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

interface CertificateInfo {
  status: "Active" | "Inactive";
  issuer: string;
  domains: string[];
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  autoRenew: boolean;
}

interface CertHistoryRow {
  id: string;
  domain: string;
  issuer: string;
  type: "DV" | "Wildcard" | "OV" | "EV";
  validFrom: string;
  validTo: string;
  status: "Active" | "Expired" | "Revoked" | "Pending";
  daysRemaining: number;
}

interface CertDetail {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  sans: string[];
  signatureAlgorithm: string;
  keyType: string;
  keySize: string;
  chain: { label: string; cn: string }[];
}

interface MixedContentIssue {
  id: string;
  url: string;
  resource: string;
  type: string;
  fixed: boolean;
}

/* ────────────── mock data ────────────── */

const CURRENT_CERT: CertificateInfo = {
  status: "Active",
  issuer: "Let's Encrypt Authority X3",
  domains: ["limewp.com", "*.limewp.com"],
  validFrom: "2025-12-15",
  validUntil: "2026-06-13",
  daysRemaining: 81,
  autoRenew: true,
};

const SSL_GRADE = {
  grade: "A+",
  protocol: 100,
  keyExchange: 100,
  cipherStrength: 90,
  lastTested: "Mar 24, 2026 at 10:32 AM",
};

const INITIAL_CERT_HISTORY: CertHistoryRow[] = [
  { id: "cert1", domain: "limewp.com", issuer: "Let's Encrypt", type: "DV", validFrom: "Jan 15, 2026", validTo: "Apr 15, 2026", status: "Active", daysRemaining: 22 },
  { id: "cert2", domain: "*.limewp.com", issuer: "DigiCert", type: "Wildcard", validFrom: "Dec 1, 2025", validTo: "Dec 1, 2026", status: "Active", daysRemaining: 252 },
  { id: "cert3", domain: "limewp.com", issuer: "Let's Encrypt", type: "DV", validFrom: "Oct 15, 2025", validTo: "Jan 15, 2026", status: "Expired", daysRemaining: 0 },
  { id: "cert4", domain: "shop.limewp.com", issuer: "Sectigo", type: "OV", validFrom: "Jun 1, 2025", validTo: "Jun 1, 2026", status: "Revoked", daysRemaining: 0 },
];

const CERT_DETAILS: Record<string, CertDetail> = {
  cert1: {
    subject: "CN=limewp.com",
    issuer: "Let's Encrypt Authority X3",
    serialNumber: "04:A3:2B:CF:19:D8:42:EF:7B:01:C3:9E:5D:A6:F8:12",
    validFrom: "Jan 15, 2026",
    validTo: "Apr 15, 2026",
    daysRemaining: 22,
    sans: ["limewp.com", "www.limewp.com"],
    signatureAlgorithm: "SHA-256 with RSA Encryption",
    keyType: "RSA",
    keySize: "2048 bit",
    chain: [
      { label: "Root CA", cn: "ISRG Root X1" },
      { label: "Intermediate", cn: "Let's Encrypt Authority X3" },
      { label: "Leaf", cn: "limewp.com" },
    ],
  },
  cert2: {
    subject: "CN=*.limewp.com",
    issuer: "DigiCert Global G2 TLS RSA SHA256 2020 CA1",
    serialNumber: "0B:AF:C2:41:A8:93:B2:17:CD:04:99:F3:6E:A1:77:9D",
    validFrom: "Dec 1, 2025",
    validTo: "Dec 1, 2026",
    daysRemaining: 252,
    sans: ["*.limewp.com", "limewp.com"],
    signatureAlgorithm: "SHA-256 with RSA Encryption",
    keyType: "EC",
    keySize: "256 bit (P-256)",
    chain: [
      { label: "Root CA", cn: "DigiCert Global Root G2" },
      { label: "Intermediate", cn: "DigiCert Global G2 TLS RSA SHA256 2020 CA1" },
      { label: "Leaf", cn: "*.limewp.com" },
    ],
  },
  cert3: {
    subject: "CN=limewp.com",
    issuer: "Let's Encrypt Authority X3",
    serialNumber: "03:F1:4A:D7:22:B9:61:CE:8A:03:E5:7C:2D:94:B6:01",
    validFrom: "Oct 15, 2025",
    validTo: "Jan 15, 2026",
    daysRemaining: 0,
    sans: ["limewp.com"],
    signatureAlgorithm: "SHA-256 with RSA Encryption",
    keyType: "RSA",
    keySize: "2048 bit",
    chain: [
      { label: "Root CA", cn: "ISRG Root X1" },
      { label: "Intermediate", cn: "Let's Encrypt Authority X3" },
      { label: "Leaf", cn: "limewp.com" },
    ],
  },
  cert4: {
    subject: "CN=shop.limewp.com",
    issuer: "Sectigo RSA Domain Validation Secure Server CA",
    serialNumber: "7E:C2:B8:19:44:AF:D3:52:01:BB:6C:E4:F2:90:A7:3D",
    validFrom: "Jun 1, 2025",
    validTo: "Jun 1, 2026",
    daysRemaining: 0,
    sans: ["shop.limewp.com"],
    signatureAlgorithm: "SHA-256 with RSA Encryption",
    keyType: "RSA",
    keySize: "4096 bit",
    chain: [
      { label: "Root CA", cn: "AAA Certificate Services" },
      { label: "Intermediate", cn: "Sectigo RSA Domain Validation Secure Server CA" },
      { label: "Leaf", cn: "shop.limewp.com" },
    ],
  },
};

const INITIAL_MIXED_CONTENT: MixedContentIssue[] = [
  { id: "mc1", url: "/blog/my-post", resource: "http://cdn.example.com/image.jpg", type: "Image", fixed: false },
  { id: "mc2", url: "/shop/product-1", resource: "http://fonts.googleapis.com/css", type: "Stylesheet", fixed: false },
  { id: "mc3", url: "/about", resource: "http://maps.googleapis.com/maps/api/js", type: "Script", fixed: false },
];

/* ────────────── helpers ────────────── */

function getDaysRemainingColor(days: number) {
  if (days > 30) return { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", ring: "ring-emerald-500/20" };
  if (days >= 7) return { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", ring: "ring-amber-500/20" };
  return { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400", ring: "ring-rose-500/20" };
}

function getStatusColors(status: string) {
  if (status === "Active") return { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", ring: "ring-emerald-500/20" };
  if (status === "Revoked") return { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400", ring: "ring-rose-500/20" };
  if (status === "Pending") return { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", ring: "ring-amber-500/20" };
  return { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400", ring: "ring-slate-500/20" };
}

function getTypeColors(type: string) {
  if (type === "DV") return "bg-sky-500/10 text-sky-400 ring-sky-500/20";
  if (type === "Wildcard") return "bg-violet-500/10 text-violet-400 ring-violet-500/20";
  if (type === "OV") return "bg-amber-500/10 text-amber-400 ring-amber-500/20";
  if (type === "EV") return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
  return "bg-slate-500/10 text-slate-400 ring-slate-500/20";
}

function getGradeColor(grade: string) {
  if (grade.startsWith("A")) return { bg: "bg-emerald-500", ring: "ring-emerald-500/30", text: "text-emerald-400" };
  if (grade.startsWith("B")) return { bg: "bg-amber-500", ring: "ring-amber-500/30", text: "text-amber-400" };
  return { bg: "bg-rose-500", ring: "ring-rose-500/30", text: "text-rose-400" };
}

/* ────────────── spinner SVG ────────────── */

function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* ────────────── component ────────────── */

export function SSLTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  /* ── state ── */

  // Toggles
  const [autoRenew, setAutoRenew] = useState(CURRENT_CERT.autoRenew);
  const [forceHttps, setForceHttps] = useState(true);

  // Generate SSL
  const [generating, setGenerating] = useState(false);

  // Custom cert modal
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPem, setCertPem] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [installing, setInstalling] = useState(false);

  // SSL Grade
  const [testingGrade, setTestingGrade] = useState(false);

  // Certificate history
  const [certHistory, setCertHistory] = useState<CertHistoryRow[]>(INITIAL_CERT_HISTORY);

  // Certificate detail modal
  const [detailCertId, setDetailCertId] = useState<string | null>(null);

  // Confirm dialogs
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Mixed content scanner
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [mixedContent, setMixedContent] = useState<MixedContentIssue[]>(INITIAL_MIXED_CONTENT);

  // HSTS
  const [hstsEnabled, setHstsEnabled] = useState(true);
  const [hstsMaxAge, setHstsMaxAge] = useState("31536000");
  const [hstsSubdomains, setHstsSubdomains] = useState(true);
  const [hstsPreload, setHstsPreload] = useState(false);
  const [savingHsts, setSavingHsts] = useState(false);

  // Renewal settings
  const [renewDaysBefore, setRenewDaysBefore] = useState("14");
  const [emailOnRenewal, setEmailOnRenewal] = useState(true);
  const [emailOnFailure, setEmailOnFailure] = useState(true);
  const [renewalAttempts, setRenewalAttempts] = useState("3");
  const [savingRenewal, setSavingRenewal] = useState(false);

  // TLS protocols
  const [tls12, setTls12] = useState(true);
  const [tls13, setTls13] = useState(true);
  const [minTlsVersion, setMinTlsVersion] = useState("1.2");
  const [savingTls, setSavingTls] = useState(false);

  /* ── handlers ── */

  const handleAutoRenewToggle = useCallback((value: boolean) => {
    setAutoRenew(value);
    showToast.success(`Auto-renew ${value ? "enabled" : "disabled"}`);
  }, []);

  const handleForceHttpsToggle = useCallback((value: boolean) => {
    setForceHttps(value);
    showToast.success(`Force HTTPS ${value ? "enabled" : "disabled"}`);
  }, []);

  const handleGenerateSSL = useCallback(async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    showToast.success("Free SSL certificate generated successfully");
  }, []);

  const handleInstallCert = useCallback(async () => {
    if (!certPem.trim() || !privateKey.trim()) {
      showToast.error("Both certificate and private key are required");
      return;
    }
    setInstalling(true);
    await new Promise((r) => setTimeout(r, 2000));
    setInstalling(false);
    setShowCertModal(false);
    setCertPem("");
    setPrivateKey("");
    showToast.success("Custom certificate installed successfully");
  }, [certPem, privateKey]);

  const handleTestGrade = useCallback(async () => {
    setTestingGrade(true);
    await new Promise((r) => setTimeout(r, 2500));
    setTestingGrade(false);
    showToast.success("SSL grade test completed");
  }, []);

  const handleRevokeCert = useCallback(async (certId: string) => {
    setRevoking(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCertHistory((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, status: "Revoked" as const, daysRemaining: 0 } : c))
    );
    setRevoking(false);
    setConfirmRevoke(null);
    showToast.success("Certificate revoked successfully");
  }, []);

  const handleDeleteCert = useCallback(async (certId: string) => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCertHistory((prev) => prev.filter((c) => c.id !== certId));
    setDeleting(false);
    setConfirmDelete(null);
    showToast.success("Certificate deleted from history");
  }, []);

  const handleDownloadCert = useCallback((certId: string) => {
    showToast.success("Certificate downloaded as PEM file");
  }, []);

  const handleCopySerial = useCallback((serial: string) => {
    navigator.clipboard.writeText(serial).then(() => {
      showToast.success("Serial number copied to clipboard");
    });
  }, []);

  const handleScanMixedContent = useCallback(async () => {
    setScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setMixedContent(INITIAL_MIXED_CONTENT);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 80));
      setScanProgress(i);
    }
    setScanning(false);
    setScanComplete(true);
    showToast.success("Mixed content scan completed");
  }, []);

  const handleFixMixedContent = useCallback((id: string) => {
    setMixedContent((prev) => prev.map((m) => (m.id === id ? { ...m, fixed: true } : m)));
    showToast.success("Resource URL updated to HTTPS");
  }, []);

  const handleSaveHsts = useCallback(async () => {
    setSavingHsts(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSavingHsts(false);
    showToast.success("HSTS configuration saved");
  }, []);

  const handleSaveRenewal = useCallback(async () => {
    setSavingRenewal(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSavingRenewal(false);
    showToast.success("Renewal settings saved");
  }, []);

  const handleSaveTls = useCallback(async () => {
    setSavingTls(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSavingTls(false);
    showToast.success("TLS protocol configuration saved");
  }, []);

  // Escape key for modals
  useEffect(() => {
    if (!showCertModal && !detailCertId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCertModal(false);
        setDetailCertId(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showCertModal, detailCertId]);

  // Body scroll lock
  useEffect(() => {
    if (showCertModal || detailCertId) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showCertModal, detailCertId]);

  /* ── shared styles ── */

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const textareaClass = `w-full rounded-xl border px-3 py-3 text-xs font-mono font-medium outline-none transition-colors resize-y min-h-[120px] ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400 placeholder:text-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)] placeholder:text-slate-500"
  }`;

  const selectClass = `h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors cursor-pointer ${
    isLight
      ? "bg-white border-slate-200 text-slate-700 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const infoBoxClass = `rounded-xl p-4 border ${
    isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const btnSecondary = `h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
    isLight
      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
      : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
  }`;

  const btnPrimary = `h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`;

  const statusActive = CURRENT_CERT.status === "Active";
  const daysColor = getDaysRemainingColor(CURRENT_CERT.daysRemaining);
  const gradeColor = getGradeColor(SSL_GRADE.grade);

  const detailCert = detailCertId ? CERT_DETAILS[detailCertId] : null;
  const detailRow = detailCertId ? certHistory.find((c) => c.id === detailCertId) : null;

  const allMixedFixed = mixedContent.every((m) => m.fixed);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          SSL / Certificates
        </h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
          Manage SSL certificates for{" "}
          <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {decodeURIComponent(siteId)}
          </span>
        </p>
      </div>

      {/* ══════════════ SECTION 1 — SSL Grade Card ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              SSL Security Grade
            </h2>
            <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              Last tested: {SSL_GRADE.lastTested}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Grade circle */}
            <div className="flex-shrink-0">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center ring-4 ${gradeColor.ring} ${
                testingGrade ? "animate-pulse" : ""
              }`} style={{ background: testingGrade ? undefined : undefined }}>
                <div className={`w-24 h-24 rounded-full ${gradeColor.bg} flex items-center justify-center`}>
                  {testingGrade ? (
                    <Spinner className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-4xl font-black text-white tracking-tight">{SSL_GRADE.grade}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="flex-1 w-full space-y-3">
              {[
                { label: "Protocol Support", value: SSL_GRADE.protocol },
                { label: "Key Exchange", value: SSL_GRADE.keyExchange },
                { label: "Cipher Strength", value: SSL_GRADE.cipherStrength },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-semibold ${
                      item.value >= 90 ? "text-emerald-400" : item.value >= 70 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {item.value}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-700/50"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.value >= 90 ? "bg-emerald-500" : item.value >= 70 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Test again button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleTestGrade}
                disabled={testingGrade}
                className={btnSecondary}
              >
                {testingGrade ? (
                  <>
                    <Spinner />
                    Testing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Test Again
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 2 — Current Certificate ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Current Certificate
          </h2>

          {/* Status badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${
              statusActive
                ? "bg-emerald-500/10 ring-emerald-500/20"
                : "bg-rose-500/10 ring-rose-500/20"
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  statusActive ? "bg-emerald-400" : "bg-rose-400"
                }`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  statusActive ? "bg-emerald-400" : "bg-rose-400"
                }`} />
              </span>
              <span className={`text-sm font-semibold ${
                statusActive ? "text-emerald-400" : "text-rose-400"
              }`}>
                {CURRENT_CERT.status}
              </span>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={infoBoxClass}>
              <p className={labelClass}>Issuer</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.issuer}
              </p>
            </div>

            <div className={infoBoxClass}>
              <p className={labelClass}>Domain</p>
              <div className="mt-1 space-y-0.5">
                {CURRENT_CERT.domains.map((d) => (
                  <p key={d} className={`text-sm font-semibold font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {d}
                  </p>
                ))}
              </div>
            </div>

            <div className={infoBoxClass}>
              <p className={labelClass}>Valid From</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.validFrom}
              </p>
            </div>

            <div className={infoBoxClass}>
              <p className={labelClass}>Valid Until</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.validUntil}
              </p>
            </div>

            <div className={infoBoxClass}>
              <p className={labelClass}>Days Remaining</p>
              <div className="mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${daysColor.bg} ${daysColor.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${daysColor.dot}`} />
                  <span className={`text-xs font-semibold ${daysColor.text}`}>{CURRENT_CERT.daysRemaining} days</span>
                </span>
              </div>
            </div>

            <div className={infoBoxClass}>
              <p className={labelClass}>Auto-Renew</p>
              <div className="mt-1.5">
                <Toggle enabled={autoRenew} onChange={handleAutoRenewToggle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 3 — Action Cards ══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Force HTTPS */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Force HTTPS
            </h3>
            <p className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Redirect all HTTP traffic to HTTPS
            </p>
            <Toggle enabled={forceHttps} onChange={handleForceHttpsToggle} />
          </div>
        </div>

        {/* Generate Free SSL */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Generate Free SSL
            </h3>
            <p className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Issue a free certificate via Let&apos;s Encrypt
            </p>
            <button onClick={handleGenerateSSL} disabled={generating} className={btnPrimary}>
              {generating ? (<><Spinner /> Generating...</>) : "Generate Free SSL"}
            </button>
          </div>
        </div>

        {/* Upload Custom Certificate */}
        <div className={cardClass}>
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Upload Custom Certificate
            </h3>
            <p className={`text-xs mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Install your own SSL certificate
            </p>
            <button onClick={() => setShowCertModal(true)} className={btnSecondary}>
              Upload Certificate
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 4 — SSL/TLS Protocol Configuration ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            SSL/TLS Protocol Configuration
          </h2>

          <div className="space-y-4">
            {/* TLS 1.0 */}
            <div className={`flex items-center justify-between ${infoBoxClass}`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>TLS 1.0</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold bg-rose-500/10 text-rose-400 ring-rose-500/20">
                  Insecure
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${isLight ? "text-slate-400" : "text-slate-500"}`}>Disabled</span>
                <Toggle enabled={false} onChange={() => showToast.error("TLS 1.0 is insecure and cannot be enabled")} />
              </div>
            </div>

            {/* TLS 1.1 */}
            <div className={`flex items-center justify-between ${infoBoxClass}`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>TLS 1.1</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold bg-amber-500/10 text-amber-400 ring-amber-500/20">
                  Deprecated
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${isLight ? "text-slate-400" : "text-slate-500"}`}>Disabled</span>
                <Toggle enabled={false} onChange={() => showToast.error("TLS 1.1 is deprecated and cannot be enabled")} />
              </div>
            </div>

            {/* TLS 1.2 */}
            <div className={`flex items-center justify-between ${infoBoxClass}`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>TLS 1.2</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${tls12 ? "text-emerald-400" : (isLight ? "text-slate-400" : "text-slate-500")}`}>
                  {tls12 ? "Enabled" : "Disabled"}
                </span>
                <Toggle enabled={tls12} onChange={(v) => { setTls12(v); showToast.success(`TLS 1.2 ${v ? "enabled" : "disabled"}`); }} />
              </div>
            </div>

            {/* TLS 1.3 */}
            <div className={`flex items-center justify-between ${infoBoxClass}`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>TLS 1.3</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 ring-emerald-500/20">
                  Recommended
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${tls13 ? "text-emerald-400" : (isLight ? "text-slate-400" : "text-slate-500")}`}>
                  {tls13 ? "Enabled" : "Disabled"}
                </span>
                <Toggle enabled={tls13} onChange={(v) => { setTls13(v); showToast.success(`TLS 1.3 ${v ? "enabled" : "disabled"}`); }} />
              </div>
            </div>

            {/* Minimum TLS version */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Minimum TLS Version</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Connections below this version will be rejected
                </p>
              </div>
              <select value={minTlsVersion} onChange={(e) => setMinTlsVersion(e.target.value)} className={selectClass}>
                <option value="1.2">TLS 1.2</option>
                <option value="1.3">TLS 1.3</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleSaveTls} disabled={savingTls} className={btnPrimary}>
                {savingTls ? (<><Spinner /> Saving...</>) : "Save TLS Configuration"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 5 — HSTS Configuration ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            HSTS Configuration
          </h2>

          <div className="space-y-5">
            {/* Enable HSTS */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Enable HSTS</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  HTTP Strict Transport Security header
                </p>
              </div>
              <Toggle enabled={hstsEnabled} onChange={(v) => { setHstsEnabled(v); }} />
            </div>

            {hstsEnabled && (
              <>
                {/* Max-Age */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Max-Age</span>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      How long browsers should remember HTTPS-only
                    </p>
                  </div>
                  <select value={hstsMaxAge} onChange={(e) => setHstsMaxAge(e.target.value)} className={selectClass}>
                    <option value="2592000">1 month</option>
                    <option value="15768000">6 months</option>
                    <option value="31536000">1 year</option>
                    <option value="63072000">2 years</option>
                  </select>
                </div>

                {/* Include Subdomains */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Include Subdomains</span>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      Apply HSTS to all subdomains
                    </p>
                  </div>
                  <Toggle enabled={hstsSubdomains} onChange={setHstsSubdomains} />
                </div>

                {/* Preload */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Preload</span>
                    <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      Submit to browser HSTS preload lists
                    </p>
                  </div>
                  <Toggle enabled={hstsPreload} onChange={setHstsPreload} />
                </div>

                {/* Warning callout */}
                {hstsPreload && (
                  <div className={`rounded-xl p-4 border flex items-start gap-3 ${
                    isLight
                      ? "bg-amber-50 border-amber-200"
                      : "bg-amber-500/5 border-amber-500/20"
                  }`}>
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <p className={`text-sm font-semibold ${isLight ? "text-amber-800" : "text-amber-400"}`}>Warning</p>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-amber-700" : "text-amber-400/80"}`}>
                        Enabling HSTS with preload is permanent. Make sure all subdomains support HTTPS before enabling this option.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-1">
              <button onClick={handleSaveHsts} disabled={savingHsts} className={btnPrimary}>
                {savingHsts ? (<><Spinner /> Saving...</>) : "Save HSTS Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 6 — Certificate Renewal Settings ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Certificate Renewal Settings
          </h2>

          <div className="space-y-5">
            {/* Days before expiry */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Auto-Renew Before Expiry</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Days before expiry to trigger auto-renewal
                </p>
              </div>
              <select value={renewDaysBefore} onChange={(e) => setRenewDaysBefore(e.target.value)} className={selectClass}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            {/* Email on renewal */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Email on Renewal</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Receive an email when certificate is renewed
                </p>
              </div>
              <Toggle enabled={emailOnRenewal} onChange={setEmailOnRenewal} />
            </div>

            {/* Email on failure */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Email on Failure</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Receive an email if renewal fails
                </p>
              </div>
              <Toggle enabled={emailOnFailure} onChange={setEmailOnFailure} />
            </div>

            {/* Renewal attempts */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Renewal Attempts</span>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Number of retry attempts if renewal fails
                </p>
              </div>
              <select value={renewalAttempts} onChange={(e) => setRenewalAttempts(e.target.value)} className={selectClass}>
                <option value="1">1 attempt</option>
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
              </select>
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={handleSaveRenewal} disabled={savingRenewal} className={btnPrimary}>
                {savingRenewal ? (<><Spinner /> Saving...</>) : "Save Renewal Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SECTION 7 — Mixed Content Scanner ══════════════ */}
      <div className={`${cardClass} mb-8`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Mixed Content Scanner
              </h2>
              <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Detect HTTP resources loaded on HTTPS pages
              </p>
            </div>
            <button onClick={handleScanMixedContent} disabled={scanning} className={btnSecondary}>
              {scanning ? (<><Spinner /> Scanning...</>) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Scan for Mixed Content
                </>
              )}
            </button>
          </div>

          {/* Progress bar */}
          {scanning && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Scanning pages...</span>
                <span className={`text-xs font-semibold ${isLight ? "text-slate-600" : "text-slate-300"}`}>{scanProgress}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-700/50"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-200 ${accent.progress || "bg-emerald-500"}`}
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {scanComplete && (
            <div className="space-y-3">
              {allMixedFixed ? (
                <div className={`flex items-center gap-3 rounded-xl p-4 border ${
                  isLight ? "bg-emerald-50 border-emerald-200" : "bg-emerald-500/5 border-emerald-500/20"
                }`}>
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-sm font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                    No mixed content detected! All resources use HTTPS.
                  </span>
                </div>
              ) : (
                mixedContent.filter((m) => !m.fixed).map((issue) => (
                  <div key={issue.id} className={`flex items-center justify-between rounded-xl p-4 border ${
                    isLight ? "bg-rose-50/50 border-rose-200" : "bg-rose-500/5 border-rose-500/20"
                  }`}>
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                          {issue.type}
                        </span>
                        <span className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                          {issue.url}
                        </span>
                      </div>
                      <p className={`text-xs font-mono truncate ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {issue.resource}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFixMixedContent(issue.id)}
                      className="flex-shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Fix
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {!scanning && !scanComplete && (
            <div className={`flex flex-col items-center justify-center py-8 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <p className="text-sm">Run a scan to check for mixed content issues</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ SECTION 8 — Certificate History ══════════════ */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="p-6 pb-0">
          <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Certificate History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {["Domain", "Issuer", "Type", "Valid From", "Valid To", "Days Left", "Status", "Actions"].map((col) => (
                  <th key={col} className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certHistory.map((row) => {
                const statusColors = getStatusColors(row.status);
                const rowDaysColor = getDaysRemainingColor(row.daysRemaining);
                return (
                  <tr
                    key={row.id}
                    className={`border-b last:border-b-0 transition-colors ${
                      isLight
                        ? "border-slate-100 hover:bg-slate-50"
                        : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm font-medium font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                      {row.domain}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                      {row.issuer}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${getTypeColors(row.type)}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {row.validFrom}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {row.validTo}
                    </td>
                    <td className="px-6 py-4">
                      {row.daysRemaining > 0 ? (
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${rowDaysColor.bg} ${rowDaysColor.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rowDaysColor.dot}`} />
                          <span className={rowDaysColor.text}>{row.daysRemaining}d</span>
                        </span>
                      ) : (
                        <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${statusColors.bg} ${statusColors.ring}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                        <span className={statusColors.text}>{row.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* View details */}
                        {CERT_DETAILS[row.id] && (
                          <button
                            onClick={() => setDetailCertId(row.id)}
                            title="View details"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        )}
                        {/* Download */}
                        <button
                          onClick={() => handleDownloadCert(row.id)}
                          title="Download"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>
                        {/* Revoke (only active) */}
                        {row.status === "Active" && (
                          <button
                            onClick={() => setConfirmRevoke(row.id)}
                            title="Revoke"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-rose-500/10 text-rose-400`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                        {/* Delete (only expired/revoked) */}
                        {(row.status === "Expired" || row.status === "Revoked") && (
                          <button
                            onClick={() => setConfirmDelete(row.id)}
                            title="Delete"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-rose-500/10 text-rose-400`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {certHistory.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-6 py-12 text-center text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    No certificate history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Custom Certificate Modal */}
      {showCertModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !installing && setShowCertModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="ssl-cert-modal-title">
            <h3 id="ssl-cert-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Upload Custom Certificate
            </h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Certificate (PEM)</label>
                <textarea
                  value={certPem}
                  onChange={(e) => setCertPem(e.target.value)}
                  placeholder="-----BEGIN CERTIFICATE-----"
                  rows={6}
                  className={`${textareaClass} mt-1.5`}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClass}>Private Key</label>
                <textarea
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY-----"
                  rows={6}
                  className={`${textareaClass} mt-1.5`}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowCertModal(false); setCertPem(""); setPrivateKey(""); }}
                disabled={installing}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button onClick={handleInstallCert} disabled={installing} className={btnPrimary}>
                {installing ? (<><Spinner /> Installing...</>) : "Install Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {detailCertId && detailCert && detailRow && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setDetailCertId(null)} />
          <div className={`${modalCardClass} max-w-xl`} role="dialog" aria-modal="true" aria-labelledby="cert-detail-title">
            <div className="flex items-center justify-between mb-5">
              <h3 id="cert-detail-title" className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Certificate Details
              </h3>
              <button
                onClick={() => setDetailCertId(null)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-[var(--bg-elevated)] text-slate-500"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div className={infoBoxClass}>
                <p className={labelClass}>Subject (CN)</p>
                <p className={`text-sm font-semibold font-mono mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  {detailCert.subject}
                </p>
              </div>

              {/* Issuer */}
              <div className={infoBoxClass}>
                <p className={labelClass}>Issuer</p>
                <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  {detailCert.issuer}
                </p>
              </div>

              {/* Serial Number */}
              <div className={infoBoxClass}>
                <div className="flex items-center justify-between">
                  <p className={labelClass}>Serial Number</p>
                  <button
                    onClick={() => handleCopySerial(detailCert.serialNumber)}
                    className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                      isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className={`mt-1.5 px-3 py-2 rounded-lg font-mono text-xs break-all ${
                  isLight ? "bg-slate-100 text-slate-700" : "bg-slate-900/50 text-slate-300"
                }`}>
                  {detailCert.serialNumber}
                </div>
              </div>

              {/* Valid dates + days remaining */}
              <div className="grid grid-cols-2 gap-4">
                <div className={infoBoxClass}>
                  <p className={labelClass}>Valid From</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {detailCert.validFrom}
                  </p>
                </div>
                <div className={infoBoxClass}>
                  <p className={labelClass}>Valid To</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {detailCert.validTo}
                  </p>
                </div>
              </div>

              {/* Days remaining badge */}
              {(() => {
                const dc = getDaysRemainingColor(detailCert.daysRemaining);
                const sc = getStatusColors(detailRow.status);
                return (
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${sc.bg} ${sc.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-xs font-semibold ${sc.text}`}>{detailRow.status}</span>
                    </span>
                    {detailCert.daysRemaining > 0 && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${dc.bg} ${dc.ring}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dc.dot}`} />
                        <span className={`text-xs font-semibold ${dc.text}`}>{detailCert.daysRemaining} days remaining</span>
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* SANs */}
              <div className={infoBoxClass}>
                <p className={labelClass}>Subject Alternative Names (SANs)</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {detailCert.sans.map((san) => (
                    <span key={san} className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                      isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800/50 text-slate-300"
                    }`}>
                      {san}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature + Key */}
              <div className="grid grid-cols-2 gap-4">
                <div className={infoBoxClass}>
                  <p className={labelClass}>Signature Algorithm</p>
                  <p className={`text-xs font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {detailCert.signatureAlgorithm}
                  </p>
                </div>
                <div className={infoBoxClass}>
                  <p className={labelClass}>Key Type &amp; Size</p>
                  <p className={`text-xs font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {detailCert.keyType} {detailCert.keySize}
                  </p>
                </div>
              </div>

              {/* Certificate Chain */}
              <div className={infoBoxClass}>
                <p className={`${labelClass} mb-3`}>Certificate Chain</p>
                <div className="space-y-0">
                  {detailCert.chain.map((link, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                          i === 0
                            ? "border-emerald-400 bg-emerald-400"
                            : i === detailCert.chain.length - 1
                              ? "border-sky-400 bg-sky-400"
                              : "border-amber-400 bg-amber-400"
                        }`} />
                        {i < detailCert.chain.length - 1 && (
                          <div className={`w-0.5 h-6 ${isLight ? "bg-slate-200" : "bg-slate-600"}`} />
                        )}
                      </div>
                      <div className="pb-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                          {link.label}
                        </span>
                        <p className={`text-xs font-semibold font-mono ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                          {link.cn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-between mt-6 pt-4 border-t border-dashed ${isLight ? 'border-slate-200' : 'border-[var(--border-tertiary)]'}">
              <button
                onClick={() => handleDownloadCert(detailCertId)}
                className={btnSecondary}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Certificate
              </button>
              {detailRow.status === "Active" && (
                <button
                  onClick={() => { setDetailCertId(null); setConfirmRevoke(detailCertId); }}
                  className="h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Revoke Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CONFIRM DIALOGS ══════════════ */}

      <ConfirmDialog
        open={confirmRevoke !== null}
        onClose={() => setConfirmRevoke(null)}
        onConfirm={() => confirmRevoke && handleRevokeCert(confirmRevoke)}
        title="Revoke Certificate"
        message="Are you sure you want to revoke this certificate? This action cannot be undone and the certificate will no longer be valid for securing connections."
        confirmText="Revoke Certificate"
        cancelText="Cancel"
        variant="danger"
        isLoading={revoking}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDeleteCert(confirmDelete)}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate from history? This will permanently remove the record."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </>
  );
}

export default function SSLCertificatesPage() {
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
      <SSLTab siteId={siteId} />
    </AppShell>
  );
}
