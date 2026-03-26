"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES, createRoute } from "@/config/routes";
import { NAV_GROUPS, NAV_ICONS, SITES_DATA } from "@/config/navigation";
import { DOMAINS } from "@/data/site/domains";
import { TOOLS } from "@/data/site/tools";
import { SETTINGS_TABS } from "@/data/settings";

// ─── Types ───

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Sites" | "Domains" | "Tools" | "Settings" | "Navigation";
  icon: string;
  href: string;
}

type CategoryKey = SearchItem["category"];

// ─── Accent Styles ───

const ACCENT_STYLES = {
  emerald: { indicator: "border-emerald-500", activeBg: "bg-emerald-500/10", text: "text-emerald-500" },
  sky: { indicator: "border-sky-500", activeBg: "bg-sky-500/10", text: "text-sky-500" },
  violet: { indicator: "border-violet-500", activeBg: "bg-violet-500/10", text: "text-violet-500" },
  amber: { indicator: "border-amber-500", activeBg: "bg-amber-500/10", text: "text-amber-500" },
  pink: { indicator: "border-pink-500", activeBg: "bg-pink-500/10", text: "text-pink-500" },
};

// ─── Category Config ───

const CATEGORY_ORDER: CategoryKey[] = ["Sites", "Domains", "Tools", "Settings", "Navigation"];

const CATEGORY_ICONS: Record<CategoryKey, string> = {
  Sites: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  Domains: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.5 8.293a4.5 4.5 0 006.364 6.364l1.757-1.757",
  Tools: "M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z",
  Settings: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  Navigation: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
};

// ─── Build Search Index ───

const SEARCH_INDEX: SearchItem[] = [
  // Sites
  ...SITES_DATA.map((site) => ({
    id: `site-${site.name}`,
    title: site.name,
    subtitle: "Managed WordPress site",
    category: "Sites" as const,
    icon: site.icon,
    href: createRoute.site(site.name),
  })),
  // Domains
  ...DOMAINS.map((d) => ({
    id: `domain-${d.domain}`,
    title: d.domain,
    subtitle: d.primary ? "Primary domain" : "Domain alias",
    category: "Domains" as const,
    icon: CATEGORY_ICONS.Domains,
    href: `${ROUTES.SITE}?tab=domains`,
  })),
  // Tools
  ...TOOLS.map((t) => ({
    id: `tool-${t.title}`,
    title: t.title,
    subtitle: t.desc,
    category: "Tools" as const,
    icon: t.icon,
    href: `${ROUTES.SITE}?tab=tools`,
  })),
  // Settings
  ...SETTINGS_TABS.map((tab) => ({
    id: `settings-${tab.id}`,
    title: tab.label,
    subtitle: "Settings",
    category: "Settings" as const,
    icon: tab.icon,
    href: `/settings?tab=${tab.id}`,
  })),
  // Navigation
  ...NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      id: `nav-${item.label}`,
      title: item.label,
      subtitle: `${group.label} section`,
      category: "Navigation" as const,
      icon: item.icon,
      href: item.href,
    }))
  ),
];

