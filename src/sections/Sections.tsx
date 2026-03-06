import { Icon, SectionHeader, Button, Toggle, IconBox } from '../components'
import { audiences, features, prices, plans, testimonials, faqData, speedItems, marqueeItems, competitors, comparisonRows, comparisonBenefits } from '../data'

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

export function Audience({ Rev }: { Rev: RevType }) {
  return (
    <section className="audience-section" id="solutions">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="Built For Everyone" title="Hosting that fits your needs" desc="From first-time creators to enterprise teams, LimeWP adapts to how you work." center />
        </Rev>
        <Rev>
          <div className="audience-grid">
            {audiences.map((a, i) => (
              <div key={i} className="audience-card">
                <IconBox name={a.icon} size="md" />
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <a href={`#${a.slug}`} className="audience-link">Learn more <Icon name="arrow" /></a>
              </div>
            ))}
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
          <SectionHeader label="Features" title="Everything you need, nothing you don't" desc="Built from the ground up for WordPress performance and reliability." center />
        </Rev>
        <Rev>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card${f.large ? ' large' : ''}`}>
                <div className="feature-content">
                  <IconBox name={f.icon} size="lg" />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="feature-list">
                    {f.list.map(item => <div key={item} className="feature-list-item"><Icon name="check" />{item}</div>)}
                  </div>
                </div>
                {f.large && (
                  <div className="feature-visual">
                    <div className="speed-demo">
                      {speedItems.map(s => (
                        <div key={s.label} className="speed-item">
                          <div className="speed-label">
                            <span>{s.label}</span>
                            <span style={s.color === 'lime' ? { color: 'var(--acc)' } : {}}>{s.time}</span>
                          </div>
                          <div className="speed-bar"><div className={`speed-bar-fill ${s.color}`} style={{ width: s.width }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function Comparison({ Rev }: { Rev: RevType }) {
  return (
    <section className="comparison-section" id="compare">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="Why LimeWP" title="See how we compare" desc="We built LimeWP specifically for freelancers and agencies. Here's how we stack up against the competition." center />
        </Rev>
        <Rev>
          <div className="compare-table">
            <div className="compare-header">
              <div className="compare-feature-col">Feature</div>
              {competitors.map(c => (
                <div key={c} className={`compare-col${c === 'LimeWP' ? ' highlight' : ''}`}>{c}</div>
              ))}
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} className="compare-row">
                <div className="compare-feature-col">
                  <Icon name={row.icon} width={18} height={18} fill="none" stroke="var(--c3)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  {row.feature}
                </div>
                {row.values.map((v, j) => (
                  <div key={j} className={`compare-col${j === 0 ? ' highlight' : ''}`}>
                    {v === 'yes' ? (
                      <Icon name="check" width={20} height={20} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    ) : v === 'no' ? (
                      <Icon name="x-mark" width={18} height={18} fill="none" stroke="var(--c3)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <Icon name="minus" width={18} height={18} fill="none" stroke="var(--c3)" strokeWidth={2} strokeLinecap="round" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Rev>
        <Rev>
          <div className="compare-benefits">
            {comparisonBenefits.map((b, i) => (
              <div key={i} className="compare-benefit">
                <IconBox name={b.icon} size="md" />
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </Rev>
      </div>
    </section>
  )
}

export function Pricing({ Rev, yearly, setYearly, onSignup }: { Rev: RevType; yearly: boolean; setYearly: (fn: (v: boolean) => boolean) => void; onSignup: () => void }) {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <Rev className="sc">
          <SectionHeader label="Simple Pricing" title="Plans that grow with you" desc="No hidden fees, no surprises. Just straightforward pricing." center />
          <Toggle active={yearly} onToggle={() => setYearly(y => !y)} labelLeft="Monthly" labelRight="Yearly" badge="Save 20%" />
        </Rev>
        <Rev>
          <div className="prgrid">
            {plans.map((plan, i) => (
              <div key={plan.name} className={`prcard${plan.popular ? ' pop' : ''}`}>
                {plan.popular && <div className="pop-label">Most Popular</div>}
                <div className="pn">{plan.name}</div>
                <div className="prnote">{plan.note}</div>
                <div className="pr">
                  <span className="pr-currency">$</span>
                  <span className="pv">{yearly ? prices.y[i] : prices.m[i]}</span>
                  <sub>/month</sub>
                </div>
                <div className={`yearly-savings${yearly ? ' visible' : ''}`}>Save ${(prices.m[i] - prices.y[i]) * 12}/year</div>
                <div className="pr-divider" />
                <ul className="fl">{plan.features.map(f => <li key={f}><Icon name="check" />{f}</li>)}</ul>
                {i === 2 ? (
                  <a href="#" className="prbtn">Contact Sales</a>
                ) : plan.popular ? (
                  <span className="prbtn" onClick={onSignup}>Start Free Trial</span>
                ) : (
                  <span className="prbtn" onClick={onSignup}>Get Started</span>
                )}
              </div>
            ))}
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
          <SectionHeader label="Reviews" title="Loved by 50,000+ WordPress users" desc="From solo creators to enterprise teams, hear why they chose LimeWP." center />
        </Rev>
        <Rev>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-rating">{[1, 2, 3, 4, 5].map(n => <Icon key={n} name="star" fill="currentColor" />)}</div>
                <p className="testimonial-text">"{t.text}"</p>
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
              <SectionHeader label="FAQ" title="Frequently asked<br />questions" desc="Everything you need to know about LimeWP." />
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
            <SectionHeader label="Ready to Launch?" title="Start building something great" center />
            <p>Join 50,000+ WordPress sites that trust LimeWP for speed, security, and reliability. Start your free trial today&mdash;no credit card required.</p>
            <div className="cta-acts">
              <Button variant="primary" icon="arrow" onClick={onSignup}>Start Your Free Trial</Button>
              <Button variant="secondary" href="#pricing">Talk to Sales</Button>
            </div>
            <div className="trust-badges">
              {['14-day free trial', 'No credit card required', 'Free migration included'].map(text => (
                <div key={text} className="trust-badge">
                  <Icon name="check-circle" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  {text}
                </div>
              ))}
            </div>
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
            <a href="#" className="logo">
              <div className="logo-icon"><Icon name="bolt" /></div>
              LimeWP
            </a>
            <p>WordPress hosting that just works. Fast, secure, and backed by humans who actually care.</p>
          </div>
          {footerCols.map(col => (
            <div key={col.title} className="footer-column">
              <h4>{col.title}</h4>
              {col.links.map(link => <a key={link.l} href={link.h}>{link.l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LimeWP. Built with love for WordPress users everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
