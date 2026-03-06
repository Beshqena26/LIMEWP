import { useState, useEffect, useRef, useCallback } from 'react'
import { useParticles, useReveal } from './hooks'
import { Icon, AuthModals } from './components'
import { navLinks } from './data'
import { Hero } from './sections/Hero'
import { Platform } from './sections/Platform'
import { Marquee, Audience, Features, Pricing, Testimonials, FAQ, CTA, Footer } from './sections/Sections'

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

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

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('limewp-theme', theme) }, [theme])
  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (glowRef.current) { glowRef.current.style.left = e.clientX + 'px'; glowRef.current.style.top = e.clientY + 'px'; glowRef.current.classList.add('active') }
    }
    const leave = () => { mouseRef.current = { x: -999, y: -999 }; glowRef.current?.classList.remove('active') }
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
  const onSignup = useCallback(() => setModal('signup'), [])

  return (
    <>
      <canvas ref={canvasRef} id="particleCanvas" />
      <div ref={glowRef} className="cursor-glow" />

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
            <Icon name={theme === 'light' ? 'sun' : 'moon'} />
          </button>
          <span className="nav-login" onClick={() => setModal('login')}>Sign In</span>
          <span className="nav-cta" onClick={onSignup}>Start Free Trial</span>
        </div>
      </nav>

      <Hero onSignup={onSignup} />
      <Marquee />
      <Platform Rev={Rev} onSignup={onSignup} />
      <Audience Rev={Rev} />
      <Features Rev={Rev} />
      <Pricing Rev={Rev} yearly={yearly} setYearly={setYearly} onSignup={onSignup} />
      <Testimonials Rev={Rev} />
      <FAQ Rev={Rev} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CTA Rev={Rev} onSignup={onSignup} />
      <AuthModals modal={modal} setModal={setModal} />
      <Footer />
    </>
  )
}
