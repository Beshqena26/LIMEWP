"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  glowPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  borderColor?: string;
  hoverBorder?: boolean;
}

const glowPositions = {
  "top-right": "-translate-y-1/2 translate-x-1/3 top-0 right-0",
  "top-left": "-translate-y-1/2 -translate-x-1/3 top-0 left-0",
  "bottom-right": "translate-y-1/2 translate-x-1/3 bottom-0 right-0",
  "bottom-left": "translate-y-1/2 -translate-x-1/3 bottom-0 left-0",
};

export const GlowCard = React.memo(function GlowCard({
  children,
  glowColor = "emerald",
  glowPosition = "top-right",
  className,
  borderColor,
  hoverBorder = true,
}: GlowCardProps) {
  const colors = getColorClasses(glowColor);

  return (
    <div className={cn(
      "relative bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] rounded-2xl border overflow-hidden",
      borderColor || "border-[var(--border-tertiary)]",
      hoverBorder && "hover:border-[var(--border-primary)]",
      "transition-all",
      className
    )}>
      <div className={cn(
        "absolute w-48 h-48 bg-gradient-to-bl to-transparent rounded-full opacity-60",
        colors.bg,
        glowPositions[glowPosition]
      )} />
      <div className="relative">{children}</div>
    </div>
  );
});
