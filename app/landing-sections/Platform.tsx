import { Icon, IconBox } from '../landing-components'

const dashNavItems = [
  { icon: 'home', label: 'Home' },
  { icon: 'grid', label: 'Services' },
  { icon: 'globe', label: 'DNS' },
  { icon: 'cart', label: 'Billing' },
  { icon: 'monitor', label: 'Resources', dropdown: true },
]

const sidebarItems = [
  { icon: 'grid', label: 'Overview', active: true },
  { icon: 'box', label: 'File Manager' },
  { icon: 'lock', label: 'SSH/SFTP' },
  { icon: 'settings', label: 'Tools' },
  { icon: 'globe', label: 'Domains' },
  { icon: 'pen', label: 'Themes' },
  { icon: 'grid', label: 'Plugins', badge: 3 },
  { icon: 'refresh-single', label: 'Backups' },
  { icon: 'pulse', label: 'Analytics' },
  { icon: 'bolt', label: 'Caching' },
  { icon: 'users', label: 'Users' },
  { icon: 'monitor', label: 'Logs' },
]

const usageRings = [
  { label: 'Visitors', value: 87, sub: '8.7k / 10.0k', color: '#ef4444' },
  { label: 'Storage', value: 12, sub: '1.2 / 10 GB', color: 'var(--acc)' },
  { label: 'Bandwidth', value: 8, sub: '3.2 / 40GB', color: 'var(--acc)' },
  { label: 'CPU', value: 22, sub: '0.44 / 2 vCPU', color: 'var(--acc)' },
  { label: 'RAM', value: 13, sub: '520 / 4.1k MB', color: 'var(--acc)' },
]

const perfMetrics = [
  { icon: 'check-circle', value: '99.98', unit: '%', label: 'UPTIME', color: 'var(--acc)' },
  { icon: 'bolt', value: '45', unit: 'ms', label: 'RESPONSE', color: '#eab308' },
  { icon: 'trend', value: '92', unit: '/100', label: 'SPEED', color: 'var(--acc)' },
  { icon: 'shield', value: 'A', unit: '', label: 'SECURITY', color: 'var(--acc)' },
]

const serverInfo = [
  { icon: 'server', label: 'IP ADDRESS', value: '34.89.42.178' },
  { icon: 'globe', label: 'REGION', value: 'US East' },
  { icon: 'grid', label: 'WORDPRESS', value: '6.7.1' },
  { icon: 'code-slash', label: 'PHP', value: '8.3.4' },
  { icon: 'box', label: 'MYSQL', value: '8.0.40' },
  { icon: 'lock', label: 'SSL', value: '324 days' },
]

const platformFeatures = [
  { icon: 'code-slash', title: 'Install 60,000+ Plugins', desc: 'Any plugin or theme from the WordPress repository, without restriction.' },
  { icon: 'globe', title: 'Custom Domain from Day One', desc: 'Connect your own domain immediately. Free DNS management included.' },
  { icon: 'shield', title: 'Go Live with SSL', desc: 'Serve real visitors with automatic HTTPS encryption on every site.' },
  { icon: 'lock', title: 'Full WP Admin Access', desc: 'Complete control over your WordPress installation, including FTP access.' },
]

function Ring({ value, color, size = 60 }: { value: number; color: string; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} className="usage-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bdrs)" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  )
}

