import { useState, Dispatch, SetStateAction } from 'react'
import { useReveal } from './hooks'
import { AuthModals } from './components'
import { Hero } from './sections/Hero'
import { Platform } from './sections/Platform'
import { Marquee, Audience, Features, Comparison, Pricing, Testimonials, FAQ, CTA, Footer } from './sections/Sections'

function Rev({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

type LandingPageProps = {
  theme: string
  modal: 'login' | 'signup' | null
  setModal: Dispatch<SetStateAction<'login' | 'signup' | null>>
  onSignup: () => void
}

export function LandingPage({ modal, setModal, onSignup }: LandingPageProps) {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <Hero onSignup={onSignup} />
      <Marquee />
      <Platform Rev={Rev} onSignup={onSignup} />
      <Audience Rev={Rev} />
      <Features Rev={Rev} />
      <Comparison Rev={Rev} />
      <Pricing Rev={Rev} yearly={yearly} setYearly={setYearly} onSignup={onSignup} />
      <Testimonials Rev={Rev} />
      <FAQ Rev={Rev} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CTA Rev={Rev} onSignup={onSignup} />
      <AuthModals modal={modal} setModal={setModal} />
      <Footer />
    </>
  )
}
