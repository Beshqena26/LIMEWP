import { useState } from 'react'
import { Icon, Button, IconBox, Input, SectionHeader, Toggle } from './components'
import './styleguide.css'

const colors = [
  { name: 'Accent', var: '--acc', desc: 'Primary brand color' },
  { name: 'Accent Hover', var: '--acc2', desc: 'Hover state' },
  { name: 'Lime', var: '--lime', desc: 'Lime highlight' },
  { name: 'Lime Light', var: '--lime-light', desc: 'Light lime' },
  { name: 'Blue', var: '--blue', desc: 'Info / analytics' },
  { name: 'Purple', var: '--purple', desc: 'Branding accent' },
  { name: 'Orange', var: '--orange', desc: 'Warning states' },
  { name: 'Red', var: '--red', desc: 'Error / danger' },
]

const surfaces = [
  { name: 'Background', var: '--bg0' },
  { name: 'Surface 1', var: '--bg1' },
  { name: 'Surface 2', var: '--bg2' },
  { name: 'Surface Hover', var: '--bg2h' },
]

const textColors = [
  { name: 'Primary', var: '--c1' },
  { name: 'Secondary', var: '--c2' },
  { name: 'Muted', var: '--c3' },
  { name: 'Inverse', var: '--ci' },
]

const iconNames = [
  'arrow', 'check', 'chevron', 'sun', 'moon', 'close', 'star', 'bolt',
  'shield', 'server', 'box', 'pulse', 'globe', 'grid', 'chat', 'lock',
  'download', 'plus', 'dots', 'trend', 'refresh', 'refresh-single',
  'settings', 'pen', 'monitor', 'cart', 'users', 'briefcase', 'check-circle',
]

const radii = [
  { name: 'XS', var: '--r-xs', value: '8px' },
  { name: 'Small', var: '--r-s', value: '10px' },
  { name: 'Default', var: '--r', value: '16px' },
]

