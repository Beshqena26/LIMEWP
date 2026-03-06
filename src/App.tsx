import { useState, useEffect } from 'react'
import { LandingPage } from './LandingPage'
import { StyleGuide } from './StyleGuide'

export function App() {
  const [page, setPage] = useState(() => window.location.hash === '#styleguide' ? 'styleguide' : 'landing')

  useEffect(() => {
    const onHash = () => setPage(window.location.hash === '#styleguide' ? 'styleguide' : 'landing')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return page === 'styleguide' ? <StyleGuide /> : <LandingPage />
}
