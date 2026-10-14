import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to top on route changes; honor in-page hash anchors. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(id)
        if (target) target.scrollIntoView()
        else window.scrollTo(0, 0)
      })
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
