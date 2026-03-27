"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { TWO_FACTOR_OPTIONS, ACTIVE_SESSIONS } from "@/data/settings";
import { passwordChangeSchema, type PasswordChangeFormData } from "@/lib/validations";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

// ─── Login History Data ───
const LOGIN_HISTORY = [
  { device: "Chrome on macOS", ip: "192.168.1.1", location: "San Francisco, US", time: "2 hours ago", current: true },
  { device: "Safari on iPhone", ip: "10.0.0.5", location: "San Francisco, US", time: "1 day ago", current: false },
  { device: "Firefox on Windows", ip: "203.0.113.50", location: "New York, US", time: "3 days ago", current: false },
  { device: "Chrome on Android", ip: "172.16.0.1", location: "Los Angeles, US", time: "1 week ago", current: false },
];

// ─── Recovery Codes ───
const RECOVERY_CODES = [
  "A7K2-M9X4", "B3P8-N1Q6", "C5R0-W2Y7", "D8T3-V4Z1",
  "E6U5-J9L2", "F1W7-H3M8", "G4X9-K6N0", "H2Y1-P5R3",
];

// ─── Password Strength ───
type StrengthLevel = "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): { level: StrengthLevel; label: string; percent: number; color: string } {
  if (!password) return { level: "weak", label: "Weak", percent: 0, color: "bg-rose-500" };

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (password.length >= 10 && hasUpper && hasLower && hasNumber && hasSpecial) {
    return { level: "strong", label: "Strong", percent: 100, color: "bg-emerald-500" };
  }
  if (password.length >= 8 && hasNumber) {
    return { level: "good", label: "Good", percent: 75, color: "bg-sky-500" };
  }
  if (password.length >= 6) {
    return { level: "fair", label: "Fair", percent: 50, color: "bg-amber-500" };
  }
  return { level: "weak", label: "Weak", percent: 25, color: "bg-rose-500" };
}

// ─── Main Export ───
export function SecurityTab() {
  return (
    <div className="space-y-6">
      <PasswordCard />
      <TwoFactorCard />
      <SessionsCard />
      <LoginHistoryCard />
      <DangerZone />
    </div>
  );
}

