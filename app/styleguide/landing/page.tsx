"use client";

import { useState } from "react";
import { Icon, Button, IconBox, Input, SectionHeader, Toggle, Card } from "../../landing-components";
import "../../landing.css";

const brandColors = [
  { name: "Accent", var: "--acc", desc: "Primary brand color", hex: { light: "#059669", dark: "#10b981" } },
  { name: "Accent Hover", var: "--acc2", desc: "Hover/active state", hex: { light: "#047857", dark: "#34d399" } },
  { name: "Lime", var: "--lime", desc: "Lime highlight", hex: { light: "#059669", dark: "#10b981" } },
  { name: "Lime Light", var: "--lime-light", desc: "Light lime accent", hex: { light: "#10b981", dark: "#34d399" } },
  { name: "Red", var: "--red", desc: "Error / danger / destructive", hex: { light: "#ef4444", dark: "#ef4444" } },
];

const surfaceColors = [
  { name: "Background", var: "--bg0", desc: "Page background", hex: { light: "#f0f2f5", dark: "#0f1117" } },
  { name: "Surface 1", var: "--bg1", desc: "Elevated layer", hex: { light: "#e8eaef", dark: "#1a1d27" } },
  { name: "Surface 2", var: "--bg2", desc: "Cards, panels", hex: { light: "#f4f5f7", dark: "#1e2130" } },
  { name: "Surface 3", var: "--bg3", desc: "Sidebar, nav bg", hex: { light: "#ebedf1", dark: "#161923" } },
];

const textColors = [
  { name: "Primary", var: "--c1", desc: "Headings, main text", hex: { light: "#0f172a", dark: "#f1f5f9" } },
  { name: "Secondary", var: "--c2", desc: "Body text, labels", hex: { light: "#475569", dark: "#cbd5e1" } },
  { name: "Muted", var: "--c3", desc: "Captions, hints", hex: { light: "#94a3b8", dark: "#64748b" } },
];

const iconNames = [
  "arrow", "check", "check-circle", "chevron", "close", "x-mark",
  "sun", "moon", "star", "bolt", "shield", "lock",
  "server", "box", "globe", "grid", "monitor", "code-slash",
  "pulse", "trend", "chat", "bell", "search", "home",
  "download", "plus", "dots", "refresh", "refresh-single",
  "settings", "pen", "cart", "users", "briefcase",
];

const iconBoxColors: Array<{ color: "lime" | "green" | "blue" | "purple" | "orange"; label: string }> = [
  { color: "lime", label: "Lime" },
  { color: "green", label: "Green" },
  { color: "blue", label: "Blue" },
  { color: "purple", label: "Purple" },
  { color: "orange", label: "Orange" },
];

