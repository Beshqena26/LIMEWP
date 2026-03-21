"use client";

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  variant?: "text" | "card" | "circle" | "table" | "chart";
  width?: string;
  height?: string;
  className?: string;
  rows?: number;
  cols?: number;
  size?: string;
}

const shimmer = "skeleton-shimmer rounded-md";

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn(shimmer, "h-3", className)} />;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  rows = 3,
  cols = 4,
  size,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  if (size) {
    style.width = size;
    style.height = size;
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(shimmer, "rounded-full w-10 h-10 shrink-0", className)}
        style={style}
      />
    );
  }

  if (variant === "text") {
    const widths = ["w-full", "w-4/5", "w-3/5", "w-full", "w-2/3"];
    return (
      <div className={cn("flex flex-col gap-2.5", className)} style={style}>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBar key={i} className={widths[i % widths.length]} />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[var(--border-tertiary)] p-5 space-y-4",
          className
        )}
        style={style}
      >
        <div className="flex items-center gap-3">
          <div className={cn(shimmer, "rounded-full w-10 h-10 shrink-0")} />
          <div className="flex-1 space-y-2">
            <SkeletonBar className="w-1/2" />
            <SkeletonBar className="w-1/3 h-2" />
          </div>
        </div>
        <div className="space-y-2.5">
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-4/5" />
          <SkeletonBar className="w-3/5" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={cn("rounded-2xl border border-[var(--border-tertiary)] overflow-hidden", className)}
        style={style}
      >
        {/* Header */}
        <div className="flex gap-4 p-4 border-b border-[var(--border-tertiary)]">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className={cn(shimmer, "h-3 flex-1")} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex gap-4 p-4 border-b border-[var(--border-tertiary)] last:border-b-0"
          >
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={cn(shimmer, "h-3 flex-1")} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        className={cn(shimmer, "rounded-2xl h-48", className)}
        style={style}
      />
    );
  }

  return null;
}
