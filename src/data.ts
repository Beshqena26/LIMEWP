export const marqueeItems = [
  'One-Click WordPress Install', 'Free SSL Certificates', 'Global CDN', 'Auto Daily Backups',
  'Staging Environments', 'WooCommerce Ready', 'SSH & WP-CLI Access', '99.9% Uptime SLA',
  '24/7 Expert Support', 'Free Site Migration', 'DDoS Protection', 'Object Caching',
]

export const audiences = [
  { icon: 'star', slug: 'creators', title: 'First-Time Creators', desc: 'Launch your blog, portfolio, or business site without touching code. We handle the tech so you can focus on what matters.' },
  { icon: 'pen', slug: 'bloggers', title: 'Content Creators & Bloggers', desc: 'Blazing-fast load times, built-in SEO optimization, and monetization support to grow your audience.' },
  { icon: 'monitor', slug: 'freelancers', title: 'Freelancers & Designers', desc: 'Staging environments, one-click cloning, and client-ready handoffs. Build faster, deliver with confidence.' },
  { icon: 'cart', slug: 'ecommerce', title: 'E-Commerce & WooCommerce', desc: 'PCI-compliant hosting, checkout optimization, and infrastructure that handles traffic spikes without breaking.' },
  { icon: 'users', slug: 'agencies', title: 'Agencies & Studios', desc: 'Multi-site dashboard, bulk updates, white-label options, and team permissions. Manage all clients from one place.' },
  { icon: 'briefcase', slug: 'enterprise', title: 'Enterprise & Organizations', desc: 'SLAs, compliance certifications, dedicated support, and infrastructure designed for mission-critical sites.' },
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

export const prices = { m: [9, 29, 79], q: [8, 26, 71], y: [7, 23, 63] }

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

export const personaNavLinks = [
  { href: '#persona-features', label: 'Features' },
  { href: '#persona-safety', label: 'Why Us' },
  { href: '#persona-pricing', label: 'Pricing' },
  { href: '#persona-testimonials', label: 'Reviews' },
  { href: '#persona-faq', label: 'FAQ' },
]

export const siteRows = [
  { name: 'TechStartup Blog', url: 'techstartup.com', status: 'Online', dot: '', time: '156ms', visits: '2.4k visits' },
  { name: 'Creative Portfolio', url: 'sarahdesigns.co', status: 'Online', dot: '', time: '142ms', visits: '1.8k visits' },
  { name: 'E-commerce Store', url: 'shopmodern.io', status: 'Update Available', dot: 'warning', time: '198ms', visits: '5.2k visits' },
]

export const competitors = ['LimeWP', 'WP Engine', 'Kinsta', 'SiteGround']

export const comparisonRows = [
  { icon: 'box', feature: 'Free Staging Environment', values: ['yes', 'yes', 'yes', 'no'] },
  { icon: 'upload', feature: 'Free Site Migration', values: ['yes', 'no', 'yes', 'yes'] },
  { icon: 'users', feature: 'Client Billing Transfer', values: ['yes', 'no', 'no', 'no'] },
  { icon: 'layers', feature: 'Bulk Site Management', values: ['yes', 'yes', 'yes', 'no'] },
  { icon: 'clock', feature: '24/7 Expert Support', values: ['yes', 'yes', 'yes', 'no'] },
  { icon: 'dollar-sign', feature: 'Agency Pricing (Pay per site)', values: ['yes', 'no', 'no', 'no'] },
  { icon: 'refresh-single', feature: '1-Click Rollback', values: ['yes', 'yes', 'yes', 'no'] },
]

export const comparisonBenefits = [
  { icon: 'dollar-sign', title: 'Built for Agencies', desc: 'Pay only for what you use. No bloated plans or wasted resources\u2014just fair pricing that scales with your business.' },
  { icon: 'users', title: 'Seamless Handoffs', desc: "Transfer ownership to clients without the headache. We're the only host that makes client handoffs truly painless." },
  { icon: 'shield', title: 'Zero Stress Deployments', desc: 'Staging, backups, and rollbacks built-in. Sleep soundly knowing you can fix any issue in seconds.' },
]

export type PersonaData = {
  slug: string
  icon: string
  title: string
  heroLabel: string
  headline: string
  subheadline: string
  heroChecks: string[]
  heroCta: string
  features: { icon: string; title: string; desc: string }[]
  safety: { title: string; desc: string; points: { icon: string; label: string; desc: string; solution?: string }[]; closing: string }
  steps: { icon: string; title: string; desc: string }[]
  perfectFor: { icon: string; label: string }[]
  perfectForNote: string
  ctaTitle: string
  ctaDesc: string
  ctaButton: string
  recommendedPlan: string
  testimonials?: { initials: string; name: string; role: string; text: string; metric?: string; metricLabel?: string }[]
  featuredTestimonial?: { initials: string; name: string; role: string; text: string; metric: string; metricLabel: string; location: string }
  testimonialStats?: { value: string; label: string }[]
  faq?: { q: string; a: string }[]
  workflow?: { icon: string; title: string; desc: string; list: string[] }[]
  handoff?: { title: string; desc: string; features: { title: string; desc: string }[] }
  tools?: { icon: string; title: string; desc: string; list: string[] }[]
  comparison?: { competitors: string[]; rows: { icon: string; feature: string; values: string[] }[]; benefits: { icon: string; title: string; desc: string }[] }
}

export const personaPages: Record<string, PersonaData> = {
  creators: {
    slug: 'creators',
    icon: 'star',
    title: 'First-Time Creators',
    heroLabel: 'WordPress Hosting for First-Time Creators',
    headline: 'Launch Your WordPress Website Without the Stress',
    subheadline: 'Starting your first website should feel exciting, not overwhelming. Our WordPress hosting removes the technical complexity so you can focus on creating, writing, and growing your online presence.',
    heroChecks: [
      'One-click WordPress installation',
      'Automatic security and backups',
      'Beginner-friendly dashboard',
      'Guided setup from start to finish',
    ],
    heroCta: 'Start Your Website in Minutes',
    features: [
      { icon: 'bolt', title: 'One-Click WordPress Installation', desc: 'No technical setup required. Install WordPress instantly and start building your site right away.' },
      { icon: 'grid', title: 'Beginner-Friendly Dashboard', desc: 'A clean, simple control panel designed for non-technical users. No confusing hosting tools or developer settings.' },
      { icon: 'lock', title: 'Automatic Security & SSL', desc: 'Your site is protected automatically. SSL certificates and security updates are handled for you.' },
      { icon: 'refresh-single', title: 'Automatic Daily Backups', desc: 'Your website is backed up every day so you never lose your work.' },
      { icon: 'chat', title: 'Clear Errors & Helpful Guidance', desc: "If something goes wrong, you'll see simple explanations and clear steps to fix it." },
    ],
    safety: {
      title: 'Built to Remove the Fear of Breaking Your Website',
      desc: 'Many first-time creators worry about making mistakes or damaging their website. Our platform protects you by making safe decisions automatically.',
      points: [
        { icon: 'shield', label: 'Safe Default Settings', desc: 'Your site starts with secure, optimized settings so you don\'t have to worry about configuration.' },
        { icon: 'refresh-single', label: 'Automatic Updates', desc: 'WordPress core, themes, and plugins stay up to date automatically in the background.' },
        { icon: 'refresh', label: 'One-Click Backup Restore', desc: 'Made a mistake? Restore your entire site to any previous state with a single click.' },
        { icon: 'star', label: 'Step-by-Step Onboarding', desc: 'A guided walkthrough helps you set up everything correctly from the very start.' },
      ],
      closing: 'You can explore, experiment, and build with confidence.',
    },
    steps: [
      { icon: 'users', title: 'Create Your Hosting Account', desc: 'Sign up and choose your website name.' },
      { icon: 'bolt', title: 'Install WordPress in One Click', desc: 'Your WordPress site will be ready in seconds.' },
      { icon: 'pen', title: 'Start Creating', desc: 'Choose a theme, publish content, and launch your website.' },
    ],
    perfectFor: [
      { icon: 'pen', label: 'Personal bloggers' },
      { icon: 'briefcase', label: 'Small business owners' },
      { icon: 'star', label: 'Creators building their first portfolio' },
      { icon: 'globe', label: 'Anyone starting their first website' },
    ],
    perfectForNote: 'No coding. No confusing settings. Just a simple path to getting online.',
    ctaTitle: 'Start Your First Website Today',
    ctaDesc: 'Join thousands of creators who launched their websites without technical headaches.',
    ctaButton: 'Create Your WordPress Site Now',
    recommendedPlan: 'Starter',
    testimonials: [
      { initials: 'SK', name: 'Sarah K.', role: 'Travel Blogger', text: "I was terrified of launching my first website. LimeWP made it so simple\u2014I had my blog live in under an hour. Their support team answered every question patiently." },
      { initials: 'DP', name: 'David P.', role: 'First-Time Creator', text: "I've never built a website before. LimeWP walked me through everything step by step. Now I have a portfolio site I'm actually proud of." },
      { initials: 'AL', name: 'Amy L.', role: 'Small Business Owner', text: "I tried other hosting platforms and got lost in technical settings. LimeWP was the first one where I actually finished setting up my site without calling for help." },
    ],
    faq: [
      { q: 'Do I need any technical skills to use LimeWP?', a: 'Not at all. LimeWP is designed for complete beginners. One-click WordPress installation, a simple dashboard, and guided setup mean you can launch your website without any coding or technical knowledge.' },
      { q: 'How long does it take to set up my website?', a: 'Most first-time creators have their site live in under an hour. WordPress installs in one click, and our step-by-step onboarding guides you through choosing a theme and publishing your first content.' },
      { q: 'What if I break something on my website?', a: 'Don\'t worry! We automatically back up your site every day. If anything goes wrong, you can restore your entire website to a previous version with a single click.' },
      { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial on all plans. No credit card required. Try everything out risk-free and only pay if you love it.' },
      { q: 'Can I get help if I get stuck?', a: 'Absolutely. Our WordPress support team is available 24/7 via live chat and email. No question is too basic\u2014we love helping first-time creators succeed.' },
    ],
  },
  freelancers: {
    slug: 'freelancers',
    icon: 'monitor',
    title: 'Freelancers & Designers',
    heroLabel: 'Built for Freelancers & Agencies',
    headline: 'Build Client Sites Without Hosting Headaches',
    subheadline: 'Stop worrying about broken sites and botched migrations. LimeWP gives you staging environments, safe updates, and seamless client handoffs\u2014so you can focus on what you do best.',
    heroChecks: [
      'Staging environments on every site',
      'One-click client handoff',
      'Instant rollbacks and safe updates',
      'Bulk site management dashboard',
    ],
    heroCta: 'Start Free Trial',
    features: [
      { icon: 'box', title: 'Staging Environments', desc: 'Every site gets its own staging environment. Build, test, and get client approval before anything goes live.' },
      { icon: 'shield', title: 'Safe Updates', desc: 'Never fear the update button again. Auto-backup before every update with instant rollback on failure.' },
      { icon: 'refresh', title: 'Easy Migrations', desc: 'Moving sites is finally painless. Our migration tools handle the heavy lifting automatically.' },
      { icon: 'users', title: 'Client Handoff', desc: 'Transfer billing and ownership to clients with one click. Set granular access permissions for each team member.' },
      { icon: 'grid', title: 'Bulk Management', desc: 'Update plugins, themes, and WordPress core across all your sites at once from a centralized dashboard.' },
    ],
    safety: {
      title: 'We Know What Keeps You Up at Night',
      desc: "Managing client websites shouldn\u2019t be stressful. Here\u2019s how LimeWP eliminates your biggest hosting anxieties.",
      points: [
        { icon: 'refresh', label: 'Client Breaks Production', desc: "One wrong click and the live site goes down. Your phone rings at 2 AM. Panic mode engaged.", solution: 'Instant rollbacks restore sites in seconds' },
        { icon: 'bolt', label: 'Updates Cause Crashes', desc: 'WordPress core, themes, or plugins update and suddenly nothing works. And you have 20 other sites to manage.', solution: 'Test updates on staging first, every time' },
        { icon: 'globe', label: 'Migrations Are Messy', desc: 'Moving sites between hosts means broken links, missing files, and hours of troubleshooting. Every. Single. Time.', solution: 'Free white-glove migration included' },
      ],
      closing: 'Sleep soundly knowing every site is protected with automatic backups and instant rollbacks.',
    },
    workflow: [
      { icon: 'box', title: 'Staging Environments', desc: 'Every site gets its own staging environment. Build, test, and get client approval before anything goes live.', list: ['1-click staging creation', 'Sync production to staging', 'Password-protected previews'] },
      { icon: 'shield', title: 'Safe Updates', desc: 'Never fear the update button again. Test everything in isolation before pushing to production.', list: ['Auto-backup before updates', 'Visual regression testing', 'Instant rollback on failure'] },
      { icon: 'refresh', title: 'Easy Migrations', desc: 'Moving sites is finally painless. Our migration tools handle the heavy lifting automatically.', list: ['Free white-glove migration', 'Auto search-replace URLs', 'Zero-downtime DNS switch'] },
    ],
    handoff: {
      title: 'Seamless Ownership Transfer',
      desc: "Hand off completed projects without losing control. Transfer billing, manage access levels, or keep maintaining the site\u2014your choice.",
      features: [
        { title: 'Transfer Ownership', desc: "Move billing responsibility to your client with one click. They own it, you're done." },
        { title: 'Granular Access Control', desc: 'Set precise permissions. Let clients edit content while protecting code and settings.' },
      ],
    },
    tools: [
      { icon: 'grid', title: 'Bulk Management', desc: 'Update plugins, themes, and WordPress core across all your sites at once. No more clicking through dozens of dashboards.', list: ['Update all sites with one click', 'Centralized monitoring dashboard', 'Automated update scheduling', 'Vulnerability alerts across portfolio'] },
      { icon: 'refresh', title: 'Instant Rollbacks', desc: "Something broke? Go back in time with one click. Every change is automatically backed up so you're always protected.", list: ['Automatic daily backups', 'Point-in-time recovery', '30-day backup retention', 'Selective file/database restore'] },
    ],
    comparison: {
      competitors: ['LimeWP', 'WP Engine', 'Kinsta', 'SiteGround'],
      rows: [
        { icon: 'box', feature: 'Free Staging Environment', values: ['yes', 'yes', 'yes', 'no'] },
        { icon: 'upload', feature: 'Free Site Migration', values: ['yes', 'no', 'yes', 'yes'] },
        { icon: 'users', feature: 'Client Billing Transfer', values: ['yes', 'no', 'no', 'no'] },
        { icon: 'layers', feature: 'Bulk Site Management', values: ['yes', 'yes', 'yes', 'no'] },
        { icon: 'clock', feature: '24/7 Expert Support', values: ['yes', 'yes', 'yes', 'no'] },
        { icon: 'dollar-sign', feature: 'Agency Pricing (Pay per site)', values: ['yes', 'no', 'no', 'no'] },
        { icon: 'refresh-single', feature: '1-Click Rollback', values: ['yes', 'yes', 'yes', 'no'] },
      ],
      benefits: [
        { icon: 'dollar-sign', title: 'Built for Agencies', desc: "Pay only for what you use. No bloated plans or wasted resources\u2014just fair pricing that scales with your business." },
        { icon: 'users', title: 'Seamless Handoffs', desc: "Transfer ownership to clients without the headache. We're the only host that makes client handoffs truly painless." },
        { icon: 'shield', title: 'Zero Stress Deployments', desc: 'Staging, backups, and rollbacks built-in. Sleep soundly knowing you can fix any issue in seconds.' },
      ],
    },
    steps: [
      { icon: 'users', title: 'Connect Your Sites', desc: 'Migrate existing sites for free or create new ones from your dashboard.' },
      { icon: 'box', title: 'Build on Staging', desc: 'Develop and test safely. Share password-protected previews with clients.' },
      { icon: 'bolt', title: 'Push Live with Confidence', desc: 'One-click deploy to production with automatic backups and zero downtime.' },
    ],
    perfectFor: [
      { icon: 'monitor', label: 'Solo freelance developers' },
      { icon: 'users', label: 'Web design agencies' },
      { icon: 'pen', label: 'WordPress theme designers' },
      { icon: 'briefcase', label: 'Digital consultancies' },
    ],
    perfectForNote: 'Built for professionals who manage client websites and need reliability, control, and seamless handoffs.',
    ctaTitle: 'Ready to Ship? Deliver with Confidence',
    ctaDesc: 'Join thousands of freelancers and agencies who trust LimeWP to power their client projects. Start your free trial today\u2014no credit card required.',
    ctaButton: 'Start Your Free Trial',
    recommendedPlan: 'Professional',
    testimonialStats: [
      { value: '5,000+', label: 'Agencies & Freelancers' },
      { value: '120K+', label: 'Sites Hosted' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '4.9/5', label: 'Customer Rating' },
    ],
    featuredTestimonial: {
      initials: 'MK', name: 'Marcus Kim', role: 'Founder, Pixel Perfect Agency',
      text: "LimeWP transformed how we deliver client projects. We've cut our deployment time by 60% and haven't had a single 'oops' moment since switching. The staging environments alone are worth it\u2014clients can review changes before they go live, which has eliminated those awkward 'can you change it back' conversations. Our team of 8 developers manages over 120 client sites without breaking a sweat.",
      metric: '120+', metricLabel: 'Sites Managed on LimeWP', location: 'Los Angeles, CA',
    },
    testimonials: [
      { initials: 'SJ', name: 'Sarah Jensen', role: 'Freelance Developer', text: "The client handoff feature is a game-changer. I used to dread the billing conversation after projects. Now I just transfer ownership in one click and move on to the next project.", metric: 'Zero Downtime', metricLabel: 'In 2 years' },
      { initials: 'RT', name: 'Ryan Torres', role: 'CEO, WebCraft Studios', text: "Migrating 45 client sites sounded like a nightmare. LimeWP's team handled everything in 3 days with zero issues. Best decision we've made this year.", metric: '45 Sites', metricLabel: 'Migrated in 3 days' },
    ],
    faq: [
      { q: 'How does the staging environment work?', a: "Every site on LimeWP gets a free staging environment with one click. You can clone your production site to staging, make changes safely, test updates, and then push everything live when you're ready. Your staging site is password-protected by default, so clients can preview without the public seeing work-in-progress." },
      { q: 'Can I transfer site ownership to my clients?', a: "Absolutely! This is one of our most popular features. You can transfer billing responsibility to your client with a single click. They'll create their own LimeWP account, add their payment method, and take over the hosting\u2014while you retain access to maintain the site if needed." },
      { q: 'How do migrations work? Is there downtime?', a: "We offer free white-glove migrations for all plans. Our team handles everything\u2014files, database, SSL setup, and DNS configuration. We migrate your site to a temporary URL first, so you can verify everything works perfectly. Then we switch DNS with zero downtime." },
      { q: 'What happens if an update breaks my site?', a: "Don't panic\u2014we've got your back! Every update triggers an automatic backup, and you can rollback to any previous state with one click. Our visual regression testing also alerts you if something looks different after an update, so you catch issues before your clients do." },
      { q: 'Do you support WooCommerce and multisite?', a: 'Yes to both! Our infrastructure is optimized for WooCommerce with dedicated resources for handling traffic spikes and cart sessions. We also fully support WordPress Multisite networks on our Professional and Agency plans.' },
      { q: 'Can I manage all my client sites from one dashboard?', a: "That's exactly what our dashboard is designed for. You can see all your sites at a glance, update plugins and themes across multiple sites simultaneously, monitor uptime and performance, and manage team access\u2014all from one place. Professional and Agency plans also include a white-label option." },
    ],
  },
}

export const speedItems = [
  { label: 'LimeWP', time: '187ms', width: '95%', color: 'lime' },
  { label: 'Competitor A', time: '1.2s', width: '45%', color: 'muted' },
  { label: 'Competitor B', time: '2.1s', width: '25%', color: 'muted' },
  { label: 'Shared Hosting', time: '3.8s', width: '12%', color: 'muted' },
]
