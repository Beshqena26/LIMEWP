import { Icon, IconBox } from '../components'
import { siteRows } from '../data'

const sidebarMain = [
  { icon: 'grid', label: 'Dashboard', active: true },
  { icon: 'globe', label: 'My Sites' },
  { icon: 'pulse', label: 'Analytics' },
  { icon: 'shield', label: 'Security' },
]

const sidebarTools = [
  { icon: 'box', label: 'Staging' },
  { icon: 'refresh-single', label: 'Backups' },
  { icon: 'settings', label: 'Settings' },
]

const platformStats = [
  { icon: 'globe', color: 'green' as const, trend: '+2', value: '12', label: 'Active Sites', showArrow: true },
  { icon: 'pulse', color: 'blue' as const, trend: '99.99%', value: '100%', label: 'Uptime (30d)' },
  { icon: 'bolt', color: 'purple' as const, trend: '-12ms', value: '187ms', label: 'Avg Load Time' },
  { icon: 'shield', color: 'orange' as const, trend: 'A+', value: '0', label: 'Security Issues' },
]

const platformFeatures = [
  { icon: 'grid', title: 'Unified Dashboard', desc: 'Manage all your WordPress sites from a single, intuitive control panel.' },
  { icon: 'pulse', title: 'Real-time Analytics', desc: 'Monitor traffic, performance, and uptime with live metrics and alerts.' },
  { icon: 'box', title: 'One-Click Staging', desc: 'Test changes safely with instant staging environments for every site.' },
  { icon: 'refresh-single', title: 'Auto Backups', desc: 'Daily automated backups with one-click restore and 30-day retention.' },
]

export function Platform({ Rev, onSignup }: { Rev: React.ComponentType<{ children: React.ReactNode; className?: string }>; onSignup: () => void }) {
  return (
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
                <span className="browser-dot red" /><span className="browser-dot yellow" /><span className="browser-dot green" />
              </div>
              <div className="browser-url"><Icon name="lock" /> app.limewp.com/dashboard</div>
            </div>
            <div className="platform-content">
              <div className="platform-sidebar">
                <div className="sidebar-logo">
                  <div className="sidebar-logo-icon"><Icon name="bolt" /></div>
                  <span>LimeWP</span>
                </div>
                <div className="sidebar-nav">
                  {sidebarMain.map(item => (
                    <div key={item.label} className={`sidebar-item${item.active ? ' active' : ''}`}><Icon name={item.icon} />{item.label}</div>
                  ))}
                  <div className="sidebar-section-title">Tools</div>
                  {sidebarTools.map(item => (
                    <div key={item.label} className="sidebar-item"><Icon name={item.icon} />{item.label}</div>
                  ))}
                </div>
              </div>
              <div className="platform-main">
                <div className="platform-main-header">
                  <h3 className="platform-main-title">Dashboard Overview</h3>
                  <div className="platform-main-actions">
                    <button className="btn btn-s"><Icon name="download" width={16} height={16} /> Export</button>
                    <button className="btn btn-p" onClick={onSignup}><Icon name="plus" width={16} height={16} /> Add Site</button>
                  </div>
                </div>
                <div className="platform-stats-grid">
                  {platformStats.map(s => (
                    <div key={s.label} className="platform-stat-card">
                      <div className="platform-stat-header">
                        <div className={`platform-stat-icon ${s.color}`}><Icon name={s.icon} /></div>
                        <span className="platform-stat-trend">
                          {s.showArrow && <Icon name="trend" />}
                          {s.trend}
                        </span>
                      </div>
                      <div className="platform-stat-value">{s.value}</div>
                      <div className="platform-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="platform-sites">
                  <div className="platform-sites-header">
                    <span className="platform-sites-title">Your Sites</span>
                    <span className="platform-sites-filter">All Sites <Icon name="chevron" /></span>
                  </div>
                  {siteRows.map((site, i) => (
                    <div key={i} className="site-row">
                      <div className="site-info">
                        <div className="site-favicon wp">W</div>
                        <div><div className="site-name">{site.name}</div><div className="site-url">{site.url}</div></div>
                      </div>
                      <div className="site-status"><span className={`site-status-dot ${site.dot}`} />{site.status}</div>
                      <div className="site-metric">{site.time}</div>
                      <div className="site-metric">{site.visits}</div>
                      <div className="site-actions">
                        <button className="site-action-btn"><Icon name="dots" /></button>
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
  )
}
