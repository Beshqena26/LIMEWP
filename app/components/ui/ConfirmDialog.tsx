"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  requireTypedConfirmation?: string; // e.g. "DELETE" — user must type this to enable confirm
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ConfirmVariant, { icon: string; iconBg: string; iconColor: string; button: string }> = {
  danger: {
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  info: {
    icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    button: "bg-sky-600 hover:bg-sky-700 text-white",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  requireTypedConfirmation,
  isLoading = false,
}: ConfirmDialogProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [typedValue, setTypedValue] = useState("");
  const style = VARIANT_STYLES[variant];
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  const canConfirm = requireTypedConfirmation
    ? typedValue === requireTypedConfirmation
    : true;

  // Reset typed value when dialog opens/closes
  useEffect(() => {
    if (!open) setTypedValue("");
  }, [open]);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      // Focus first focusable element after render
      requestAnimationFrame(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelector<HTMLElement>(
          'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Escape key + focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusableEls = dialog.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableEls.length === 0) return;
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleConfirm = useCallback(() => {
    if (!canConfirm || isLoading) return;
    onConfirm();
  }, [canConfirm, isLoading, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
          isLight
            ? "bg-white border border-slate-200"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
        }`}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center mb-4`}>
          <svg className={`w-6 h-6 ${style.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
          </svg>
        </div>

        {/* Title */}
        <h3 id="confirm-dialog-title" className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {title}
        </h3>

        {/* Message */}
        <p id="confirm-dialog-message" className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {message}
        </p>

        {/* Typed confirmation */}
        {requireTypedConfirmation && (
          <div className="mb-5">
            <label htmlFor="confirm-dialog-input" className={`text-sm mb-2 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Type <span className="font-mono font-semibold">{requireTypedConfirmation}</span> to confirm:
            </label>
            <input
              id="confirm-dialog-input"
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={requireTypedConfirmation}
              autoFocus
              className={`w-full h-10 px-3 text-sm rounded-xl border outline-none transition-all font-mono ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/20"
                  : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/20"
              }`}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
              isLight
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${style.button}`}
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
