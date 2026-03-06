import { useEffect, useRef } from 'react'

export function useReveal() {
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

export function useParticles(theme: string) {
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