// ─── Component ───

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);

  // Debounce raw query → query (200ms)
  useEffect(() => {
    const timer = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setRawQuery("");
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Compute filtered results
  const flatResults: SearchItem[] = query
    ? SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query)
      )
    : recentSearches.length > 0
    ? recentSearches
    : SEARCH_INDEX;

  const isShowingRecent = !query && recentSearches.length > 0;

  // Group results by category
  const grouped: { category: CategoryKey; items: SearchItem[] }[] = [];
  if (isShowingRecent) {
    grouped.push({ category: "Navigation" as CategoryKey, items: recentSearches });
  } else {
    for (const cat of CATEGORY_ORDER) {
      const items = flatResults.filter((r) => r.category === cat);
      if (items.length > 0) grouped.push({ category: cat, items });
    }
  }

  // Flat list for keyboard indexing
  const allItems = grouped.flatMap((g) => g.items);

  // Select an item
  const selectItem = useCallback(
    (item: SearchItem) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter((r) => r.id !== item.id);
        return [item, ...filtered].slice(0, 5);
      });
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < allItems.length - 1 ? prev + 1 : 0;
          document.querySelector(`[data-cmd-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
          return next;
        });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : allItems.length - 1;
          document.querySelector(`[data-cmd-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
          return next;
        });
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[activeIndex]) {
          selectItem(allItems[activeIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, allItems, activeIndex, selectItem]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Centering wrapper */}
      <div className="flex items-start justify-center pt-[15vh] px-4">
        <div
          className={`relative w-full max-w-[640px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
            isLight
              ? "bg-white border border-slate-200"
              : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
          }`}
        >
          {/* Search Input */}
          <div className={`flex items-center gap-3 px-4 h-14 border-b ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}>
            <svg
              className={`w-5 h-5 flex-shrink-0 ${isLight ? "text-slate-400" : "text-slate-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className={`flex-1 bg-transparent h-full outline-none text-sm ${
                isLight
                  ? "text-slate-800 placeholder:text-slate-500"
                  : "text-slate-100 placeholder:text-slate-500"
              }`}
            />
            <kbd
              className={`inline-flex items-center px-2 py-1 text-[10px] font-mono rounded-lg border flex-shrink-0 ${
                isLight
                  ? "text-slate-400 bg-slate-100 border-slate-200"
                  : "text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
              }`}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="overflow-y-auto max-h-[380px]">
            {grouped.length > 0 ? (
              <div className="py-2">
                {grouped.map((group) => (
                  <div key={group.category}>
                    {/* Section Header */}
                    <div className={`flex items-center gap-2 px-4 pt-3 pb-1.5 ${
                      isLight ? "text-slate-400" : "text-slate-500"
                    }`}>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={isShowingRecent
                          ? "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          : CATEGORY_ICONS[group.category]
                        } />
                      </svg>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {isShowingRecent ? "Recent Searches" : group.category}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="px-2">
                      {group.items.map((item) => {
                        const idx = flatIndex++;
                        const isActive = idx === activeIndex;
                        return (
                          <button
                            key={item.id}
                            data-cmd-index={idx}
                            onClick={() => selectItem(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                              isActive
                                ? `border-l-2 ${accent.indicator} ${accent.activeBg} ml-0`
                                : `border-l-2 border-transparent ${
                                    isLight
                                      ? "hover:bg-slate-100"
                                      : "hover:bg-[var(--bg-elevated)]"
                                  }`
                            }`}
                          >
                            {/* Icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? accent.activeBg
                                : isLight
                                ? "bg-slate-100"
                                : "bg-[var(--bg-secondary)]"
                            }`}>
                              <svg
                                className={`w-4 h-4 ${
                                  isActive
                                    ? accent.text
                                    : isLight
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d={item.icon} />
                              </svg>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                isLight ? "text-slate-800" : "text-slate-100"
                              }`}>
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {item.subtitle}
                              </p>
                            </div>

                            {/* Category Badge */}
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${
                              isLight
                                ? "bg-slate-100 text-slate-400"
                                : "bg-[var(--bg-secondary)] text-slate-500"
                            }`}>
                              {item.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <svg
                  className={`w-12 h-12 mb-4 ${isLight ? "text-slate-300" : "text-slate-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className={`text-sm font-medium mb-1 ${
                  isLight ? "text-slate-600" : "text-slate-300"
                }`}>
                  No results for &ldquo;{rawQuery}&rdquo;
                </p>
                <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Try a different search
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center gap-4 px-4 py-2.5 border-t ${
            isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-secondary)]/50"
          }`}>
            <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-primary)]"}`}>↑↓</kbd>
              navigate
            </span>
            <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-primary)]"}`}>↵</kbd>
              select
            </span>
            <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-primary)]"}`}>esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
