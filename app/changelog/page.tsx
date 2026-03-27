"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "../landing-components";
import { navLinks } from "../landing-data";
import { Footer } from "../landing-sections/Sections";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES } from "@/config/routes";
import { showToast } from "@/lib/toast";
import "../landing.css";

/* ────────────────────────── Types ────────────────────────── */

type EntryType = "Feature" | "Improvement" | "Fix" | "Security";

interface ChangelogEntry {
  date: string;
  version: string;
  type: EntryType;
  title: string;
  description: string;
  changes: string[];
}

/* ────────────────────────── Data ────────────────────────── */

const TYPE_CONFIG: Record<EntryType, { color: string; text: string; bg: string; dot: string }> = {
  Feature:     { color: "#10b981", text: "#10b981", bg: "rgba(16,185,129,.1)",  dot: "#10b981" },
  Improvement: { color: "#0ea5e9", text: "#0ea5e9", bg: "rgba(14,165,233,.1)",  dot: "#0ea5e9" },
  Fix:         { color: "#f59e0b", text: "#f59e0b", bg: "rgba(245,158,11,.1)",  dot: "#f59e0b" },
  Security:    { color: "#f43f5e", text: "#f43f5e", bg: "rgba(244,63,94,.1)",   dot: "#f43f5e" },
};

const FILTER_OPTIONS: Array<{ label: string; value: EntryType | "All" }> = [
  { label: "All", value: "All" },
  { label: "Features", value: "Feature" },
  { label: "Improvements", value: "Improvement" },
  { label: "Fixes", value: "Fix" },
  { label: "Security", value: "Security" },
];

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Mar 25, 2026",
    version: "v2.4.0",
    type: "Feature",
    title: "DNS Management Overhaul",
    description: "A complete reimagining of the DNS management experience with new record types, one-click templates, and a real-time propagation checker so you always know when your changes have gone live.",
    changes: [
      "Added support for CAA, NAPTR, and SSHFP record types",
      "One-click DNS templates for common configurations (Google Workspace, Microsoft 365, Cloudflare)",
      "Real-time propagation checker with 20+ global vantage points",
      "Bulk import/export of DNS records via CSV and BIND zone files",
      "Visual diff view for pending DNS changes before publishing",
    ],
  },
  {
    date: "Mar 20, 2026",
    version: "v2.3.2",
    type: "Fix",
    title: "SSL Certificate Renewal",
    description: "Resolved a timing issue that caused SSL certificate auto-renewal to trigger too late, occasionally resulting in brief periods where certificates had expired before replacements were issued.",
    changes: [
      "Auto-renewal now triggers 30 days before expiry (previously 7 days)",
      "Added retry logic with exponential backoff for failed renewal attempts",
      "New email notification sent when renewal is initiated and completed",
      "Fixed edge case where wildcard certificates were not included in auto-renewal queue",
    ],
  },
  {
    date: "Mar 15, 2026",
    version: "v2.3.1",
    type: "Improvement",
    title: "Dashboard Redesign",
    description: "The main dashboard has been redesigned from the ground up to surface the most important information at a glance, making it easier for non-technical users to understand their site health.",
    changes: [
      "New at-a-glance health cards showing uptime, performance score, and security status",
      "Simplified site overview with traffic spark lines and storage usage rings",
      "Quick action buttons for the most common tasks (clear cache, backup, update plugins)",
      "Responsive grid layout that adapts to any screen size",
      "Reduced initial dashboard load time by 40% with optimized data fetching",
    ],
  },
  {
    date: "Mar 10, 2026",
    version: "v2.3.0",
    type: "Feature",
    title: "Migration Wizard",
    description: "Migrate your WordPress site to LimeWP from any hosting provider with our new 4-step guided wizard. Supports 12 popular hosting providers with automatic credential detection and zero-downtime cutover.",
    changes: [
      "4-step guided migration: connect, scan, transfer, verify",
      "Direct integrations with 12 hosting providers (SiteGround, Bluehost, GoDaddy, WP Engine, and more)",
      "Automatic database and file transfer with real-time progress tracking",
      "DNS migration assistant with step-by-step instructions per registrar",
      "Post-migration health check that verifies all links, images, and forms are working",
    ],
  },
  {
    date: "Mar 5, 2026",
    version: "v2.2.1",
    type: "Security",
    title: "WAF Rules Update",
    description: "Our Web Application Firewall has been updated with 50 new threat signatures targeting the latest attack vectors, including recently discovered WordPress plugin vulnerabilities.",
    changes: [
      "50 new threat signatures covering SQL injection, XSS, and RCE vectors",
      "Updated rule sets for 15 recently patched WordPress plugin vulnerabilities",
      "Improved bot detection with machine learning-based behavioral analysis",
      "New geographic blocking rules with country-level granularity",
      "Reduced false positive rate by 35% through refined pattern matching",
    ],
  },
  {
    date: "Feb 28, 2026",
    version: "v2.2.0",
    type: "Feature",
    title: "Staging Environment",
    description: "Create a perfect copy of your production site for testing. Push changes selectively or pull production data into staging, all with granular control over what gets synced.",
    changes: [
      "One-click staging environment creation from any production site",
      "Selective push: choose specific files, database tables, or plugins to deploy",
      "Pull production data into staging with automatic URL replacement",
      "Password protection and IP restriction for staging sites",
      "Staging environment access management with team permissions",
    ],
  },
  {
    date: "Feb 20, 2026",
    version: "v2.1.0",
    type: "Improvement",
    title: "Performance Monitoring",
    description: "Enhanced performance monitoring with multi-region uptime checks from 12 global locations, SSL certificate monitoring, and detailed response time breakdowns.",
    changes: [
      "Multi-region uptime checks from 12 locations across 6 continents",
      "SSL certificate expiry monitoring with automated alerts at 30, 14, and 7 days",
      "Response time breakdown showing DNS, TCP, TLS, TTFB, and full load timings",
      "New performance trend graphs with 90-day historical data",
      "Configurable alert thresholds for response time and uptime percentage",
    ],
  },
  {
    date: "Feb 15, 2026",
    version: "v2.0.0",
    type: "Feature",
    title: "LimeWP 2.0 Launch",
    description: "A complete platform redesign built from scratch. LimeWP 2.0 introduces a modern dashboard, new infrastructure powered by edge computing, and a suite of developer tools designed for the modern WordPress workflow.",
    changes: [
      "Completely redesigned dashboard with dark mode, accent colors, and responsive layout",
      "New edge computing infrastructure with automatic nearest-region deployment",
      "Built-in Git integration for version-controlled WordPress development",
      "REST API v2 with full OpenAPI documentation and webhook support",
      "New CLI tool for managing sites, deployments, and backups from the terminal",
      "Team collaboration features with role-based access control",
    ],
  },
];

