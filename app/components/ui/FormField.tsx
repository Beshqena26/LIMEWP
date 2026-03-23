"use client";

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTheme } from "@/lib/context/ThemeContext";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  error?: string;
  helperText?: string;
  register?: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
  rows?: number;
  disabled?: boolean;
  autoComplete?: string;
  icon?: string; // SVG path d attribute
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  helperText,
  register,
  options,
  rows = 4,
  disabled = false,
  autoComplete,
  icon,
}: FormFieldProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses = `w-full text-sm rounded-xl border outline-none transition-all ${
    error
      ? "border-red-400/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
      : isLight
      ? "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
      : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
  } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

  const inputClasses = `${baseClasses} h-11 px-4 ${icon ? "pl-11" : ""}`;
  const selectClasses = `${baseClasses} h-11 px-4`;
  const textareaClasses = `${baseClasses} px-4 py-3`;

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
    );
  };

  const renderPasswordToggle = () => {
    if (type !== "password") return null;
    return (
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
    );
  };

  return (
    <div>
      <label
        htmlFor={name}
        className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={textareaClasses}
          {...register}
        />
      ) : type === "select" ? (
        <select
          id={name}
          disabled={disabled}
          className={selectClasses}
          {...register}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {renderIcon()}
          <input
            id={name}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`${inputClasses} ${type === "password" ? "pr-11" : ""}`}
            {...register}
          />
          {renderPasswordToggle()}
        </div>
      )}

      {error && <p role="alert" className="text-red-400 text-[13px] mt-1">{error}</p>}
      {helperText && !error && (
        <p className={`text-[12px] mt-1 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{helperText}</p>
      )}
    </div>
  );
}
