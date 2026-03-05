import { useState, useEffect, useRef, useCallback } from 'react'

/* ── SVG Icons ── */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
)
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)
const SunIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" fill="var(--c1)" />
  </svg>
)

/* ── Data ── */
const marqueeItems = [
  'One-Click WordPress Install', 'Free SSL Certificates', 'Global CDN', 'Auto Daily Backups',
  'Staging Environments', 'WooCommerce Ready', 'SSH & WP-CLI Access', '99.9% Uptime SLA',
  '24/7 Expert Support', 'Free Site Migration', 'DDoS Protection', 'Object Caching',
]

const trustRows = [
  { num: '01', title: 'Performance', desc: 'Optimized infrastructure for fast page loads, responsive dashboards, and reliable behavior under any traffic.', metric: '<200ms', label: 'Avg. Response Time' },
  { num: '02', title: 'Security', desc: 'Automatic SSL, hardened infrastructure, and continuous monitoring to protect your website and its visitors.', metric: '24/7', label: 'Threat Monitoring' },
  { num: '03', title: 'Reliability', desc: 'High uptime, automatic backups, and stable environments keep your site running without interruptions.', metric: '99.9%', label: 'Uptime SLA' },
]

const personas = [
  { emoji: '\u{1F331}', name: 'First-Time Creator', role: 'Launch without complexity', desc: 'Get online fast with one-click WordPress setup, guided onboarding, and automatic security.', tags: ['One-click install', 'Simple dashboard', 'Auto backups', 'Free SSL'], featured: true },
  { emoji: '\u270D\uFE0F', name: 'Content Creator', role: 'Publish with confidence', desc: 'Fast page loads and traffic spike protection keep your audience engaged.', tags: ['Built-in CDN', 'Media optimization', 'Caching', 'Spike protection'] },
  { emoji: '\u{1F3A8}', name: 'Freelancer / Designer', role: 'Build and deliver for clients', desc: 'Test safely in staging, migrate sites with zero hassle.', tags: ['Staging environments', 'Site migration', 'Client handoff'] },
  { emoji: '\u{1F3E2}', name: 'Agency / Studio', role: 'Manage many sites at once', desc: 'Centralized dashboard for all client sites with team permissions.', tags: ['Multi-site management', 'Team roles', 'Bulk updates'] },
  { emoji: '\u{1F6D2}', name: 'E-commerce Owner', role: 'Sell with stable performance', desc: 'Optimized databases and secure checkout keep your store fast.', tags: ['DB optimization', 'Object caching', 'Secure checkout', 'Rollback'] },
  { emoji: '\u26A1', name: 'Developer', role: 'Full control and transparency', desc: 'SSH, WP-CLI, database access, and debug logs.', tags: ['SSH access', 'WP-CLI', 'DB access', 'Debug logs'] },
  { emoji: '\u{1F3DB}\uFE0F', name: 'Enterprise', role: 'Mission-critical infrastructure', desc: 'High availability, audit trails, and SLA guarantees.', tags: ['High availability', 'Audit logs', 'Access control', 'SLA'] },
]

const capabilities = [
  { icon: <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, title: 'WordPress-Optimized Infrastructure', sub: 'Purpose-built servers with intelligent caching layers and global content delivery.', details: ['LiteSpeed Cache', 'Redis', 'Global CDN', 'PHP 8.3'] },
  { icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: 'Safe Development Workflows', sub: 'Staging environments and automated backup systems protect your production sites.', details: ['1-Click Staging', 'Auto Backups', 'Rollback'] },
  { icon: <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>, title: 'Flexible Development Tools', sub: 'Command-line tools, direct database access, and full configuration control.', details: ['SSH', 'WP-CLI', 'phpMyAdmin', 'Git Deploy'] },
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>, title: 'Scalable Architecture', sub: 'Infrastructure that auto-scales alongside your traffic and ambitions.', details: ['Auto-Scaling', 'Load Balancing', '99.9% SLA'] },
]

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up and pick your plan in under a minute.' },
  { num: '02', title: 'Install WordPress', desc: 'One click. Fully configured and ready to go.' },
  { num: '03', title: 'Start Building', desc: 'Publish, develop, or launch your store immediately.' },
]

const prices = { m: [9, 29, 79], y: [7, 23, 63] }