export default function LandingStyleGuide() {
  const [inputVal, setInputVal] = useState("");
  const [toggleOn, setToggleOn] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document !== "undefined") return document.documentElement.dataset.theme || "dark";
    return "dark";
  });
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("limewp-theme", next);
    setTheme(next);
  };

  const copyVar = (v: string) => {
    navigator.clipboard.writeText(`var(${v})`);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopiedVar(t);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  return (
    <div className="sg" data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg0)", color: "var(--c1)", fontFamily: "var(--fb, Inter, system-ui, sans-serif)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ padding: "40px 0 24px", borderBottom: "1px solid var(--bdrs, #1e293b)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "var(--acc)", marginBottom: 8 }}>Landing Page Design System</div>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, fontFamily: "var(--fd, 'Plus Jakarta Sans', system-ui)", lineHeight: 1.1, margin: 0 }}>LimeWP Style Guide</h1>
              <p style={{ color: "var(--c2)", marginTop: 12, fontSize: 15, maxWidth: 600 }}>Design tokens, components, and patterns used in the LimeWP marketing landing page.</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", color: "var(--c1)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                <Icon name={theme === "light" ? "sun" : "moon"} width={16} height={16} />
                {theme === "light" ? "Light" : "Dark"}
              </button>
              <a href="/styleguide" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--c2)", fontSize: 13, textDecoration: "none" }}>
                ← Back
              </a>
            </div>
          </div>
        </div>

        {/* COLORS */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Color Palette</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Brand, surface, and text colors. Click any swatch to copy.</p>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Brand & Accent</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
            {brandColors.map(c => (
              <div key={c.var} onClick={() => copyVar(c.var)} style={{ borderRadius: 12, overflow: "hidden", background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", cursor: "pointer", transition: "transform 0.2s" }}>
                <div style={{ height: 56, background: `var(${c.var})`, position: "relative" }}>
                  {copiedVar === c.var && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, fontWeight: 600 }}>Copied!</span>}
                </div>
                <div style={{ padding: 12 }}>
                  <strong style={{ fontSize: 13 }}>{c.name}</strong>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--c3)", marginTop: 2 }}>{c.var}</div>
                  <div style={{ fontSize: 11, color: "var(--c3)" }}>{c.hex[theme as "light" | "dark"]}</div>
                  <div style={{ fontSize: 11, color: "var(--c2)", marginTop: 4 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Surfaces</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
            {surfaceColors.map(c => (
              <div key={c.var} onClick={() => copyVar(c.var)} style={{ borderRadius: 12, overflow: "hidden", background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", cursor: "pointer" }}>
                <div style={{ height: 56, background: `var(${c.var})`, border: "1px solid var(--bdrs, #1e293b)" }} />
                <div style={{ padding: 12 }}>
                  <strong style={{ fontSize: 13 }}>{c.name}</strong>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--c3)", marginTop: 2 }}>{c.var}</div>
                  <div style={{ fontSize: 11, color: "var(--c2)", marginTop: 4 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Text</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {textColors.map(c => (
              <div key={c.var} onClick={() => copyVar(c.var)} style={{ borderRadius: 12, overflow: "hidden", background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", cursor: "pointer" }}>
                <div style={{ height: 56, background: `var(${c.var})`, border: "1px solid var(--bdrs, #1e293b)" }} />
                <div style={{ padding: 12 }}>
                  <strong style={{ fontSize: 13 }}>{c.name}</strong>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--c3)", marginTop: 2 }}>{c.var}</div>
                  <div style={{ fontSize: 11, color: "var(--c2)", marginTop: 4 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Typography</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Plus Jakarta Sans for display, Inter for body.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Hero", style: { fontFamily: "var(--fd)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 } },
              { label: "Section Title", style: { fontFamily: "var(--fd)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1.1 } },
              { label: "Card Title", style: { fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 700 } },
              { label: "Body Large", style: { fontSize: "1.1rem", color: "var(--c2)" } },
              { label: "Body", style: { fontSize: "0.95rem", color: "var(--c2)" } },
              { label: "Caption", style: { fontSize: "0.75rem", color: "var(--c3)" } },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "12px 0", borderBottom: "1px solid var(--bdrs, #1e293b)" }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--c3)", width: 100, flexShrink: 0 }}>{t.label}</span>
                <span style={t.style as React.CSSProperties}>The quick brown fox jumps over the lazy dog</span>
              </div>
            ))}
          </div>
        </section>

        {/* BUTTONS */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Buttons</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Primary, secondary variants with sizes.</p>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Variants</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <Button variant="primary" icon="arrow" onClick={() => {}}>Primary</Button>
            <Button variant="secondary" icon="arrow" href="#">Secondary</Button>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Sizes</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="primary" icon="arrow" onClick={() => {}}>Default</Button>
            <Button variant="primary" size="small" onClick={() => {}}>Small</Button>
          </div>
        </section>

        {/* INPUTS */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Form Inputs</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Text inputs with labels and error states.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20, maxWidth: 800 }}>
            <Input label="Default" placeholder="Type something..." value={inputVal} onChange={setInputVal} />
            <Input label="With Value" placeholder="Placeholder" value="hello@limewp.com" onChange={() => {}} />
            <Input label="Error State" placeholder="Invalid" value="bad-email" onChange={() => {}} error={true} />
            <Input label="Password" type="password" placeholder="Enter password" value="secret" onChange={() => {}} />
          </div>
        </section>

        {/* ICONS */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Icon Library</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>{iconNames.length} icons available. Click to copy.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
            {iconNames.map(name => (
              <div key={name} onClick={() => copyText(`<Icon name="${name}" />`)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12, borderRadius: 10, background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", cursor: "pointer", position: "relative" }}>
                <Icon name={name} width={22} height={22} />
                <code style={{ fontSize: 9, color: "var(--c3)" }}>{name}</code>
                {copiedVar === `<Icon name="${name}" />` && <span style={{ position: "absolute", top: 4, right: 4, fontSize: 9, color: "var(--acc)", fontWeight: 600 }}>✓</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ICON BOXES */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Icon Boxes</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Colored icon containers in 3 sizes and 5 colors.</p>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Sizes</h3>
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32 }}>
            {(["sm", "md", "lg"] as const).map(size => (
              <div key={size} style={{ textAlign: "center" }}>
                <IconBox name="bolt" size={size} />
                <div style={{ fontSize: 11, color: "var(--c3)", marginTop: 8 }}>{size}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--c3)", marginBottom: 16 }}>Colors</h3>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {iconBoxColors.map(c => (
              <div key={c.color} style={{ textAlign: "center" }}>
                <IconBox name="bolt" size="md" color={c.color} />
                <div style={{ fontSize: 11, color: "var(--c3)", marginTop: 8 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CARDS */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Cards</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Container component with optional hover elevation.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            <Card hover={true}>
              <div style={{ padding: 24 }}>
                <IconBox name="bolt" size="md" color="lime" />
                <h3 style={{ marginTop: 16, marginBottom: 8, fontFamily: "var(--fd)" }}>With Hover</h3>
                <p style={{ color: "var(--c2)", fontSize: 14 }}>Card lifts on hover with shadow transition.</p>
              </div>
            </Card>
            <Card hover={false}>
              <div style={{ padding: 24 }}>
                <IconBox name="shield" size="md" color="green" />
                <h3 style={{ marginTop: 16, marginBottom: 8, fontFamily: "var(--fd)" }}>Static Card</h3>
                <p style={{ color: "var(--c2)", fontSize: 14 }}>No hover effect, flat presentation.</p>
              </div>
            </Card>
          </div>
        </section>

        {/* TOGGLE */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Toggle</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Binary toggle for pricing and settings.</p>
          <Toggle active={toggleOn} onToggle={() => setToggleOn(!toggleOn)} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />
          <div style={{ marginTop: 12, fontSize: 13, color: "var(--c3)" }}>State: {toggleOn ? "Yearly" : "Monthly"}</div>
        </section>

        {/* SECTION HEADER */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "var(--fd)" }}>Section Header</h2>
          <p style={{ color: "var(--c2)", fontSize: 14, marginBottom: 32 }}>Standardized section introductions.</p>
          <div style={{ padding: 24, borderRadius: 16, background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)", marginBottom: 16 }}>
            <SectionHeader label="Features" title="Section Title Goes Here" desc="A supporting description that provides context for the section content." />
          </div>
          <div style={{ padding: 24, borderRadius: 16, background: "var(--bg2)", border: "1px solid var(--bdrs, #1e293b)" }}>
            <SectionHeader label="Pricing" title="Start free. Scale when ready." desc="No hidden fees. No surprises." center />
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "48px 0 32px", fontSize: 12, color: "var(--c3)" }}>
          LimeWP Landing Design System • March 2026
        </div>
      </div>
    </div>
  );
}