export function Platform({ Rev, onSignup }: { Rev: React.ComponentType<{ children: React.ReactNode; className?: string }>; onSignup: () => void }) {
  return (
    <>
    <section className="platform-header-section">
      <div className="container">
        <Rev className="sc">
          <div className="sl">Not a Demo</div>
          <div className="st">This is a <em style={{fontStyle:'normal',color:'var(--acc)'}}>real website.</em> Yours to build and launch.</div>
          <p className="sd">When you sign up, you get a full WordPress installation with zero restrictions. It's production hosting, not a sandbox.</p>
        </Rev>
      </div>
    </section>
    <section className="platform-section" id="platform">
      <div className="container">
        <div className="platform-preview">
          {/* Dashboard Navbar */}
          <div className="dash-nav">
            <div className="dash-nav-left">
              <div className="dash-logo"><Icon name="bolt" /></div>
              <span className="dash-logo-text">LimeWP</span>
            </div>
            <div className="dash-nav-mid">
              {dashNavItems.map(item => (
                <span key={item.label} className="dash-nav-link">
                  <Icon name={item.icon} />{item.label}
                  {item.dropdown && <Icon name="chevron" />}
                </span>
              ))}
            </div>
            <div className="dash-nav-right">
              <div className="dash-search">
                <Icon name="search" />
                <span>Search...</span>
                <span className="dash-kbd">&#8984;K</span>
              </div>
              <div className="dash-nav-btn">
                <Icon name="bell" />
                <span className="dash-notif">3</span>
              </div>
              <div className="dash-nav-btn"><Icon name="sun" /></div>
              <div className="dash-user">
                <span className="dash-avatar">L</span>
                <span>Lime</span>
                <Icon name="chevron" />
              </div>
            </div>
          </div>

          {/* Site Header */}
          <div className="dash-body">
            <div className="site-header">
              <div className="site-header-left">
                <div className="site-header-icon"><Icon name="globe" /></div>
                <div>
                  <div className="site-header-domain">
                    limewp.com
                    <span className="site-badge green">Active</span>
                    <span className="site-badge teal">SSL Secured</span>
                  </div>
                  <div className="site-header-plan">Pro Plan &middot; <span className="upgrade-link">Upgrade to Business &#10024;</span></div>
                </div>
              </div>
              <div className="site-header-actions">
                <button className="btn btn-s"><Icon name="arrow" width={14} height={14} /> Visit Site</button>
                <button className="btn btn-s"><Icon name="monitor" width={14} height={14} /> WP Admin</button>
                <button className="btn btn-p" onClick={onSignup}><Icon name="bolt" width={14} height={14} /> Quick Actions</button>
              </div>
            </div>

            {/* Meta strip */}
            <div className="site-meta-strip">
              <span><Icon name="server" /> Server: us-east-1</span>
              <span><Icon name="globe" /> IP: 189.65.43.55</span>
              <span><Icon name="code-slash" /> PHP: 8.1</span>
              <span><Icon name="grid" /> WP: 6.6.2</span>
              <span><Icon name="lock" /> Next Payment: Mar 15, 2026</span>
              <span className="meta-link">View Site Analytics <Icon name="arrow" /></span>
            </div>

            {/* Sidebar + Main */}
            <div className="platform-content">
              <div className="platform-sidebar">
                <div className="sidebar-header">
                  <span className="sidebar-title">Site Management</span>
                  <span className="sidebar-sub">Configure your site</span>
                </div>
                <div className="sidebar-nav">
                  {sidebarItems.map(item => (
                    <div key={item.label} className={`sidebar-item${item.active ? ' active' : ''}`}>
                      <Icon name={item.icon} />{item.label}
                      {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                      {item.active && <span className="sidebar-arrow"><Icon name="chevron" /></span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="platform-main">
                {/* Plan Usage */}
                <div className="overview-card">
                  <div className="overview-card-header">
                    <h4>Plan Usage <span className="site-badge accent">Business</span></h4>
                    <span className="overview-meta">Renews Mar 15, 2026</span>
                  </div>
                  <div className="usage-grid">
                    {usageRings.map(u => (
                      <div key={u.label} className="usage-item">
                        <div className="usage-ring-wrap">
                          <Ring value={u.value} color={u.color} />
                          <span className="usage-ring-value">{u.value}%</span>
                        </div>
                        <div className="usage-label">{u.label}</div>
                        <div className="usage-sub">{u.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div className="overview-card">
                  <h4>Performance</h4>
                  <div className="perf-grid">
                    {perfMetrics.map(m => (
                      <div key={m.label} className="perf-item">
                        <div className="perf-icon" style={{ color: m.color }}><Icon name={m.icon} /></div>
                        <div className="perf-value">{m.value}<span className="perf-unit">{m.unit}</span></div>
                        <div className="perf-label">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Server */}
                <div className="overview-card">
                  <h4>Server</h4>
                  <div className="server-grid">
                    {serverInfo.map(s => (
                      <div key={s.label} className="server-item">
                        <div className="server-icon"><Icon name={s.icon} /></div>
                        <div>
                          <div className="server-label">{s.label}</div>
                          <div className="server-value">{s.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="platform-features-section">
      <div className="container">
        <Rev>
          <div className="platform-features">
            {platformFeatures.map((f, i) => (
              <div key={i} className="platform-feature">
                <IconBox name={f.icon} size="md" />
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </Rev>
      </div>
    </section>
    </>
  )
}
