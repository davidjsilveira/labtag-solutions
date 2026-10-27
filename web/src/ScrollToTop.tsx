import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToAnchor } from '@/scrollToAnchor'

/** Scroll to top on route changes; honor in-page hash anchors. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const frame = window.requestAnimationFrame(() => {
        if (!scrollToAnchor(id, 'auto')) window.scrollTo(0, 0)
      })
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
