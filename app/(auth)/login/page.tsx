"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/lib/context/ThemeContext";
import { useAuth } from "@/lib/context/AuthContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ACCENT_STYLES: Record<string, { gradient: string; focusBorder: string; focusRing: string }> = {
  emerald: { gradient: "from-emerald-500 to-emerald-600", focusBorder: "border-emerald-500/40", focusRing: "ring-emerald-500/20" },
  sky: { gradient: "from-sky-500 to-sky-600", focusBorder: "border-sky-500/40", focusRing: "ring-sky-500/20" },
  violet: { gradient: "from-violet-500 to-violet-600", focusBorder: "border-violet-500/40", focusRing: "ring-violet-500/20" },
  rose: { gradient: "from-rose-500 to-rose-600", focusBorder: "border-rose-500/40", focusRing: "ring-rose-500/20" },
  amber: { gradient: "from-amber-500 to-amber-600", focusBorder: "border-amber-500/40", focusRing: "ring-amber-500/20" },
};

export default function LoginPage() {
  const router = useRouter();
  const { accentColor, resolvedTheme } = useTheme();
  const colors = getColorClasses(accentColor);
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.emerald;
  const isLight = resolvedTheme === "light";
  const { login } = useAuth();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [shaking, setShaking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await login(data.email, data.password);
      showToast.success("Welcome back!");
      router.push(ROUTES.DASHBOARD);
    } catch {
      setAuthError("Invalid email or password");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    triggerShake();
  };

  const inputBaseClasses = `w-full h-11 px-4 pl-11 text-sm rounded-xl border outline-none transition-all ${
    isLight
      ? `bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
      : `bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:${accent.focusBorder} focus:ring-1 focus:${accent.focusRing}`
  }`;

  return (
    <div className={`${shaking ? "animate-shake" : ""}`}>
      {/* Logo (mobile only, desktop has it in left panel) */}
      <div className="flex justify-center lg:hidden mb-8">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className={`text-xl font-bold tracking-tight ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            LimeWP
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
      </div>

      {/* Error Banner */}
      {authError && (
        <div className="mb-6 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm text-red-400">{authError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {/* Email */}
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
              {...register("email")}
              className={inputBaseClasses}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-[13px] mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
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
          {errors.password && (
            <p className="text-red-400 text-[13px] mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={`w-4 h-4 rounded border transition-colors ${
                isLight
                  ? "border-slate-300 accent-slate-800"
                  : "border-slate-600 accent-slate-300 bg-[var(--bg-elevated)]"
              }`}
            />
            <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Remember me
            </span>
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className={`text-sm font-medium transition-colors ${
              isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className={`flex-1 h-px ${isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"}`} />
        <span className="text-xs text-slate-500">or continue with</span>
        <div className={`flex-1 h-px ${isLight ? "bg-slate-200" : "bg-[var(--border-tertiary)]"}`} />
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => showToast.info("Google login coming soon")}
          className={`h-11 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            isLight
              ? "border-slate-200 text-slate-700 hover:bg-slate-50"
              : "border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => showToast.info("GitHub login coming soon")}
          className={`h-11 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            isLight
              ? "border-slate-200 text-slate-700 hover:bg-slate-50"
              : "border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className={`font-medium transition-colors ${
            isLight ? "text-slate-700 hover:text-slate-900" : "text-slate-300 hover:text-slate-100"
          }`}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