// ─── Password Card ───
function PasswordCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");

  const strength = useMemo(() => getPasswordStrength(newPasswordValue), [newPasswordValue]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const errorInputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none border-red-400 focus:border-red-500 ${
    isLight ? "bg-white text-slate-800" : "bg-[var(--bg-elevated)] text-slate-200"
  }`;

  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  const onSubmit = async (_data: PasswordChangeFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    reset();
    setNewPasswordValue("");
    showToast.success("Password updated");
  };

  const onError = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const { onChange: rhfOnChange, ...newPasswordProps } = register("newPassword");

  return (
    <div className={`relative overflow-hidden ${cardClass}`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Change Password</h3>
            <p className="text-xs text-slate-500">Update your password regularly for security</p>
          </div>
        </div>

        <p className={`text-xs mb-6 ml-[52px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
          Last changed: 45 days ago
        </p>

        <form onSubmit={handleSubmit(onSubmit, onError)} className={`space-y-4 max-w-md ${shake ? "animate-shake" : ""}`}>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className={errors.currentPassword ? errorInputClass : inputClass}
              {...register("currentPassword")}
            />
            {errors.currentPassword && <p className="text-red-400 text-[13px] mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className={errors.newPassword ? errorInputClass : inputClass}
              {...newPasswordProps}
              onChange={(e) => {
                rhfOnChange(e);
                setNewPasswordValue(e.target.value);
              }}
            />
            {errors.newPassword ? (
              <p className="text-red-400 text-[13px] mt-1">{errors.newPassword.message}</p>
            ) : (
              <>
                {/* Password Strength Indicator */}
                {newPasswordValue.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-medium ${
                        strength.level === "weak" ? "text-rose-500" :
                        strength.level === "fair" ? "text-amber-500" :
                        strength.level === "good" ? "text-sky-500" :
                        "text-emerald-500"
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-700"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <svg className={`w-3.5 h-3.5 ${isLight ? "text-slate-400" : "text-slate-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  12+ characters, mixed case, numbers, symbols
                </p>
              </>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className={errors.confirmPassword ? errorInputClass : inputClass}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-400 text-[13px] mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg ${accent.buttonShadow} mt-2 transition-all disabled:opacity-60 flex items-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Two-Factor Card ───
function TwoFactorCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  const has2FAEnabled = TWO_FACTOR_OPTIONS.some((opt) => opt.enabled === true);

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(RECOVERY_CODES.join("\n"));
    showToast.success("Recovery codes copied to clipboard");
  };

  const handleDownloadCodes = () => {
    const content = `LimeWP Recovery Codes\n${"=".repeat(30)}\n\nStore these codes in a safe place.\nEach code can only be used once.\n\n${RECOVERY_CODES.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "limewp-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("Recovery codes downloaded");
  };

  return (
    <>
      <div className={`relative overflow-hidden ${cardClass}`}>
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Two-Factor Authentication</h3>
              <p className="text-xs text-slate-500">Add an extra layer of security</p>
            </div>
          </div>

          <div className="space-y-3">
            {TWO_FACTOR_OPTIONS.map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                isLight
                  ? "bg-slate-50 hover:bg-slate-100"
                  : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-slate-200" : "bg-[var(--bg-secondary)]"
                  }`}>
                    <svg className={`w-4 h-4 ${isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.enabled !== null && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.enabled
                        ? `${accent.bg} ${accent.text}`
                        : isLight ? "bg-slate-200 text-slate-500" : "bg-slate-700/50 text-slate-500"
                    }`}>
                      {item.enabled ? "Enabled" : "Disabled"}
                    </span>
                  )}
                  <button
                    onClick={() => showToast.success("Two-factor authentication updated")}
                    className={`font-medium text-xs rounded-lg h-8 px-3 transition-colors ${
                      isLight
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900"
                        : "bg-[var(--border-primary)] text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.enabled === null ? "Generate" : item.enabled ? "Manage" : "Setup"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View Recovery Codes button - shown when 2FA is enabled */}
          {has2FAEnabled && (
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700/50">
              <button
                onClick={() => setShowRecoveryCodes(true)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${accent.text} hover:opacity-80`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                View Recovery Codes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recovery Codes Modal */}
      <RecoveryCodesModal
        open={showRecoveryCodes}
        onClose={() => setShowRecoveryCodes(false)}
        onCopy={handleCopyCodes}
        onDownload={handleDownloadCodes}
      />
    </>
  );
}

// ─── Recovery Codes Modal ───
function RecoveryCodesModal({
  open,
  onClose,
  onCopy,
  onDownload,
}: {
  open: boolean;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
}) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      requestAnimationFrame(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelector<HTMLElement>('button:not([disabled])');
        focusable?.focus();
      });
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-codes-title"
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
          isLight
            ? "bg-white border border-slate-200"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h3 id="recovery-codes-title" className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Recovery Codes</h3>
            <p className="text-xs text-slate-500">Store these codes in a safe place</p>
          </div>
        </div>

        <p className={`text-sm mb-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          Each code can only be used once. If you lose access to your authenticator, use one of these codes to sign in.
        </p>

        {/* Codes Grid */}
        <div className={`grid grid-cols-2 gap-2 p-4 rounded-xl mb-4 font-mono text-sm ${
          isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
        }`}>
          {RECOVERY_CODES.map((code) => (
            <div
              key={code}
              className={`text-center py-2 rounded-lg ${
                isLight ? "bg-white text-slate-700" : "bg-[var(--bg-secondary)] text-slate-300"
              }`}
            >
              {code}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDownload}
            className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[var(--bg-elevated)] text-slate-300 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
          <button
            onClick={onCopy}
            className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[var(--bg-elevated)] text-slate-300 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copy
          </button>
          <button
            onClick={onClose}
            className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r ${accent.gradient} text-white shadow-lg ${accent.buttonShadow}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sessions Card ───
function SessionsCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [revokeSession, setRevokeSession] = useState<number | null>(null);
  const [revokeAllDialog, setRevokeAllDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  const handleRevoke = async () => {
    setIsRevoking(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRevoking(false);
    setRevokeSession(null);
    showToast.warning("Session revoked");
  };

  const handleRevokeAll = async () => {
    setIsRevoking(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsRevoking(false);
    setRevokeAllDialog(false);
    showToast.warning("All other sessions revoked");
  };

  return (
    <>
      <div className={`relative overflow-hidden ${cardClass}`}>
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <div>
                <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Active Sessions</h3>
                <p className="text-xs text-slate-500">Manage your logged-in devices</p>
              </div>
            </div>
            {ACTIVE_SESSIONS.filter((s) => !s.current).length > 0 && (
              <button
                onClick={() => setRevokeAllDialog(true)}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
              >
                Revoke All Others
              </button>
            )}
          </div>

          <div className="space-y-3">
            {ACTIVE_SESSIONS.map((session, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
                isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    session.current
                      ? accent.bg
                      : isLight ? "bg-slate-200" : "bg-[var(--bg-secondary)]"
                  }`}>
                    <svg className={`w-4 h-4 ${session.current ? accent.text : isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={session.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{session.device}</p>
                    <p className="text-[11px] text-slate-500">{session.location} · {session.time}</p>
                  </div>
                </div>
                {session.current ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${accent.bg} ${accent.text}`}>
                    Current
                  </span>
                ) : (
                  <button
                    onClick={() => setRevokeSession(i)}
                    className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-medium text-xs rounded-lg h-8 px-3 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={revokeSession !== null}
        onClose={() => setRevokeSession(null)}
        onConfirm={handleRevoke}
        title="Revoke Session"
        message="This will immediately log out this device. The user will need to sign in again to regain access."
        confirmText="Revoke Session"
        variant="warning"
        isLoading={isRevoking}
      />

      <ConfirmDialog
        open={revokeAllDialog}
        onClose={() => setRevokeAllDialog(false)}
        onConfirm={handleRevokeAll}
        title="Revoke All Sessions"
        message="This will immediately log out all other devices. Only your current session will remain active."
        confirmText="Revoke All"
        variant="warning"
        isLoading={isRevoking}
      />
    </>
  );
}

