import { Icon, IconBox, Button } from '../landing-components'

const stats = [
  { v: '<200ms', l: 'Avg. TTFB' },
  { v: '99.99%', l: 'Uptime SLA' },
  { v: '50+', l: 'Edge Locations' },
  { v: '95+', l: 'PageSpeed Score' },
]

const perks = [
  { icon: 'bolt', text: 'LiteSpeed Server' },
  { icon: 'server', text: 'NVMe SSD' },
  { icon: 'lock', text: 'Redis Caching' },
  { icon: 'shield', text: 'Enterprise WAF' },
]

export function Hero({ onSignup, countdown }: { onSignup: () => void; countdown: { d: number; h: number; m: number; s: number } }) {
  const { d, h, m, s } = countdown
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-badge"><span className="dot" /> LimeWP — Premium WordPress Hosting</div>
            <h1>WordPress Hosting<br /><em>That Performs.</em></h1>
            <p className="hero-sub">LimeWP gives your site LiteSpeed servers, NVMe storage, Redis caching, and enterprise security — try it free for 6 months.</p>
            <div className="hero-actions">
              <Button variant="primary" icon="arrow" onClick={onSignup}>Start Free on LimeWP</Button>
            </div>
            <div className="hero-trust">
              {['LiteSpeed + NVMe stack', 'Isolated cloud containers', '6 months free trial'].map(text => (
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
              <IconBox name="bolt" size="sm" color="green" />
              LiteSpeed Active
            </div>
            <div className="hero-float f2">
              <IconBox name="server" size="sm" color="blue" />
              NVMe SSD
            </div>
            <div className="hero-float f3">
              <IconBox name="shield" size="sm" color="purple" />
              WAF Protected
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
                  LimeWP Premium
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
