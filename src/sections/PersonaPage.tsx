import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useReveal } from '../hooks'
import { Icon, IconBox, Button, SectionHeader, AuthModals } from '../components'
import { PersonaData, prices, plans } from '../data'
import { Footer } from './Sections'

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

type PersonaPageProps = {
  data: PersonaData
  modal: 'login' | 'signup' | null
  setModal: Dispatch<SetStateAction<'login' | 'signup' | null>>
  onSignup: () => void
}

export function PersonaPage({ data, modal, setModal, onSignup }: PersonaPageProps) {
  const [openFaq, setOpenFaq] = useState(-1)
  const [billing, setBilling] = useState<'m' | 'q' | 'y'>('m')
  useEffect(() => { window.scrollTo(0, 0) }, [data.slug])

  return (
    <>
      {/* Hero */}
      <section className="persona-hero">
        <div className="container">
          <div className="persona-hero-grid">
            <Rev className="persona-hero-left">
              <div className="persona-hero-label">{data.heroLabel}</div>
              <h1>{data.headline}</h1>
              <p className="persona-hero-sub">{data.subheadline}</p>
              <div className="persona-hero-checks">
                {data.heroChecks.map((c, i) => (
                  <span key={i} className="persona-check">
                    <Icon name="check" width={16} height={16} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {c}
                  </span>
                ))}
              </div>
              <div className="persona-hero-actions">
                <Button variant="primary" icon="arrow" onClick={onSignup}>{data.heroCta}</Button>
              </div>
            </Rev>
            <Rev className="persona-hero-right">
              <PersonaIllustration slug={data.slug} />
            </Rev>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="persona-features-section" id="persona-features">
        <div className="container">
          <Rev className="sc">
            <SectionHeader label="Features" title={data.workflow ? 'Professional tools for professional work' : 'Everything You Need to Launch Your First Site'} center />
          </Rev>
          <Rev>
            <div className="persona-features-grid">
              {data.features.slice(0, 2).map((f, i) => (
                <div key={i} className="persona-feature-card">
                  <IconBox name={f.icon} size="md" />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="persona-features-bottom">
              {data.features.slice(2).map((f, i) => (
                <div key={i} className="persona-feature-card">
                  <IconBox name={f.icon} size="md" />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* Safety / Fear Removal */}
      <section className="persona-safety-section" id="persona-safety">
        <div className="container">
          <Rev className="sc">
            <SectionHeader label={data.safety.points[0]?.solution ? 'Common Fears' : 'Peace of Mind'} title={data.safety.title} desc={data.safety.desc} center />
          </Rev>
          <Rev>
            <div className="persona-safety-grid">
              {data.safety.points.map((p, i) => (
                <div key={i} className={`persona-safety-card${p.solution ? ' has-solution' : ''}`}>
                  <IconBox name={p.icon} size="md" />
                  <h3>{p.label}</h3>
                  <p>{p.desc}</p>
                  {p.solution && <div className="persona-safety-solution"><Icon name="check" width={14} height={14} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /><span>{p.solution}</span></div>}
                </div>
              ))}
            </div>
          </Rev>
          <Rev>
            <div className="persona-safety-closing">
              <Icon name="check-circle" width={20} height={20} fill="none" stroke="var(--acc)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <span>{data.safety.closing}</span>
            </div>
          </Rev>
        </div>
      </section>

      {/* Workflow */}
      {data.workflow && (
        <section className="persona-workflow-section" id="persona-workflow">
          <div className="container">
            <Rev className="sc">
              <SectionHeader label="Professional Workflow" title="Your development workflow, perfected" desc="Build, test, and deploy with confidence using industry-standard practices baked right into your hosting." center />
            </Rev>
            <Rev>
              <div className="persona-workflow-grid">
                {data.workflow.map((w, i) => (
                  <div key={i} className="persona-workflow-card">
                    <IconBox name={w.icon} size="md" />
                    <h3>{w.title}</h3>
                    <p>{w.desc}</p>
                    <ul className="persona-workflow-list">
                      {w.list.map((item, j) => (
                        <li key={j}>
                          <Icon name="check" width={14} height={14} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Rev>
          </div>
        </section>
      )}

      {/* Client Handoff */}
      {data.handoff && (
        <section className="persona-handoff-section" id="persona-handoff">
          <div className="container">
            <Rev>
              <div className="persona-handoff-grid">
                <div className="persona-handoff-demo">
                  <div className="persona-handoff-demo-card">
                    <div className="persona-handoff-demo-title">Team Access</div>
                    {[
                      { initials: 'JD', name: "John's Design Co.", email: 'john@design.co', role: 'Owner' },
                      { initials: 'AC', name: 'Acme Corp (Client)', email: 'admin@acme.com', role: 'Admin' },
                      { initials: 'SW', name: 'Sarah Writer', email: 'sarah@writer.com', role: 'Editor' },
                    ].map((m, i) => (
                      <div key={i} className="persona-handoff-member">
                        <div className="persona-handoff-avatar">{m.initials}</div>
                        <div className="persona-handoff-info">
                          <strong>{m.name}</strong>
                          <span>{m.email}</span>
                        </div>
                        <div className={`persona-handoff-role ${m.role.toLowerCase()}`}>{m.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="persona-handoff-content">
                  <SectionHeader label="Client Handoff" title={data.handoff.title} desc={data.handoff.desc} />
                  <div className="persona-handoff-features">
                    {data.handoff.features.map((f, i) => (
                      <div key={i} className="persona-handoff-feature">
                        <Icon name="check-circle" width={20} height={20} fill="none" stroke="var(--acc)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <div>
                          <strong>{f.title}</strong>
                          <p>{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Rev>
          </div>
        </section>
      )}

      {/* Tools */}
      {data.tools && (
        <section className="persona-tools-section" id="persona-tools">
          <div className="container">
            <Rev className="sc">
              <SectionHeader label="Time-Saving Tools" title="Manage multiple sites in minutes" desc="Stop doing the same tasks over and over. Our tools let you manage your entire portfolio efficiently." center />
            </Rev>
            <Rev>
              <div className="persona-tools-grid">
                {data.tools.map((t, i) => (
                  <div key={i} className="persona-tool-card">
                    <IconBox name={t.icon} size="md" />
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <ul className="persona-tool-list">
                      {t.list.map((item, j) => (
                        <li key={j}>
                          <Icon name="check" width={14} height={14} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Rev>
          </div>
        </section>
      )}

      {/* Comparison */}
      {data.comparison && (
        <section className="persona-comparison-section" id="persona-comparison">
          <div className="container">
            <Rev className="sc">
              <SectionHeader label="Why LimeWP?" title="See how we compare" desc="We built LimeWP specifically for freelancers and agencies. Here's how we stack up against the competition." center />
            </Rev>
            <Rev>
              <div className="persona-comparison-table">
                <div className="persona-comparison-header">
                  <div className="persona-comparison-feature">Feature</div>
                  {data.comparison.competitors.map((c, i) => (
                    <div key={i} className={`persona-comparison-val${i === 0 ? ' highlight' : ''}`}>{c}</div>
                  ))}
                </div>
                {data.comparison.rows.map((r, i) => (
                  <div key={i} className="persona-comparison-row">
                    <div className="persona-comparison-feature">
                      <Icon name={r.icon} width={18} height={18} fill="none" stroke="var(--c3)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      {r.feature}
                    </div>
                    {r.values.map((v, j) => (
                      <div key={j} className={`persona-comparison-val${j === 0 ? ' highlight' : ''}`}>
                        {v === 'yes' ? (
                          <Icon name="check" width={20} height={20} fill="none" stroke="var(--acc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <Icon name="x-mark" width={18} height={18} fill="none" stroke="var(--c3)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Rev>
            <Rev>
              <div className="persona-comparison-benefits">
                {data.comparison.benefits.map((b, i) => (
                  <div key={i} className="persona-comparison-benefit">
                    <IconBox name={b.icon} size="md" />
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
            </Rev>
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="persona-steps-section" id="persona-steps">
        <div className="container">
          <Rev className="sc">
            <SectionHeader label="How It Works" title="Launch Your Website in 3 Simple Steps" center />
          </Rev>
          <Rev>
            <div className="persona-timeline">
              <div className="persona-timeline-line" />
              {data.steps.map((s, i) => (
                <div key={i} className="persona-timeline-item">
                  <div className="persona-timeline-node">
                    <div className="persona-timeline-num">{i + 1}</div>
                  </div>
                  <div className="persona-timeline-content">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Rev>
        </div>
      </section>

      {/* Perfect For */}
      <section className="persona-perfect-section">
        <div className="container">
          <Rev>
            <div className="persona-perfect">
              <div className="persona-perfect-header">
                <div className="persona-perfect-label">Perfect For</div>
                <p className="persona-perfect-note">{data.perfectForNote}</p>
              </div>
              <div className="persona-perfect-grid">
                {data.perfectFor.map((p, i) => (
                  <div key={i} className="persona-perfect-item">
                    <IconBox name={p.icon} size="sm" />
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Rev>
        </div>
      </section>

      {/* Recommended Plan */}
      <section className="persona-pricing-section" id="persona-pricing">
        <div className="container">
          <Rev className="sc">
            <SectionHeader label="Recommended Plan" title={`Best plan for ${data.title.toLowerCase()}`} desc="Start with what fits, upgrade anytime." center />
          </Rev>
          <Rev>
            <div className="persona-billing-toggle">
              <button className={billing === 'm' ? 'active' : ''} onClick={() => setBilling('m')}>Monthly</button>
              <button className={billing === 'q' ? 'active' : ''} onClick={() => setBilling('q')}>3 Months</button>
              <button className={billing === 'y' ? 'active' : ''} onClick={() => setBilling('y')}>Annual</button>
            </div>
            <div className="persona-plan-highlight">
              {plans.map((plan, i) => {
                const recommended = plan.name === data.recommendedPlan
                const price = prices[billing][i]
                const savePercent = billing === 'q' ? Math.round((1 - prices.q[i] / prices.m[i]) * 100) : billing === 'y' ? Math.round((1 - prices.y[i] / prices.m[i]) * 100) : 0
                return (
                  <div key={i} className={`prcard${recommended ? ' pop' : ''}`}>
                    {recommended && <div className="pop-label">Recommended for you</div>}
                    <div className="pn">{plan.name}</div>
                    <div className="pr">
                      <span className="pr-currency">$</span>
                      <span className="pv">{price}</span>
                      <sub>/mo</sub>
                    </div>
                    {savePercent > 0 && <div className="persona-save-badge">Save {savePercent}%</div>}
                    <div className="prnote">{plan.note}</div>
                    <div className="pr-divider" />
                    <ul className="fl">
                      {plan.features.map((f, j) => (
                        <li key={j}>
                          <Icon name="check" width={16} height={16} fill="none" stroke="var(--acc)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="prbtn" onClick={onSignup}>{recommended ? 'Start Free Trial' : 'Choose Plan'}</button>
                  </div>
                )
              })}
            </div>
          </Rev>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials && (
        <section className="testimonials" id="persona-testimonials">
          <div className="container">
            <Rev className="sc">
              <SectionHeader label={data.testimonialStats ? 'Trusted by Agencies' : 'Reviews'} title={data.testimonialStats ? 'Real results from real agencies' : `Trusted by ${data.title.toLowerCase()} like you`} desc={data.testimonialStats ? "Join thousands of web professionals who've transformed their workflow with LimeWP." : undefined} center />
            </Rev>
            {data.testimonialStats && (
              <Rev>
                <div className="persona-stats-row">
                  {data.testimonialStats.map((s, i) => (
                    <div key={i} className="persona-stat-item">
                      <div className="persona-stat-value">{s.value}</div>
                      <div className="persona-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Rev>
            )}
            <Rev>
              {data.featuredTestimonial && (
                <div className="persona-featured-testimonial">
                  <div className="testimonial-card featured">
                    <div className="testimonial-author">
                      <div className="author-avatar">{data.featuredTestimonial.initials}</div>
                      <div className="author-info"><strong>{data.featuredTestimonial.name}</strong><span>{data.featuredTestimonial.role}</span></div>
                    </div>
                    <p className="testimonial-text">"{data.featuredTestimonial.text}"</p>
                    <div className="persona-testimonial-meta">
                      <div className="persona-testimonial-metric">
                        <strong>{data.featuredTestimonial.metric}</strong>
                        <span>{data.featuredTestimonial.metricLabel}</span>
                      </div>
                      <div className="persona-testimonial-location">{data.featuredTestimonial.location}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="testimonials-grid">
                {data.testimonials.map((t, i) => (
                  <div key={i} className="testimonial-card">
                    <div className="testimonial-rating">{[1, 2, 3, 4, 5].map(n => <Icon key={n} name="star" fill="currentColor" />)}</div>
                    <p className="testimonial-text">"{t.text}"</p>
                    <div className="testimonial-author">
                      <div className="author-avatar">{t.initials}</div>
                      <div className="author-info"><strong>{t.name}</strong><span>{t.role}</span></div>
                    </div>
                    {t.metric && (
                      <div className="persona-testimonial-metric">
                        <strong>{t.metric}</strong>
                        <span>{t.metricLabel}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Rev>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq && (
        <section className="faq" id="persona-faq">
          <div className="container">
            <Rev>
              <div className="faqgrid">
                <div className="faqside">
                  <SectionHeader label="FAQ" title="Frequently asked<br />questions" desc={`Everything you need to know about hosting for ${data.title.toLowerCase()}.`} />
                  <div className="faqcontact">
                    <p>Can't find what you're looking for? Our team is happy to help.</p>
                    <Button variant="secondary" size="small" icon="arrow" href="#">Contact Support</Button>
                  </div>
                </div>
                <div className="faqlist">
                  {data.faq.map((f, i) => (
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
      )}

      {/* CTA */}
      <section className="persona-cta-section">
        <div className="container">
          <Rev>
            <div className="ctabox">
              <h2>{data.ctaTitle}</h2>
              <p>{data.ctaDesc}</p>
              <div className="cta-acts">
                <Button variant="primary" icon="arrow" onClick={onSignup}>{data.ctaButton}</Button>
              </div>
            </div>
          </Rev>
        </div>
      </section>

      <AuthModals modal={modal} setModal={setModal} />
      <Footer />
    </>
  )
}

function PersonaIllustration({ slug }: { slug: string }) {
  if (slug === 'creators') return <CreatorsIllustration />
  if (slug === 'freelancers') return <FreelancersIllustration />
  return <DefaultIllustration />
}

function CreatorsIllustration() {
  return (
    <div className="persona-illust">
      {/* Floating badges */}
      <div className="persona-float pf1">
        <IconBox name="bolt" size="sm" />
        <span>1-Click Install</span>
      </div>
      <div className="persona-float pf2">
        <IconBox name="lock" size="sm" />
        <span>SSL Active</span>
      </div>
      <div className="persona-float pf3">
        <IconBox name="refresh-single" size="sm" />
        <span>Auto Backup</span>
      </div>

      {/* Main card: simplified dashboard mockup */}
      <div className="persona-illust-card">
        <div className="pi-topbar">
          <div className="pi-dots"><span /><span /><span /></div>
          <div className="pi-url">mywebsite.com</div>
          <div />
        </div>
        <div className="pi-body">
          <div className="pi-sidebar">
            <div className="pi-nav-item active"><Icon name="home" width={14} height={14} /><span>Home</span></div>
            <div className="pi-nav-item"><Icon name="pen" width={14} height={14} /><span>Pages</span></div>
            <div className="pi-nav-item"><Icon name="grid" width={14} height={14} /><span>Themes</span></div>
            <div className="pi-nav-item"><Icon name="settings" width={14} height={14} /><span>Settings</span></div>
          </div>
          <div className="pi-main">
            <div className="pi-welcome">
              <div className="pi-welcome-icon"><Icon name="check-circle" width={24} height={24} /></div>
              <div className="pi-welcome-text">
                <strong>Your site is live!</strong>
                <span>Everything is set up and ready to go</span>
              </div>
            </div>
            <div className="pi-stats-row">
              <div className="pi-stat"><div className="pi-stat-val">100%</div><div className="pi-stat-lbl">Uptime</div></div>
              <div className="pi-stat"><div className="pi-stat-val">A+</div><div className="pi-stat-lbl">Security</div></div>
              <div className="pi-stat"><div className="pi-stat-val">187ms</div><div className="pi-stat-lbl">Speed</div></div>
            </div>
            <div className="pi-bar-row">
              <div className="pi-bar-label">Setup Progress</div>
              <div className="pi-bar"><div className="pi-bar-fill" /></div>
              <div className="pi-bar-pct">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FreelancersIllustration() {
  return (
    <div className="persona-illust">
      <div className="persona-float pf1">
        <IconBox name="box" size="sm" />
        <span>Staging Ready</span>
      </div>
      <div className="persona-float pf2">
        <IconBox name="shield" size="sm" />
        <span>Safe Updates</span>
      </div>
      <div className="persona-float pf3">
        <IconBox name="users" size="sm" />
        <span>Client Handoff</span>
      </div>

      <div className="persona-illust-card">
        <div className="pi-topbar">
          <div className="pi-dots"><span /><span /><span /></div>
          <div className="pi-url">dashboard.limewp.com</div>
          <div />
        </div>
        <div className="pi-body">
          <div className="pi-sidebar">
            <div className="pi-nav-item active"><Icon name="grid" width={14} height={14} /><span>Sites</span></div>
            <div className="pi-nav-item"><Icon name="box" width={14} height={14} /><span>Staging</span></div>
            <div className="pi-nav-item"><Icon name="users" width={14} height={14} /><span>Clients</span></div>
            <div className="pi-nav-item"><Icon name="settings" width={14} height={14} /><span>Settings</span></div>
          </div>
          <div className="pi-main">
            <div className="pi-welcome">
              <div className="pi-welcome-icon"><Icon name="grid" width={24} height={24} /></div>
              <div className="pi-welcome-text">
                <strong>5 Sites Managed</strong>
                <span>All sites healthy and up to date</span>
              </div>
            </div>
            <div className="pi-stats-row">
              <div className="pi-stat"><div className="pi-stat-val">5</div><div className="pi-stat-lbl">Active</div></div>
              <div className="pi-stat"><div className="pi-stat-val">3</div><div className="pi-stat-lbl">Staging</div></div>
              <div className="pi-stat"><div className="pi-stat-val">0</div><div className="pi-stat-lbl">Issues</div></div>
            </div>
            <div className="pi-bar-row">
              <div className="pi-bar-label">Updates Applied</div>
              <div className="pi-bar"><div className="pi-bar-fill" /></div>
              <div className="pi-bar-pct">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultIllustration() {
  return (
    <div className="persona-illust">
      <div className="persona-illust-card">
        <div className="pi-topbar">
          <div className="pi-dots"><span /><span /><span /></div>
          <div className="pi-url">limewp.com</div>
          <div />
        </div>
        <div className="pi-body">
          <div className="pi-main" style={{ padding: 32 }}>
            <div className="pi-welcome">
              <div className="pi-welcome-icon"><Icon name="bolt" width={24} height={24} /></div>
              <div className="pi-welcome-text">
                <strong>LimeWP Dashboard</strong>
                <span>Manage your WordPress sites</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
