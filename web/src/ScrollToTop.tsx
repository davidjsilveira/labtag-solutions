import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { scrollToAnchor } from '@/scrollToAnchor'

function scrollKey(pathname: string, search: string) {
  return `scroll:${pathname}${search}`
}

/** Scroll to top on new routes; restore position on back/forward. Honor hash anchors. */
export function ScrollToTop() {
  const { pathname, hash, search } = useLocation()
  const nav = useNavigationType()
  const key = scrollKey(pathname, search)

  useEffect(() => {
    const save = () => sessionStorage.setItem(key, String(window.scrollY))
    window.addEventListener('beforeunload', save)
    return () => {
      save()
      window.removeEventListener('beforeunload', save)
    }
  }, [key])

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const frame = window.requestAnimationFrame(() => {
        if (!scrollToAnchor(id, 'auto')) window.scrollTo(0, 0)
      })
      return () => window.cancelAnimationFrame(frame)
    }
    if (nav === 'POP') {
      const y = Number(sessionStorage.getItem(key) || 0)
      const frame = window.requestAnimationFrame(() => window.scrollTo(0, y))
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, search, nav, key])

  return null
}
