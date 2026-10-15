import { useEffect } from 'react'

/**
 * Highlight the hash target until it scrolls out of view.
 * Clears the URL hash when the highlight is dismissed so :target does not linger.
 */
export function useAnchorHighlight(pageKey: string) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let active: Element | null = null
    let hasBeenVisible = false

    const clear = () => {
      active?.classList.remove('is-anchor-highlight')
      active = null
      hasBeenVisible = false
      observer?.disconnect()
      observer = null
      if (window.location.hash) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }
    }

    const activate = (el: Element | null) => {
      if (!el) return
      if (el === active) return

      active?.classList.remove('is-anchor-highlight')
      observer?.disconnect()

      active = el
      hasBeenVisible = false
      el.classList.add('is-anchor-highlight')

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasBeenVisible = true
            return
          }
          if (hasBeenVisible) clear()
        },
        { threshold: 0, rootMargin: '-12% 0px -12% 0px' },
      )
      observer.observe(el)
    }

    const syncFromHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) {
        if (active) clear()
        return
      }
      activate(document.getElementById(id))
    }

    const onHashChange = () => {
      requestAnimationFrame(syncFromHash)
    }

    syncFromHash()
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      observer?.disconnect()
      active?.classList.remove('is-anchor-highlight')
    }
  }, [pageKey])
}
