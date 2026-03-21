"use client";

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";

type SiteButtonVariant = "primary" | "secondary" | "flat" | "danger" | "warning" | "icon" | "link";
type SiteButtonColor = "slate";
type SiteButtonSize = "xs" | "sm" | "md";

interface SiteButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: SiteButtonVariant;
  color?: SiteButtonColor;
  size?: SiteButtonSize;
  startContent?: ReactNode;
  endContent?: ReactNode;
  fullWidth?: boolean;
}

const SIZE_CLASSES: Record<SiteButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5",
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-1.5",
};

const ICON_SIZE_CLASSES: Record<SiteButtonSize, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

export const SiteButton = forwardRef<HTMLButtonElement, SiteButtonProps>(function SiteButton({
  variant = "secondary",
  color = "slate",
  size = "md",
  startContent,
  endContent,
  fullWidth,
  children,
  className = "",
  ...props
}, ref) {
  const baseClasses = "flex items-center justify-center rounded-xl transition-all";
  const widthClass = fullWidth ? "w-full" : "inline-flex";

  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20";
      break;

    case "secondary":
      variantClasses = "font-medium ring-1 ring-border text-sub hover:text-sub hover:bg-muted/10 hover:ring-muted/50";
      break;

    case "flat":
      variantClasses = "font-medium " + getFlatClasses(color);
      break;

    case "danger":
      variantClasses = "font-medium ring-1 ring-border text-sub hover:bg-error/10 hover:text-error hover:ring-error/30";
      break;

    case "warning":
      variantClasses = "font-medium bg-muted/10 text-sub ring-1 ring-muted/20 hover:bg-muted/20";
      break;

    case "icon":
      variantClasses = getIconClasses(color);
      break;

    case "link":
      variantClasses = "font-medium text-sub hover:text-heading";
      break;
  }

  const sizeClass = variant === "icon"
    ? ICON_SIZE_CLASSES[size]
    : SIZE_CLASSES[size];

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${widthClass} ${sizeClass} ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {startContent}
      {children}
      {endContent}
    </button>
  );
});

function getFlatClasses(color: SiteButtonColor): string {
  return "bg-surface text-heading ring-1 ring-border hover:bg-surface-2";
}

function getIconClasses(color: SiteButtonColor): string {
  return "bg-surface-2/70 text-sub ring-1 ring-border hover:bg-border";
}
