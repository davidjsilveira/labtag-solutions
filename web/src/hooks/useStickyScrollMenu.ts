import { useEffect, useRef } from 'react'
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'

/** Ignore tiny scroll jitter when deciding direction. */
const SCROLL_DELTA = 8
/** Extra distance past stick before the menu may hide on scroll-down. */
const HIDE_AFTER_PX = 220
/** Hide-on-scroll only when jump links wrap past this many rows. */
const HIDE_AFTER_LINES = 2
/** Cluster link tops within this many px as the same row. */
const LINE_CLUSTER_PX = 8

/** Count wrapped rows of jump links inside the sticky menu. */
function countJumpLines(el: HTMLElement): number {
  const links = Array.from(el.querySelectorAll<HTMLElement>('.feature-jump-link'))
  if (!links.length) return 0

  const tops = links
    .map((link) => link.getBoundingClientRect().top)
    .sort((a, b) => a - b)

  let rows = 1
  let rowTop = tops[0]
  for (const top of tops) {
    if (top - rowTop > LINE_CLUSTER_PX) {
      rows += 1
      rowTop = top
    }
  }
  return rows
}

/**
 * Sticky on-page menu: stays under the site header.
 * Short menus (≤2 jump-link rows) stay open while stuck.
 * Taller menus (3+ rows) slide away on scroll-down after a grace distance
 * and return on scroll-up.
 * Also keeps `--anchor-scroll-margin` in sync with header + this menu’s height.
 */
export function useStickyScrollMenu<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastY = window.scrollY
    let hidden = false
    let stuckAtY: number | null = null
    let canHide = false
    let ticking = false

    const syncOffsets = () => {
      const header = document.querySelector<HTMLElement>('.site-header')
      const height = header?.getBoundingClientRect().height ?? 0
      el.style.setProperty('--quick-menu-top', `${Math.round(height)}px`)
      canHide = countJumpLines(el) > HIDE_AFTER_LINES
      if (!canHide) applyHidden(false)
      syncAnchorScrollMargin(el)
    }

    const applyHidden = (next: boolean) => {
      if (next === hidden) return
      hidden = next
      el.classList.toggle('is-scroll-hidden', hidden)
      syncAnchorScrollMargin(el)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        const y = window.scrollY
        const delta = y - lastY
        lastY = y

        const topOffset = parseFloat(el.style.getPropertyValue('--quick-menu-top') || '0')
        const stuck = el.getBoundingClientRect().top <= topOffset + 1

        if (!stuck || y < 8 || !canHide) {
          stuckAtY = null
          applyHidden(false)
          return
        }

        if (stuckAtY === null) stuckAtY = y

        if (delta < -SCROLL_DELTA) {
          applyHidden(false)
          return
        }

        if (delta > SCROLL_DELTA && y >= stuckAtY + HIDE_AFTER_PX) {
          applyHidden(true)
        }
      })
    }

    syncOffsets()
    const observer = new ResizeObserver(syncOffsets)
    observer.observe(el)
    const header = document.querySelector('.site-header')
    if (header) observer.observe(header)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', syncOffsets)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', syncOffsets)
      // Drop the live override so pages without a quick menu fall back to the token.
      document.documentElement.style.removeProperty('--anchor-scroll-margin')
    }
  }, [])

  return ref
}
