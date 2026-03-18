"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook to determine if a route is currently active.
 * Handles both pathname matching and query parameter matching.
 *
 * @example
 * const { isActive } = useActiveRoute();
 * isActive("/dashboard") // true if on /dashboard
 * isActive("/site?name=example.com") // true if on /site with name=example.com
 */
export function useActiveRoute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = useMemo(() => {
    return (href: string): boolean => {
      // Handle routes with query params
      if (href.includes("?")) {
        const [path, query] = href.split("?");
        if (pathname !== path) return false;

        const params = new URLSearchParams(query);
        for (const [key, value] of params) {
          if (searchParams.get(key) !== value) return false;
        }
        return true;
      }

      // Exact match
      return pathname === href;
    };
  }, [pathname, searchParams]);

  const isPathActive = useMemo(() => {
    return (path: string): boolean => {
      return pathname === path;
    };
  }, [pathname]);

  return {
    pathname,
    searchParams,
    isActive,
    isPathActive,
  };
}
