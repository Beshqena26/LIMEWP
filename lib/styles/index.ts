/**
 * Shared style class generators.
 * Eliminates duplication across 30+ component files.
 */

export function getCardClass(isLight: boolean): string {
  return `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;
}

export function getInputClass(isLight: boolean): string {
  return `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-slate-400"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 placeholder:text-slate-500 focus:border-[var(--border-secondary)]"
  }`;
}

export function getSelectClass(isLight: boolean): string {
  return `w-full h-10 px-3 rounded-xl border text-sm appearance-none cursor-pointer transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;
}

export function getLabelClass(isLight: boolean): string {
  return `text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`;
}

export function getModalOverlayClass(): string {
  return "fixed inset-0 z-[100] flex items-center justify-center p-4";
}

export function getModalBackdropClass(): string {
  return "absolute inset-0 bg-black/50 backdrop-blur-sm";
}

export function getModalCardClass(isLight: boolean): string {
  return `relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;
}

export function getTextClasses(isLight: boolean) {
  return {
    primary: isLight ? "text-slate-800" : "text-slate-100",
    secondary: isLight ? "text-slate-600" : "text-slate-400",
    tertiary: isLight ? "text-slate-500" : "text-slate-500",
    muted: isLight ? "text-slate-400" : "text-slate-600",
  };
}
