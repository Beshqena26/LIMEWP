import { useState, useEffect, useRef, useCallback } from 'react'

/* -- SVG Icons -- */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
)
const ChevronDown = () => (
  <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
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
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
)

/* -- Data -- */
const marqueeItems = [
  'One-Click WordPress Install', 'Free SSL Certificates', 'Global CDN', 'Auto Daily Backups',
  'Staging Environments', 'WooCommerce Ready', 'SSH & WP-CLI Access', '99.9% Uptime SLA',
  '24/7 Expert Support', 'Free Site Migration', 'DDoS Protection', 'Object Caching',
]

const audiences = [
  { icon: <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, title: 'First-Time Creators', desc: 'Launch your blog, portfolio, or business site without touching code. We handle the tech so you can focus on what matters.' },
  { icon: <svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>, title: 'Content Creators & Bloggers', desc: 'Blazing-fast load times, built-in SEO optimization, and monetization support to grow your audience.' },
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>, title: 'Freelancers & Designers', desc: 'Staging environments, one-click cloning, and client-ready handoffs. Build faster, deliver with confidence.' },
  { icon: <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>, title: 'E-Commerce & WooCommerce', desc: 'PCI-compliant hosting, checkout optimization, and infrastructure that handles traffic spikes without breaking.' },
  { icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, title: 'Agencies & Studios', desc: 'Multi-site dashboard, bulk updates, white-label options, and team permissions. Manage all clients from one place.' },
  { icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>, title: 'Enterprise & Organizations', desc: 'SLAs, compliance certifications, dedicated support, and infrastructure designed for mission-critical sites.' },
]

