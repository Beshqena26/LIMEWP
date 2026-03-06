import { Icon, IconBox, Button } from '../components'

const servers = [
  { icon: 'server', name: 'Production Server', info: 'US-East \u2022 4 vCPU \u2022 16GB RAM', status: 'Online', dotClass: '' },
  { icon: 'box', name: 'Staging Environment', info: 'EU-West \u2022 Synced 2m ago', status: 'Active', dotClass: 'delayed' },
  { icon: 'pulse', name: 'CDN Edge Network', info: '200+ Global Locations', status: 'Healthy', dotClass: 'delayed-2' },
]

const metrics = [
  { v: '187ms', l: 'Load Time', w: '95%' },
  { v: '100%', l: 'Uptime', w: '100%' },
  { v: 'A+', l: 'Security', w: '98%' },
]

const stats = [
  { v: '99.99%', l: 'Uptime SLA' },
  { v: '<200ms', l: 'Response Time' },
  { v: '24/7', l: 'Expert Support' },
]

export function Hero({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-badge"><span className="dot" /> Trusted by 50,000+ WordPress sites</div>
            <h1>WordPress hosting<br />that <em>just works</em></h1>
            <p className="hero-sub">Lightning-fast speeds, bulletproof security, and expert support. Whether you're launching your first site or managing hundreds, LimeWP scales with you.</p>
            <div className="hero-actions">
              <Button variant="primary" icon="arrow" onClick={onSignup}>Start Your Free Trial</Button>
              <Button variant="secondary" href="#platform">See How It Works</Button>
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
              <IconBox name="refresh-single" size="sm" color="purple" />
              Auto Backup
            </div>
            <div className="server-stack">
              {servers.map(s => (
                <div key={s.name} className="server-unit">
                  <div className="server-info">
                    <div className="server-icon"><Icon name={s.icon} /></div>
                    <div className="server-details"><h4>{s.name}</h4><span>{s.info}</span></div>
                  </div>
                  <div className="server-status"><span className={`status-dot ${s.dotClass}`} /><span className="status-text">{s.status}</span></div>
                </div>
              ))}
            </div>
            <div className="dashboard-card">
              <div className="dashboard-header">
                <div className="dashboard-title">
                  <Icon name="bolt" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  Performance Monitor
                </div>
                <div className="dashboard-badge">Live</div>
              </div>
              <div className="performance-metrics">
                {metrics.map(m => (
                  <div key={m.l} className="metric-item">
                    <div className="metric-value">{m.v}</div>
                    <div className="metric-label">{m.l}</div>
                    <div className="metric-bar"><div className="metric-bar-fill" style={{ '--progress-width': m.w } as React.CSSProperties} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
