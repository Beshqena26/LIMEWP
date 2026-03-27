export const marqueeItems = [
  'NVMe SSD Storage', 'LiteSpeed Web Server', 'Built-in Redis Caching', 'Enterprise DDoS Protection',
  'Global Edge CDN', 'Automated WAF', 'Staging Environments', 'SSH & WP-CLI Access',
  '99.99% Uptime SLA', 'Free Expert Migration', 'Isolated Cloud Containers', 'Real-Time Backups',
]

export const features = [
  { icon: 'bolt', color: 'lime', title: 'LiteSpeed + NVMe Stack', desc: 'Enterprise-grade LiteSpeed web server paired with NVMe SSD storage. Sub-200ms TTFB on every request.' },
  { icon: 'shield', color: 'green', title: 'Enterprise Security', desc: 'Web Application Firewall, real-time malware scanning, DDoS protection, and automatic SSL — all built in.' },
  { icon: 'server', color: 'purple', title: 'Isolated Cloud Containers', desc: 'Your site runs in its own container with guaranteed CPU and RAM. No noisy neighbors, no shared resources.' },
  { icon: 'globe', color: 'blue', title: 'Global Edge CDN', desc: '50+ edge locations worldwide. Static assets served from the nearest node. Blazing fast for every visitor.' },
  { icon: 'refresh-single', color: 'orange', title: 'Redis + Server Caching', desc: 'Built-in Redis object caching, OPcache, and full-page caching. Your WordPress runs at peak performance.' },
  { icon: 'grid', color: 'lime', title: 'Staging & Dev Tools', desc: 'One-click staging environments, SSH access, WP-CLI, Git deployment, and PHP version selector.' },
]

export const prices = { m: [9, 29, 79], q: [8, 26, 71], y: [7, 23, 63] }

export const plans = [
  { name: 'Starter', note: 'Perfect for personal sites and blogs', features: ['1 WordPress site', '10GB NVMe storage', 'LiteSpeed + Redis caching', 'Free SSL & daily backups', 'Global CDN'] },
  { name: 'Professional', note: 'For growing sites and businesses', features: ['Up to 5 WordPress sites', '50GB NVMe storage', 'Staging environments', 'Priority expert support', 'WooCommerce optimized'], popular: true },
  { name: 'Agency', note: 'For teams managing multiple clients', features: ['Up to 25 WordPress sites', '200GB NVMe storage', 'White-label dashboard', 'Dedicated resources', 'Bulk site management'] },
]

export const testimonials = [
  { initials: 'MS', name: 'Maria S.', role: 'E-commerce Founder', text: "My WooCommerce store went from 3.2s load time on shared hosting to under 800ms on LimeWP. The Redis caching and LiteSpeed combination is something I used to pay $80/mo for elsewhere. Checkout conversions jumped 40% just from the speed improvement." },
  { initials: 'JK', name: 'James K.', role: 'Agency Owner, 12 Client Sites', text: "I moved all my client sites here after testing the staging environments. One-click clone, test changes, push to production. The isolated containers mean one client's traffic spike doesn't affect the others. This is enterprise-level infrastructure at a fraction of the cost." },
  { initials: 'RT', name: 'Rachel T.', role: 'WordPress Developer', text: "SSH access, WP-CLI, Git deployment, PHP 8.3 — LimeWP actually respects developers. The 6-month trial let me test everything before committing. PageSpeed scores went from 67 to 96 without touching a single plugin. The server stack does the heavy lifting." },
]

export const faqData = [
  { q: 'What makes LimeWP premium?', a: 'Every site runs on LiteSpeed web servers with NVMe SSD storage and built-in Redis caching — the same stack that enterprise hosts charge $100+/mo for. Each site gets its own isolated container with guaranteed CPU and RAM, not shared resources. Plus enterprise security: WAF, DDoS protection, and real-time malware scanning.' },
  { q: 'Is the free trial the same premium infrastructure?', a: 'Yes. The 6-month free trial runs on the exact same servers and infrastructure as paid plans. Same LiteSpeed, same NVMe storage, same Redis caching, same CDN. We want you to experience premium performance before you pay a cent.' },
  { q: 'How fast will my site be?', a: 'Most sites see sub-200ms Time to First Byte (TTFB) and PageSpeed scores above 90. Our LiteSpeed + Redis + CDN stack handles the heavy lifting at the server level, so your site is fast before you even install a caching plugin.' },
  { q: 'What happens after 6 months?', a: 'You\u2019ll be notified before the free period ends. You can upgrade to a paid plan to keep your site running and unlock additional features like staging environments and priority support. If you decide not to continue, your data stays accessible for a grace period so you can export everything.' },
  { q: 'Can I run WooCommerce and heavy plugins?', a: 'Absolutely. Our infrastructure is optimized for resource-intensive plugins. WooCommerce, Elementor, Yoast SEO — no restrictions. The isolated container architecture means your site has dedicated resources, so heavy plugins won\u2019t slow you down.' },
  { q: 'Do you offer site migration?', a: 'Yes, free expert migration on all plans. Our team handles the entire process — DNS, files, database, SSL — with zero downtime. Most migrations complete within 24 hours.' },
]

export const navLinks = [
  { href: '#platform', label: 'Platform', icon: 'monitor' },
  { href: '#compare', label: 'Compare', icon: 'layers' },
  { href: '#features', label: 'Features', icon: 'grid' },
  { href: '#pricing', label: 'Pricing', icon: 'cart' },
  { href: '#testimonials', label: 'Reviews', icon: 'star' },
  { href: '#faq', label: 'FAQ', icon: 'chat' },
  { href: '/blog', label: 'Blog', icon: 'grid' },
  { href: '/changelog', label: 'Changelog', icon: 'refresh-single' },
]

export const comparisonRows = [
  { label: 'Server type', others: 'Shared (Apache)', you: 'Isolated (LiteSpeed)' },
  { label: 'Storage', others: 'HDD / SATA SSD', you: 'NVMe SSD' },
  { label: 'Caching', others: 'Plugin-based', you: 'Redis + OPcache built-in' },
  { label: 'CDN', others: 'Extra cost', you: 'Global CDN included' },
  { label: 'Security', others: 'Basic firewall', you: 'WAF + DDoS + malware scan' },
  { label: 'Resources', others: 'Shared with 100+ sites', you: 'Guaranteed CPU & RAM' },
  { label: 'Free trial', others: '14-30 days', you: '6 full months' },
]

export const freeFeatures = [
  '1 WordPress site on premium stack',
  'LiteSpeed + NVMe + Redis',
  'Free SSL & daily backups',
  'Global CDN included',
  'WAF & DDoS protection',
]

export const paidFeatures = [
  'Multiple WordPress sites',
  'Staging environments',
  'Priority expert support',
  'More NVMe storage',
  'Real-time backups',
]
