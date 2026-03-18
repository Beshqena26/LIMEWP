import { useState } from 'react'
import { Icon, Button, IconBox, Input, SectionHeader, Toggle, Card } from './components'
import './styleguide.css'

const brandColors = [
  { name: 'Accent', var: '--acc', desc: 'Primary brand color', hex: { light: '#059669', dark: '#10b981' } },
  { name: 'Accent Hover', var: '--acc2', desc: 'Hover/active state', hex: { light: '#047857', dark: '#34d399' } },
  { name: 'Lime', var: '--lime', desc: 'Lime highlight', hex: { light: '#059669', dark: '#10b981' } },
  { name: 'Lime Light', var: '--lime-light', desc: 'Light lime accent', hex: { light: '#10b981', dark: '#34d399' } },
  { name: 'Red', var: '--red', desc: 'Error / danger / destructive', hex: { light: '#ef4444', dark: '#ef4444' } },
]

const surfaceColors = [
  { name: 'Background', var: '--bg0', desc: 'Page background', hex: { light: '#f0f2f5', dark: '#0f1117' } },
  { name: 'Surface 1', var: '--bg1', desc: 'Elevated layer', hex: { light: '#e8eaef', dark: '#1a1d27' } },
  { name: 'Surface 2', var: '--bg2', desc: 'Cards, panels', hex: { light: '#f4f5f7', dark: '#1e2130' } },
  { name: 'Surface Hover', var: '--bg2h', desc: 'Hover on surface 2', hex: { light: '#ecedf0', dark: '#282b3a' } },
  { name: 'Surface 3', var: '--bg3', desc: 'Sidebar, nav bg', hex: { light: '#ebedf1', dark: '#161923' } },
  { name: 'Surface 4', var: '--bg4', desc: 'Deepest surface', hex: { light: '#e2e4e9', dark: '#222537' } },
]

const textColors = [
  { name: 'Primary', var: '--c1', desc: 'Headings, main text', hex: { light: '#0f172a', dark: '#f1f5f9' } },
  { name: 'Secondary', var: '--c2', desc: 'Body text, labels', hex: { light: '#475569', dark: '#cbd5e1' } },
  { name: 'Muted', var: '--c3', desc: 'Captions, hints', hex: { light: '#94a3b8', dark: '#64748b' } },
  { name: 'Inverse', var: '--ci', desc: 'Text on accent bg', hex: { light: '#ffffff', dark: '#0f1117' } },
]

const borderColors = [
  { name: 'Border', var: '--bdr', desc: 'Strong borders', hex: { light: '#cbd5e1', dark: '#334155' } },
  { name: 'Border Subtle', var: '--bdrs', desc: 'Subtle borders', hex: { light: '#e2e8f0', dark: '#1e293b' } },
]

const iconNames = [
  'arrow', 'check', 'check-circle', 'chevron', 'close', 'x-mark',
  'sun', 'moon', 'star', 'bolt', 'shield', 'lock',
  'server', 'box', 'globe', 'grid', 'monitor', 'code-slash',
  'pulse', 'trend', 'chat', 'bell', 'search', 'home',
  'download', 'plus', 'dots', 'refresh', 'refresh-single',
  'settings', 'pen', 'cart', 'users', 'briefcase',
]

const radii = [
  { name: 'XS', var: '--r-xs', value: '8px' },
  { name: 'Small', var: '--r-s', value: '10px' },
  { name: 'Default', var: '--r', value: '16px' },
  { name: 'XL', var: '--r-xl', value: '24px' },
]

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80]

const transitions = [
  { name: 'Default', var: '--t', value: '0.3s ease', desc: 'General UI transitions' },
  { name: 'Spring', var: '--spring', value: '0.6s cubic-bezier(.34,1.56,.64,1)', desc: 'Bouncy, playful motion' },
  { name: 'Ease Out Expo', var: '--ease-out-expo', value: 'cubic-bezier(.16,1,.3,1)', desc: 'Fast start, smooth stop' },
  { name: 'Ease Spring', var: '--ease-spring', value: 'cubic-bezier(.34,1.56,.64,1)', desc: 'Spring overshoot curve' },
]

