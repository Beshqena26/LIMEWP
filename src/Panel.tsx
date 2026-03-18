import { useState } from 'react'
import { Icon } from './components'
import {
  PANEL_SITES, PANEL_ACTIVITIES, PANEL_NOTIFICATIONS, DNS_RECORDS,
  SUPPORT_TICKETS, ACTIVE_SERVICES, SUGGESTED_SERVICES, panelNavItems,
  type PanelSite, type PanelActivity,
} from './panelData'

// ─── Panel Layout ───
interface PanelProps {
  page: string
  theme: string
  onThemeToggle: () => void
  onLogout: () => void
}

export function Panel({ page, theme, onThemeToggle, onLogout }: PanelProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const panelPage = page.replace('panel-', '') || 'dashboard'

  const navigate = (id: string) => {
    window.location.hash = id === 'dashboard' ? 'dashboard' : id
    setSidebarOpen(false)
  }

  return (
    <div className="panel">
      {/* Sidebar */}
      <aside className={`panel-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="ps-header">
          <a href="#dashboard" className="ps-logo">
            <img src="https://limewp.vercel.app/limewp-logo.svg" alt="LimeWP" width="110" height="28" />
          </a>
        </div>

        <div className="ps-nav">
          {/* Overview */}
          <div className="ps-group-label">Overview</div>
          {panelNavItems.filter(n => n.group === 'Overview').map(n => (
            <a key={n.id} href={`#${n.id}`} className={`ps-nav-item${panelPage === n.id ? ' active' : ''}`} onClick={e => { e.preventDefault(); navigate(n.id) }}>
              <div className="ps-nav-icon"><Icon name={n.icon} width={18} height={18} /></div>
              <span>{n.label}</span>
            </a>
          ))}

          {/* My Sites */}
          <div className="ps-group-label ps-sites-label">
            <span>My Sites</span>
            <span className="ps-badge-count">{PANEL_SITES.length}</span>
          </div>
          {PANEL_SITES.map(site => (
            <a key={site.name} href={`#site-${site.name}`} className={`ps-site-item${panelPage === `site-${site.name}` ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); window.location.hash = `site-${site.name}` }}>
              <div className="ps-site-avatar">{site.initials}</div>
              <div className="ps-site-info">
                <span className="ps-site-name">{site.name}</span>
                <span className="ps-site-meta">{site.visits} visits · {site.status}</span>
              </div>
              <span className={`ps-status-dot ${site.status}`} />
            </a>
          ))}

          {/* Operations */}
          <div className="ps-group-label">Operations</div>
          {panelNavItems.filter(n => n.group === 'Operations').map(n => (
            <a key={n.id} href={`#${n.id}`} className={`ps-nav-item${panelPage === n.id ? ' active' : ''}`} onClick={e => { e.preventDefault(); navigate(n.id) }}>
              <div className="ps-nav-icon"><Icon name={n.icon} width={18} height={18} /></div>
              <span>{n.label}</span>
            </a>
          ))}

          {/* Support */}
          <div className="ps-group-label">Support</div>
          {panelNavItems.filter(n => n.group === 'Support').map(n => (
            <a key={n.id} href={`#${n.id}`} className={`ps-nav-item${panelPage === n.id ? ' active' : ''}`} onClick={e => { e.preventDefault(); navigate(n.id) }}>
              <div className="ps-nav-icon"><Icon name={n.icon} width={18} height={18} /></div>
              <span>{n.label}</span>
            </a>
          ))}
        </div>

        {/* Upgrade Card */}
        <div className="ps-upgrade-card">
          <div className="ps-upgrade-badge"><Icon name="bolt" width={14} height={14} /> Pro Plan</div>
          <p className="ps-upgrade-title">Unlock Premium</p>
          <p className="ps-upgrade-desc">Staging, auto-backups, and priority support.</p>
          <a href="#billing" className="ps-upgrade-btn" onClick={e => { e.preventDefault(); navigate('billing') }}>
            Upgrade Now <Icon name="arrow" width={14} height={14} />
          </a>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="panel-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content area */}
      <div className="panel-main">
        {/* Top Header */}
        <header className="panel-header">
          <div className="ph-left">
            <button className="ph-burger" onClick={() => setSidebarOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>
            <div className="ph-search">
              <Icon name="search" width={16} height={16} />
              <input type="text" placeholder="Search..." />
              <kbd>⌘K</kbd>
            </div>
          </div>
          <div className="ph-right">
            {/* Notifications */}
            <div className="ph-dropdown-wrap">
              <button className="ph-icon-btn" onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false) }}>
                <Icon name="bell" width={20} height={20} />
                {PANEL_NOTIFICATIONS.filter(n => n.unread).length > 0 && (
                  <span className="ph-notif-badge">{PANEL_NOTIFICATIONS.filter(n => n.unread).length}</span>
                )}
              </button>
              {notifOpen && (
                <div className="ph-dropdown ph-notif-dropdown">
                  <div className="ph-dropdown-header">
                    <span>Notifications</span>
                    <span className="ph-notif-new">{PANEL_NOTIFICATIONS.filter(n => n.unread).length} new</span>
                  </div>
                  {PANEL_NOTIFICATIONS.map((n, i) => (
                    <div key={i} className={`ph-notif-item${n.unread ? ' unread' : ''}`}>
                      <div className={`ph-notif-icon ${n.type}`}>
                        <Icon name={n.type === 'success' ? 'check-circle' : n.type === 'warning' ? 'shield' : n.type === 'update' ? 'refresh-single' : 'bolt'} width={14} height={14} />
                      </div>
                      <div className="ph-notif-content">
                        <span className="ph-notif-title">{n.title}{n.unread && <span className="ph-unread-dot" />}</span>
                        <span className="ph-notif-desc">{n.desc}</span>
                        <span className="ph-notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button className="ph-icon-btn" onClick={onThemeToggle} aria-label="Toggle theme">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} width={20} height={20} />
            </button>

            <div className="ph-divider" />

            {/* User Menu */}
            <div className="ph-dropdown-wrap">
              <button className="ph-user-btn" onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false) }}>
                <div className="ph-avatar">LK</div>
                <span className="ph-user-name">Lime</span>
                <Icon name="chevron" width={16} height={16} />
              </button>
              {userMenuOpen && (
                <div className="ph-dropdown ph-user-dropdown">
                  <div className="ph-dropdown-header ph-user-info">
                    <div className="ph-avatar lg">LK</div>
                    <div><strong>Lime Starter</strong><span>lime@example.com</span></div>
                  </div>
                  <a href="#settings" className="ph-dropdown-item" onClick={e => { e.preventDefault(); setUserMenuOpen(false); navigate('settings') }}>
                    <Icon name="settings" width={16} height={16} /> Settings
                  </a>
                  <button className="ph-dropdown-item ph-logout" onClick={() => { setUserMenuOpen(false); onLogout() }}>
                    <Icon name="arrow" width={16} height={16} style={{ transform: 'rotate(180deg)' }} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="panel-content" onClick={() => { setNotifOpen(false); setUserMenuOpen(false) }}>
          {panelPage === 'dashboard' && <DashboardPage navigate={navigate} />}
          {panelPage === 'billing' && <BillingPage />}
          {panelPage === 'settings' && <SettingsPage />}
          {panelPage === 'services' && <ServicesPage />}
          {panelPage === 'dns' && <DnsPage />}
          {panelPage === 'support' && <SupportPage />}
          {panelPage === 'new-site' && <NewSitePage navigate={navigate} />}
          {panelPage.startsWith('site-') && <SiteManagePage siteName={panelPage.replace('site-', '')} />}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───
function DashboardPage({ navigate }: { navigate: (id: string) => void }) {
  return (
    <div className="pg">
      <div className="pg-header">
        <div>
          <h1>Welcome back, Lime</h1>
          <p>Here's what's happening with your sites</p>
        </div>
        <button className="btn btn-p btn-panel" onClick={() => navigate('new-site')}>
          <Icon name="plus" width={16} height={16} /> New Site
        </button>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-icon"><Icon name="bolt" width={20} height={20} /></div>
        <div className="promo-text">
          <strong>Upgrade to Pro</strong>
          <span>Get staging environments, priority support, and more.</span>
        </div>
        <button className="btn btn-p btn-panel btn-sm" onClick={() => navigate('billing')}>Upgrade <Icon name="arrow" width={14} height={14} /></button>
      </div>

      {/* Sites Grid */}
      <div className="pg-section-label"><Icon name="grid" width={16} height={16} /> Your Sites</div>
      <div className="sites-grid">
        {PANEL_SITES.map(site => (
          <SiteCard key={site.name} site={site} onManage={() => window.location.hash = `site-${site.name}`} />
        ))}
        <button className="add-site-card" onClick={() => navigate('new-site')}>
          <div className="add-site-icon"><Icon name="plus" width={24} height={24} /></div>
          <span>Add New Site</span>
        </button>
      </div>

      {/* Performance & Security */}
      <div className="pg-section-label"><Icon name="pulse" width={16} height={16} /> Site Overview</div>
      <div className="overview-grid">
        <PerformanceCard />
        <SecurityCard />
      </div>

      {/* Activity Feed */}
      <div className="pg-section-label"><Icon name="clock" width={16} height={16} /> Recent Activity</div>
      <div className="activity-feed">
        {PANEL_ACTIVITIES.map((a, i) => (
          <div key={i} className="activity-item">
            <div className={`activity-icon ${a.type}`}>
              <Icon name={a.type === 'backup' ? 'check-circle' : a.type === 'update' ? 'refresh-single' : a.type === 'security' ? 'shield' : 'code-slash'} width={16} height={16} />
            </div>
            <div className="activity-content">
              <span className="activity-action">{a.action}</span>
              <span className="activity-details">{a.details}</span>
            </div>
            <div className="activity-meta">
              <span className="activity-site">{a.site}</span>
              <span className="activity-time">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Site Card ───
function SiteCard({ site, onManage }: { site: PanelSite; onManage: () => void }) {
  return (
    <div className="site-card">
      <div className="sc-top">
        <div className="sc-avatar">{site.initials}</div>
        <div className="sc-info">
          <span className="sc-name">{site.name}</span>
          <span className="sc-wp">{site.wordpress}</span>
        </div>
        <span className={`sc-status ${site.status}`}>{site.status}</span>
      </div>
      <div className="sc-stats">
        <div className="sc-stat"><span className="sc-stat-val">{site.visits}</span><span className="sc-stat-lbl">Visits</span></div>
        <div className="sc-stat"><span className="sc-stat-val">{site.storage}</span><span className="sc-stat-lbl">Storage</span></div>
        <div className="sc-stat"><span className="sc-stat-val">{site.health}%</span><span className="sc-stat-lbl">Health</span></div>
      </div>
      <div className="sc-bars">
        <div className="sc-bar"><span>CPU</span><div className="sc-bar-track"><div className="sc-bar-fill" style={{ width: `${site.cpu}%` }} /></div><span>{site.cpu}%</span></div>
        <div className="sc-bar"><span>Memory</span><div className="sc-bar-track"><div className="sc-bar-fill" style={{ width: `${site.memory}%` }} /></div><span>{site.memory}%</span></div>
      </div>
      <div className="sc-actions">
        <a href={site.url} target="_blank" rel="noopener" className="btn btn-s btn-panel">Visit <Icon name="arrow" width={12} height={12} /></a>
        <button className="btn btn-p btn-panel" onClick={onManage}>Manage</button>
      </div>
    </div>
  )
}

// ─── Performance Card ───
function PerformanceCard() {
  const metrics = [
    { label: 'Response Time', value: '142ms', icon: 'bolt', good: true },
    { label: 'Uptime', value: '99.98%', icon: 'check-circle', good: true },
    { label: 'Page Speed', value: '94/100', icon: 'trend', good: true },
    { label: 'Requests/min', value: '847', icon: 'pulse', good: true },
  ]
  return (
    <div className="overview-card">
      <div className="oc-header"><Icon name="bolt" width={18} height={18} /> Performance</div>
      <div className="oc-metrics">
        {metrics.map(m => (
          <div key={m.label} className="oc-metric">
            <div className="oc-metric-icon"><Icon name={m.icon} width={16} height={16} /></div>
            <div className="oc-metric-info">
              <span className="oc-metric-val">{m.value}</span>
              <span className="oc-metric-lbl">{m.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Security Card ───
function SecurityCard() {
  const items = [
    { label: 'SSL Certificate', value: 'Active', icon: 'lock', ok: true },
    { label: 'Firewall', value: 'Enabled', icon: 'shield', ok: true },
    { label: 'Malware Scan', value: 'Clean', icon: 'check-circle', ok: true },
    { label: 'Last Backup', value: '2h ago', icon: 'refresh-single', ok: true },
  ]
  return (
    <div className="overview-card">
      <div className="oc-header"><Icon name="shield" width={18} height={18} /> Security</div>
      <div className="oc-metrics">
        {items.map(m => (
          <div key={m.label} className="oc-metric">
            <div className={`oc-metric-icon${m.ok ? ' ok' : ' warn'}`}><Icon name={m.icon} width={16} height={16} /></div>
            <div className="oc-metric-info">
              <span className="oc-metric-val">{m.value}</span>
              <span className="oc-metric-lbl">{m.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Billing Page ───
function BillingPage() {
  return (
    <div className="pg">
      <div className="pg-header"><div><h1>Billing</h1><p>Manage your subscription, payments, and invoices</p></div></div>

      {/* Current Plan */}
      <div className="billing-plan-card">
        <div className="bp-info">
          <span className="bp-badge">Current Plan</span>
          <h3>Business Plan</h3>
          <p>5 sites · 50GB storage · Priority support</p>
        </div>
        <div className="bp-price">
          <span className="bp-amount">$49</span>
          <span className="bp-period">/month</span>
        </div>
      </div>

      {/* Usage */}
      <div className="pg-section-label"><Icon name="pulse" width={16} height={16} /> Usage</div>
      <div className="usage-grid">
        {[
          { label: 'Sites', used: '2', total: '5' },
          { label: 'Storage', used: '2.4 GB', total: '50 GB' },
          { label: 'Bandwidth', used: '12 GB', total: '100 GB' },
          { label: 'Email Accounts', used: '3', total: '10' },
        ].map(u => (
          <div key={u.label} className="usage-card">
            <div className="usage-label">{u.label}</div>
            <div className="usage-vals">{u.used} <span>/ {u.total}</span></div>
            <div className="usage-bar"><div className="usage-bar-fill" style={{ width: `${(parseFloat(u.used.replace(/[^0-9.]/g, '')) / parseFloat(u.total.replace(/[^0-9.]/g, ''))) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div className="pg-section-label"><Icon name="dollar-sign" width={16} height={16} /> Recent Invoices</div>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { id: 'INV-2024-012', date: 'Mar 1, 2024', amount: '$49.00', status: 'paid' },
              { id: 'INV-2024-011', date: 'Feb 1, 2024', amount: '$49.00', status: 'paid' },
              { id: 'INV-2024-010', date: 'Jan 1, 2024', amount: '$49.00', status: 'paid' },
            ].map(inv => (
              <tr key={inv.id}>
                <td className="td-bold">{inv.id}</td>
                <td>{inv.date}</td>
                <td>{inv.amount}</td>
                <td><span className={`table-badge ${inv.status}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Settings Page ───
function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile')
  return (
    <div className="pg">
      <div className="pg-header"><div><h1>Settings</h1><p>Manage your account preferences</p></div></div>
      <div className="settings-tabs">
        {(['profile', 'security', 'notifications', 'appearance'] as const).map(t => (
          <button key={t} className={`settings-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="settings-content">
        {tab === 'profile' && (
          <div className="settings-form">
            <div className="sf-group"><label>Full Name</label><input type="text" defaultValue="Lime Starter" className="panel-input" /></div>
            <div className="sf-group"><label>Email</label><input type="email" defaultValue="lime@example.com" className="panel-input" /></div>
            <div className="sf-group"><label>Company</label><input type="text" placeholder="Your company" className="panel-input" /></div>
            <button className="btn btn-p btn-panel">Save Changes</button>
          </div>
        )}
        {tab === 'security' && (
          <div className="settings-form">
            <div className="sf-group"><label>Current Password</label><input type="password" className="panel-input" /></div>
            <div className="sf-group"><label>New Password</label><input type="password" className="panel-input" /></div>
            <div className="sf-group"><label>Confirm Password</label><input type="password" className="panel-input" /></div>
            <button className="btn btn-p btn-panel">Update Password</button>
            <div className="settings-section">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
              <button className="btn btn-s btn-panel">Enable 2FA</button>
            </div>
          </div>
        )}
        {tab === 'notifications' && (
          <div className="settings-form">
            {['Email notifications', 'Security alerts', 'Billing reminders', 'Product updates', 'Weekly reports'].map(n => (
              <div key={n} className="sf-toggle-row">
                <span>{n}</span>
                <label className="panel-toggle"><input type="checkbox" defaultChecked /><span className="panel-toggle-slider" /></label>
              </div>
            ))}
          </div>
        )}
        {tab === 'appearance' && (
          <div className="settings-form">
            <div className="settings-section">
              <h3>Theme</h3>
              <p>Choose how LimeWP looks for you</p>
              <div className="theme-options">
                <button className="theme-option active">Light</button>
                <button className="theme-option">Dark</button>
                <button className="theme-option">System</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Services Page ───
function ServicesPage() {
  return (
    <div className="pg">
      <div className="pg-header"><div><h1>Services</h1><p>Manage your active services and explore add-ons</p></div></div>

      <div className="pg-section-label"><Icon name="check-circle" width={16} height={16} /> Active Services</div>
      <div className="services-grid">
        {ACTIVE_SERVICES.map(s => (
          <div key={s.name} className="service-card active">
            <div className="svc-top">
              <div className={`svc-icon ${s.color}`}><Icon name={s.icon} width={20} height={20} /></div>
              <span className="svc-status-badge active">Active</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <div className="svc-footer"><span className="svc-price">{s.price}</span><button className="btn btn-s btn-panel">Manage</button></div>
          </div>
        ))}
      </div>

      <div className="pg-section-label"><Icon name="plus" width={16} height={16} /> Suggested Services</div>
      <div className="services-grid">
        {SUGGESTED_SERVICES.map(s => (
          <div key={s.name} className="service-card">
            <div className="svc-top">
              <div className={`svc-icon ${s.color}`}><Icon name={s.icon} width={20} height={20} /></div>
            </div>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <div className="svc-footer"><span className="svc-price">{s.price}</span><button className="btn btn-p btn-panel">Add</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DNS Page ───
function DnsPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? DNS_RECORDS : DNS_RECORDS.filter(r => r.type === filter)
  return (
    <div className="pg">
      <div className="pg-header">
        <div><h1>DNS Management</h1><p>Manage DNS records for your domains</p></div>
        <button className="btn btn-p btn-panel"><Icon name="plus" width={16} height={16} /> Add Record</button>
      </div>

      <div className="dns-filters">
        {['all', 'A', 'CNAME', 'MX', 'TXT', 'AAAA'].map(f => (
          <button key={f} className={`dns-filter${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f}</button>
        ))}
      </div>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead><tr><th>Type</th><th>Name</th><th>Value</th><th>TTL</th><th></th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td><span className="dns-type-badge">{r.type}</span></td>
                <td className="td-bold">{r.name}</td>
                <td className="td-mono">{r.value}</td>
                <td>{r.ttl}s</td>
                <td className="td-actions">
                  <button className="btn-icon"><Icon name="pen" width={14} height={14} /></button>
                  <button className="btn-icon danger"><Icon name="close" width={14} height={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Support Page ───
function SupportPage() {
  return (
    <div className="pg">
      <div className="pg-header">
        <div><h1>Support</h1><p>Get help with your hosting and sites</p></div>
        <button className="btn btn-p btn-panel"><Icon name="plus" width={16} height={16} /> New Ticket</button>
      </div>

      {/* Quick Actions */}
      <div className="support-actions">
        {[
          { icon: 'chat', title: 'Live Chat', desc: 'Chat with our team', color: 'lime' },
          { icon: 'chat', title: 'Email Support', desc: 'Get help via email', color: 'blue' },
          { icon: 'globe', title: 'Documentation', desc: 'Browse our docs', color: 'purple' },
        ].map(a => (
          <div key={a.title} className="support-action-card">
            <div className={`sac-icon ${a.color}`}><Icon name={a.icon} width={22} height={22} /></div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Tickets */}
      <div className="pg-section-label"><Icon name="chat" width={16} height={16} /> Recent Tickets</div>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead><tr><th>ID</th><th>Subject</th><th>Status</th><th>Priority</th><th>Updated</th></tr></thead>
          <tbody>
            {SUPPORT_TICKETS.map(t => (
              <tr key={t.id}>
                <td className="td-bold">{t.id}</td>
                <td>{t.subject}</td>
                <td><span className={`table-badge ${t.status}`}>{t.status}</span></td>
                <td><span className={`table-badge priority-${t.priority}`}>{t.priority}</span></td>
                <td>{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── New Site Page ───
function NewSitePage({ navigate }: { navigate: (id: string) => void }) {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState('starter')
  const [domain, setDomain] = useState('')
  const [domainType, setDomainType] = useState<'existing' | 'subdomain'>('subdomain')

  return (
    <div className="pg">
      <div className="pg-header"><div><h1>Create New Site</h1><p>Set up a new WordPress site in minutes</p></div></div>

      {/* Steps */}
      <div className="ns-steps">
        {['Package', 'Domain', 'WordPress', 'Review'].map((s, i) => (
          <div key={s} className={`ns-step${step === i + 1 ? ' active' : ''}${step > i + 1 ? ' done' : ''}`}>
            <div className="ns-step-num">{step > i + 1 ? <Icon name="check" width={14} height={14} /> : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="ns-plans">
          {[
            { id: 'starter', name: 'Starter', price: '$9/mo', features: ['1 site', '10GB SSD', 'Free SSL'] },
            { id: 'premium', name: 'Premium', price: '$29/mo', features: ['5 sites', '50GB SSD', 'Staging'], popular: true },
            { id: 'business', name: 'Business', price: '$79/mo', features: ['25 sites', '200GB SSD', 'White-label'] },
          ].map(p => (
            <div key={p.id} className={`ns-plan-card${plan === p.id ? ' selected' : ''}${p.popular ? ' popular' : ''}`} onClick={() => setPlan(p.id)}>
              {p.popular && <span className="ns-popular">Most Popular</span>}
              <h3>{p.name}</h3>
              <div className="ns-price">{p.price}</div>
              <ul>{p.features.map(f => <li key={f}><Icon name="check" width={14} height={14} />{f}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="ns-domain">
          <div className="ns-domain-types">
            <button className={`ns-dt${domainType === 'subdomain' ? ' active' : ''}`} onClick={() => setDomainType('subdomain')}>Free Subdomain</button>
            <button className={`ns-dt${domainType === 'existing' ? ' active' : ''}`} onClick={() => setDomainType('existing')}>Existing Domain</button>
          </div>
          <div className="sf-group">
            <label>{domainType === 'subdomain' ? 'Choose a subdomain' : 'Enter your domain'}</label>
            <div className="ns-domain-input">
              <input type="text" placeholder={domainType === 'subdomain' ? 'mysite' : 'example.com'} className="panel-input" value={domain} onChange={e => setDomain(e.target.value)} />
              {domainType === 'subdomain' && <span className="ns-domain-suffix">.limewp.com</span>}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="settings-form">
          <div className="sf-group"><label>Site Title</label><input type="text" placeholder="My WordPress Site" className="panel-input" /></div>
          <div className="sf-group"><label>Admin Username</label><input type="text" defaultValue="admin" className="panel-input" /></div>
          <div className="sf-group"><label>Admin Password</label><input type="password" className="panel-input" /></div>
          <div className="sf-group"><label>Admin Email</label><input type="email" defaultValue="lime@example.com" className="panel-input" /></div>
        </div>
      )}

      {step === 4 && (
        <div className="ns-review">
          <div className="ns-review-card">
            <h3>Review Your Site</h3>
            <div className="ns-review-row"><span>Plan</span><span>{plan.charAt(0).toUpperCase() + plan.slice(1)}</span></div>
            <div className="ns-review-row"><span>Domain</span><span>{domain || 'mysite'}{domainType === 'subdomain' ? '.limewp.com' : ''}</span></div>
            <div className="ns-review-row"><span>WordPress</span><span>Latest (6.6.2)</span></div>
            <div className="ns-review-row"><span>PHP</span><span>8.1</span></div>
            <div className="ns-review-row"><span>SSL</span><span>Free (auto)</span></div>
          </div>
        </div>
      )}

      <div className="ns-actions">
        {step > 1 && <button className="btn btn-s btn-panel" onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 4 ? (
          <button className="btn btn-p btn-panel" onClick={() => setStep(s => s + 1)}>Continue <Icon name="arrow" width={14} height={14} /></button>
        ) : (
          <button className="btn btn-p btn-panel" onClick={() => navigate('dashboard')}>Create Site <Icon name="arrow" width={14} height={14} /></button>
        )}
      </div>
    </div>
  )
}

// ─── Site Manage Page ───
function SiteManagePage({ siteName }: { siteName: string }) {
  const site = PANEL_SITES.find(s => s.name === siteName)
  const [tab, setTab] = useState<'overview' | 'files' | 'backups' | 'domains'>('overview')

  if (!site) return <div className="pg"><h1>Site not found</h1></div>

  return (
    <div className="pg">
      <div className="pg-header">
        <div className="pg-header-site">
          <div className="sc-avatar lg">{site.initials}</div>
          <div><h1>{site.name}</h1><p>{site.wordpress} · {site.storage}</p></div>
        </div>
        <div className="pg-header-actions">
          <a href={site.url} target="_blank" rel="noopener" className="btn btn-s btn-panel">Visit <Icon name="arrow" width={12} height={12} /></a>
          <a href={`${site.url}/wp-admin`} target="_blank" rel="noopener" className="btn btn-p btn-panel">WP Admin <Icon name="arrow" width={12} height={12} /></a>
        </div>
      </div>

      <div className="settings-tabs">
        {(['overview', 'files', 'backups', 'domains'] as const).map(t => (
          <button key={t} className={`settings-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="site-overview">
          <div className="overview-grid">
            <div className="overview-card">
              <div className="oc-header"><Icon name="bolt" width={18} height={18} /> Performance</div>
              <div className="oc-metrics">
                <div className="oc-metric"><div className="oc-metric-icon"><Icon name="bolt" width={16} height={16} /></div><div className="oc-metric-info"><span className="oc-metric-val">142ms</span><span className="oc-metric-lbl">Response Time</span></div></div>
                <div className="oc-metric"><div className="oc-metric-icon"><Icon name="check-circle" width={16} height={16} /></div><div className="oc-metric-info"><span className="oc-metric-val">99.98%</span><span className="oc-metric-lbl">Uptime</span></div></div>
              </div>
            </div>
            <div className="overview-card">
              <div className="oc-header"><Icon name="server" width={18} height={18} /> Resources</div>
              <div className="sc-bars" style={{ padding: '0 4px' }}>
                <div className="sc-bar"><span>CPU</span><div className="sc-bar-track"><div className="sc-bar-fill" style={{ width: `${site.cpu}%` }} /></div><span>{site.cpu}%</span></div>
                <div className="sc-bar"><span>Memory</span><div className="sc-bar-track"><div className="sc-bar-fill" style={{ width: `${site.memory}%` }} /></div><span>{site.memory}%</span></div>
                <div className="sc-bar"><span>Storage</span><div className="sc-bar-track"><div className="sc-bar-fill" style={{ width: `${site.storagePct}%` }} /></div><span>{site.storagePct}%</span></div>
              </div>
            </div>
          </div>

          <div className="pg-section-label"><Icon name="settings" width={16} height={16} /> Quick Settings</div>
          <div className="settings-form">
            <div className="sf-toggle-row"><span>SSL Certificate</span><label className="panel-toggle"><input type="checkbox" defaultChecked /><span className="panel-toggle-slider" /></label></div>
            <div className="sf-toggle-row"><span>Auto Updates</span><label className="panel-toggle"><input type="checkbox" defaultChecked /><span className="panel-toggle-slider" /></label></div>
            <div className="sf-toggle-row"><span>Debug Mode</span><label className="panel-toggle"><input type="checkbox" /><span className="panel-toggle-slider" /></label></div>
            <div className="sf-toggle-row"><span>Object Cache (Redis)</span><label className="panel-toggle"><input type="checkbox" defaultChecked /><span className="panel-toggle-slider" /></label></div>
          </div>
        </div>
      )}

      {tab === 'files' && (
        <div className="settings-form">
          <div className="settings-section">
            <h3>File Manager</h3>
            <p>Access your WordPress files directly</p>
            <button className="btn btn-p btn-panel">Open File Manager <Icon name="arrow" width={14} height={14} /></button>
          </div>
          <div className="settings-section">
            <h3>SFTP Access</h3>
            <div className="sf-group"><label>Host</label><input type="text" value="sftp.limewp.com" readOnly className="panel-input" /></div>
            <div className="sf-group"><label>Port</label><input type="text" value="22" readOnly className="panel-input" /></div>
            <div className="sf-group"><label>Username</label><input type="text" value={`wp_${site.initials.toLowerCase()}`} readOnly className="panel-input" /></div>
          </div>
        </div>
      )}

      {tab === 'backups' && (
        <div>
          <div className="support-actions">
            <div className="support-action-card">
              <div className="sac-icon lime"><Icon name="refresh-single" width={22} height={22} /></div>
              <h3>Create Backup</h3>
              <p>Create a manual backup now</p>
              <button className="btn btn-p btn-panel" style={{ marginTop: 12 }}>Backup Now</button>
            </div>
          </div>
          <div className="pg-section-label"><Icon name="clock" width={16} height={16} /> Backup History</div>
          <div className="panel-table-wrap">
            <table className="panel-table">
              <thead><tr><th>Date</th><th>Size</th><th>Type</th><th></th></tr></thead>
              <tbody>
                {[
                  { date: 'Today, 2:00 AM', size: '148 MB', type: 'Auto' },
                  { date: 'Yesterday, 2:00 AM', size: '145 MB', type: 'Auto' },
                  { date: 'Mar 16, 2:00 AM', size: '142 MB', type: 'Auto' },
                ].map((b, i) => (
                  <tr key={i}><td>{b.date}</td><td>{b.size}</td><td><span className="table-badge paid">{b.type}</span></td><td className="td-actions"><button className="btn btn-s btn-panel">Restore</button><button className="btn-icon"><Icon name="download" width={14} height={14} /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'domains' && (
        <div className="settings-form">
          <div className="settings-section">
            <h3>Primary Domain</h3>
            <div className="sf-group"><label>Domain</label><input type="text" value={site.name} readOnly className="panel-input" /></div>
            <div className="sf-toggle-row"><span>Force HTTPS</span><label className="panel-toggle"><input type="checkbox" defaultChecked /><span className="panel-toggle-slider" /></label></div>
          </div>
        </div>
      )}
    </div>
  )
}
