import { useEffect, useState } from 'react'

const AUDIENCES = ['Labs', 'Healthcare', 'Biobanking', 'Pharmaceutical'] as const

const ROTATE_MS = 2800

export function RotatingAudience() {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % AUDIENCES.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  const word = AUDIENCES[index]

  return (
    <span className="hero-rotate" aria-live="polite">
      <span key={word} className="hero-rotate-word">
        {word}
      </span>
    </span>
  )
}