// ─── Login History Card ───
function LoginHistoryCard() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const cardClass = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  return (
    <div className={`relative overflow-hidden ${cardClass}`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Login History</h3>
            <p className="text-xs text-slate-500">Recent sign-in activity on your account</p>
          </div>
        </div>

        <div className="space-y-3">
          {LOGIN_HISTORY.map((entry, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${
              isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/50"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  entry.current
                    ? accent.bg
                    : isLight ? "bg-slate-200" : "bg-[var(--bg-secondary)]"
                }`}>
                  <svg className={`w-4 h-4 ${entry.current ? accent.text : isLight ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{entry.device}</p>
                  <p className="text-[11px] text-slate-500">
                    {entry.ip} · {entry.location} · {entry.time}
                  </p>
                </div>
              </div>
              {entry.current && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${accent.bg} ${accent.text}`}>
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Danger Zone ───
function DangerZone() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsDeleting(false);
    setShowDeleteDialog(false);
    showToast.error("Account deletion requested");
  };

  return (
    <>
      <div className={`relative rounded-2xl border border-rose-500/20 overflow-hidden ${
        isLight
          ? "bg-rose-50/50"
          : "bg-gradient-to-br from-rose-500/5 to-[var(--gradient-card-to)]"
      }`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-rose-400">Danger Zone</h3>
              <p className="text-xs text-slate-500">Irreversible actions</p>
            </div>
          </div>
          <p className={`text-sm mb-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm rounded-xl h-10 px-5 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="This action cannot be undone. All your sites, data, and settings will be permanently deleted. You will lose access to everything associated with this account."
        confirmText="Delete Account"
        variant="danger"
        requireTypedConfirmation="DELETE"
        isLoading={isDeleting}
      />
    </>
  );
}
