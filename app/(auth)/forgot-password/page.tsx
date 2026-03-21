"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

// ─── Schemas ───

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character")
      .regex(/[A-Z]/, "Password must contain an uppercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type Step = 1 | 2 | 3 | 4;
type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): { level: PasswordStrength } {
  if (!password || password.length < 8) return { level: "weak" };
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  if (hasNumber && hasSpecial && hasUpper) return { level: "strong" };
  return { level: "medium" };
}

const STRENGTH_CONFIG: Record<PasswordStrength, { label: string; color: string; bg: string; width: string }> = {
  weak: { label: "Weak", color: "text-red-400", bg: "bg-red-500", width: "w-1/3" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500", width: "w-2/3" },
  strong: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-500", width: "w-full" },
};

const ACCENT_STYLES: Record<string, { focusBorder: string; focusRing: string }> = {
  emerald: { focusBorder: "border-emerald-500/40", focusRing: "ring-emerald-500/20" },
  sky: { focusBorder: "border-sky-500/40", focusRing: "ring-sky-500/20" },
  violet: { focusBorder: "border-violet-500/40", focusRing: "ring-violet-500/20" },
  rose: { focusBorder: "border-rose-500/40", focusRing: "ring-rose-500/20" },
  amber: { focusBorder: "border-amber-500/40", focusRing: "ring-amber-500/20" },
};

// ─── Code Input Component ───

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

// ─── Main Component ───

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { accentColor, resolvedTheme } = useTheme();
  const colors = getColorClasses(accentColor);
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.emerald;
  const isLight = resolvedTheme === "light";

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const goToStep = useCallback((next: Step) => {
    setVisible(false);
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
      requestAnimationFrame(() => setVisible(true));
    }, 200);
  }, []);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  // Step 1 form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Step 3 form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const passwordValue = useWatch({ control: passwordForm.control, name: "password", defaultValue: "" });
  const strength = getPasswordStrength(passwordValue);

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setEmail(data.email);
    setResendCooldown(60);
    goToStep(2);
  };

  const handleCodeComplete = async (_code: string) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    goToStep(3);
  };

  const handlePasswordSubmit = async (_data: PasswordFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    showToast.success("Password reset successfully!");
    goToStep(4);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    showToast.success("Code resent!");
  };

  const inputBaseClasses = `w-full h-11 px-4 pl-11 text-sm rounded-xl border outline-none transition-all ${
    isLight
      ? `bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
      : `bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
  }`;

  const stepTransition = `transition-all duration-200 ${
    visible && !transitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  }`;

  // ─── Mobile Logo (shared) ───
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

  // ─── Step 4: Success ───
  if (step === 4) {
    return (
      <div className={stepTransition}>
        {mobileLogo}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-emerald-500/10`}>
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Password reset successful
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center`}
          >
            Sign in with new password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${shaking ? "animate-shake" : ""} ${stepTransition}`}>
      {mobileLogo}

      {/* ─── Step 1: Enter Email ─── */}
      {step === 1 && (
        <>
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Reset your password
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your email and we&apos;ll send you a reset code
            </p>
          </div>

          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit, triggerShake)} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...emailForm.register("email")}
                  className={inputBaseClasses}
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-red-400 text-[13px] mt-1">{emailForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link
              href={ROUTES.LOGIN}
              className={`font-medium transition-colors ${isLight ? "text-slate-700 hover:text-slate-900" : "text-slate-300 hover:text-slate-100"}`}
            >
              Back to sign in
            </Link>
          </p>
        </>
      )}

      {/* ─── Step 2: Enter Code ─── */}
      {step === 2 && (
        <>
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Enter verification code
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              We sent a 6-digit code to{" "}
              <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <CodeInput onComplete={handleCodeComplete} isLight={isLight} accent={accent} />

            {isSubmitting && (
              <div className="flex justify-center">
                <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}

            <div className="text-center text-sm text-slate-500">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`font-medium transition-colors disabled:opacity-50 ${
                  isLight ? "text-slate-700 hover:text-slate-900" : "text-slate-300 hover:text-slate-100"
                }`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>

            <p className="text-center text-sm">
              <button
                onClick={() => goToStep(1)}
                className={`font-medium transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}
              >
                Back
              </button>
            </p>
          </div>
        </>
      )}

      {/* ─── Step 3: New Password ─── */}
      {step === 3 && (
        <>
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Set new password
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit, triggerShake)} className="space-y-4">
            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                New password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...passwordForm.register("password")}
                  className={`${inputBaseClasses} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.password && (
                <p className="text-red-400 text-[13px] mt-1">{passwordForm.formState.errors.password.message}</p>
              )}

              {/* Password Strength */}
              {passwordValue.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${STRENGTH_CONFIG[strength.level].color}`}>
                      {STRENGTH_CONFIG[strength.level].label}
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                    <div className={`h-full rounded-full transition-all duration-300 ${STRENGTH_CONFIG[strength.level].bg} ${STRENGTH_CONFIG[strength.level].width}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                  className={`${inputBaseClasses} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-400 text-[13px] mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
