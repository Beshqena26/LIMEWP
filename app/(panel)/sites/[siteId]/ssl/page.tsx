"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Switch } from "@heroui/react";

/* ────────────── mock data ────────────── */

interface CertificateInfo {
  status: "Active" | "Inactive";
  issuer: string;
  domains: string[];
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  autoRenew: boolean;
}

const CURRENT_CERT: CertificateInfo = {
  status: "Active",
  issuer: "Let's Encrypt Authority X3",
  domains: ["example.com", "*.example.com"],
  validFrom: "2025-12-15",
  validUntil: "2026-06-13",
  daysRemaining: 84,
  autoRenew: true,
};

interface CertHistoryRow {
  id: string;
  domain: string;
  issuer: string;
  type: "Free" | "Custom";
  validFrom: string;
  validUntil: string;
  status: "Active" | "Expired" | "Revoked";
}

const CERT_HISTORY: CertHistoryRow[] = [
  { id: "1", domain: "example.com", issuer: "Let's Encrypt Authority X3", type: "Free", validFrom: "2025-12-15", validUntil: "2026-06-13", status: "Active" },
  { id: "2", domain: "*.example.com", issuer: "Let's Encrypt Authority X3", type: "Free", validFrom: "2025-12-15", validUntil: "2026-06-13", status: "Active" },
  { id: "3", domain: "example.com", issuer: "Comodo RSA", type: "Custom", validFrom: "2024-06-01", validUntil: "2025-06-01", status: "Expired" },
  { id: "4", domain: "example.com", issuer: "Let's Encrypt Authority X3", type: "Free", validFrom: "2024-06-15", validUntil: "2024-12-14", status: "Expired" },
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
  return { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400", ring: "ring-slate-500/20" };
}

/* ────────────── component ────────────── */

export default function SSLCertificatesPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Toggle states
  const [autoRenew, setAutoRenew] = useState(CURRENT_CERT.autoRenew);
  const [forceHttps, setForceHttps] = useState(true);

  // Generate SSL
  const [generating, setGenerating] = useState(false);

  // Custom cert modal
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPem, setCertPem] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [installing, setInstalling] = useState(false);

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

  // Escape key for modal
  useEffect(() => {
    if (!showCertModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCertModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showCertModal]);

  // Body scroll lock
  useEffect(() => {
    if (showCertModal) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showCertModal]);

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

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const statusActive = CURRENT_CERT.status === "Active";
  const daysColor = getDaysRemainingColor(CURRENT_CERT.daysRemaining);

  return (
    <AppShell>
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

      {/* SECTION 1 — SSL Status */}
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
            {/* Issuer */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Issuer</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.issuer}
              </p>
            </div>

            {/* Domain */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Domain</p>
              <div className="mt-1 space-y-0.5">
                {CURRENT_CERT.domains.map((d) => (
                  <p key={d} className={`text-sm font-semibold font-mono ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {d}
                  </p>
                ))}
              </div>
            </div>

            {/* Valid From */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Valid From</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.validFrom}
              </p>
            </div>

            {/* Valid Until */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Valid Until</p>
              <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {CURRENT_CERT.validUntil}
              </p>
            </div>

            {/* Days Remaining */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Days Remaining</p>
              <div className="mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${daysColor.bg} ${daysColor.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${daysColor.dot}`} />
                  <span className={`text-xs font-semibold ${daysColor.text}`}>{CURRENT_CERT.daysRemaining} days</span>
                </span>
              </div>
            </div>

            {/* Auto-Renew */}
            <div className={`rounded-xl p-4 border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
            }`}>
              <p className={labelClass}>Auto-Renew</p>
              <div className="mt-1.5">
                <Switch
                  isSelected={autoRenew}
                  onValueChange={handleAutoRenewToggle}
                  size="sm"
                  classNames={{
                    wrapper: `${autoRenew ? "!bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-600"}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — Action Cards */}
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
            <Switch
              isSelected={forceHttps}
              onValueChange={handleForceHttpsToggle}
              size="sm"
              classNames={{
                wrapper: `${forceHttps ? "!bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-600"}`,
              }}
            />
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
            <button
              onClick={handleGenerateSSL}
              disabled={generating}
              className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating…
                </>
              ) : (
                "Generate Free SSL"
              )}
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
            <button
              onClick={() => setShowCertModal(true)}
              className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
              }`}
            >
              Upload Certificate
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Certificate History */}
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
                {["Domain", "Issuer", "Type", "Valid From", "Valid Until", "Status"].map((col) => (
                  <th key={col} className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CERT_HISTORY.map((row) => {
                const statusColors = getStatusColors(row.status);
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
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${
                        row.type === "Free"
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                          : "bg-violet-500/10 text-violet-400 ring-violet-500/20"
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {row.validFrom}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {row.validUntil}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[10px] font-semibold ${statusColors.bg} ${statusColors.ring}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                        <span className={statusColors.text}>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Custom Certificate Modal ── */}
      {showCertModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !installing && setShowCertModal(false)} />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="ssl-cert-modal-title">
            <h3 id="ssl-cert-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Upload Custom Certificate
            </h3>

            <div className="space-y-4">
              {/* Certificate */}
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

              {/* Private Key */}
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

            {/* Actions */}
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
              <button
                onClick={handleInstallCert}
                disabled={installing}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {installing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Installing…
                  </>
                ) : (
                  "Install Certificate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