const plans = [
  { name: 'Starter', note: 'Perfect for personal sites and blogs', features: ['1 WordPress site', '10 GB SSD storage', 'Free SSL and CDN', 'Daily backups', 'Email support'] },
  { name: 'Professional', note: 'For growing businesses and freelancers', features: ['10 WordPress sites', '50 GB SSD storage', 'Staging environments', 'SSH and WP-CLI access', 'Priority support', 'Free site migration'], popular: true },
  { name: 'Enterprise', note: 'For agencies and mission-critical sites', features: ['Unlimited sites', '200 GB SSD storage', 'High availability', 'Team roles and audit logs', 'Dedicated support', '99.99% SLA guarantee'] },
]

const faqData = [
  { q: 'Can I migrate my existing WordPress site?', a: 'Yes. We offer free migrations for all plans. Our team handles the entire process with zero downtime. Most migrations complete within 24 hours.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Every plan comes with a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment \u2014 no questions asked.' },
  { q: 'Is WooCommerce supported?', a: 'Yes. All plans support WooCommerce with optimized databases, object caching, and secure checkout.' },
  { q: 'What kind of support do you offer?', a: 'All plans include email support. Professional adds live chat. Enterprise gets a dedicated engineer and phone support.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes. Change your plan anytime. Upgrades are instant, downgrades apply next billing cycle. We prorate automatically.' },
  { q: 'Do you include staging environments?', a: 'Staging is included in Professional and Enterprise plans. Clone your site, test safely, push live when ready.' },
  { q: 'What happens if I exceed my storage?', a: 'We notify you before hitting your limit. Add storage or upgrade anytime. We never shut down your site without notice.' },
]

/* ── Hooks ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function useParticles(theme: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const particlesRef = useRef<{ x: number; y: number; ox: number; oy: number; r: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const resize = () => {
      canvas.width = innerWidth
      canvas.height = innerHeight
      // reinit particles
      const ps: typeof particlesRef.current = []
      const cols = Math.floor(innerWidth / 90)
      const rows = Math.floor(innerHeight / 90)
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
          ps.push({ x: 90 * i + 45 + Math.random() * 20 - 10, y: 90 * j + 45 + Math.random() * 20 - 10, ox: 90 * i + 45, oy: 90 * j + 45, r: 1.5 + Math.random() })
      particlesRef.current = ps
    }
    resize()
    window.addEventListener('resize', resize)

    const getCSS = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dotC = getCSS('--canv-dot')
      const lineC = getCSS('--canv-line')
      const actC = getCSS('--canv-active')
      const rad = 180
      const mouse = mouseRef.current
      const ps = particlesRef.current

      for (const p of ps) {
        const dx = mouse.x - p.ox, dy = mouse.y - p.oy
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < rad) { p.x += (p.ox + dx * .15 - p.x) * .12; p.y += (p.oy + dy * .15 - p.y) * .12 }
        else { p.x += (p.ox - p.x) * .08; p.y += (p.oy - p.y) * .08 }
        const prox = d < rad ? 1 - d / rad : 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + prox * 2, 0, Math.PI * 2)
        ctx.fillStyle = prox > 0 ? actC : dotC; ctx.fill()
      }
      for (let i = 0; i < ps.length; i++)
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j]
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            const near = Math.min(
              Math.sqrt((mouse.x - a.x) ** 2 + (mouse.y - a.y) ** 2),
              Math.sqrt((mouse.x - b.x) ** 2 + (mouse.y - b.y) ** 2)
            ) < rad
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = near ? actC : lineC; ctx.lineWidth = near ? 1 : .5; ctx.stroke()
          }
        }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [theme])

  return { canvasRef, mouseRef }
}

/* ── Reveal wrapper ── */
function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

