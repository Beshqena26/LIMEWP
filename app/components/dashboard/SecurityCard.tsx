"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

interface SecurityItem {
  label: string;
  status: "active" | "warning" | "inactive";
  detail: string;
  icon: string;
  color: "emerald" | "amber" | "violet" | "sky";
  lastCheck: string;
  threatCount: number;
  configDetail: string;
}

interface SecurityCardProps {
  onRunScan?: () => void;
  onViewDetails?: () => void;
}

export function SecurityCard({ onRunScan, onViewDetails }: SecurityCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // --- State ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [itemToggles, setItemToggles] = useState<Record<string, boolean>>({
    "SSL Certificate": true,
    "Firewall": true,
    "Malware Scan": true,
    "Login Protection": true,
  });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [confirmToggleItem, setConfirmToggleItem] = useState<string | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const securityItems: SecurityItem[] = [
    {
      label: "SSL Certificate",
      status: "active",
      detail: "Valid until Dec 2026",
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      color: "emerald",
      lastCheck: "2 minutes ago",
      threatCount: 0,
      configDetail: "Auto-renew enabled via Let's Encrypt. TLS 1.3 with HSTS preload active.",
    },
    {
      label: "Firewall",
      status: "active",
      detail: "18 threats blocked today",
      icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
      color: "amber",
      lastCheck: "Real-time",
      threatCount: 18,
      configDetail: "WAF rules updated 3 hours ago. Rate limiting: 100 req/min per IP. Geo-blocking: 4 countries.",
    },
    {
      label: "Malware Scan",
      status: "active",
      detail: "Last scan: 2 hours ago",
      icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
      color: "violet",
      lastCheck: "2 hours ago",
      threatCount: 0,
      configDetail: "Daily automated scans at 3 AM UTC. File integrity monitoring active on 1,247 files.",
    },
    {
      label: "Login Protection",
      status: "active",
      detail: "2FA enabled, 3 failed attempts",
      icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
      color: "sky",
      lastCheck: "5 minutes ago",
      threatCount: 3,
      configDetail: "2FA via TOTP enforced for all admins. Brute-force lockout after 5 failed attempts (15 min cooldown).",
    },
  ];

  const BASE_SCORE = 98;
  const disabledCount = Object.values(itemToggles).filter((v) => !v).length;
  const currentScore = Math.max(0, BASE_SCORE - disabledCount * 5);

  const threatStats = {
    blocked: 247,
    scanned: "12.4K",
    score: currentScore,
  };

  const itemColorMap = {
    emerald: {
      iconBg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
      iconText: "text-emerald-500",
    },
    amber: {
      iconBg: isLight ? "bg-amber-50" : "bg-amber-500/10",
      iconText: "text-amber-500",
    },
    violet: {
      iconBg: isLight ? "bg-violet-50" : "bg-violet-500/10",
      iconText: "text-violet-500",
    },
    sky: {
      iconBg: isLight ? "bg-sky-50" : "bg-sky-500/10",
      iconText: "text-sky-500",
    },
  };

  const scoreStroke = threatStats.score >= 80 ? "stroke-emerald-500" : threatStats.score >= 50 ? "stroke-amber-500" : "stroke-rose-500";
  const scoreTrack = isLight ? "stroke-emerald-100" : "stroke-emerald-500/20";

  // --- Modal styles ---
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`;

  // --- Escape key + body scroll lock for detail modal ---
  useEffect(() => {
    if (!showDetailModal) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDetailModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [showDetailModal]);

  // Cleanup scan interval on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // --- Handlers ---
  const handleRunScan = useCallback(() => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);

    scanIntervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const increment = Math.floor(Math.random() * 6) + 3; // 3-8
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
          // Use setTimeout to avoid state update during render
          setTimeout(() => {
            setScanning(false);
            setScanComplete(true);
            showToast.success("Security scan complete!");
          }, 200);
        }
        return next;
      });
    }, 200);
  }, [scanning]);

  const handleScanAgain = useCallback(() => {
    setScanComplete(false);
    handleRunScan();
  }, [handleRunScan]);

  const handleToggleItem = useCallback((label: string, newValue: boolean) => {
    if (!newValue) {
      // Turning off — show confirm
      setConfirmToggleItem(label);
    } else {
      // Turning on — just do it
      setItemToggles((prev) => ({ ...prev, [label]: true }));
      showToast.success(`${label} enabled`);
    }
  }, []);

  const handleConfirmDisable = useCallback(() => {
    if (!confirmToggleItem) return;
    setItemToggles((prev) => ({ ...prev, [confirmToggleItem]: false }));
    showToast.warning(`${confirmToggleItem} disabled`);
    setConfirmToggleItem(null);
  }, [confirmToggleItem]);

  const handleItemClick = useCallback((label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  }, []);

  const handleConfigure = useCallback((label: string) => {
    showToast.info(`${label} configuration opened`);
  }, []);

  const handleDownloadReport = useCallback(() => {
    showToast.success("Security report downloaded");
  }, []);

  return (
    <>
      <div className={cn(
        "rounded-2xl border overflow-hidden h-full flex flex-col",
        isLight
          ? "bg-white border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      )}>
        {/* Header */}
        <div className={cn(
          "px-5 py-4 border-b flex items-center justify-between",
          isLight ? "border-slate-200" : "border-[var(--bg-elevated)]"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h2 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                Security
              </h2>
              <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                Protection status
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetailModal(true)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
              accent.text,
              isLight ? "hover:bg-slate-100" : "hover:bg-slate-800"
            )}
          >
            View Details
          </button>
        </div>

        {/* Security Score */}
        <div className="p-5 flex-1 flex flex-col">
          <div className={cn(
            "rounded-xl p-4 mb-4 flex items-center gap-4",
            isLight ? "bg-slate-50" : "bg-slate-800/30"
          )}>
            <div className="relative">
              <svg className="w-16 h-16 -rotate-90" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  className={scoreTrack}
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  className={scoreStroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(threatStats.score / 100) * 176} 176`}
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-lg font-bold transition-colors", threatStats.score >= 80 ? "text-emerald-500" : threatStats.score >= 50 ? "text-amber-500" : "text-rose-500")}>
                  {threatStats.score}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className={cn("text-sm font-semibold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
                Security Score
              </div>
              <div className={cn("text-xs mb-2", isLight ? "text-slate-500" : "text-slate-500")}>
                {disabledCount === 0 ? "Your site is well protected" : `${disabledCount} protection${disabledCount > 1 ? "s" : ""} disabled`}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-rose-400">
                    {threatStats.blocked}
                  </span>
                  <span className={cn("text-[11px]", isLight ? "text-slate-500" : "text-slate-500")}>
                    blocked
                  </span>
                </div>
                <span className={isLight ? "text-slate-300" : "text-slate-700"}>|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-sky-400">
                    {threatStats.scanned}
                  </span>
                  <span className={cn("text-[11px]", isLight ? "text-slate-500" : "text-slate-500")}>
                    scanned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Items */}
          <div className="space-y-2">
            {securityItems.map((item) => {
              const colors = itemColorMap[item.color];
              const enabled = itemToggles[item.label] ?? true;
              const isExpanded = expandedItem === item.label;
              return (
                <div key={item.label}>
                  <div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer",
                      isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/30",
                      !enabled && "opacity-50"
                    )}
                    onClick={() => handleItemClick(item.label)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleItemClick(item.label); } }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      colors.iconBg
                    )}>
                      <svg
                        className={cn("w-4 h-4", colors.iconText)}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                        {item.label}
                      </div>
                      <div className={cn("text-xs truncate", isLight ? "text-slate-500" : "text-slate-500")}>
                        {item.detail}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        enabled={enabled}
                        onChange={(val) => handleToggleItem(item.label, val)}
                      />
                    </div>
                  </div>
                  {/* Expanded inline detail */}
                  {isExpanded && (
                    <div className={cn(
                      "mx-3 mb-2 p-3 rounded-lg text-xs space-y-2",
                      isLight ? "bg-slate-50 text-slate-500" : "bg-slate-800/20 text-slate-400"
                    )}>
                      <div>{item.configDetail}</div>
                      <div className="flex items-center justify-between">
                        <span>Last check: {item.lastCheck}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleConfigure(item.label); }}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                            accent.text,
                            isLight ? "bg-slate-100 hover:bg-slate-200" : "bg-slate-700 hover:bg-slate-600"
                          )}
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scan Results (inline) */}
          {scanComplete && (
            <div className={cn(
              "mt-3 p-3 rounded-xl text-xs flex items-center gap-2",
              isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
            )}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Scan complete! No threats found. 2 outdated plugins detected.</span>
            </div>
          )}

          {/* Action Button */}
          <div className={cn(
            "mt-4 pt-4 border-t",
            isLight ? "border-slate-100" : "border-slate-800"
          )}>
            {scanning ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-medium", isLight ? "text-slate-600" : "text-slate-300")}>
                    Scanning...
                  </span>
                  <span className={cn("text-xs font-semibold", accent.text)}>
                    {scanProgress}%
                  </span>
                </div>
                <div className={cn("h-2.5 rounded-full overflow-hidden", isLight ? "bg-slate-100" : "bg-slate-800")}>
                  <div
                    className={cn("h-full rounded-full transition-all duration-200", accent.button || "bg-violet-500")}
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            ) : scanComplete ? (
              <button
                onClick={handleScanAgain}
                className={cn(
                  "w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg",
                  accent.button,
                  accent.buttonHover,
                  accent.buttonShadow
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Scan Again
              </button>
            ) : (
              <button
                onClick={handleRunScan}
                className={cn(
                  "w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg",
                  accent.button,
                  accent.buttonHover,
                  accent.buttonShadow
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Run Security Scan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm disable toggle dialog */}
      <ConfirmDialog
        open={confirmToggleItem !== null}
        onClose={() => setConfirmToggleItem(null)}
        onConfirm={handleConfirmDisable}
        title={`Disable ${confirmToggleItem}?`}
        message={`Disabling ${confirmToggleItem} will reduce your security score. Your site will be more vulnerable to attacks.`}
        confirmText="Disable"
        cancelText="Keep Enabled"
        variant="warning"
      />

      {/* Security Details Modal */}
      {showDetailModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="sec-detail-title">
          <div className={modalBackdropClass} onClick={() => setShowDetailModal(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            {/* Close button */}
            <button
              onClick={() => setShowDetailModal(false)}
              className={cn(
                "absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-slate-800 text-slate-500"
              )}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 id="sec-detail-title" className={cn("text-lg font-semibold mb-5", isLight ? "text-slate-800" : "text-slate-100")}>
              Security Details
            </h3>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Large score circle */}
              <div className={cn("rounded-xl p-5 flex items-center gap-5", isLight ? "bg-slate-50" : "bg-slate-800/30")}>
                <div className="relative">
                  <svg className="w-24 h-24 -rotate-90" aria-hidden="true">
                    <circle cx="48" cy="48" r="42" fill="none" className={scoreTrack} strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="42" fill="none"
                      className={scoreStroke}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(threatStats.score / 100) * 264} 264`}
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className={cn("text-2xl font-bold", threatStats.score >= 80 ? "text-emerald-500" : threatStats.score >= 50 ? "text-amber-500" : "text-rose-500")}>
                        {threatStats.score}
                      </span>
                      <div className={cn("text-[10px]", isLight ? "text-slate-400" : "text-slate-500")}>/100</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={cn("text-sm font-semibold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
                    {threatStats.score >= 90 ? "Excellent" : threatStats.score >= 70 ? "Good" : "Needs Attention"}
                  </div>
                  <div className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
                    {disabledCount === 0
                      ? "All security features are active and working properly."
                      : `${disabledCount} feature${disabledCount > 1 ? "s" : ""} disabled. Enable all for maximum protection.`}
                  </div>
                </div>
              </div>

              {/* Security items expanded */}
              {securityItems.map((item) => {
                const colors = itemColorMap[item.color];
                const enabled = itemToggles[item.label] ?? true;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "rounded-xl p-4",
                      isLight ? "bg-slate-50" : "bg-slate-800/30",
                      !enabled && "opacity-50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", colors.iconBg)}>
                          <svg className={cn("w-4 h-4", colors.iconText)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={item.icon} />
                          </svg>
                        </div>
                        <span className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>
                          {item.label}
                        </span>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Toggle
                          enabled={enabled}
                          onChange={(val) => handleToggleItem(item.label, val)}
                        />
                      </div>
                    </div>
                    <div className={cn("text-xs space-y-1.5", isLight ? "text-slate-500" : "text-slate-400")}>
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <span className={cn(
                          "font-medium",
                          enabled ? "text-emerald-500" : "text-slate-400"
                        )}>
                          {enabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last check</span>
                        <span className="font-medium">{item.lastCheck}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Threats detected</span>
                        <span className={cn("font-medium", item.threatCount > 0 ? "text-amber-400" : "text-emerald-500")}>
                          {item.threatCount}
                        </span>
                      </div>
                      <div className={cn("pt-2 text-[11px]", isLight ? "text-slate-400" : "text-slate-500")}>
                        {item.configDetail}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Download Report */}
              <button
                onClick={handleDownloadReport}
                className={cn(
                  "w-full h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                  isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Security Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
