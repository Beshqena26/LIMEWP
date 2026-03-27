"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES } from "@/config/routes";
import "../landing.css";

/* ────────────────────────── Data ────────────────────────── */

const HOSTS = ["LimeWP", "Kinsta", "WP Engine", "SiteGround", "Bluehost"] as const;

interface FeatureRow {
  feature: string;
  values: (string | boolean)[];
}

const FEATURES: FeatureRow[] = [
  { feature: "Starting Price", values: ["$29/mo (6mo free)", "$35/mo", "$20/mo", "$3.99/mo", "$2.95/mo"] },
  { feature: "Free Trial", values: ["6 months", "None", "None", "30 days", "30 days"] },
  { feature: "Free SSL", values: [true, true, true, true, true] },
  { feature: "Free CDN", values: [true, true, true, false, false] },
  { feature: "Free Migrations", values: ["Unlimited", "Limited", "Limited", "1 site", false] },
  { feature: "Staging", values: [true, true, true, true, false] },
  { feature: "Daily Backups", values: [true, true, true, true, false] },
  { feature: "Redis Cache", values: [true, "Add-on", true, false, false] },
  { feature: "LiteSpeed Server", values: [true, false, false, true, false] },
  { feature: "NVMe Storage", values: [true, true, false, false, false] },
  { feature: "Isolated Containers", values: [true, true, true, false, false] },
  { feature: "24/7 Support", values: [true, true, true, true, true] },
  { feature: "Uptime SLA", values: ["99.99%", "99.9%", "99.95%", "99.9%", "99.9%"] },
];

const TESTIMONIAL = {
  quote:
    "We migrated 14 client sites from WP Engine to LimeWP in under a day. Page load times dropped by 40%, our staging workflow is smoother, and we haven't paid a dime in 6 months. The LiteSpeed + NVMe combo is no joke.",
  name: "Sarah Chen",
  role: "Lead Developer, Pixel & Code Agency",
  avatar: "SC",
};

/* ────────────────────────── Components ────────────────────────── */

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CellValue({ value, isLimeWP }: { value: string | boolean; isLimeWP: boolean }) {
  if (typeof value === "boolean") {
    return <span className="flex justify-center">{value ? <CheckIcon /> : <XIcon />}</span>;
  }
  return (
    <span className={`text-sm ${isLimeWP ? "font-semibold" : ""}`}>
      {value}
    </span>
  );
}

/* ────────────────────────── Page ────────────────────────── */

