import { useState, useEffect, useRef, useCallback } from 'react'
import { useParticles } from './hooks'
import { Icon } from './components'
import { navLinks } from './data'
import { LandingPage } from './LandingPage'
import { StyleGuide } from './StyleGuide'

const TWELVE_HOURS = 12 * 60 * 60 * 1000

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = TWELVE_HOURS - (now % TWELVE_HOURS)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d: 0, h, m, s }
}

function getPage(hash: string) {
  if (hash === '#styleguide') return 'styleguide'
  return 'landing'
}

export function App() {
  const [page, setPage] = useState(() => getPage(window.location.hash))
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('limewp-theme')
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })
  const [modal, setModal] = useState<'login' | 'signup' | null>(null)
  const [activeSection, setActiveSection] = useState('')
  const glowRef = useRef<HTMLDivElement>(null)
  const { canvasRef, mouseRef } = useParticles(theme)

  useEffect(() => {
    const onHash = () => setPage(getPage(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('limewp-theme', theme) }, [theme])
  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

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
  }, [page])

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), [])
  const onSignup = useCallback(() => setModal('signup'), [])
  const { d, h, m, s } = useCountdown()

  if (page === 'styleguide') return <StyleGuide />

  return (
    <>
      <canvas ref={canvasRef} id="particleCanvas" />
      <div ref={glowRef} className="cursor-glow" />

      <div className="top-banner">
        <div className="top-banner-shimmer" />
        <div className="top-banner-inner">
          <span className="top-banner-dot" />
          <span className="top-banner-text">Free hosting for 6 months — limited spots</span>
          <div className="top-banner-countdown">
            <div className="tb-block"><span className="tb-num">{String(h).padStart(2, '0')}</span><span className="tb-lbl">Hrs</span></div>
            <span className="tb-colon">:</span>
            <div className="tb-block"><span className="tb-num">{String(m).padStart(2, '0')}</span><span className="tb-lbl">Min</span></div>
            <span className="tb-colon">:</span>
            <div className="tb-block"><span className="tb-num">{String(s).padStart(2, '0')}</span><span className="tb-lbl">Sec</span></div>
          </div>
          <button className="top-banner-cta" onClick={onSignup}>Claim Your Spot <Icon name="arrow" width={12} height={12} /></button>
        </div>
      </div>

      <nav>
        <a href="#" onClick={e => { e.preventDefault(); window.location.hash = '' }} className="nav-logo">
          <img src="https://limewp.vercel.app/limewp-logo.svg" alt="LimeWP" width="120" height="32" style={{ display: 'block' }} />
        </a>
        <div className="nav-mid">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={activeSection === l.href.slice(1) ? 'active' : ''} onClick={(e) => {
              e.preventDefault()
              document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
            }}>{l.label}</a>
          ))}
        </div>
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon name={theme === 'light' ? 'sun' : 'moon'} />
          </button>
          <button className="nav-login" onClick={() => setModal('login')}>Sign In</button>
          <button className="nav-cta" onClick={onSignup}>Start Free</button>
        </div>
      </nav>

      <LandingPage modal={modal} setModal={setModal} onSignup={onSignup} countdown={{ d, h, m, s }} />
    </>
  )
}
