import { useEffect, useRef } from 'react'
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'

/** Visible header depth at the top of the viewport (accounts for compact/away transforms). */
function visibleHeaderInset(header: HTMLElement | null): number {
  if (!header) return 0
  return Math.max(0, Math.round(header.getBoundingClientRect().bottom))
}

/**
 * Sticky on-page menu: stays under the visible site header and never slides away.
 * Updates `--quick-menu-top` from the header’s live bottom edge so compact/away
 * nav transforms do not leave a gap or overlap. Also keeps `--anchor-scroll-margin`
 * in sync with header + this menu’s height.
 */
export function useStickyScrollMenu<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    let transitionFrames = 0

    const syncOffsets = () => {
      const header = document.querySelector<HTMLElement>('.site-header')
      el.style.setProperty('--quick-menu-top', `${visibleHeaderInset(header)}px`)
      syncAnchorScrollMargin(el)
    }

    const scheduleSync = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        syncOffsets()
        if (transitionFrames > 0) {
          transitionFrames -= 1
          scheduleSync()
        }
      })
    }

    const onHeaderTransition = () => {
      // Follow the 500ms header transform for roughly one second of frames.
      transitionFrames = 60
      scheduleSync()
    }

    syncOffsets()

    const observer = new ResizeObserver(scheduleSync)
    observer.observe(el)
    const header = document.querySelector('.site-header')
    if (header) {
      observer.observe(header)
      header.addEventListener('transitionrun', onHeaderTransition)
      header.addEventListener('transitionend', scheduleSync)
    }

    const classObserver = new MutationObserver(scheduleSync)
    if (header) {
      classObserver.observe(header, { attributes: true, attributeFilter: ['class'] })
    }

    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
      classObserver.disconnect()
      if (header) {
        header.removeEventListener('transitionrun', onHeaderTransition)
        header.removeEventListener('transitionend', scheduleSync)
      }
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      document.documentElement.style.removeProperty('--anchor-scroll-margin')
    }
  }, [])

  return ref
}
