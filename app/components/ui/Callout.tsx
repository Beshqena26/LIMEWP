"use client";

import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "success" | "error";

interface CalloutProps {
  variant?: CalloutVariant;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { bg: string; border: string; glow: string; iconBg: string; iconRing: string; titleColor: string }> = {
  info: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "from-sky-500/20",
    iconBg: "bg-sky-500/20",
    iconRing: "ring-sky-500/30",
    titleColor: "text-sky-400",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "from-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconRing: "ring-amber-500/30",
    titleColor: "text-amber-400",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "from-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    iconRing: "ring-emerald-500/30",
    titleColor: "text-emerald-400",
  },
  error: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "from-rose-500/20",
    iconBg: "bg-rose-500/20",
    iconRing: "ring-rose-500/30",
    titleColor: "text-rose-400",
  },
};

const variantIcons: Record<CalloutVariant, string> = {
  info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
  warning: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  success: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
};

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const styles = variantStyles[variant];
  const iconPath = variantIcons[variant];

  return (
    <div className={cn("relative rounded-xl p-4 overflow-hidden border", styles.bg, styles.border, className)}>
      <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl to-transparent rounded-full -translate-y-1/2 translate-x-1/3", styles.glow)} />
      <div className="relative flex gap-4">
        <div className={cn("w-10 h-10 rounded-xl ring-1 flex items-center justify-center flex-shrink-0", styles.iconBg, styles.iconRing)}>
          <svg className={cn("w-5 h-5", styles.titleColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
        <div>
          <div className={cn("font-semibold mb-1", styles.titleColor)}>{title}</div>
          <div className="text-sm text-zinc-400">{children}</div>
        </div>
      </div>
    </div>
  );
}