const features = [
  {
    large: true,
    icon: <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    title: 'Lightning-Fast Performance',
    desc: 'Our globally distributed infrastructure ensures your site loads in under 200ms, anywhere in the world. Built on modern architecture with NVMe storage and smart caching.',
    list: ['Global CDN with 200+ edge locations', 'Automatic image optimization', 'Object caching & Redis support'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'Enterprise-Grade Security',
    desc: 'Sleep soundly with automatic malware scanning, firewalls, DDoS protection, and free SSL certificates.',
    list: ['Web Application Firewall', 'Real-time malware scanning', 'Free Wildcard SSL'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    title: 'Automatic Daily Backups',
    desc: 'Every change is automatically backed up. Restore your entire site with one click. 30-day retention included.',
    list: ['One-click restore', 'Off-site redundant storage', 'Downloadable backups'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    title: 'Expert WordPress Support',
    desc: 'Real humans who know WordPress inside and out. Available 24/7 via chat and email. Average response under 2 minutes.',
    list: ['24/7 live chat support', 'WordPress experts, not scripts', 'Free migration assistance'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    title: 'Staging Environments',
    desc: 'Test updates, designs, and plugins safely before going live. Clone your production site in seconds.',
    list: ['One-click staging creation', 'Selective push to production', 'Shareable staging URLs'],
  },
]

const prices = { m: [9, 29, 79], y: [7, 23, 63] }

const plans = [
  { name: 'Starter', note: 'Perfect for personal sites and blogs', features: ['1 WordPress site', '10GB SSD storage', 'Free SSL certificate', 'Daily backups', 'Global CDN'] },
  { name: 'Professional', note: 'For growing sites and small businesses', features: ['Up to 5 WordPress sites', '50GB SSD storage', 'Staging environments', 'Priority support', 'WooCommerce optimized'], popular: true },
  { name: 'Agency', note: 'For teams managing multiple clients', features: ['Up to 25 WordPress sites', '200GB SSD storage', 'White-label dashboard', 'Unlimited team members', 'Bulk site management'] },
]

const testimonials = [
  { initials: 'SK', name: 'Sarah K.', role: 'Travel Blogger', text: "I was terrified of launching my first website. LimeWP made it so simple\u2014I had my blog live in under an hour. Their support team answered every question patiently." },
  { initials: 'MR', name: 'Marcus R.', role: 'E-commerce Owner', text: "After moving to LimeWP, our page load time dropped from 4 seconds to under 400ms. Our bounce rate is down 35% and conversions are up. Game changer for our store." },
  { initials: 'JC', name: 'James C.', role: 'Agency Director', text: "We manage 47 client sites from one dashboard. Bulk updates take minutes, not hours. Haven't had a single downtime incident in 8 months." },
]

const faqData = [
  { q: 'Can I migrate my existing WordPress site?', a: 'Absolutely! We offer free migrations on all plans. Our team handles everything\u2014DNS, database, files\u2014with zero downtime. Most migrations complete within 24-48 hours.' },
  { q: 'What happens if I need help?', a: 'Our WordPress experts are available 24/7 via live chat and email. Average response time is under 2 minutes. No question is too basic\u2014we\'re here to help.' },
  { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial on all plans. No credit card required. If it\'s not for you, simply don\'t continue\u2014no awkward cancellation process.' },
  { q: 'Do you support WooCommerce?', a: 'LimeWP is fully optimized for WooCommerce. Our infrastructure handles traffic spikes, optimizes checkout performance, and meets PCI compliance requirements.' },
  { q: 'What\'s your uptime guarantee?', a: 'We guarantee 99.99% uptime with our SLA. If we don\'t meet that commitment, you\'ll receive account credits automatically. Most customers see 100% uptime.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel anytime with no penalties. We don\'t believe in lock-in. You own your data and code\u2014we provide full exports and migration assistance.' },
]

/* -- Hooks -- */
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

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

/* -- Main Component -- */
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('limewp-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

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
    { href: '#platform', label: 'Platform' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ]

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
          <span className="nav-login" onClick={() => setModal('login')}>Sign In</span>
          <span className="nav-cta" onClick={() => setModal('signup')}>Start Free Trial</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="hero-badge"><span className="dot" /> Trusted by 50,000+ WordPress sites</div>
              <h1>WordPress hosting<br />that <em>just works</em></h1>
              <p className="hero-sub">Lightning-fast speeds, bulletproof security, and expert support. Whether you're launching your first site or managing hundreds, LimeWP scales with you.</p>
              <div className="hero-actions">
                <span className="btn btn-p" onClick={() => setModal('signup')}>Start Your Free Trial <ArrowIcon /></span>
                <a href="#platform" className="btn btn-s">See How It Works</a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">99.99%</div>
                  <div className="stat-label">Uptime SLA</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">&lt;200ms</div>
                  <div className="stat-label">Response Time</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">24/7</div>
                  <div className="stat-label">Expert Support</div>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hero-right">
              {/* Floating Badges */}
              <div className="hero-float f1">
                <div className="badge-icon green">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                SSL Active
              </div>
              <div className="hero-float f2">
                <div className="badge-icon blue">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                10x Faster
              </div>
              <div className="hero-float f3">
                <div className="badge-icon purple">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                </div>
                Auto Backup
              </div>

              {/* Server Stack */}
              <div className="server-stack">
                <div className="server-unit">
                  <div className="server-info">
                    <div className="server-icon">
                      <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
                    </div>
                    <div className="server-details">
                      <h4>Production Server</h4>
                      <span>US-East &bull; 4 vCPU &bull; 16GB RAM</span>
                    </div>
                  </div>
                  <div className="server-status">
                    <span className="status-dot" />
                    <span className="status-text">Online</span>
                  </div>
                </div>
                <div className="server-unit">
                  <div className="server-info">
                    <div className="server-icon">
                      <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    </div>
                    <div className="server-details">
                      <h4>Staging Environment</h4>
                      <span>EU-West &bull; Synced 2m ago</span>
                    </div>
                  </div>
                  <div className="server-status">
                    <span className="status-dot delayed" />
                    <span className="status-text">Active</span>
                  </div>
                </div>
                <div className="server-unit">
                  <div className="server-info">
                    <div className="server-icon">
                      <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    </div>
                    <div className="server-details">
                      <h4>CDN Edge Network</h4>
                      <span>200+ Global Locations</span>
                    </div>
                  </div>
                  <div className="server-status">
                    <span className="status-dot delayed-2" />
                    <span className="status-text">Healthy</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Card */}
              <div className="dashboard-card">
                <div className="dashboard-header">
                  <div className="dashboard-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Performance Monitor
                  </div>
                  <div className="dashboard-badge">Live</div>
                </div>
                <div className="performance-metrics">
                  <div className="metric-item">
                    <div className="metric-value">187ms</div>
                    <div className="metric-label">Load Time</div>
                    <div className="metric-bar"><div className="metric-bar-fill" style={{ '--progress-width': '95%' } as React.CSSProperties} /></div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">100%</div>
                    <div className="metric-label">Uptime</div>
                    <div className="metric-bar"><div className="metric-bar-fill" style={{ '--progress-width': '100%' } as React.CSSProperties} /></div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">A+</div>
                    <div className="metric-label">Security</div>
                    <div className="metric-bar"><div className="metric-bar-fill" style={{ '--progress-width': '98%' } as React.CSSProperties} /></div>
                  </div>
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

      {/* PLATFORM PREVIEW */}
      <section className="platform-section" id="platform">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Platform Preview</div>
            <div className="st">One dashboard to manage everything</div>
            <p className="sd">Monitor performance, manage sites, and deploy updates&mdash;all from a single, intuitive interface.</p>
          </Rev>

          <Rev>
            <div className="platform-preview">
              <div className="platform-browser-bar">
                <div className="browser-dots">
                  <span className="browser-dot red" />
                  <span className="browser-dot yellow" />
                  <span className="browser-dot green" />
                </div>
                <div className="browser-url">
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  app.limewp.com/dashboard
                </div>
              </div>

              <div className="platform-content">
                {/* Sidebar */}
                <div className="platform-sidebar">
                  <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                      <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </div>
                    <span>LimeWP</span>
                  </div>
                  <div className="sidebar-nav">
                    <div className="sidebar-item active">
                      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                      Dashboard
                    </div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                      My Sites
                    </div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                      Analytics
                    </div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      Security
                    </div>
                    <div className="sidebar-section-title">Tools</div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                      Staging
                    </div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                      Backups
                    </div>
                    <div className="sidebar-item">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                      Settings
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="platform-main">
                  <div className="platform-main-header">
                    <h3 className="platform-main-title">Dashboard Overview</h3>
                    <div className="platform-main-actions">
                      <button className="btn btn-s">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Export
                      </button>
                      <button className="btn btn-p" onClick={() => setModal('signup')}>
                        <svg viewBox="0 0 24 24" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Site
                      </button>
                    </div>
                  </div>

                  <div className="platform-stats-grid">
                    <div className="platform-stat-card">
                      <div className="platform-stat-header">
                        <div className="platform-stat-icon green">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </div>
                        <span className="platform-stat-trend">
                          <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
                          +2
                        </span>
                      </div>
                      <div className="platform-stat-value">12</div>
                      <div className="platform-stat-label">Active Sites</div>
                    </div>
                    <div className="platform-stat-card">
                      <div className="platform-stat-header">
                        <div className="platform-stat-icon blue">
                          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                        </div>
                        <span className="platform-stat-trend">99.99%</span>
                      </div>
                      <div className="platform-stat-value">100%</div>
                      <div className="platform-stat-label">Uptime (30d)</div>
                    </div>
                    <div className="platform-stat-card">
                      <div className="platform-stat-header">
                        <div className="platform-stat-icon purple">
                          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        </div>
                        <span className="platform-stat-trend">-12ms</span>
                      </div>
                      <div className="platform-stat-value">187ms</div>
                      <div className="platform-stat-label">Avg Load Time</div>
                    </div>
                    <div className="platform-stat-card">
                      <div className="platform-stat-header">
                        <div className="platform-stat-icon orange">
                          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <span className="platform-stat-trend">A+</span>
                      </div>
                      <div className="platform-stat-value">0</div>
                      <div className="platform-stat-label">Security Issues</div>
                    </div>
                  </div>

                  <div className="platform-sites">
                    <div className="platform-sites-header">
                      <span className="platform-sites-title">Your Sites</span>
                      <span className="platform-sites-filter">All Sites <ChevronDown /></span>
                    </div>
                    {[
                      { name: 'TechStartup Blog', url: 'techstartup.com', status: 'Online', dot: '', time: '156ms', visits: '2.4k visits' },
                      { name: 'Creative Portfolio', url: 'sarahdesigns.co', status: 'Online', dot: '', time: '142ms', visits: '1.8k visits' },
                      { name: 'E-commerce Store', url: 'shopmodern.io', status: 'Update Available', dot: 'warning', time: '198ms', visits: '5.2k visits' },
                    ].map((site, i) => (
                      <div key={i} className="site-row">
                        <div className="site-info">
                          <div className="site-favicon wp">W</div>
                          <div>
                            <div className="site-name">{site.name}</div>
                            <div className="site-url">{site.url}</div>
                          </div>
                        </div>
                        <div className="site-status">
                          <span className={`site-status-dot ${site.dot}`} />
                          {site.status}
                        </div>
                        <div className="site-metric">{site.time}</div>
                        <div className="site-metric">{site.visits}</div>
                        <div className="site-actions">
                          <button className="site-action-btn">
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Rev>

          <Rev>
            <div className="platform-features">
              {[
                { icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>, title: 'Unified Dashboard', desc: 'Manage all your WordPress sites from a single, intuitive control panel.' },
                { icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>, title: 'Real-time Analytics', desc: 'Monitor traffic, performance, and uptime with live metrics and alerts.' },
                { icon: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>, title: 'One-Click Staging', desc: 'Test changes safely with instant staging environments for every site.' },
                { icon: <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>, title: 'Auto Backups', desc: 'Daily automated backups with one-click restore and 30-day retention.' },
              ].map((f, i) => (
                <div key={i} className="platform-feature">
                  <div className="platform-feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* AUDIENCE / SOLUTIONS */}
      <section className="audience-section" id="solutions">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Built For Everyone</div>
            <div className="st">Hosting that fits your needs</div>
            <p className="sd">From first-time creators to enterprise teams, LimeWP adapts to how you work.</p>
          </Rev>
          <Rev>
            <div className="audience-grid">
              {audiences.map((a, i) => (
                <div key={i} className="audience-card">
                  <div className="audience-icon">{a.icon}</div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <a href="#" className="audience-link">Learn more <ArrowIcon /></a>
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Features</div>
            <div className="st">Everything you need, nothing you don't</div>
            <p className="sd">Built from the ground up for WordPress performance and reliability.</p>
          </Rev>
          <Rev>
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className={`feature-card${f.large ? ' large' : ''}`}>
                  <div className="feature-content">
                    <div className="feature-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                    <div className="feature-list">
                      {f.list.map(item => (
                        <div key={item} className="feature-list-item"><CheckIcon />{item}</div>
                      ))}
                    </div>
                  </div>
                  {f.large && (
                    <div className="feature-visual">
                      <div className="speed-demo">
                        {[
                          { label: 'LimeWP', time: '187ms', width: '95%', color: 'lime' },
                          { label: 'Competitor A', time: '1.2s', width: '45%', color: 'muted' },
                          { label: 'Competitor B', time: '2.1s', width: '25%', color: 'muted' },
                          { label: 'Shared Hosting', time: '3.8s', width: '12%', color: 'muted' },
                        ].map(s => (
                          <div key={s.label} className="speed-item">
                            <div className="speed-label">
                              <span>{s.label}</span>
                              <span style={s.color === 'lime' ? { color: 'var(--acc)' } : {}}>{s.time}</span>
                            </div>
                            <div className="speed-bar">
                              <div className={`speed-bar-fill ${s.color}`} style={{ width: s.width }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Simple Pricing</div>
            <div className="st">Plans that grow with you</div>
            <p className="sd">No hidden fees, no surprises. Just straightforward pricing.</p>
            <div className="billing-toggle">
              <span className={!yearly ? 'on' : ''}>Monthly</span>
              <div className={`tpill${yearly ? ' yr' : ''}`} onClick={() => setYearly(y => !y)} />
              <span className={yearly ? 'on' : ''}>Yearly <span className="save">Save 20%</span></span>
            </div>
          </Rev>
          <Rev>
            <div className="prgrid">
              {plans.map((plan, i) => (
                <div key={plan.name} className={`prcard${plan.popular ? ' pop' : ''}`}>
                  {plan.popular && <div className="pop-label">Most Popular</div>}
                  <div className="pn">{plan.name}</div>
                  <div className="prnote">{plan.note}</div>
                  <div className="pr">
                    <span className="pr-currency">$</span>
                    <span className="pv" style={{ transition: 'opacity .2s, transform .2s' }}>
                      {yearly ? prices.y[i] : prices.m[i]}
                    </span>
                    <sub>/month</sub>
                  </div>
                  <div className={`yearly-savings${yearly ? ' visible' : ''}`}>
                    Save ${(prices.m[i] - prices.y[i]) * 12}/year
                  </div>
                  <div className="pr-divider" />
                  <ul className="fl">
                    {plan.features.map(f => (
                      <li key={f}><CheckIcon />{f}</li>
                    ))}
                  </ul>
                  {i === 2 ? (
                    <a href="#" className="prbtn">Contact Sales</a>
                  ) : plan.popular ? (
                    <span className="prbtn" onClick={() => setModal('signup')}>Start Free Trial</span>
                  ) : (
                    <span className="prbtn" onClick={() => setModal('signup')}>Get Started</span>
                  )}
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <Rev className="sc">
            <div className="sl">Reviews</div>
            <div className="st">Loved by 50,000+ WordPress users</div>
            <p className="sd">From solo creators to enterprise teams, hear why they chose LimeWP.</p>
          </Rev>
          <Rev>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-rating">
                    {[1, 2, 3, 4, 5].map(n => <StarIcon key={n} />)}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.initials}</div>
                    <div className="author-info">
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
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
                <div className="st">Frequently asked<br />questions</div>
                <p className="sd">Everything you need to know about LimeWP.</p>
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
                      <span className="faqico"><ChevronDown /></span>
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
              <div className="sl">Ready to Launch?</div>
              <h2>Start building something great</h2>
              <p>Join 50,000+ WordPress sites that trust LimeWP for speed, security, and reliability. Start your free trial today&mdash;no credit card required.</p>
              <div className="cta-acts">
                <span className="btn btn-p" onClick={() => setModal('signup')}>Start Your Free Trial <ArrowIcon /></span>
                <a href="#pricing" className="btn btn-s">Talk to Sales</a>
              </div>
              <div className="trust-badges">
                <div className="trust-badge">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  14-day free trial
                </div>
                <div className="trust-badge">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  No credit card required
                </div>
                <div className="trust-badge">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  Free migration included
                </div>
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
          <div className="footer-content">
            <div className="footer-brand">
              <a href="#" className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                LimeWP
              </a>
              <p>WordPress hosting that just works. Fast, secure, and backed by humans who actually care.</p>
            </div>
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">WooCommerce</a>
              <a href="#">Enterprise</a>
              <a href="#">Migrations</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">System Status</a>
              <a href="#">Documentation</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 LimeWP. Built with love for WordPress users everywhere.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

/* -- Login Form -- */
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

/* -- Signup Form -- */
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
