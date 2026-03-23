"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const segments = buildBreadcrumbs(pathname, searchParams);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-4 flex items-center flex-wrap gap-y-1">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;

        return (
          <span key={i} className="flex items-center">
            {i > 0 && (
              <span
                className={`mx-2 select-none ${
                  isLight ? "text-slate-300" : "text-slate-600"
                }`}
              >
                /
              </span>
            )}
            {isLast || !seg.href ? (
              <span
                className={`font-semibold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {seg.label}
              </span>
            ) : (
              <Link
                href={seg.href}
                className={`transition-colors ${
                  isLight
                    ? "text-slate-500 hover:text-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {seg.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
