import { useEffect } from 'react'
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'

const JUMP_STYLE_ID = 'anchor-jump-active-style'

/** Land the target fully below sticky header + jump menu. */
function scrollTargetIntoView(el: Element) {
  syncAnchorScrollMargin()
  el.scrollIntoView({ block: 'start', behavior: 'auto' })
}

/**
 * Highlight the hash target until it scrolls out of view.
 * Clears the URL hash when the highlight is dismissed so :target does not linger.
 * Marks the matching quick-menu jump via `html[data-active-jump]` + a dynamic
 * style rule so dimming/active styles survive React remounts of the menu.
 */
export function useAnchorHighlight(pageKey: string) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let active: Element | null = null
    let hasBeenVisible = false

    const clearJump = () => {
      delete document.documentElement.dataset.activeJump
      document.getElementById(JUMP_STYLE_ID)?.remove()
      document
        .querySelectorAll('.solution-quick-menu.is-jump-filtered')
        .forEach((menu) => menu.classList.remove('is-jump-filtered'))
      document
        .querySelectorAll('.feature-jump-link.is-jump-active')
        .forEach((link) => link.classList.remove('is-jump-active'))
    }

    const clear = () => {
      active?.classList.remove('is-anchor-highlight')
      active = null
      hasBeenVisible = false
      observer?.disconnect()
      observer = null
      clearJump()
      if (window.location.hash) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }
    }

    const activateJump = (id: string) => {
      document.documentElement.dataset.activeJump = id

      let style = document.getElementById(JUMP_STYLE_ID) as HTMLStyleElement | null
      if (!style) {
        style = document.createElement('style')
        style.id = JUMP_STYLE_ID
        document.head.appendChild(style)
      }
      const escaped = CSS.escape(id)
      style.textContent = `
        html[data-active-jump="${escaped}"] .solution-quick-menu a.feature-jump-link[href="#${escaped}"] {
          color: var(--labtag-pure-white);
          opacity: 1;
          font-weight: 700;
          text-decoration: underline;
          text-decoration-color: var(--labtag-orange-main, var(--color-accent));
          text-decoration-thickness: 2px;
          text-underline-offset: 0.22em;
        }
      `

      document.querySelectorAll('.solution-quick-menu').forEach((menu) => {
        menu.classList.add('is-jump-filtered')
        menu.querySelectorAll('a.feature-jump-link').forEach((link) => {
          const href = link.getAttribute('href')
          link.classList.toggle('is-jump-active', href === `#${id}`)
        })
      })
    }

    const activate = (el: Element | null, id: string, scroll = false) => {
      if (!el) return
      if (el === active) {
        activateJump(id)
        if (scroll) scrollTargetIntoView(el)
        return
      }

      active?.classList.remove('is-anchor-highlight')
      observer?.disconnect()

      active = el
      hasBeenVisible = false
      el.classList.add('is-anchor-highlight')
      activateJump(id)
      if (scroll) scrollTargetIntoView(el)
      requestAnimationFrame(() => {
        if (active === el) activateJump(id)
      })

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

    const syncFromHash = (scroll = false) => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) {
        if (active) clear()
        return
      }
      activate(document.getElementById(id), id, scroll)
    }

    const onHashChange = () => {
      // Native hash scroll often uses a stale fixed margin; correct after paint.
      requestAnimationFrame(() => syncFromHash(true))
    }

    const onJumpClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest<HTMLAnchorElement>(
        '.solution-quick-menu a.feature-jump-link[href^="#"]',
      )
      if (!link) return
      const id = decodeURIComponent((link.getAttribute('href') || '').replace(/^#/, ''))
      if (!id) return
      requestAnimationFrame(() => activate(document.getElementById(id), id, true))
    }

    requestAnimationFrame(() => requestAnimationFrame(syncFromHash))
    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('click', onJumpClick)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onJumpClick)
      observer?.disconnect()
      active?.classList.remove('is-anchor-highlight')
      clearJump()
    }
  }, [pageKey])
}
