import { Icon, IconBox, Button } from '../components'

const stats = [
  { v: '12,000+', l: 'Sites Launched' },
  { v: '4.8/5', l: 'Avg. Rating' },
  { v: '6 Mo', l: 'Free Hosting' },
  { v: '$0', l: 'To Get Started' },
]

const perks = [
  { icon: 'globe', text: 'Custom Domain' },
  { icon: 'lock', text: 'Free SSL' },
  { icon: 'refresh-single', text: 'Auto Backups' },
  { icon: 'code-slash', text: 'Full WP Access' },
]

export function Hero({ onSignup, countdown }: { onSignup: () => void; countdown: { d: number; h: number; m: number; s: number } }) {
  const { d, h, m, s } = countdown
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-badge"><span className="dot" /> Free for 6 months — limited spots remaining</div>
            <h1>Launch Your WordPress Site —<br /><em>Pay $0 for 6 Months</em></h1>
            <p className="hero-sub">Real hosting. Real WordPress. Install plugins, connect your domain, go live — all free for 6 months. No credit card. No catch.</p>
            <div className="hero-actions">
              <Button variant="primary" icon="arrow" onClick={onSignup}>Start Building for Free</Button>
            </div>
            <div className="hero-trust">
              {['No credit card required', 'Full WordPress access', 'Cancel anytime'].map(text => (
                <span key={text} className="hero-trust-item">
                  <Icon name="check-circle" width={15} height={15} />
                  {text}
                </span>
              ))}
            </div>
            <div className="hero-stats">
              {stats.map(s => (
                <div key={s.l} className="stat-item"><div className="stat-value">{s.v}</div><div className="stat-label">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-float f1">
              <IconBox name="shield" size="sm" color="green" />
              SSL Active
            </div>
            <div className="hero-float f2">
              <IconBox name="bolt" size="sm" color="blue" />
              10x Faster
            </div>
            <div className="hero-float f3">
              <IconBox name="server" size="sm" color="purple" />
              Free Redis Caching
            </div>
            <div className="hero-showcase">
              <div className="hero-showcase-glow" />
              <div className="hero-showcase-ring" />
              <div className="hero-showcase-ring hero-showcase-ring-2" />
              <div className="hero-showcase-center">
                <div className="hero-showcase-big">
                  <span className="hero-showcase-num">6</span>
                  <div className="hero-showcase-label">
                    <span className="hero-showcase-months">MONTHS</span>
                    <span className="hero-showcase-free">FREE</span>
                  </div>
                </div>
                <div className="hero-showcase-divider" />
                <div className="hero-showcase-tagline">
                  <Icon name="bolt" width={16} height={16} />
                  WordPress Hosting
                </div>
                <div className="hero-showcase-perks">
                  {perks.map(p => (
                    <div key={p.text} className="hero-showcase-perk">
                      <Icon name={p.icon} width={14} height={14} />
                      <span>{p.text}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-showcase-badge">
                  <Icon name="check-circle" width={14} height={14} />
                  No Credit Card Required
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
