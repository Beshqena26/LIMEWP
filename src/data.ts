export const marqueeItems = [
  'One-Click WordPress Install', 'Free SSL Certificates', 'Global CDN', 'Auto Daily Backups',
  'Staging Environments', 'WooCommerce Ready', 'SSH & WP-CLI Access', '99.9% Uptime SLA',
  '24/7 Expert Support', 'Free Site Migration', 'DDoS Protection', 'Object Caching',
]

export const audiences = [
  { icon: 'star', title: 'First-Time Creators', desc: 'Launch your blog, portfolio, or business site without touching code. We handle the tech so you can focus on what matters.' },
  { icon: 'pen', title: 'Content Creators & Bloggers', desc: 'Blazing-fast load times, built-in SEO optimization, and monetization support to grow your audience.' },
  { icon: 'monitor', title: 'Freelancers & Designers', desc: 'Staging environments, one-click cloning, and client-ready handoffs. Build faster, deliver with confidence.' },
  { icon: 'cart', title: 'E-Commerce & WooCommerce', desc: 'PCI-compliant hosting, checkout optimization, and infrastructure that handles traffic spikes without breaking.' },
  { icon: 'users', title: 'Agencies & Studios', desc: 'Multi-site dashboard, bulk updates, white-label options, and team permissions. Manage all clients from one place.' },
  { icon: 'briefcase', title: 'Enterprise & Organizations', desc: 'SLAs, compliance certifications, dedicated support, and infrastructure designed for mission-critical sites.' },
]

export const features = [
  {
    large: true, icon: 'bolt',
    title: 'Lightning-Fast Performance',
    desc: 'Our globally distributed infrastructure ensures your site loads in under 200ms, anywhere in the world. Built on modern architecture with NVMe storage and smart caching.',
    list: ['Global CDN with 200+ edge locations', 'Automatic image optimization', 'Object caching & Redis support'],
  },
  {
    icon: 'shield',
    title: 'Enterprise-Grade Security',
    desc: 'Sleep soundly with automatic malware scanning, firewalls, DDoS protection, and free SSL certificates.',
    list: ['Web Application Firewall', 'Real-time malware scanning', 'Free Wildcard SSL'],
  },
  {
    icon: 'refresh',
    title: 'Automatic Daily Backups',
    desc: 'Every change is automatically backed up. Restore your entire site with one click. 30-day retention included.',
    list: ['One-click restore', 'Off-site redundant storage', 'Downloadable backups'],
  },
  {
    icon: 'chat',
    title: 'Expert WordPress Support',
    desc: 'Real humans who know WordPress inside and out. Available 24/7 via chat and email. Average response under 2 minutes.',
    list: ['24/7 live chat support', 'WordPress experts, not scripts', 'Free migration assistance'],
  },
  {
    icon: 'box',
    title: 'Staging Environments',
    desc: 'Test updates, designs, and plugins safely before going live. Clone your production site in seconds.',
    list: ['One-click staging creation', 'Selective push to production', 'Shareable staging URLs'],
  },
]

export const prices = { m: [9, 29, 79], y: [7, 23, 63] }

export const plans = [
  { name: 'Starter', note: 'Perfect for personal sites and blogs', features: ['1 WordPress site', '10GB SSD storage', 'Free SSL certificate', 'Daily backups', 'Global CDN'] },
  { name: 'Professional', note: 'For growing sites and small businesses', features: ['Up to 5 WordPress sites', '50GB SSD storage', 'Staging environments', 'Priority support', 'WooCommerce optimized'], popular: true },
  { name: 'Agency', note: 'For teams managing multiple clients', features: ['Up to 25 WordPress sites', '200GB SSD storage', 'White-label dashboard', 'Unlimited team members', 'Bulk site management'] },
]

export const testimonials = [
  { initials: 'SK', name: 'Sarah K.', role: 'Travel Blogger', text: "I was terrified of launching my first website. LimeWP made it so simple\u2014I had my blog live in under an hour. Their support team answered every question patiently." },
  { initials: 'MR', name: 'Marcus R.', role: 'E-commerce Owner', text: "After moving to LimeWP, our page load time dropped from 4 seconds to under 400ms. Our bounce rate is down 35% and conversions are up. Game changer for our store." },
  { initials: 'JC', name: 'James C.', role: 'Agency Director', text: "We manage 47 client sites from one dashboard. Bulk updates take minutes, not hours. Haven't had a single downtime incident in 8 months." },
]

export const faqData = [
  { q: 'Can I migrate my existing WordPress site?', a: 'Absolutely! We offer free migrations on all plans. Our team handles everything\u2014DNS, database, files\u2014with zero downtime. Most migrations complete within 24-48 hours.' },
  { q: 'What happens if I need help?', a: 'Our WordPress experts are available 24/7 via live chat and email. Average response time is under 2 minutes. No question is too basic\u2014we\'re here to help.' },
  { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial on all plans. No credit card required. If it\'s not for you, simply don\'t continue\u2014no awkward cancellation process.' },
  { q: 'Do you support WooCommerce?', a: 'LimeWP is fully optimized for WooCommerce. Our infrastructure handles traffic spikes, optimizes checkout performance, and meets PCI compliance requirements.' },
  { q: 'What\'s your uptime guarantee?', a: 'We guarantee 99.99% uptime with our SLA. If we don\'t meet that commitment, you\'ll receive account credits automatically. Most customers see 100% uptime.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel anytime with no penalties. We don\'t believe in lock-in. You own your data and code\u2014we provide full exports and migration assistance.' },
]

export const navLinks = [
  { href: '#platform', label: 'Platform' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export const siteRows = [
  { name: 'TechStartup Blog', url: 'techstartup.com', status: 'Online', dot: '', time: '156ms', visits: '2.4k visits' },
  { name: 'Creative Portfolio', url: 'sarahdesigns.co', status: 'Online', dot: '', time: '142ms', visits: '1.8k visits' },
  { name: 'E-commerce Store', url: 'shopmodern.io', status: 'Update Available', dot: 'warning', time: '198ms', visits: '5.2k visits' },
]

export const speedItems = [
  { label: 'LimeWP', time: '187ms', width: '95%', color: 'lime' },
  { label: 'Competitor A', time: '1.2s', width: '45%', color: 'muted' },
  { label: 'Competitor B', time: '2.1s', width: '25%', color: 'muted' },
  { label: 'Shared Hosting', time: '3.8s', width: '12%', color: 'muted' },
]
