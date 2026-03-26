"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

// ─── Types ───

type SetupStep = 1 | 2 | 3;

const ACCENT_STYLES: Record<string, { focusBorder: string; focusRing: string }> = {
  emerald: { focusBorder: "border-emerald-500/40", focusRing: "ring-emerald-500/20" },
  sky: { focusBorder: "border-sky-500/40", focusRing: "ring-sky-500/20" },
  violet: { focusBorder: "border-violet-500/40", focusRing: "ring-violet-500/20" },
  rose: { focusBorder: "border-rose-500/40", focusRing: "ring-rose-500/20" },
  amber: { focusBorder: "border-amber-500/40", focusRing: "ring-amber-500/20" },
};

const MOCK_SECRET_KEY = "JBSW Y3DP EHPK 3PXP LH4Q WZDM";

const MOCK_BACKUP_CODES = [
  "a4f2-8c91", "b7e3-2d5f", "c1a9-6e84", "d8b5-3f72",
  "e2c6-9a17", "f5d4-7b38", "g3e8-1c65", "h9f1-4d29",
];

// ─── CodeInput Component ───

function CodeInput({
  onComplete,
  isLight,
  accent,
}: {
  onComplete: (code: string) => void;
  isLight: boolean;
  accent: { focusBorder: string; focusRing: string };
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      onComplete(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (next.every((d) => d !== "")) {
      onComplete(next.join(""));
    }
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          autoFocus={i === 0}
          className={`w-11 h-13 text-center text-lg font-semibold rounded-xl border outline-none transition-all ${
            isLight
              ? `bg-white border-slate-200 text-slate-800 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
              : `bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
          }`}
        />
      ))}
    </div>
  );
}

// ─── Step Indicator ───