const iconBoxColors: Array<{ color: 'lime' | 'green' | 'blue' | 'purple' | 'orange'; label: string }> = [
  { color: 'lime', label: 'Lime' },
  { color: 'green', label: 'Green' },
  { color: 'blue', label: 'Blue' },
  { color: 'purple', label: 'Purple' },
  { color: 'orange', label: 'Orange' },
]

export function StyleGuide() {
  const [inputVal, setInputVal] = useState('')
  const [toggleOn, setToggleOn] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [copiedVar, setCopiedVar] = useState<string | null>(null)

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    localStorage.setItem('limewp-theme', next)
    setTheme(next)
  }

  const copyVar = (v: string) => {
    navigator.clipboard.writeText(`var(${v})`)
    setCopiedVar(v)
    setTimeout(() => setCopiedVar(null), 1500)
  }

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t)
    setCopiedVar(t)
    setTimeout(() => setCopiedVar(null), 1500)
  }

  return (
    <div className="sg">
      <div className="container">
        {/* Header */}
        <div className="sg-header">
          <div className="sg-header-top">
            <div>
              <div className="sg-header-label">Design System</div>
              <h1>LimeWP Style Guide</h1>
              <p>A comprehensive reference of design tokens, components, patterns, and guidelines used across the LimeWP platform.</p>
            </div>
            <div className="sg-header-actions">
              <button className="sg-theme-toggle" onClick={toggleTheme}>
                <Icon name={theme === 'light' ? 'sun' : 'moon'} width={18} height={18} />
                {theme === 'light' ? 'Light' : 'Dark'}
              </button>
              <a href="#" className="sg-back-link" onClick={e => { e.preventDefault(); window.location.hash = '' }}>
                <Icon name="arrow" width={14} height={14} style={{ transform: 'rotate(180deg)' }} />
                Back to Site
              </a>
            </div>
          </div>
          <div className="sg-toc">
            <span className="sg-toc-label">Jump to:</span>
            {['Colors', 'Typography', 'Spacing', 'Shadows', 'Motion', 'Buttons', 'Inputs', 'Icons', 'Icon Boxes', 'Cards', 'Toggle', 'Section Header'].map(s => (
              <a key={s} href="#styleguide" className="sg-toc-link" onClick={e => {
                e.preventDefault()
                document.getElementById(`sg-${s.toLowerCase().replace(/ /g, '-')}`)?.scrollIntoView({ behavior: 'smooth' })
              }}>{s}</a>
            ))}
          </div>
        </div>

        {/* ========== DESIGN TOKENS ========== */}
        <div className="sg-group-label">Design Tokens</div>

        {/* COLORS */}
        <section className="sg-section" id="sg-colors">
          <SectionHeader label="Tokens" title="Color Palette" desc="Brand, surface, text, and border colors that automatically adapt between light and dark themes. Click any swatch to copy the CSS variable." />

          <h3 className="sg-sub">Brand & Semantic</h3>
          <div className="sg-color-grid">
            {brandColors.map(c => (
              <div key={c.var} className="sg-color-card" onClick={() => copyVar(c.var)}>
                <div className="sg-color-swatch" style={{ background: `var(${c.var})` }}>
                  {copiedVar === c.var && <span className="sg-copied">Copied!</span>}
                </div>
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                  <span className="sg-color-hex">{c.hex[theme as 'light' | 'dark']}</span>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Surfaces</h3>
          <div className="sg-color-grid">
            {surfaceColors.map(c => (
              <div key={c.var} className="sg-color-card" onClick={() => copyVar(c.var)}>
                <div className="sg-color-swatch" style={{ background: `var(${c.var})`, border: '1px solid var(--bdrs)' }}>
                  {copiedVar === c.var && <span className="sg-copied">Copied!</span>}
                </div>
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                  <span className="sg-color-hex">{c.hex[theme as 'light' | 'dark']}</span>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Text</h3>
          <div className="sg-color-grid">
            {textColors.map(c => (
              <div key={c.var} className="sg-color-card" onClick={() => copyVar(c.var)}>
                <div className="sg-color-swatch" style={{ background: `var(${c.var})`, border: '1px solid var(--bdrs)' }}>
                  {copiedVar === c.var && <span className="sg-copied">Copied!</span>}
                </div>
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                  <span className="sg-color-hex">{c.hex[theme as 'light' | 'dark']}</span>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Borders</h3>
          <div className="sg-color-grid">
            {borderColors.map(c => (
              <div key={c.var} className="sg-color-card" onClick={() => copyVar(c.var)}>
                <div className="sg-color-swatch" style={{ background: `var(${c.var})`, border: '1px solid var(--bdrs)' }}>
                  {copiedVar === c.var && <span className="sg-copied">Copied!</span>}
                </div>
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                  <span className="sg-color-hex">{c.hex[theme as 'light' | 'dark']}</span>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className="sg-section" id="sg-typography">
          <SectionHeader label="Tokens" title="Typography" desc="Font families, type scale, weights, and usage guidelines. LimeWP uses Plus Jakarta Sans for display and Inter for body." />

          <h3 className="sg-sub">Font Families</h3>
          <div className="sg-type-families">
            <div className="sg-type-family">
              <div className="sg-type-family-preview" style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', fontWeight: 800 }}>Aa</div>
              <div className="sg-type-family-info">
                <strong>Plus Jakarta Sans</strong>
                <code>var(--fd)</code>
                <span>Headlines, prices, display text, section titles</span>
                <div className="sg-type-weights">
                  <span style={{ fontFamily: 'var(--fd)', fontWeight: 600 }}>600 Semi</span>
                  <span style={{ fontFamily: 'var(--fd)', fontWeight: 700 }}>700 Bold</span>
                  <span style={{ fontFamily: 'var(--fd)', fontWeight: 800 }}>800 Extra</span>
                </div>
              </div>
            </div>
            <div className="sg-type-family">
              <div className="sg-type-family-preview" style={{ fontFamily: 'var(--fb)', fontSize: '2.5rem', fontWeight: 400 }}>Aa</div>
              <div className="sg-type-family-info">
                <strong>Inter</strong>
                <code>var(--fb)</code>
                <span>Body text, UI elements, navigation, labels</span>
                <div className="sg-type-weights">
                  <span style={{ fontFamily: 'var(--fb)', fontWeight: 400 }}>400 Regular</span>
                  <span style={{ fontFamily: 'var(--fb)', fontWeight: 500 }}>500 Medium</span>
                  <span style={{ fontFamily: 'var(--fb)', fontWeight: 600 }}>600 Semi</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="sg-sub">Type Scale</h3>
          <div className="sg-type-scale">
            {[
              { label: 'Hero Heading', style: { fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 } as React.CSSProperties, size: 'clamp(40-56px)' },
              { label: 'Section Title', style: { fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.1 } as React.CSSProperties, size: 'clamp(32-44px)' },
              { label: 'Card Title', style: { fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700 } as React.CSSProperties, size: '24px' },
              { label: 'Subsection', style: { fontFamily: 'var(--fd)', fontSize: '1.25rem', fontWeight: 700 } as React.CSSProperties, size: '20px' },
              { label: 'Body Large', style: { fontSize: '1.1rem', color: 'var(--c2)' } as React.CSSProperties, size: '17.6px' },
              { label: 'Body Default', style: { fontSize: '.95rem', color: 'var(--c2)' } as React.CSSProperties, size: '15.2px' },
              { label: 'Body Small', style: { fontSize: '.85rem', color: 'var(--c3)' } as React.CSSProperties, size: '13.6px' },
              { label: 'Label / Overline', style: { fontSize: '.85rem', color: 'var(--c3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 } as React.CSSProperties, size: '13.6px' },
              { label: 'Caption', style: { fontSize: '.75rem', color: 'var(--c3)' } as React.CSSProperties, size: '12px' },
            ].map(t => (
              <div key={t.label} className="sg-type-scale-row">
                <div className="sg-type-scale-meta">
                  <span className="sg-type-scale-label">{t.label}</span>
                  <code>{t.size}</code>
                </div>
                <div style={t.style}>The quick brown fox jumps over the lazy dog</div>
              </div>
            ))}
          </div>
        </section>

        {/* SPACING */}
        <section className="sg-section" id="sg-spacing">
          <SectionHeader label="Tokens" title="Spacing & Radius" desc="Consistent spacing scale and border radius tokens used throughout the design system." />

          <h3 className="sg-sub">Spacing Scale</h3>
          <div className="sg-spacing-grid">
            {spacingScale.map(s => (
              <div key={s} className="sg-spacing-item">
                <div className="sg-spacing-bar" style={{ width: s }} />
                <code>{s}px</code>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Border Radius</h3>
          <div className="sg-radius-grid">
            {radii.map(r => (
              <div key={r.var} className="sg-radius-item" onClick={() => copyVar(r.var)}>
                <div className="sg-radius-preview" style={{ borderRadius: `var(${r.var})` }} />
                <strong>{r.name}</strong>
                <code>{r.var}</code>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SHADOWS */}
        <section className="sg-section" id="sg-shadows">
          <SectionHeader label="Tokens" title="Shadows & Effects" desc="Elevation levels, glow effects, and glassmorphism used for depth and focus." />
          <div className="sg-shadow-grid">
            {[
              { name: 'Default Shadow', var: '--sh', desc: 'Cards, containers at rest' },
              { name: 'Hover Shadow', var: '--shh', desc: 'Elevated hover state' },
              { name: 'Glow', var: '--glow', desc: 'Accent glow highlights' },
              { name: 'Nav Shadow', var: '--shnav', desc: 'Navigation bar bottom' },
            ].map(s => (
              <div key={s.var} className="sg-shadow-card" style={{ boxShadow: `var(${s.var})` }}>
                <strong>{s.name}</strong>
                <code>{s.var}</code>
                <span>{s.desc}</span>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Glass Effect</h3>
          <div className="sg-glass-demo">
            <div className="sg-glass-card">
              <strong>Glassmorphism</strong>
              <code>backdrop-filter: blur(16px)</code>
              <span>Used in floating badges, modals, and overlays</span>
            </div>
          </div>
        </section>

        {/* MOTION */}
        <section className="sg-section" id="sg-motion">
          <SectionHeader label="Tokens" title="Motion & Transitions" desc="Timing functions and animation presets for smooth, consistent motion across all interactions." />
          <div className="sg-motion-grid">
            {transitions.map(t => (
              <div key={t.var} className="sg-motion-card">
                <div className="sg-motion-preview">
                  <div className="sg-motion-dot" style={{ transition: `transform ${t.value.includes('cubic') ? `0.6s ${t.value}` : t.value}` }} />
                </div>
                <div className="sg-motion-info">
                  <strong>{t.name}</strong>
                  <code>{t.var}</code>
                  <span className="sg-motion-value">{t.value}</span>
                  <span>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Keyframe Animations</h3>
          <div className="sg-anim-grid">
            {[
              { name: 'scaleIn', desc: 'Entry with bounce overshoot', cls: 'sg-anim-scalein' },
              { name: 'fadeInU', desc: 'Fade in from below', cls: 'sg-anim-fadein' },
              { name: 'heroFloat', desc: 'Gentle floating with rotation', cls: 'sg-anim-float' },
              { name: 'pulse', desc: 'Breathing opacity pulse', cls: 'sg-anim-pulse' },
            ].map(a => (
              <div key={a.name} className="sg-anim-card">
                <div className={`sg-anim-preview ${a.cls}`}>
                  <div className="sg-anim-box" />
                </div>
                <strong>{a.name}</strong>
                <span>{a.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== COMPONENTS ========== */}
        <div className="sg-group-label">Components</div>

        {/* BUTTONS */}
        <section className="sg-section" id="sg-buttons">
          <SectionHeader label="Components" title="Buttons" desc="Action triggers in primary, secondary, and coral variants with default and small sizes." />

          <h3 className="sg-sub">Variants</h3>
          <div className="sg-row">
            <Button variant="primary" icon="arrow" onClick={() => {}}>Primary</Button>
            <Button variant="secondary" icon="arrow" href="#">Secondary</Button>
          </div>

          <h3 className="sg-sub">Sizes</h3>
          <div className="sg-row">
            <Button variant="primary" icon="arrow" onClick={() => {}}>Default Size</Button>
            <Button variant="primary" size="small" onClick={() => {}}>Small Size</Button>
          </div>
          <div className="sg-row" style={{ marginTop: 12 }}>
            <Button variant="secondary" icon="arrow" href="#">Default Size</Button>
            <Button variant="secondary" size="small" href="#">Small Size</Button>
          </div>

          <h3 className="sg-sub">States</h3>
          <div className="sg-states-row">
            <div className="sg-state">
              <Button variant="primary" onClick={() => {}}>Default</Button>
              <span>Rest</span>
            </div>
            <div className="sg-state">
              <div className="sg-state-hover"><Button variant="primary" onClick={() => {}}>Hovered</Button></div>
              <span>Hover</span>
            </div>
            <div className="sg-state">
              <button className="btn btn-p" disabled style={{ opacity: .5, pointerEvents: 'none' }}>Disabled</button>
              <span>Disabled</span>
            </div>
          </div>

          <div className="sg-props-table">
            <h3 className="sg-sub">Props</h3>
            <table>
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>&apos;primary&apos; | &apos;secondary&apos; | &apos;coral&apos;</code></td><td><code>&apos;primary&apos;</code></td><td>Visual style</td></tr>
                <tr><td><code>size</code></td><td><code>&apos;default&apos; | &apos;small&apos;</code></td><td><code>&apos;default&apos;</code></td><td>Button size</td></tr>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>Icon name (appended after text)</td></tr>
                <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Renders as anchor tag</td></tr>
                <tr><td><code>onClick</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Click handler (renders as button)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="sg-code">
            <code>{`<Button variant="primary" icon="arrow" onClick={fn}>Label</Button>`}</code>
            <code>{`<Button variant="secondary" size="small" href="#">Label</Button>`}</code>
          </div>
        </section>

        {/* INPUTS */}
        <section className="sg-section" id="sg-inputs">
          <SectionHeader label="Components" title="Form Inputs" desc="Text inputs with labels, placeholders, error states, and email/password types." />

          <h3 className="sg-sub">States</h3>
          <div className="sg-form-grid">
            <Input label="Default" placeholder="Type something..." value={inputVal} onChange={setInputVal} />
            <Input label="With Value" placeholder="Placeholder" value="hello@limewp.com" onChange={() => {}} />
            <Input label="Error State" placeholder="Invalid value" value="bad-email" onChange={() => {}} error={true} />
            <Input label="Password" type="password" placeholder="Enter password" value="mypassword" onChange={() => {}} />
          </div>

          <div className="sg-props-table">
            <h3 className="sg-sub">Props</h3>
            <table>
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Input label text</td></tr>
                <tr><td><code>type</code></td><td><code>string</code></td><td><code>&apos;text&apos;</code></td><td>HTML input type</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Placeholder text</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(v: string) =&gt; void</code></td><td>—</td><td>Value change handler</td></tr>
                <tr><td><code>error</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show error styling</td></tr>
              </tbody>
            </table>
          </div>

          <div className="sg-code">
            <code>{`<Input label="Email" type="email" placeholder="you@example.com" value={val} onChange={setVal} />`}</code>
            <code>{`<Input label="Password" type="password" value={pw} onChange={setPw} error={hasError} />`}</code>
          </div>
        </section>

        {/* ICONS */}
        <section className="sg-section" id="sg-icons">
          <SectionHeader label="Components" title="Icon Library" desc={`${iconNames.length} icons available in the Icon component. All icons are 24x24 SVG with stroke rendering. Click to copy.`} />
          <div className="sg-icon-grid">
            {iconNames.map(name => (
              <div key={name} className="sg-icon-item" onClick={() => copyText(`<Icon name="${name}" />`)}>
                <Icon name={name} width={24} height={24} />
                <code>{name}</code>
                {copiedVar === `<Icon name="${name}" />` && <span className="sg-copied-sm">Copied!</span>}
              </div>
            ))}
          </div>
          <div className="sg-code">
            <code>{`<Icon name="bolt" />                        // default 24x24`}</code>
            <code>{`<Icon name="bolt" width={16} height={16} />  // custom size`}</code>
          </div>
        </section>

        {/* ICON BOXES */}
        <section className="sg-section" id="sg-icon-boxes">
          <SectionHeader label="Components" title="Icon Boxes" desc="Colored icon containers used in feature cards, floating badges, and highlights. Available in 3 sizes and 5 color variants." />

          <h3 className="sg-sub">Sizes</h3>
          <div className="sg-row sg-row-spaced">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <div key={size} className="sg-icon-demo">
                <IconBox name="bolt" size={size} />
                <span>{size === 'sm' ? 'Small (32px)' : size === 'md' ? 'Medium (56px)' : 'Large (64px)'}</span>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Colors</h3>
          <div className="sg-row sg-row-spaced">
            {iconBoxColors.map(c => (
              <div key={c.color} className="sg-icon-demo">
                <IconBox name="bolt" size="md" color={c.color} />
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="sg-props-table">
            <h3 className="sg-sub">Props</h3>
            <table>
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Icon name from library</td></tr>
                <tr><td><code>size</code></td><td><code>&apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;</code></td><td><code>&apos;md&apos;</code></td><td>Container size</td></tr>
                <tr><td><code>color</code></td><td><code>&apos;lime&apos; | &apos;green&apos; | &apos;blue&apos; | &apos;purple&apos; | &apos;orange&apos;</code></td><td><code>&apos;lime&apos;</code></td><td>Color theme</td></tr>
              </tbody>
            </table>
          </div>

          <div className="sg-code">
            <code>{`<IconBox name="bolt" size="lg" color="blue" />`}</code>
          </div>
        </section>

        {/* CARDS */}
        <section className="sg-section" id="sg-cards">
          <SectionHeader label="Components" title="Cards" desc="Container component with optional hover elevation effect." />
          <div className="sg-card-grid">
            <Card hover={true}>
              <div style={{ padding: 24 }}>
                <IconBox name="bolt" size="md" color="lime" />
                <h3 style={{ marginTop: 16, marginBottom: 8 }}>With Hover</h3>
                <p style={{ color: 'var(--c2)', fontSize: '.9rem' }}>Card lifts on hover with shadow transition.</p>
              </div>
            </Card>
            <Card hover={false}>
              <div style={{ padding: 24 }}>
                <IconBox name="shield" size="md" color="green" />
                <h3 style={{ marginTop: 16, marginBottom: 8 }}>Static Card</h3>
                <p style={{ color: 'var(--c2)', fontSize: '.9rem' }}>No hover effect, flat presentation.</p>
              </div>
            </Card>
          </div>
          <div className="sg-code">
            <code>{`<Card hover={true}>{children}</Card>`}</code>
          </div>
        </section>

        {/* TOGGLE */}
        <section className="sg-section" id="sg-toggle">
          <SectionHeader label="Components" title="Toggle" desc="Binary toggle switch with labels and optional badge. Used for pricing plans and settings." />
          <div className="sg-row" style={{ gap: 32 }}>
            <div className="sg-toggle-demo">
              <Toggle active={toggleOn} onToggle={() => setToggleOn(!toggleOn)} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />
              <span className="sg-toggle-state">State: {toggleOn ? 'Yearly' : 'Monthly'}</span>
            </div>
          </div>
          <div className="sg-code">
            <code>{`<Toggle active={on} onToggle={toggle} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />`}</code>
          </div>
        </section>

        {/* SECTION HEADER */}
        <section className="sg-section" id="sg-section-header">
          <SectionHeader label="Components" title="Section Header" desc="Standardized section introductions with label pill, title, and description. Supports centered alignment." />

          <h3 className="sg-sub">Left Aligned</h3>
          <div className="sg-demo-box">
            <SectionHeader label="Features" title="Section Title Goes Here" desc="A supporting description that provides context for the section content." />
          </div>

          <h3 className="sg-sub">Center Aligned</h3>
          <div className="sg-demo-box">
            <SectionHeader label="Pricing" title="Start free. Scale when ready." desc="No hidden fees. No surprises. Pick the plan that fits." center />
          </div>

          <div className="sg-code">
            <code>{`<SectionHeader label="Features" title="Title" desc="Description." />`}</code>
            <code>{`<SectionHeader label="Pricing" title="Title" desc="Description." center />`}</code>
          </div>
        </section>

        {/* Footer */}
        <div className="sg-footer">
          <div className="sg-footer-inner">
            <p>LimeWP Design System v2.0</p>
            <p>Last updated: March 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
