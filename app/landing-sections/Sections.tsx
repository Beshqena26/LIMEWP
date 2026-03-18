import { Icon, SectionHeader, Button, IconBox } from '../landing-components'
import { features, prices, plans, testimonials, faqData, marqueeItems, comparisonRows, freeFeatures, paidFeatures } from '../landing-data'

type RevType = React.ComponentType<{ children: React.ReactNode; className?: string }>

export function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {[...marqueeItems, ...marqueeItems].map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  )
}

export function BuildFirst({ Rev, onSignup }: { Rev: RevType; onSignup: () => void }) {
  return (
    <section className="build-first" id="compare">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="Why LimeWP" title="Shared hosting can't compete with this." desc="Most hosts pack hundreds of sites on one server. LimeWP gives every site its own isolated container with enterprise-grade infrastructure." center />
        </Rev>
        <Rev>
          <div className="bf-table">
            <div className="bf-header">
              <div className="bf-label-col">Feature</div>
              <div className="bf-col bf-others">Typical Host</div>
              <div className="bf-col bf-you">LimeWP</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} className="bf-row">
                <div className="bf-label-col">{row.label}</div>
                <div className="bf-col bf-others"><Icon name="x-mark" width={14} height={14} />{row.others}</div>
                <div className="bf-col bf-you"><Icon name="check" width={14} height={14} />{row.you}</div>
              </div>
            ))}
          </div>
        </Rev>
        <Rev>
          <div className="bf-cta">
            <Button variant="primary" icon="arrow" onClick={onSignup}>Start Building for Free</Button>
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function Features({ Rev }: { Rev: RevType }) {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="The LimeWP Stack" title="Enterprise infrastructure. Every plan." desc="LiteSpeed, NVMe, Redis, WAF — the technology that powers high-traffic sites, included on every LimeWP account." center />
        </Rev>
        <Rev>
          <div className="features-grid features-grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-content">
                  <IconBox name={f.icon} size="lg" color={f.color as any} />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function UpgradePath({ Rev, onSignup, countdown }: { Rev: RevType; onSignup: () => void; countdown: { h: number; m: number; s: number } }) {
  const { h, m, s } = countdown
  return (
    <section className="upgrade-path">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="Grow with LimeWP" title="Premium from day one. Scale when ready." desc="Your free LimeWP account runs on the same premium infrastructure as paid plans. When you need more, upgrading unlocks everything." center />
        </Rev>
        <Rev>
          <div className="upgrade-flow">
            <div className="upgrade-card-side">
              <div className="upgrade-step">1</div>
              <div className="upgrade-badge">Free Plan / 6 Months</div>
              <h3>Everything to Launch</h3>
              <ul className="upgrade-list">
                {freeFeatures.map(f => (
                  <li key={f}><Icon name="check" />{f}</li>
                ))}
              </ul>
            </div>
            <div className="upgrade-arrow-col">
              <div className="upgrade-connector" />
              <div className="upgrade-arrow-circle">
                <Icon name="arrow" />
              </div>
              <span className="upgrade-arrow-label">When ready</span>
              <div className="upgrade-connector" />
            </div>
            <div className="upgrade-card-side upgrade-card-pro">
              <div className="upgrade-step">2</div>
              <div className="upgrade-badge">Paid Plans</div>
              <h3>Scale Without Limits</h3>
              <ul className="upgrade-list">
                {paidFeatures.map(f => (
                  <li key={f}><Icon name="plus" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </Rev>
        <Rev>
          <div className="upgrade-bottom">
            <div className="upgrade-countdown">
              <span className="upgrade-countdown-label">Free offer ends in</span>
              <div className="upgrade-cd-digits">
                <div className="cd-box"><span className="cd-num">{String(h).padStart(2, '0')}</span><span className="cd-label">Hours</span></div>
                <span className="cd-colon">:</span>
                <div className="cd-box"><span className="cd-num">{String(m).padStart(2, '0')}</span><span className="cd-label">Minutes</span></div>
                <span className="cd-colon">:</span>
                <div className="cd-box"><span className="cd-num">{String(s).padStart(2, '0')}</span><span className="cd-label">Seconds</span></div>
              </div>
            </div>
            <Button variant="primary" icon="arrow" onClick={onSignup}>Start Building for Free</Button>
          </div>
        </Rev>
      </div>
    </section>
  )
}

const paidPlans = [
  {
    name: 'Pro Monthly',
    price: '$9',
    period: '/mo',
    desc: 'Full premium stack with more resources. Cancel anytime.',
    features: ['Everything in Free', '10 GB NVMe storage', 'Staging environment', 'Priority expert support', 'Real-time backups', 'Advanced analytics', 'SSH & WP-CLI access'],
    cta: 'Get Pro Monthly',
  },
  {
    name: 'Pro Yearly',
    price: '$79',
    period: '/yr',
    save: 'Save 27%',
    desc: 'Best value. Same premium infrastructure, maximum savings.',
    features: ['Everything in Pro Monthly', '50 GB NVMe storage', 'Multisite support', 'White-label branding', 'Dedicated resources', 'Git deployment', 'PHP version selector'],
    cta: 'Get Pro Yearly',
  },
]

export function PlansCard({ Rev, onSignup, countdown }: { Rev: RevType; onSignup: () => void; countdown: { h: number; m: number; s: number } }) {
  return (
    <section className="plans-card-section" id="pricing">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="LimeWP Pricing" title="Premium hosting. Honest pricing." desc="Every LimeWP plan includes the full premium stack. No hidden fees, no upsells on essential features." center />
        </Rev>

        <Rev>
          <div className="plan-free">
            <div className="plan-free-glow" />
            <div className="plan-free-content">
              <div className="plan-free-left">
                <div className="plan-free-tag">
                  <Icon name="bolt" width={14} height={14} />
                  <span>Free for 6 months</span>
                  <span className="plan-free-tag-sep" />
                  <span className="plan-free-tag-cd">{String(countdown.h).padStart(2, '0')}h {String(countdown.m).padStart(2, '0')}m {String(countdown.s).padStart(2, '0')}s left</span>
                </div>
                <h3>Experience LimeWP before you pay</h3>
                <p>Full LimeWP stack — LiteSpeed, NVMe, Redis, CDN, WAF — for 6 months at zero cost. Same infrastructure as paid plans.</p>
                <Button variant="primary" icon="arrow" onClick={onSignup}>Start Free on LimeWP</Button>
                <div className="plan-free-no-cc">
                  <Icon name="check-circle" width={14} height={14} />
                  No credit card required
                </div>
              </div>
              <div className="plan-free-right">
                <ul className="plan-free-features">
                  {['Full premium stack', '1 GB NVMe storage', 'LiteSpeed + Redis', 'Free SSL & CDN', 'WAF protection', 'Daily backups'].map(f => (
                    <li key={f}><Icon name="check" />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Rev>

        <Rev>
          <p className="plans-when-ready">When you're ready, upgrade to Pro:</p>
          <div className="plans-paid-grid">
            {paidPlans.map((p, i) => (
              <div key={i} className="plan-paid-card">
                <div className="plan-paid-top">
                  <div className="plan-paid-name">{p.name}</div>
                  {'save' in p && p.save && <div className="plan-paid-save">{p.save}</div>}
                </div>
                <div className="plan-paid-price">
                  <span className="plan-paid-amount">{p.price}</span>
                  <span className="plan-paid-period">{p.period}</span>
                </div>
                <p className="plan-paid-desc">{p.desc}</p>
                <ul className="plan-paid-features">
                  {p.features.map(f => (
                    <li key={f}><Icon name="check" />{f}</li>
                  ))}
                </ul>
                <Button variant="secondary" icon="arrow" onClick={onSignup}>{p.cta}</Button>
                <div className="plan-paid-cc-note">Credit card required</div>
              </div>
            ))}
          </div>
        </Rev>

        <Rev>
          <div className="plans-guarantee">
            <Icon name="shield" width={18} height={18} />
            <span>30-day money-back guarantee on all paid plans</span>
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function Testimonials({ Rev }: { Rev: RevType }) {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="What Users Say" title="The performance speaks for itself." desc="See why developers, agencies, and business owners chose LimeWP." center />
        </Rev>
        <Rev>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card${i === 1 ? ' featured' : ''}`}>
                <div className="testimonial-rating">{[1, 2, 3, 4, 5].map(n => <Icon key={n} name="star" />)}</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div className="author-info"><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function FAQ({ Rev, openFaq, setOpenFaq }: { Rev: RevType; openFaq: number; setOpenFaq: (v: number) => void }) {
  return (
    <section className="faq" id="faq">
      <div className="container">
        <Rev>
          <div className="faqgrid">
            <div className="faqside">
              <SectionHeader label="FAQ" title="Questions?<br />Answered." desc="Everything you need to know about LimeWP." />
              <div className="faqcontact">
                <p>Can't find what you're looking for? Our team is happy to help.</p>
                <Button variant="secondary" size="small" icon="arrow" href="#">Contact Support</Button>
              </div>
            </div>
            <div className="faqlist">
              {faqData.map((f, i) => (
                <div key={i} className={`faqitem${openFaq === i ? ' open' : ''}`}>
                  <div className="faqq" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    {f.q}
                    <span className="faqico"><Icon name="chevron" /></span>
                  </div>
                  <div className="faqa"><div className="faqai">{f.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function CTA({ Rev, onSignup }: { Rev: RevType; onSignup: () => void }) {
  return (
    <section className="final-cta" id="cta">
      <div className="container">
        <Rev>
          <div className="ctabox">
            <div className="cta-icon-ring">
              <Icon name="bolt" width={28} height={28} />
            </div>
            <h2>This is LimeWP.<br />Try it free for 6 months.</h2>
            <p>LiteSpeed. NVMe. Redis. Enterprise security. Experience what premium WordPress hosting feels like — at zero cost.</p>
            <div className="cta-acts">
              <Button variant="primary" icon="arrow" onClick={onSignup}>Start Free on LimeWP</Button>
            </div>
            <div className="trust-badges">
              {['No credit card', 'Full premium stack', 'Cancel anytime'].map(text => (
                <div key={text} className="trust-badge">
                  <Icon name="check-circle" width={15} height={15} />
                  {text}
                </div>
              ))}
            </div>
            <div className="urgency-line">Over 12,000 sites running on LimeWP.</div>
          </div>
        </Rev>
      </div>
    </section>
  )
}

const footerCols = [
  { title: 'Product', links: [{ l: 'Features', h: '#features' }, { l: 'Pricing', h: '#pricing' }, { l: 'WooCommerce', h: '#' }, { l: 'Enterprise', h: '#' }, { l: 'Migrations', h: '#' }] },
  { title: 'Support', links: [{ l: 'Help Center', h: '#' }, { l: 'Contact Us', h: '#' }, { l: 'System Status', h: '#' }, { l: 'Documentation', h: '#' }] },
  { title: 'Company', links: [{ l: 'About Us', h: '#' }, { l: 'Blog', h: '#' }, { l: 'Careers', h: '#' }, { l: 'Privacy Policy', h: '#' }, { l: 'Terms of Service', h: '#' }] },
]

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="/" className="logo">
              <img src="/limewp-logo.svg" alt="LimeWP" width="100" height="28" style={{ display: 'block' }} />
            </a>
            <p>Premium WordPress hosting. LiteSpeed servers, NVMe storage, and enterprise security — backed by experts who care.</p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="GitHub"><Icon name="code-slash" width={16} height={16} /></a>
              <a href="#" className="footer-social-link" aria-label="Chat"><Icon name="chat" width={16} height={16} /></a>
              <a href="#" className="footer-social-link" aria-label="Globe"><Icon name="globe" width={16} height={16} /></a>
            </div>
          </div>
          {footerCols.map(col => (
            <div key={col.title} className="footer-column">
              <h4>{col.title}</h4>
              {col.links.map(link => <a key={link.l} href={link.h}>{link.l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LimeWP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