export function StyleGuide() {
  const [inputVal, setInputVal] = useState('')
  const [inputErr, setInputErr] = useState(false)
  const [toggleOn, setToggleOn] = useState(false)

  return (
    <div className="sg">
      <div className="container">
        <div className="sg-header">
          <h1>LimeWP Design System</h1>
          <p>Components, tokens, and patterns used across the LimeWP platform.</p>
        </div>

        {/* COLORS */}
        <section className="sg-section">
          <SectionHeader label="Tokens" title="Color Palette" desc="Brand and semantic colors that adapt to light/dark themes." />
          <h3 className="sg-sub">Brand & Semantic</h3>
          <div className="sg-color-grid">
            {colors.map(c => (
              <div key={c.var} className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: `var(${c.var})` }} />
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Surfaces</h3>
          <div className="sg-color-grid">
            {surfaces.map(c => (
              <div key={c.var} className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: `var(${c.var})`, border: '1px solid var(--bdrs)' }} />
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                </div>
              </div>
            ))}
          </div>

          <h3 className="sg-sub">Text</h3>
          <div className="sg-color-grid">
            {textColors.map(c => (
              <div key={c.var} className="sg-color-card">
                <div className="sg-color-swatch" style={{ background: `var(${c.var})`, border: '1px solid var(--bdrs)' }} />
                <div className="sg-color-info">
                  <strong>{c.name}</strong>
                  <code>{c.var}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className="sg-section">
          <SectionHeader label="Tokens" title="Typography" desc="Font families, sizes, and weights." />
          <div className="sg-type-grid">
            <div className="sg-type-row">
              <code>--fd</code>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '2rem', fontWeight: 800 }}>Plus Jakarta Sans</span>
              <span className="sg-type-note">Headlines, prices, display text</span>
            </div>
            <div className="sg-type-row">
              <code>--fb</code>
              <span style={{ fontFamily: 'var(--fb)', fontSize: '1.25rem' }}>Inter</span>
              <span className="sg-type-note">Body text, UI elements</span>
            </div>
          </div>
          <div className="sg-type-scale">
            <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>Hero Heading</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, lineHeight: 1.1 }}>Section Title</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700 }}>Card Title</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.25rem', fontWeight: 700 }}>Subsection</div>
            <div style={{ fontSize: '1.1rem', color: 'var(--c2)' }}>Body Large</div>
            <div style={{ fontSize: '.95rem', color: 'var(--c2)' }}>Body Default</div>
            <div style={{ fontSize: '.85rem', color: 'var(--c3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Label / Overline</div>
          </div>
        </section>

        {/* SPACING & RADIUS */}
        <section className="sg-section">
          <SectionHeader label="Tokens" title="Radius & Spacing" desc="Border radius tokens and spacing conventions." />
          <div className="sg-radius-grid">
            {radii.map(r => (
              <div key={r.var} className="sg-radius-item">
                <div className="sg-radius-preview" style={{ borderRadius: `var(${r.var})` }} />
                <strong>{r.name}</strong>
                <code>{r.var}: {r.value}</code>
              </div>
            ))}
          </div>
        </section>

        {/* BUTTONS */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Buttons" desc="Action triggers in primary, secondary, and size variants." />
          <div className="sg-row">
            <Button variant="primary" icon="arrow" onClick={() => {}}>Primary Button</Button>
            <Button variant="secondary" icon="arrow" href="#">Secondary Button</Button>
            <Button variant="primary" size="small" onClick={() => {}}>Small Primary</Button>
            <Button variant="secondary" size="small" href="#">Small Secondary</Button>
          </div>
          <div className="sg-code">
            <code>{`<Button variant="primary" icon="arrow" onClick={fn}>Label</Button>`}</code>
            <code>{`<Button variant="secondary" href="#">Label</Button>`}</code>
            <code>{`<Button size="small" onClick={fn}>Small</Button>`}</code>
          </div>
        </section>

        {/* ICON BOX */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Icon Boxes" desc="Colored icon containers in small, medium, and large sizes." />
          <h3 className="sg-sub">Sizes</h3>
          <div className="sg-row">
            <div className="sg-icon-demo">
              <IconBox name="bolt" size="sm" />
              <span>Small (32px)</span>
            </div>
            <div className="sg-icon-demo">
              <IconBox name="bolt" size="md" />
              <span>Medium (56px)</span>
            </div>
            <div className="sg-icon-demo">
              <IconBox name="bolt" size="lg" />
              <span>Large (64px)</span>
            </div>
          </div>
          <h3 className="sg-sub">Colors</h3>
          <div className="sg-row">
            <div className="sg-icon-demo"><IconBox name="globe" color="lime" /><span>Lime</span></div>
            <div className="sg-icon-demo"><IconBox name="pulse" color="blue" /><span>Blue</span></div>
            <div className="sg-icon-demo"><IconBox name="bolt" color="purple" /><span>Purple</span></div>
            <div className="sg-icon-demo"><IconBox name="shield" color="orange" /><span>Orange</span></div>
          </div>
          <div className="sg-code">
            <code>{`<IconBox name="bolt" size="md" color="lime" />`}</code>
          </div>
        </section>

        {/* ICONS */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Icon Library" desc="All available icons in the Icon component registry." />
          <div className="sg-icon-grid">
            {iconNames.map(name => (
              <div key={name} className="sg-icon-item">
                <Icon name={name} width={24} height={24} fill="none" stroke="var(--c1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <code>{name}</code>
              </div>
            ))}
          </div>
          <div className="sg-code">
            <code>{`<Icon name="bolt" />`}</code>
          </div>
        </section>

        {/* INPUTS */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Form Inputs" desc="Text inputs with labels, placeholders, and error states." />
          <div className="sg-form-row">
            <Input label="Default Input" placeholder="Type something..." value={inputVal} onChange={setInputVal} />
            <Input label="Error State" placeholder="Invalid value" value="" onChange={() => {}} error={inputErr || true} />
          </div>
          <div className="sg-row" style={{ marginTop: 16 }}>
            <button className="modal-submit" style={{ maxWidth: 200 }} onClick={() => setInputErr(!inputErr)}>Toggle Error</button>
          </div>
          <div className="sg-code">
            <code>{`<Input label="Email" type="email" placeholder="you@example.com" value={val} onChange={setVal} error={hasError} />`}</code>
          </div>
        </section>

        {/* TOGGLE */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Toggle" desc="Binary toggle with labels and optional badge." />
          <div className="sg-row">
            <Toggle active={toggleOn} onToggle={() => setToggleOn(!toggleOn)} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />
          </div>
          <div className="sg-code">
            <code>{`<Toggle active={on} onToggle={toggle} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />`}</code>
          </div>
        </section>

        {/* SECTION HEADER */}
        <section className="sg-section">
          <SectionHeader label="Components" title="Section Header" desc="Consistent section introductions with label, title, and description." />
          <div className="sg-demo-box">
            <SectionHeader label="Label Text" title="Section Title Goes Here" desc="A supporting description that provides context for the section content." center />
          </div>
          <div className="sg-code">
            <code>{`<SectionHeader label="Features" title="Section Title" desc="Description text." center />`}</code>
          </div>
        </section>

        {/* SHADOWS & EFFECTS */}
        <section className="sg-section">
          <SectionHeader label="Tokens" title="Shadows & Effects" desc="Elevation levels and glow effects." />
          <div className="sg-shadow-grid">
            <div className="sg-shadow-card" style={{ boxShadow: 'var(--sh)' }}>
              <strong>Default Shadow</strong>
              <code>--sh</code>
            </div>
            <div className="sg-shadow-card" style={{ boxShadow: 'var(--shh)' }}>
              <strong>Hover Shadow</strong>
              <code>--shh</code>
            </div>
            <div className="sg-shadow-card" style={{ boxShadow: 'var(--glow)' }}>
              <strong>Glow</strong>
              <code>--glow</code>
            </div>
          </div>
        </section>

        <div className="sg-footer">
          <p>LimeWP Design System v1.0</p>
        </div>
      </div>
    </div>
  )
}
