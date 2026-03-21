"use client";

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParticles, useReveal } from './landing-hooks'
import { Icon } from './landing-components'
import { navLinks } from './landing-data'
import { Hero } from './landing-sections/Hero'
import { Platform } from './landing-sections/Platform'
import { Marquee, BuildFirst, Features, UpgradePath, PlansCard, Testimonials, FAQ, CTA, Footer } from './landing-sections/Sections'
import { useTheme } from '@/lib/context/ThemeContext'
import { ROUTES } from '@/config/routes'
import './landing.css'

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

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export default function HomePage() {
  const { resolvedTheme, setTheme } = useTheme()
  const theme = resolvedTheme
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const glowRef = useRef<HTMLDivElement>(null)
  const { canvasRef, mouseRef } = useParticles(theme)

  useEffect(() => { document.body.style.overflow = mobileMenu ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [mobileMenu])

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

  const toggleTheme = useCallback(() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light'), [resolvedTheme, setTheme])
  const onSignup = useCallback(() => { window.location.href = ROUTES.LOGIN }, [])
  const { h, m, s } = useCountdown()
  const countdown = { d: 0, h, m, s }

  return (
    <div className="landing">
      <canvas ref={canvasRef} id="particleCanvas" />
      <div ref={glowRef} className="cursor-glow" />

      <div className="top-banner">
        <div className="top-banner-shimmer" />
        <div className="top-banner-inner">
          <span className="top-banner-dot" />
          <span className="top-banner-text">LimeWP — premium WordPress hosting, free for 6 months</span>
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
        <a href="/" className="nav-logo">
          <img src="/limewp-logo.svg" alt="LimeWP" width="120" height="32" style={{ display: 'block' }} />
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
          <button className="nav-login" onClick={() => { window.location.href = ROUTES.LOGIN }}>Sign In</button>
          <button className="nav-cta" onClick={onSignup}>Start Free</button>
          <button className={`burger${mobileMenu ? ' open' : ''}`} onClick={() => setMobileMenu(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay${mobileMenu ? ' open' : ''}`} onClick={() => setMobileMenu(false)} />
      <div className={`mobile-menu${mobileMenu ? ' open' : ''}`}>
        <div className="mobile-menu-links">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={(e) => {
              e.preventDefault()
              setMobileMenu(false)
              document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
            }}><Icon name={l.icon} width={18} height={18} />{l.label}</a>
          ))}
        </div>
        <div className="mobile-menu-actions">
          <button className="btn btn-s" onClick={() => { setMobileMenu(false); window.location.href = ROUTES.LOGIN }}>Sign In</button>
          <button className="btn btn-p" onClick={() => { setMobileMenu(false); onSignup() }}>Start Free</button>
        </div>
      </div>

      <Hero onSignup={onSignup} countdown={countdown} />
      <Marquee />
      <Platform Rev={Rev} onSignup={onSignup} />
      <BuildFirst Rev={Rev} onSignup={onSignup} />
      <Features Rev={Rev} />
      <UpgradePath Rev={Rev} onSignup={onSignup} countdown={countdown} />
      <PlansCard Rev={Rev} onSignup={onSignup} countdown={countdown} />
      <Testimonials Rev={Rev} />
      <FAQ Rev={Rev} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CTA Rev={Rev} onSignup={onSignup} />
      <Footer />
      <div className="sticky-cta">
        <button className="btn btn-p" onClick={onSignup}>Try Premium Free</button>
      </div>
    </div>
  )
}
