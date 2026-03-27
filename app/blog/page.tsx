"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "../landing-components";
import { navLinks } from "../landing-data";
import { Footer } from "../landing-sections/Sections";
import { useTheme } from "@/lib/context/ThemeContext";
import { ROUTES } from "@/config/routes";
import { showToast } from "@/lib/toast";
import "../landing.css";

/* ────────────────────────── Data ────────────────────────── */

const CATEGORIES = [
  { label: "All", color: "slate" },
  { label: "Tutorials", color: "sky" },
  { label: "WordPress", color: "violet" },
  { label: "Performance", color: "amber" },
  { label: "Security", color: "rose" },
  { label: "News", color: "emerald" },
  { label: "Migration", color: "cyan" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Tutorial:    { bg: "rgba(14,165,233,.1)", text: "#0ea5e9", border: "rgba(14,165,233,.25)" },
  Tutorials:   { bg: "rgba(14,165,233,.1)", text: "#0ea5e9", border: "rgba(14,165,233,.25)" },
  WordPress:   { bg: "rgba(139,92,246,.1)", text: "#8b5cf6", border: "rgba(139,92,246,.25)" },
  Performance: { bg: "rgba(245,158,11,.1)", text: "#f59e0b", border: "rgba(245,158,11,.25)" },
  Security:    { bg: "rgba(244,63,94,.1)",  text: "#f43f5e", border: "rgba(244,63,94,.25)" },
  News:        { bg: "rgba(16,185,129,.1)", text: "#10b981", border: "rgba(16,185,129,.25)" },
  Migration:   { bg: "rgba(6,182,212,.1)",  text: "#06b6d4", border: "rgba(6,182,212,.25)" },
};

const FEATURED_POST = {
  category: "Tutorial",
  title: "The Complete Guide to WordPress Site Speed Optimization",
  excerpt:
    "Learn how to dramatically improve your WordPress site's loading speed with our comprehensive guide covering caching, image optimization, database tuning, and LiteSpeed-specific techniques that can cut your load times in half.",
  author: "LimeWP Team",
  date: "Mar 20, 2026",
  readTime: "12 min",
  gradient: "linear-gradient(135deg, #10b981, #0ea5e9)",
};

const POSTS = [
  {
    category: "Migration",
    title: "How to Migrate from cPanel to LimeWP",
    excerpt: "A step-by-step walkthrough for seamlessly moving your WordPress sites from traditional cPanel hosting to LimeWP's managed platform.",
    author: "LimeWP Team",
    date: "Mar 18, 2026",
    readTime: "8 min",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  },
  {
    category: "Tutorial",
    title: "Understanding DNS: A Beginner's Guide",
    excerpt: "Demystify DNS records, propagation, and configuration with practical examples for WordPress site owners.",
    author: "LimeWP Team",
    date: "Mar 15, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  },
  {
    category: "Security",
    title: "WordPress Security Best Practices 2026",
    excerpt: "Protect your WordPress site from the latest threats with our updated security checklist and hardening techniques.",
    author: "LimeWP Team",
    date: "Mar 12, 2026",
    readTime: "10 min",
    gradient: "linear-gradient(135deg, #f43f5e, #ec4899)",
  },
  {
    category: "Performance",
    title: "Why LiteSpeed is Faster Than Apache",
    excerpt: "A deep dive into the architectural differences that make LiteSpeed the superior choice for WordPress hosting.",
    author: "LimeWP Team",
    date: "Mar 10, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
  {
    category: "WordPress",
    title: "Setting Up WooCommerce on LimeWP",
    excerpt: "Configure WooCommerce for optimal performance on LimeWP with caching rules, payment gateways, and server tuning tips.",
    author: "LimeWP Team",
    date: "Mar 8, 2026",
    readTime: "9 min",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
  },
  {
    category: "News",
    title: "LimeWP 2.0: What's New",
    excerpt: "Explore the latest features in LimeWP 2.0 including the redesigned dashboard, new monitoring tools, and improved migration flow.",
    author: "LimeWP Team",
    date: "Mar 5, 2026",
    readTime: "5 min",
    gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
  },
];

/* ────────────────────────── Component ────────────────────────── */

export default function BlogPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme;

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPosts = POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "All" ||
      post.category === activeCategory ||
      (activeCategory === "Tutorials" && post.category === "Tutorial");
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostClick = () => {
    showToast.info("Opening article...");
  };

  const catColor = (cat: string) =>
    CATEGORY_COLORS[cat] || { bg: "rgba(100,116,139,.1)", text: "#94a3b8", border: "rgba(100,116,139,.25)" };

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
        <div className="container">

          {/* Page Header */}
          <div style={{ marginBottom: 48, maxWidth: 640 }}>
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
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
              Blog
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: "var(--c1)", fontFamily: "var(--fd)", marginBottom: 12 }}>
              Tips, Tutorials &amp; Updates
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--c3)", maxWidth: 520 }}>
              Insights from the LimeWP team on WordPress hosting, performance, security, and development best practices.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 400, marginBottom: 32 }}>
            <svg
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--c4)", width: 16, height: 16 }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                paddingLeft: 40,
                paddingRight: 16,
                borderRadius: 12,
                border: "1px solid var(--bdrs)",
                background: "var(--bg2)",
                color: "var(--c1)",
                fontSize: 14,
                outline: "none",
                transition: "border-color .2s",
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                    border: isActive ? "none" : "1px solid var(--bdrs)",
                    background: isActive ? "var(--acc)" : "var(--bg2)",
                    color: isActive ? "#fff" : "var(--c2)",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Featured Post */}
          <button
            type="button"
            onClick={handlePostClick}
            style={{
              width: "100%",
              textAlign: "left" as const,
              borderRadius: 20,
              border: "1px solid var(--bdrs)",
              overflow: "hidden",
              marginBottom: 48,
              cursor: "pointer",
              background: "var(--bg2)",
              transition: "transform .3s, box-shadow .3s",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.005)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,0,0,.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            {/* Image */}
            <div style={{ position: "relative", minHeight: 260, background: FEATURED_POST.gradient }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
                <svg width="96" height="96" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
              </div>
              <div style={{ position: "absolute", top: 16, left: 16 }}>
                <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.2)", color: "#fff", backdropFilter: "blur(8px)" }}>
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
              <span style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
                background: catColor(FEATURED_POST.category).bg,
                color: catColor(FEATURED_POST.category).text,
              }}>
                {FEATURED_POST.category}
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, color: "var(--c1)", marginBottom: 12, fontFamily: "var(--fd)" }}>
                {FEATURED_POST.title}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--c3)", marginBottom: 20 }}>
                {FEATURED_POST.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--acc-a10)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  LW
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--c2)" }}>{FEATURED_POST.author}</span>
                <span style={{ fontSize: 12, color: "var(--c4)" }}>&middot;</span>
                <span style={{ fontSize: 12, color: "var(--c3)" }}>{FEATURED_POST.date}</span>
                <span style={{ fontSize: 12, color: "var(--c4)" }}>&middot;</span>
                <span style={{ fontSize: 12, color: "var(--c3)" }}>{FEATURED_POST.readTime} read</span>
              </div>
            </div>
          </button>

          {/* Post Grid */}
          {filteredPosts.length === 0 ? (
            <div style={{
              textAlign: "center" as const,
              padding: "80px 24px",
              borderRadius: 20,
              border: "1px solid var(--bdrs)",
              background: "var(--bg2)",
            }}>
              <svg
                style={{ width: 48, height: 48, margin: "0 auto 16px", color: "var(--c4)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--c3)" }}>
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24, marginBottom: 48 }}>
              {filteredPosts.map((post) => (
                <button
                  key={post.title}
                  type="button"
                  onClick={handlePostClick}
                  style={{
                    textAlign: "left" as const,
                    borderRadius: 20,
                    border: "1px solid var(--bdrs)",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "var(--bg2)",
                    transition: "transform .3s, box-shadow .3s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 160, background: post.gradient }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}>
                      <svg width="64" height="64" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={0.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 20 }}>
                    <span style={{
                      display: "inline-flex",
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 10,
                      background: catColor(post.category).bg,
                      color: catColor(post.category).text,
                    }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, color: "var(--c1)", marginBottom: 8, fontFamily: "var(--fd)" }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--c3)", marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 999, background: "var(--acc-a10)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                        LW
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--c2)" }}>{post.author}</span>
                      <span style={{ fontSize: 11, color: "var(--c4)" }}>&middot;</span>
                      <span style={{ fontSize: 12, color: "var(--c3)" }}>{post.date}</span>
                      <span style={{ fontSize: 11, color: "var(--c4)" }}>&middot;</span>
                      <span style={{ fontSize: 12, color: "var(--c3)" }}>{post.readTime} read</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => showToast.info("No more articles to load")}
                style={{
                  padding: "10px 32px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "1px solid var(--bdrs)",
                  background: "var(--bg2)",
                  color: "var(--c2)",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                Load More
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
