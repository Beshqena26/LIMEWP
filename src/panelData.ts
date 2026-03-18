// Panel mock data & types

export interface PanelSite {
  name: string
  url: string
  initials: string
  visits: string
  storage: string
  wordpress: string
  health: number
  cpu: number
  memory: number
  storagePct: number
  status: 'online' | 'offline' | 'maintenance'
}

export interface PanelActivity {
  action: string
  site: string
  siteInitials: string
  time: string
  type: 'backup' | 'update' | 'security' | 'system'
  details: string
}

export interface PanelNotification {
  type: 'success' | 'warning' | 'update' | 'info'
  title: string
  desc: string
  time: string
  unread: boolean
}

export interface DnsRecord {
  type: string
  name: string
  value: string
  ttl: string
  priority?: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  updated: string
}

export interface ServiceItem {
  name: string
  desc: string
  icon: string
  color: string
  status?: 'active' | 'inactive'
  plan?: string
  price?: string
}

export const PANEL_SITES: PanelSite[] = [
  {
    name: 'limewp.com',
    url: 'https://limewp.com',
    initials: 'LW',
    visits: '8,734',
    storage: '150 MB',
    wordpress: 'WP 6.6.2',
    health: 76,
    cpu: 22,
    memory: 12,
    storagePct: 1.5,
    status: 'online',
  },
  {
    name: 'supernova.guru',
    url: 'https://supernova.guru',
    initials: 'SG',
    visits: '15,821',
    storage: '420 MB',
    wordpress: 'WP 6.6.2',
    health: 92,
    cpu: 45,
    memory: 38,
    storagePct: 4.2,
    status: 'online',
  },
]

export const PANEL_ACTIVITIES: PanelActivity[] = [
  { action: 'Backup completed', site: 'limewp.com', siteInitials: 'LW', time: '2 hours ago', type: 'backup', details: 'Full site backup · 148 MB' },
  { action: 'Plugin updated', site: 'supernova.guru', siteInitials: 'SG', time: '5 hours ago', type: 'update', details: 'Flavor starter v2.4.1 → v2.5.0' },
  { action: 'SSL certificate renewed', site: 'limewp.com', siteInitials: 'LW', time: '1 day ago', type: 'security', details: 'Valid until Jan 28, 2027' },
  { action: 'PHP upgraded to 8.1', site: 'supernova.guru', siteInitials: 'SG', time: '2 days ago', type: 'system', details: 'PHP 7.4 → PHP 8.1' },
  { action: 'WordPress core updated', site: 'limewp.com', siteInitials: 'LW', time: '3 days ago', type: 'update', details: 'WP 6.6.1 → WP 6.6.2' },
]

export const PANEL_NOTIFICATIONS: PanelNotification[] = [
  { type: 'success', title: 'Backup completed', desc: 'limewp.com backup finished', time: '2 min ago', unread: true },
  { type: 'warning', title: 'SSL expiring', desc: 'supernova.guru cert expires in 7 days', time: '1 hour ago', unread: true },
  { type: 'update', title: 'WordPress 6.7', desc: 'New version available', time: '3 hours ago', unread: true },
  { type: 'info', title: 'Traffic spike', desc: 'limewp.com traffic up 150%', time: 'Yesterday', unread: false },
]

export const DNS_RECORDS: DnsRecord[] = [
  { type: 'A', name: '@', value: '76.76.21.21', ttl: '3600' },
  { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', ttl: '3600' },
  { type: 'MX', name: '@', value: 'mail.limewp.com', ttl: '3600', priority: '10' },
  { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: '3600' },
  { type: 'AAAA', name: '@', value: '2606:4700:3037::6815:2e5c', ttl: '3600' },
]

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TK-1042', subject: 'Cannot access WordPress admin', status: 'open', priority: 'high', updated: '2 hours ago' },
  { id: 'TK-1038', subject: 'SSL certificate not showing', status: 'pending', priority: 'medium', updated: '1 day ago' },
  { id: 'TK-1035', subject: 'Email forwarding setup', status: 'resolved', priority: 'low', updated: '3 days ago' },
  { id: 'TK-1029', subject: 'Site migration assistance', status: 'resolved', priority: 'medium', updated: '5 days ago' },
]

export const ACTIVE_SERVICES: ServiceItem[] = [
  { name: 'Managed WordPress Hosting', desc: 'Business plan · 5 sites', icon: 'server', color: 'lime', status: 'active', plan: 'Business', price: '$49/mo' },
  { name: 'Email Hosting', desc: '5 mailboxes · 10GB each', icon: 'chat', color: 'blue', status: 'active', plan: 'Professional', price: '$12/mo' },
]

export const SUGGESTED_SERVICES: ServiceItem[] = [
  { name: 'Global CDN', desc: 'Speed up your site globally with edge caching', icon: 'globe', color: 'green', price: '$9/mo' },
  { name: 'Premium SSL', desc: 'Extended validation & wildcard certificates', icon: 'lock', color: 'purple', price: '$15/mo' },
  { name: 'Backup Pro', desc: 'Real-time backups with instant recovery', icon: 'refresh-single', color: 'orange', price: '$7/mo' },
  { name: 'Uptime Monitoring', desc: '1-minute checks with instant alerts', icon: 'pulse', color: 'blue', price: '$5/mo' },
]

export const panelNavItems = [
  { id: 'dashboard', label: 'Home', icon: 'home', group: 'Overview' },
  { id: 'services', label: 'Services', icon: 'layers', group: 'Operations' },
  { id: 'dns', label: 'DNS', icon: 'globe', group: 'Operations' },
  { id: 'billing', label: 'Billing', icon: 'dollar-sign', group: 'Operations' },
  { id: 'support', label: 'Support', icon: 'chat', group: 'Support' },
  { id: 'settings', label: 'Settings', icon: 'settings', group: 'Support' },
]
