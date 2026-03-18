import { useState, Dispatch, SetStateAction } from 'react'
import { useReveal } from './hooks'
import { AuthModals } from './components'
import { Hero } from './sections/Hero'
import { Platform } from './sections/Platform'
import { Marquee, BuildFirst, Features, UpgradePath, PlansCard, Testimonials, FAQ, CTA, Footer } from './sections/Sections'

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

type LandingPageProps = {
  modal: 'login' | 'signup' | null
  setModal: Dispatch<SetStateAction<'login' | 'signup' | null>>
  onSignup: () => void
  onAuth?: () => void
  countdown: { d: number; h: number; m: number; s: number }
}

export function LandingPage({ modal, setModal, onSignup, onAuth, countdown }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <Hero onSignup={onSignup} countdown={countdown} />
      <Marquee />
      <Platform Rev={Rev} onSignup={onSignup} />
      <BuildFirst Rev={Rev} onSignup={onSignup} />
      <Features Rev={Rev} />
      <UpgradePath Rev={Rev} onSignup={onSignup} countdown={countdown} />
      <PlansCard Rev={Rev} onSignup={onSignup} countdown={countdown} />
      <Testimonials Rev={Rev} />
      <FAQ Rev={Rev} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CTA Rev={Rev} onSignup={onSignup} />
      <AuthModals modal={modal} setModal={setModal} onAuth={onAuth} />
      <Footer />
      <div className="sticky-cta">
        <button className="btn btn-p" onClick={onSignup}>Start Building for Free</button>
      </div>
    </>
  )
}