export default function ComparePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme;
  const isDark = theme === "dark";

  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav style={scrolled ? { backdropFilter: "blur(20px)" } : undefined}>
        <a href="/" className="nav-logo">
          <img src="/limewp-logo.svg" alt="LimeWP" width="120" height="32" style={{ display: "block" }} />
        </a>
        <div className="nav-mid" />
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <button className="nav-login" onClick={() => { window.location.href = ROUTES.LOGIN; }}>
            Sign In
          </button>
          <button className="nav-cta" onClick={onSignup}>
            Start Free
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{ paddingTop: "140px", paddingBottom: "60px" }}
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isDark
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          Honest Comparison
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4"
          style={{ fontFamily: "var(--fd)", color: "var(--c1)", lineHeight: 1.1 }}
        >
          Why{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--acc), var(--acc2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LimeWP
          </span>
          ?
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-2"
          style={{ color: "var(--c2)", fontFamily: "var(--fb)" }}
        >
          See how we compare to other WordPress hosts.
        </p>
        <p
          className="text-sm max-w-xl mx-auto"
          style={{ color: "var(--c3)", fontFamily: "var(--fb)" }}
        >
          Transparent pricing, no hidden fees, no bait-and-switch. Just premium hosting with a 6-month free trial.
        </p>
      </section>

      {/* ── Comparison Table ── */}
      <section className="container" style={{ paddingBottom: "60px" }}>
        <div
          className="overflow-x-auto rounded-2xl"
          style={{
            border: `1px solid ${isDark ? "var(--bdrs)" : "var(--bdr)"}`,
            background: isDark ? "var(--bg2)" : "#fff",
            boxShadow: "var(--sh)",
          }}
        >
          <table className="w-full text-sm" style={{ minWidth: "700px", fontFamily: "var(--fb)" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${isDark ? "var(--bdrs)" : "var(--bdr)"}`,
                }}
              >
                <th
                  className="text-left px-5 py-4 font-semibold"
                  style={{ color: "var(--c2)", width: "200px" }}
                >
                  Feature
                </th>
                {HOSTS.map((host, i) => (
                  <th
                    key={host}
                    className="px-4 py-4 text-center font-semibold"
                    style={{
                      color: i === 0 ? "var(--acc)" : "var(--c2)",
                      position: "relative",
                    }}
                  >
                    <span className={i === 0 ? "text-base" : ""}>{host}</span>
                    {i === 0 && (
                      <span
                        className="block text-[10px] font-medium mt-0.5 uppercase tracking-wider"
                        style={{ color: "var(--acc2)" }}
                      >
                        Recommended
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, rowIdx) => (
                <tr
                  key={row.feature}
                  style={{
                    borderBottom:
                      rowIdx < FEATURES.length - 1
                        ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`
                        : "none",
                    transition: "background 0.15s ease",
                  }}
                  className="hover:bg-[var(--tint3)]"
                >
                  <td
                    className="px-5 py-3.5 font-medium"
                    style={{ color: "var(--c1)" }}
                  >
                    {row.feature}
                  </td>
                  {row.values.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-4 py-3.5 text-center"
                      style={{
                        color: colIdx === 0 ? "var(--c1)" : "var(--c2)",
                        background:
                          colIdx === 0
                            ? isDark
                              ? "rgba(16,185,129,0.04)"
                              : "rgba(5,150,105,0.03)"
                            : "transparent",
                      }}
                    >
                      <CellValue value={val} isLimeWP={colIdx === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile note ── */}
        <p
          className="text-center text-xs mt-3 sm:hidden"
          style={{ color: "var(--c3)" }}
        >
          Scroll horizontally to see all hosts
        </p>
      </section>

      {/* ── Testimonial ── */}
      <section className="container" style={{ paddingBottom: "60px" }}>
        <div
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))"
              : "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))",
            border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.15)"}`,
          }}
        >
          <svg
            className="w-10 h-10 mx-auto mb-5 opacity-30"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--acc)" }}
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
          </svg>
          <blockquote
            className="text-lg sm:text-xl font-medium leading-relaxed max-w-3xl mx-auto mb-6"
            style={{ color: "var(--c1)", fontFamily: "var(--fd)" }}
          >
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: isDark ? "rgba(16,185,129,0.2)" : "rgba(5,150,105,0.15)",
                color: "var(--acc)",
              }}
            >
              {TESTIMONIAL.avatar}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: "var(--c1)" }}>
                {TESTIMONIAL.name}
              </p>
              <p className="text-xs" style={{ color: "var(--c3)" }}>
                {TESTIMONIAL.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container text-center" style={{ paddingBottom: "100px" }}>
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-4"
          style={{ fontFamily: "var(--fd)", color: "var(--c1)" }}
        >
          Ready to switch?
        </h2>
        <p
          className="text-lg mb-8 max-w-xl mx-auto"
          style={{ color: "var(--c2)", fontFamily: "var(--fb)" }}
        >
          Start your 6-month free trial today. No credit card required. Migrate your existing sites for free.
        </p>
        <button
          className="nav-cta"
          onClick={onSignup}
          style={{
            padding: "16px 40px",
            fontSize: "16px",
            borderRadius: "14px",
          }}
        >
          Start Your 6-Month Free Trial
        </button>
        <p className="text-xs mt-4" style={{ color: "var(--c3)" }}>
          Free for 6 months &middot; No credit card &middot; Cancel anytime
        </p>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="/" className="logo">
                <img
                  src="/limewp-logo.svg"
                  alt="LimeWP"
                  width="100"
                  height="28"
                  style={{ display: "block" }}
                />
              </a>
              <p>
                Premium WordPress hosting. LiteSpeed servers, NVMe storage, and
                enterprise security — backed by experts who care.
              </p>
            </div>
            <div className="footer-column">
              <h4>Product</h4>
              <a href="/#features">Features</a>
              <a href="/#pricing">Pricing</a>
              <a href="/compare">Compare</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="/contact">Contact</a>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 LimeWP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