/* ────────────────────────── Component ────────────────────────── */

export default function ChangelogPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme;

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EntryType | "All">("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === "light" ? "dark" : "light"),
    [resolvedTheme, setTheme]
  );

  const onSignup = useCallback(() => {
    window.location.href = ROUTES.REGISTER;
  }, []);

  const filteredEntries = activeFilter === "All"
    ? CHANGELOG
    : CHANGELOG.filter((entry) => entry.type === activeFilter);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      showToast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    showToast.success("Subscribed to changelog updates!");
  };

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav style={scrolled ? { backdropFilter: "blur(20px)" } : undefined}>
        <a href="/" className="nav-logo">
          <img src="/limewp-logo.svg" alt="LimeWP" width="120" height="32" style={{ display: "block" }} />
        </a>
        <div className="nav-mid">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (l.href.startsWith("#")) {
                  e.preventDefault();
                  window.location.href = "/" + l.href;
                }
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon name={theme === "light" ? "sun" : "moon"} />
          </button>
          <button className="nav-login" onClick={() => { window.location.href = ROUTES.LOGIN; }}>
            Sign In
          </button>
          <button className="nav-cta" onClick={onSignup}>
            Start Free
          </button>
          <button className={`burger${mobileMenu ? " open" : ""}`} onClick={() => setMobileMenu((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu-overlay${mobileMenu ? " open" : ""}`} onClick={() => setMobileMenu(false)} />
      <div className={`mobile-menu${mobileMenu ? " open" : ""}`}>
        <div className="mobile-menu-links">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (l.href.startsWith("#")) {
                  e.preventDefault();
                  setMobileMenu(false);
                  window.location.href = "/" + l.href;
                } else {
                  setMobileMenu(false);
                }
              }}
            >
              <Icon name={l.icon} width={18} height={18} />
              {l.label}
            </a>
          ))}
        </div>
        <div className="mobile-menu-actions">
          <button className="btn btn-s" onClick={() => { setMobileMenu(false); window.location.href = ROUTES.LOGIN; }}>Sign In</button>
          <button className="btn btn-p" onClick={() => { setMobileMenu(false); onSignup(); }}>Start Free</button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ paddingTop: 120, paddingBottom: 80, position: "relative", zIndex: 2 }}>
        <div className="container" style={{ maxWidth: 900 }}>

          {/* Page Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 32 }}>
              <div style={{ maxWidth: 520 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16,
                    background: "var(--acc-a10)",
                    color: "var(--acc)",
                    border: "1px solid var(--acc-a20, rgba(132,204,22,.2))",
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                  What&apos;s New
                </div>
                <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: "var(--c1)", fontFamily: "var(--fd)", marginBottom: 8 }}>
                  Changelog
                </h1>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--c3)" }}>
                  Latest updates, improvements, and fixes to the LimeWP platform.
                </p>
              </div>

              {/* Subscribe */}
              {!subscribed ? (
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    style={{
                      height: 40,
                      width: 200,
                      padding: "0 12px",
                      borderRadius: 12,
                      fontSize: 14,
                      border: "1px solid var(--bdrs)",
                      background: "var(--bg2)",
                      color: "var(--c1)",
                      outline: "none",
                      transition: "border-color .2s",
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    style={{
                      height: 40,
                      padding: "0 16px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      background: "var(--acc)",
                      cursor: "pointer",
                      transition: "transform .15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "none",
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    Subscribe
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, background: "rgba(16,185,129,.1)", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="#10b981" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#10b981" }}>Subscribed</span>
                </div>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FILTER_OPTIONS.map((option) => {
                const isActive = activeFilter === option.value;
                const typeConfig = option.value !== "All" ? TYPE_CONFIG[option.value as EntryType] : null;
                return (
                  <button
                    key={option.value}
                    onClick={() => setActiveFilter(option.value)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all .2s",
                      border: isActive && typeConfig ? `1px solid ${typeConfig.color}30` : isActive ? "none" : "1px solid var(--bdrs)",
                      background: isActive && typeConfig ? typeConfig.bg : isActive ? "var(--acc)" : "var(--bg2)",
                      color: isActive && typeConfig ? typeConfig.text : isActive ? "#fff" : "var(--c2)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {isActive && typeConfig && (
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: typeConfig.dot }} />
                    )}
                    {option.label}
                    {option.value !== "All" && (
                      <span style={{ fontSize: 12, opacity: isActive ? 0.8 : 0.5 }}>
                        {CHANGELOG.filter((e) => e.type === option.value).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Timeline ── */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute",
              left: 19,
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--bdrs)",
            }} />

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
              {filteredEntries.map((entry, idx) => {
                const typeConfig = TYPE_CONFIG[entry.type];
                return (
                  <div key={`${entry.version}-${idx}`} style={{ position: "relative", display: "flex", gap: 24 }}>
                    {/* Timeline dot */}
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                        background: typeConfig.bg,
                      }}>
                        <span style={{ width: 12, height: 12, borderRadius: 999, background: typeConfig.dot }} />
                      </div>
                    </div>

                    {/* Card */}
                    <div style={{
                      flex: 1,
                      padding: 24,
                      borderRadius: 20,
                      border: "1px solid var(--bdrs)",
                      background: "var(--bg2)",
                      transition: "transform .2s",
                    }}>
                      {/* Meta row */}
                      <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--c3)" }}>{entry.date}</span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "var(--bg3, rgba(255,255,255,.05))",
                          color: "var(--c2)",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {entry.version}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: typeConfig.bg,
                          color: typeConfig.text,
                        }}>
                          {entry.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c1)", marginBottom: 8, fontFamily: "var(--fd)" }}>
                        {entry.title}
                      </h3>

                      {/* Description */}
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--c3)", marginBottom: 16 }}>
                        {entry.description}
                      </p>

                      {/* Changes list */}
                      <ul style={{ display: "flex", flexDirection: "column" as const, gap: 8, listStyle: "none" }}>
                        {entry.changes.map((change, ci) => (
                          <li key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <svg style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, color: typeConfig.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--c2)" }}>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div style={{
              padding: "60px 24px",
              borderRadius: 20,
              border: "1px solid var(--bdrs)",
              background: "var(--bg2)",
              textAlign: "center" as const,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                background: "var(--acc-a10)",
              }}>
                <svg style={{ width: 28, height: 28, color: "var(--acc)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--c1)", marginBottom: 4 }}>No entries found</h3>
              <p style={{ fontSize: 14, color: "var(--c3)" }}>No changelog entries match the selected filter.</p>
            </div>
          )}

          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 40 }}>
            {FILTER_OPTIONS.filter((o) => o.value !== "All").map((option) => {
              const typeConfig = TYPE_CONFIG[option.value as EntryType];
              const count = CHANGELOG.filter((e) => e.type === option.value).length;
              return (
                <div
                  key={option.value}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: "1px solid var(--bdrs)",
                    background: "var(--bg2)",
                    textAlign: "center" as const,
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 700, color: typeConfig.text, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                    {count}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c3)" }}>
                    {option.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