/* ── Main Component ── */
export function LandingPage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('limewp-theme')
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })
  const [modal, setModal] = useState<'login' | 'signup' | null>(null)
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const glowRef = useRef<HTMLDivElement>(null)

  const { canvasRef, mouseRef } = useParticles(theme)

  // Theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('limewp-theme', theme)
  }, [theme])

  // Body scroll lock for modal
  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

  // Mouse tracking for cursor glow
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top = e.clientY + 'px'
        glowRef.current.classList.add('active')
      }
    }
    const leave = () => {
      mouseRef.current = { x: -999, y: -999 }
      glowRef.current?.classList.remove('active')
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave) }
  }, [mouseRef])

  // Active nav section
  useEffect(() => {
    const onScroll = () => {
      const secs = document.querySelectorAll('section[id]')
      let cur = ''
      secs.forEach(s => { if (window.scrollY >= (s as HTMLElement).offsetTop - 120) cur = s.id })
      setActiveSection(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Tilt cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.tilt-card')
    const handlers: [HTMLElement, (e: MouseEvent) => void, () => void][] = []
    cards.forEach(c => {
      const move = (e: MouseEvent) => {
        const r = c.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - .5
        const y = (e.clientY - r.top) / r.height - .5
        c.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`
        c.style.boxShadow = `${-x * 12}px ${y * 12}px 32px rgba(0,0,0,.08)`
      }
      const leave = () => { c.style.transform = ''; c.style.boxShadow = '' }
      c.addEventListener('mousemove', move as EventListener)
      c.addEventListener('mouseleave', leave)
      handlers.push([c, move, leave])
    })
    return () => handlers.forEach(([c, m, l]) => { c.removeEventListener('mousemove', m as EventListener); c.removeEventListener('mouseleave', l) })
  }, [])

  // Global reveal observer for elements with .reveal class not managed by Rev
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal:not(.vis)').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), [])

  const navLinks = [
    { href: '#trust', label: 'Platform' },
    { href: '#personas', label: 'Solutions' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ]

  const chartVals = [65, 45, 78, 52, 88, 72, 95]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleFormSubmit = () => { window.location.href = 'https://limewp.vercel.app/dashboard' }

  return (
    <>
      <canvas ref={canvasRef} id="particleCanvas" />
      <div ref={glowRef} className="cursor-glow" />

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">
          <img src="https://limewp.vercel.app/limewp-logo.svg" alt="LimeWP" width="120" height="32" style={{ display: 'block' }} />
        </a>
        <div className="nav-mid">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={activeSection === l.href.slice(1) ? 'active' : ''}>{l.label}</a>
          ))}
        </div>
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          </button>
          <span className="nav-login" onClick={() => setModal('login')}>Log In</span>
          <span className="nav-cta" onClick={() => setModal('signup')}>Sign Up</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge"><span className="dot" /> Built for everyone on WordPress</div>
              <h1>Hosting That <em>Works</em> for Everyone Who Builds</h1>
              <p className="hero-sub">From your first blog to enterprise platforms — fast, secure, and reliable WordPress hosting that scales with you.</p>
              <div className="hero-actions">
                <span className="btn btn-p" onClick={() => setModal('signup')}>Start Your Site <ArrowIcon /></span>
                <a href="#capabilities" className="btn btn-s">Explore Platform</a>
              </div>
              <div className="hero-trust">
                <span>Trusted by teams at</span>
                <span className="ht-name">Vercel</span>
                <span className="ht-dot" />
                <span className="ht-name">Stripe</span>
                <span className="ht-dot" />
                <span className="ht-name">Shopify</span>
                <span className="ht-dot" />
                <span className="ht-name">Basecamp</span>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-float f1">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                SSL Active
              </div>
              <div className="hero-float f2">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                CDN Enabled
              </div>
              <div className="hero-float f3">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Backed Up
              </div>
              <div className="hero-card">
                <div className="hero-card-bar">
                  <span className="hero-card-dot r" /><span className="hero-card-dot y" /><span className="hero-card-dot g" />
                  <span className="hero-card-url">limewp.app/dashboard</span>
                </div>
                <div className="hero-card-body">
                  <div className="hero-card-row">
                    <div className="hero-card-stat"><div className="hcs-val">99.9%</div><div className="hcs-label">Uptime</div></div>
                    <div className="hero-card-stat"><div className="hcs-val">142ms</div><div className="hcs-label">Response</div></div>
                    <div className="hero-card-stat"><div className="hcs-val">2.4k</div><div className="hcs-label">Visitors</div></div>
                  </div>
                  <HeroChart vals={chartVals} />
                  <div className="hero-card-label">{days.map(d => <span key={d}>{d}</span>)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* TRUST / FOUNDATION */}
      <section className="trust" id="trust">
        <div className="container">
          <Rev className="">
            <div className="trust-header">
              <div><div className="sl">Foundation</div><div className="st">The Three Pillars Every<br />WordPress Site Needs</div></div>
              <p className="sd">No matter who you are — performance, security, and reliability are non-negotiable.</p>
            </div>
          </Rev>
          <div className="trust-list">
            {trustRows.map(r => (
              <Rev key={r.num}>
                <div className="trust-row">
                  <div className="trust-num">{r.num}</div>
                  <div className="trust-body"><h3>{r.title}</h3><p>{r.desc}</p></div>
                  <div className="trust-metric"><div className="trust-metric-val">{r.metric}</div><div className="trust-metric-label">{r.label}</div></div>
                </div>
              </Rev>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS / SOLUTIONS */}
      <section className="personas" id="personas">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Solutions</div>
            <div className="st">Designed Around Real<br />WordPress Users</div>
            <p className="sd">Different workflows need different tools. Our platform adapts to each.</p>
          </Rev>
          <div className="pgrid">
            {personas.map((p, i) => (
              <div key={i} className="pcard tilt-card reveal">
                {p.featured ? (
                  <>
                    <div className="pcard-ava">{p.emoji}</div>
                    <div className="pcard-content">
                      <div className="pcard-top">
                        <div><h3>{p.name}</h3><div className="pcard-role">{p.role}</div></div>
                      </div>
                      <div className="pcard-desc">{p.desc}</div>
                      <ul className="ptags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pcard-top">
                      <div className="pcard-ava">{p.emoji}</div>
                    </div>
                    <h3>{p.name}</h3>
                    <div className="pcard-role">{p.role}</div>
                    <div className="pcard-desc">{p.desc}</div>
                    <ul className="ptags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="capabilities" id="capabilities">
        <div className="container">
          <Rev>
            <div className="cap-layout">
              <div className="cap-side">
                <div className="sl">Platform</div>
                <div className="st">One Platform,<br />Every Workflow</div>
                <p className="sd">Instead of limited hosting, a platform that adapts to your needs while staying reliable.</p>
                <div className="cap-side-stats">
                  <div className="cap-stat"><div className="cs-num">40+</div><div className="cs-label">Global Edge Nodes</div></div>
                  <div className="cap-stat"><div className="cs-num">6</div><div className="cs-label">Data Regions</div></div>
                </div>
              </div>
              <div className="cap-timeline">
                {capabilities.map((c, i) => (
                  <div key={i} className="cap-item">
                    <div className="cap-dot">{c.icon}</div>
                    <h3>{c.title}</h3>
                    <div className="cap-sub">{c.sub}</div>
                    <div className="cap-details">{c.details.map(d => <span key={d}>{d}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Rev>
        </div>
      </section>

      {/* STEPS */}
      <section className="steps" id="steps">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Getting Started</div>
            <div className="st">Live in Minutes</div>
            <p className="sd">Three steps. No complexity. Your site is online before your coffee gets cold.</p>
          </Rev>
          <Rev>
            <div className="steps-row">
              {steps.map(s => (
                <div key={s.num} className="step">
                  <div className="step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* TRUSTPILOT */}
      <section className="trustpilot" id="reviews">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Reviews</div>
            <div className="st">Trusted by Thousands</div>
            <p className="sd">See what our customers say about LimeWP hosting.</p>
            <div className="tp-score">
              <div className="tp-stars">
                {[1, 2, 3, 4, 5].map(n => (
                  <svg key={n} className={`tp-star${n <= 4 ? ' filled' : ' half'}`} viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                  </svg>
                ))}
              </div>
              <div className="tp-rating">4.7 <span>out of 5</span></div>
              <div className="tp-badge">
                <svg viewBox="0 0 24 24" className="tp-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                Trustpilot Verified
              </div>
            </div>
          </Rev>
        </div>
        <ReviewCarousel />
        <div className="container">
          <Rev className="sc">
            <div className="tp-summary" style={{ marginTop: '40px' }}>
              <span>Based on <strong>2,847</strong> reviews</span>
              <span className="tp-dot" />
              <span>Excellent on Trustpilot</span>
            </div>
            <a href="https://www.trustpilot.com/review/limewp.com" target="_blank" rel="noopener noreferrer" className="btn tp-cta" style={{ marginTop: '24px' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Write a Review
            </a>
          </Rev>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Pricing</div>
            <div className="st">Simple, Transparent Pricing</div>
            <p className="sd">No hidden fees. No surprises. Pick the plan that fits.</p>
            <div className="billing-toggle">
              <span className={!yearly ? 'on' : ''}>Monthly</span>
              <div className={`tpill${yearly ? ' yr' : ''}`} onClick={() => setYearly(y => !y)} />
              <span className={yearly ? 'on' : ''}>Yearly</span>
              <span className="save">Save 20%</span>
            </div>
          </Rev>
          <Rev>
            <div className="prgrid">
              {plans.map((plan, i) => (
                <div key={plan.name} className={`prcard${plan.popular ? ' pop' : ''}`}>
                  {plan.popular && <div className="pop-label">Recommended</div>}
                  <div className="pn">{plan.name}</div>
                  <div className="pr">
                    $<span className="pv" style={{ transition: 'opacity .2s, transform .2s' }}>
                      {yearly ? prices.y[i] : prices.m[i]}
                    </span><sub>/mo</sub>
                  </div>
                  <div className="prnote">{plan.note}</div>
                  <div className="pr-divider" />
                  <ul className="fl">
                    {plan.features.map(f => (
                      <li key={f}><CheckIcon />{f}</li>
                    ))}
                  </ul>
                  {i === 2 ? (
                    <a href="#" className="prbtn">Contact Sales</a>
                  ) : (
                    <span className="prbtn" onClick={() => setModal('signup')}>Get Started</span>
                  )}
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <Rev>
            <div className="faqgrid">
              <div className="faqside">
                <div className="sl">FAQ</div>
                <div className="st">Questions?<br />We Have Answers</div>
                <p className="sd">Everything you need to know before getting started.</p>
                <div className="faqcontact">
                  <p>Can't find what you're looking for? Our team is happy to help.</p>
                  <a href="#" className="btn btn-sm btn-s">Contact Support <ArrowIcon /></a>
                </div>
              </div>
              <div className="faqlist">
                {faqData.map((f, i) => (
                  <div key={i} className={`faqitem${openFaq === i ? ' open' : ''}`}>
                    <div className="faqq" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                      {f.q}
                      <span className="faqico"><PlusIcon /></span>
                    </div>
                    <div className="faqa"><div className="faqai">{f.a}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </Rev>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="final-cta" id="cta">
        <div className="container">
          <Rev>
            <div className="ctabox">
              <h2>Built for the Way<br />You Work</h2>
              <p>From first-time creators to enterprise teams — tools and reliability to build with confidence.</p>
              <div className="cta-acts">
                <span className="btn btn-coral" onClick={() => setModal('signup')}>Start Hosting Today <ArrowIcon /></span>
                <a href="#pricing" className="btn btn-s">Explore Plans</a>
              </div>
            </div>
          </Rev>
        </div>
      </section>

      {/* LOGIN MODAL */}
      <div className={`modal-overlay${modal === 'login' ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="modal">
          <div className="modal-close" onClick={() => setModal(null)}><CloseIcon /></div>
          <div className="modal-title">Welcome Back</div>
          <div className="modal-sub">Log in to manage your WordPress sites</div>
          <LoginForm onSubmit={handleFormSubmit} onSwitch={() => setModal('signup')} />
        </div>
      </div>

      {/* SIGNUP MODAL */}
      <div className={`modal-overlay${modal === 'signup' ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="modal">
          <div className="modal-close" onClick={() => setModal(null)}><CloseIcon /></div>
          <div className="modal-title">Create Account</div>
          <div className="modal-sub">Start your WordPress site in minutes</div>
          <SignupForm onSubmit={handleFormSubmit} onSwitch={() => setModal('login')} />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="finner">
            <div className="fcp">&copy; 2026 LimeWP. WordPress hosting built for everyone.</div>
            <div className="flnks">
              <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Status</a><a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

/* ── Hero Chart ── */
function HeroChart({ vals }: { vals: number[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    vals.forEach((v, i) => {
      const bar = document.createElement('div')
      bar.className = 'bar' + (i === vals.length - 1 ? ' active' : '')
      bar.style.height = '0%'
      ref.current!.appendChild(bar)
      setTimeout(() => { bar.style.height = v + '%' }, 300 + i * 80)
    })
  }, [vals])
  return <div ref={ref} className="hero-card-chart" />
}

/* ── Review Carousel ── */
const reviews = [
  { name: 'Sarah M.', role: 'Freelance Designer', rating: 5, text: 'Migrated 12 client sites in one weekend. Zero downtime, staging works flawlessly. Best hosting decision I\'ve made.' },
  { name: 'James K.', role: 'E-commerce Owner', rating: 5, text: 'Our WooCommerce store loads in under 2 seconds now. Checkout conversions went up 23% after switching to LimeWP.' },
  { name: 'Priya R.', role: 'Content Creator', rating: 5, text: 'Went viral and got 50k visitors in a day. Site didn\'t even flinch. The CDN and caching just handled everything.' },
  { name: 'Marcus T.', role: 'Agency Director', rating: 4, text: 'Managing 40+ client sites from one dashboard saves us hours every week. Team permissions are exactly what we needed.' },
  { name: 'Elena V.', role: 'Developer', rating: 5, text: 'SSH access, WP-CLI, Git deploy — finally a host that treats developers like adults. The staging workflow is chef\'s kiss.' },
  { name: 'David L.', role: 'Startup Founder', rating: 5, text: 'Started on Starter plan, now on Enterprise. Scaling was seamless. Support team actually knows WordPress inside out.' },
]

function ReviewCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf: number
    let pos = 0
    const speed = 0.4

    const animate = () => {
      if (!paused) {
        pos -= speed
        const halfWidth = track.scrollWidth / 2
        if (Math.abs(pos) >= halfWidth) pos = 0
        track.style.transform = `translateX(${pos}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const doubled = [...reviews, ...reviews]

  return (
    <div className="tp-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="tp-carousel-fade tp-fade-left" />
      <div className="tp-carousel-fade tp-fade-right" />
      <div className="tp-track" ref={trackRef}>
        {doubled.map((review, i) => (
          <div key={i} className="tp-card">
            <div className="tp-card-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <svg key={n} className={`tp-star-sm${n <= review.rating ? ' filled' : ''}`} viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
                </svg>
              ))}
            </div>
            <p className="tp-card-text">"{review.text}"</p>
            <div className="tp-card-author">
              <div className="tp-card-avatar">{review.name[0]}</div>
              <div>
                <div className="tp-card-name">{review.name}</div>
                <div className="tp-card-role">{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Login Form ── */
function LoginForm({ onSubmit, onSwitch }: { onSubmit: () => void; onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const submit = () => {
    const e: Record<string, boolean> = {}
    if (!email.trim()) e.email = true
    if (!password.trim()) e.password = true
    setErrors(e)
    if (Object.keys(e).length === 0) onSubmit()
  }

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={errors.email ? { borderColor: '#EF4444' } : {}} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={errors.password ? { borderColor: '#EF4444' } : {}} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="modal-check"><input type="checkbox" /> Remember me</label>
        <a style={{ fontSize: '.8rem', color: 'var(--acc)', fontWeight: 500, cursor: 'pointer' }}>Forgot password?</a>
      </div>
      <button className="modal-submit" type="button" onClick={submit}>Log In</button>
      <div className="modal-divider"><span>or continue with</span></div>
      <div className="modal-social">
        <button type="button"><GoogleIcon /> Google</button>
        <button type="button"><GitHubIcon /> GitHub</button>
      </div>
      <div className="modal-footer">Don't have an account? <a onClick={onSwitch}>Sign up</a></div>
    </div>
  )
}

/* ── Signup Form ── */
function SignupForm({ onSubmit, onSwitch }: { onSubmit: () => void; onSwitch: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const submit = () => {
    const e: Record<string, boolean> = {}
    if (!name.trim()) e.name = true
    if (!email.trim()) e.email = true
    if (!password.trim()) e.password = true
    setErrors(e)
    if (Object.keys(e).length === 0) onSubmit()
  }

  return (
    <div className="modal-form">
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={errors.name ? { borderColor: '#EF4444' } : {}} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={errors.email ? { borderColor: '#EF4444' } : {}} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} style={errors.password ? { borderColor: '#EF4444' } : {}} />
      </div>
      <label className="modal-check"><input type="checkbox" /> I agree to the <a style={{ color: 'var(--acc)', fontWeight: 500, cursor: 'pointer' }}>Terms of Service</a></label>
      <button className="modal-submit" type="button" onClick={submit}>Create Account</button>
      <div className="modal-divider"><span>or sign up with</span></div>
      <div className="modal-social">
        <button type="button"><GoogleIcon /> Google</button>
        <button type="button"><GitHubIcon /> GitHub</button>
      </div>
      <div className="modal-footer">Already have an account? <a onClick={onSwitch}>Log in</a></div>
    </div>
  )
}
