"use client";

import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

interface IconBoxProps {
  icon: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline" | "gradient";
  className?: string;
}

const sizes = {
  sm: { box: "w-7 h-7", icon: "w-3.5 h-3.5" },
  md: { box: "w-10 h-10", icon: "w-5 h-5" },
  lg: { box: "w-12 h-12", icon: "w-6 h-6" },
};

export function IconBox({ icon, color = "emerald", size = "md", variant = "outline", className }: IconBoxProps) {
  const colors = getColorClasses(color);
  const sizeClasses = sizes[size];

  const variantClasses = {
    filled: cn(colors.gradient, "text-white shadow-lg"),
    outline: cn(colors.bg, colors.text, "ring-1", colors.ring),
    gradient: cn("bg-gradient-to-br", colors.gradient, "text-white shadow-lg"),
  };

  return (
    <div className={cn("rounded-xl flex items-center justify-center", sizeClasses.box, variantClasses[variant], className)}>
      <svg className={cn(sizeClasses.icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
    </div>
  );
}