function StepIndicator({
  currentStep,
  isLight,
  colors,
}: {
  currentStep: SetupStep;
  isLight: boolean;
  colors: ReturnType<typeof getColorClasses>;
}) {
  const steps = [
    { num: 1, label: "Scan QR" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Backup codes" },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step.num < currentStep
                  ? `bg-gradient-to-r ${colors.gradient} text-white`
                  : step.num === currentStep
                  ? `bg-gradient-to-r ${colors.gradient} text-white`
                  : isLight
                  ? "bg-slate-200 text-slate-500"
                  : "bg-[var(--bg-elevated)] text-slate-500"
              }`}
            >
              {step.num < currentStep ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                step.num <= currentStep
                  ? isLight ? "text-slate-700" : "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-px mx-2 ${
                step.num < currentStep
                  ? `bg-gradient-to-r ${colors.gradient}`
                  : isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── QR Code Placeholder ───

function QRCodePlaceholder({ isLight }: { isLight: boolean }) {
  return (
    <div
      className={`w-48 h-48 mx-auto rounded-2xl border-2 border-dashed flex items-center justify-center ${
        isLight ? "border-slate-300 bg-white" : "border-[var(--border-tertiary)] bg-[var(--bg-elevated)]"
      }`}
    >
      {/* Simple QR-like pattern */}
      <svg className={`w-32 h-32 ${isLight ? "text-slate-800" : "text-slate-200"}`} viewBox="0 0 100 100">
        {/* Top-left finder */}
        <rect x="5" y="5" width="25" height="25" rx="3" fill="currentColor" />
        <rect x="9" y="9" width="17" height="17" rx="2" fill={isLight ? "white" : "#1a1a2e"} />
        <rect x="13" y="13" width="9" height="9" rx="1" fill="currentColor" />
        {/* Top-right finder */}
        <rect x="70" y="5" width="25" height="25" rx="3" fill="currentColor" />
        <rect x="74" y="9" width="17" height="17" rx="2" fill={isLight ? "white" : "#1a1a2e"} />
        <rect x="78" y="13" width="9" height="9" rx="1" fill="currentColor" />
        {/* Bottom-left finder */}
        <rect x="5" y="70" width="25" height="25" rx="3" fill="currentColor" />
        <rect x="9" y="74" width="17" height="17" rx="2" fill={isLight ? "white" : "#1a1a2e"} />
        <rect x="13" y="78" width="9" height="9" rx="1" fill="currentColor" />
        {/* Data modules */}
        <rect x="35" y="5" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="45" y="5" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="55" y="5" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="35" y="15" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="50" y="15" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="35" y="25" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="45" y="25" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="60" y="25" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="5" y="35" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="15" y="35" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="25" y="35" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="40" y="35" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="55" y="35" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="70" y="35" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="85" y="35" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="5" y="45" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="20" y="45" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="35" y="45" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="50" y="45" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="65" y="45" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="80" y="45" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="10" y="55" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="25" y="55" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="40" y="55" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="55" y="55" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="75" y="55" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="90" y="55" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="35" y="65" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="50" y="65" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="65" y="65" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="80" y="65" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="35" y="75" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="45" y="75" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="60" y="75" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="75" y="75" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="90" y="75" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="40" y="85" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="55" y="85" width="5" height="5" fill="currentColor" opacity="0.6" />
        <rect x="70" y="85" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="85" y="85" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="50" y="90" width="5" height="5" fill="currentColor" opacity="0.8" />
        <rect x="65" y="90" width="5" height="5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

// ─── Main Component ───

export default function TwoFactorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") === "verify" ? "verify" : "setup";

  const { accentColor, resolvedTheme } = useTheme();
  const colors = getColorClasses(accentColor);
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.emerald;
  const isLight = resolvedTheme === "light";

  const [setupStep, setSetupStep] = useState<SetupStep>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCodeValue, setBackupCodeValue] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  const goToStep = useCallback((next: SetupStep) => {
    setVisible(false);
    setTransitioning(true);
    setTimeout(() => {
      setSetupStep(next);
      setTransitioning(false);
      requestAnimationFrame(() => setVisible(true));
    }, 200);
  }, []);

  const stepTransition = `transition-all duration-200 ${
    visible && !transitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  }`;

  const handleCopyKey = useCallback(async () => {
    await navigator.clipboard.writeText(MOCK_SECRET_KEY.replace(/\s/g, ""));
    setKeyCopied(true);
    showToast.success("Key copied to clipboard");
    setTimeout(() => setKeyCopied(false), 2000);
  }, []);

  const handleCopyAllCodes = useCallback(async () => {
    await navigator.clipboard.writeText(MOCK_BACKUP_CODES.join("\n"));
    setCodesCopied(true);
    showToast.success("Backup codes copied");
    setTimeout(() => setCodesCopied(false), 2000);
  }, []);

  const handleDownloadCodes = useCallback(() => {
    const content = `LimeWP Backup Codes\n${"=".repeat(30)}\n\nSave these codes in a safe place.\nEach code can only be used once.\n\n${MOCK_BACKUP_CODES.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\nGenerated: ${new Date().toLocaleDateString()}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "limewp-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("Backup codes downloaded");
  }, []);

  const handleCodeComplete = useCallback(async (_code: string) => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsVerifying(false);

    if (mode === "verify") {
      showToast.success("Verified successfully!");
      router.push(ROUTES.DASHBOARD);
    } else {
      goToStep(3);
    }
  }, [mode, router, goToStep]);

  const handleBackupCodeSubmit = useCallback(async () => {
    if (!backupCodeValue.trim()) return;
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsVerifying(false);
    showToast.success("Verified with backup code!");
    router.push(ROUTES.DASHBOARD);
  }, [backupCodeValue, router]);

  const handleSetupDone = useCallback(() => {
    showToast.success("Two-factor authentication enabled!");
    router.push(ROUTES.DASHBOARD);
  }, [router]);

  // ─── Mobile Logo ───
  const mobileLogo = (
    <div className="flex justify-center lg:hidden mb-8">
      <div className="flex items-center gap-2.5">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span className={`text-xl font-bold tracking-tight ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          LimeWP
        </span>
      </div>
    </div>
  );

  const inputBaseClasses = `w-full h-11 px-4 text-sm rounded-xl border outline-none transition-all ${
    isLight
      ? `bg-white border-slate-200 text-slate-800 placeholder-slate-500 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
      : `bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
  }`;

  // ════════════════════════════════════
  // MODE 2: VERIFY (login with 2FA)
  // ════════════════════════════════════
  if (mode === "verify") {
    return (
      <div>
        {mobileLogo}

        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
          }`}>
            <svg className={`w-8 h-8 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Two-factor authentication
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {useBackupCode
              ? "Enter one of your backup codes"
              : "Enter the 6-digit code from your authenticator app"
            }
          </p>
        </div>

        {useBackupCode ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                Backup code
              </label>
              <input
                type="text"
                value={backupCodeValue}
                onChange={(e) => setBackupCodeValue(e.target.value)}
                placeholder="xxxx-xxxx"
                autoFocus
                className={inputBaseClasses}
              />
            </div>

            <button
              onClick={handleBackupCodeSubmit}
              disabled={isVerifying || !backupCodeValue.trim()}
              className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {isVerifying ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>

            <p className="text-center text-sm">
              <button
                onClick={() => setUseBackupCode(false)}
                className={`font-medium transition-colors ${isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"}`}
              >
                Use authenticator code instead
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <CodeInput onComplete={handleCodeComplete} isLight={isLight} accent={accent} />

            {isVerifying && (
              <div className="flex justify-center">
                <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}

            <p className="text-center text-sm">
              <button
                onClick={() => setUseBackupCode(true)}
                className={`font-medium transition-colors ${isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"}`}
              >
                Use a backup code instead
              </button>
            </p>
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link
            href={ROUTES.LOGIN}
            className={`font-medium transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  // ════════════════════════════════════
  // MODE 1: SETUP WIZARD
  // ════════════════════════════════════
  return (
    <div className={stepTransition}>
      {mobileLogo}

      <div className="text-center mb-2">
        <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Set up two-factor authentication
        </h1>
        <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account</p>
      </div>

      <StepIndicator currentStep={setupStep} isLight={isLight} colors={colors} />

      {/* ─── Step 1: Scan QR ─── */}
      {setupStep === 1 && (
        <div className="space-y-6">
          <p className={`text-sm text-center ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>

          <QRCodePlaceholder isLight={isLight} />

          {/* Manual key */}
          <div className={`rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]"}`}>
            <p className={`text-xs mb-2 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              Can&apos;t scan? Enter this key manually:
            </p>
            <div className="flex items-center gap-2">
              <code className={`flex-1 text-sm font-mono tracking-wider ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                {MOCK_SECRET_KEY}
              </code>
              <button
                onClick={handleCopyKey}
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isLight ? "hover:bg-slate-200 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"
                }`}
              >
                {keyCopied ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => goToStep(2)}
            className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center`}
          >
            Next
          </button>
        </div>
      )}

      {/* ─── Step 2: Verify ─── */}
      {setupStep === 2 && (
        <div className="space-y-6">
          <p className={`text-sm text-center ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Enter the 6-digit code from your authenticator app to verify setup
          </p>

          <CodeInput onComplete={handleCodeComplete} isLight={isLight} accent={accent} />

          {isVerifying && (
            <div className="flex justify-center">
              <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          <p className="text-center text-sm">
            <button
              onClick={() => goToStep(1)}
              className={`font-medium transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}
            >
              Back
            </button>
          </p>
        </div>
      )}

      {/* ─── Step 3: Backup Codes ─── */}
      {setupStep === 3 && (
        <div className="space-y-5">
          {/* Warning banner */}
          <div className={`flex items-start gap-2.5 p-3 rounded-xl ${
            isLight ? "bg-amber-50 border border-amber-200" : "bg-amber-500/10 border border-amber-500/20"
          }`}>
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className={`text-xs leading-relaxed ${isLight ? "text-amber-800" : "text-amber-300"}`}>
              Save these codes in a safe place. Each code can only be used once. If you lose access to your authenticator app, you can use these to sign in.
            </p>
          </div>

          {/* Backup codes grid */}
          <div className={`rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]"}`}>
            <div className="grid grid-cols-2 gap-2.5">
              {MOCK_BACKUP_CODES.map((code, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg text-center font-mono text-sm tracking-wider ${
                    isLight ? "bg-white border border-slate-200 text-slate-700" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-slate-300"
                  }`}
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCodes}
              className={`h-10 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                isLight
                  ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                  : "border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </button>
            <button
              onClick={handleCopyAllCodes}
              className={`h-10 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                isLight
                  ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                  : "border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"
              }`}
            >
              {codesCopied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy all
                </>
              )}
            </button>
          </div>

          {/* Done button */}
          <button
            onClick={handleSetupDone}
            className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center`}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
