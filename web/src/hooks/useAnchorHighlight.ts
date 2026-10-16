import { useEffect } from 'react'
import { syncAnchorScrollMargin } from '@/hooks/syncAnchorScrollMargin'

const JUMP_STYLE_ID = 'anchor-jump-active-style'

/** Land the target fully below sticky header + jump menu. */
function scrollTargetIntoView(el: Element) {
  syncAnchorScrollMargin()
  el.scrollIntoView({ block: 'start', behavior: 'auto' })
}

function readScrollMarginPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--anchor-scroll-margin')
    .trim()
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 96
}

function jumpTargetIds(): string[] {
  const ids: string[] = []
  const seen = new Set<string>()
  document
    .querySelectorAll<HTMLAnchorElement>('.solution-quick-menu a.feature-jump-link[href^="#"]')
    .forEach((link) => {
      const id = decodeURIComponent((link.getAttribute('href') || '').replace(/^#/, ''))
      if (!id || seen.has(id)) return
      seen.add(id)
      ids.push(id)
    })
  return ids
}

/**
 * Highlight the hash target until it scrolls out of view or the user clicks outside it.
 * Clears the URL hash when the highlight is dismissed so :target does not linger.
 * Marks the matching quick-menu jump via `html[data-active-jump]` + a dynamic
 * style rule so dimming/active styles survive React remounts of the menu.
 * Also scroll-spies jump targets so the sticky bar always shows the section in view.
 */
export function useAnchorHighlight(pageKey: string) {
  useEffect(() => {
    let hashObserver: IntersectionObserver | null = null
    let spyObserver: IntersectionObserver | null = null
    let hashTarget: Element | null = null
    let hasBeenVisible = false
    let activeJumpId: string | null = null
    let spyLockedUntil = 0
    const visibleIds = new Set<string>()

    const clearJump = () => {
      activeJumpId = null
      delete document.documentElement.dataset.activeJump
      document.getElementById(JUMP_STYLE_ID)?.remove()
      document
        .querySelectorAll('.solution-quick-menu.is-jump-filtered')
        .forEach((menu) => menu.classList.remove('is-jump-filtered'))
      document
        .querySelectorAll('.feature-jump-link.is-jump-active')
        .forEach((link) => link.classList.remove('is-jump-active'))
    }

    const clearHashHighlight = () => {
      hashTarget?.classList.remove('is-anchor-highlight')
      hashTarget = null
      hasBeenVisible = false
      hashObserver?.disconnect()
      hashObserver = null
      if (window.location.hash) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }
    }

    const activateJump = (id: string) => {
      if (activeJumpId === id) {
        // Re-apply class/attrs in case the menu remounted.
      } else {
        activeJumpId = id
      }
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

    const pickSpySection = () => {
      if (performance.now() < spyLockedUntil) return

      const margin = readScrollMarginPx()
      const probe = margin + 8
      const ids = jumpTargetIds()
      if (!ids.length) {
        if (activeJumpId) clearJump()
        return
      }

      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= probe) current = id
      }

      if (!current) {
        // Above the first section — prefer a visible target, else the first link.
        current =
          ids.find((id) => visibleIds.has(id)) ??
          ids.find((id) => document.getElementById(id)) ??
          null
      }

      if (current) activateJump(current)
    }

    const bindSpy = () => {
      spyObserver?.disconnect()
      visibleIds.clear()
      const ids = jumpTargetIds()
      if (!ids.length) return

      const margin = readScrollMarginPx()
      spyObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id
            if (!id) continue
            if (entry.isIntersecting) visibleIds.add(id)
            else visibleIds.delete(id)
          }
          pickSpySection()
        },
        {
          // Band under sticky chrome where the “current” section lives.
          rootMargin: `-${Math.round(margin)}px 0px -45% 0px`,
          threshold: [0, 0.05, 0.2, 0.5, 1],
        },
      )

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el) spyObserver.observe(el)
      }
      pickSpySection()
    }

    const activateHashTarget = (el: Element | null, id: string, scroll = false) => {
      if (!el) return
      if (el === hashTarget) {
        activateJump(id)
        if (scroll) scrollTargetIntoView(el)
        return
      }

      hashTarget?.classList.remove('is-anchor-highlight')
      hashObserver?.disconnect()

      hashTarget = el
      hasBeenVisible = false
      el.classList.add('is-anchor-highlight')
      activateJump(id)
      if (scroll) {
        spyLockedUntil = performance.now() + 700
        scrollTargetIntoView(el)
      }
      requestAnimationFrame(() => {
        if (hashTarget === el) activateJump(id)
      })

      hashObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasBeenVisible = true
            return
          }
          if (hasBeenVisible) clearHashHighlight()
        },
        { threshold: 0, rootMargin: '-12% 0px -12% 0px' },
      )
      hashObserver.observe(el)
    }

    const syncFromHash = (scroll = false) => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) {
        if (hashTarget) clearHashHighlight()
        pickSpySection()
        return
      }
      activateHashTarget(document.getElementById(id), id, scroll)
    }

    const onHashChange = () => {
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
      spyLockedUntil = performance.now() + 700
      activateJump(id)
      requestAnimationFrame(() => activateHashTarget(document.getElementById(id), id, true))
    }

    /** Dismiss the orange hash highlight when the user clicks outside it. */
    const onOutsideClick = (event: MouseEvent) => {
      if (!hashTarget) return
      const target = event.target
      if (!(target instanceof Node)) return
      if (target instanceof Element) {
        // Jump links activate their own highlight; don't clear underneath them.
        if (target.closest('.solution-quick-menu a.feature-jump-link[href^="#"]')) return
      }
      if (hashTarget.contains(target)) return
      clearHashHighlight()
    }

    const onScroll = () => {
      pickSpySection()
    }

    const boot = () => {
      syncAnchorScrollMargin()
      bindSpy()
      syncFromHash(false)
    }

    requestAnimationFrame(() => requestAnimationFrame(boot))
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', bindSpy)
    document.addEventListener('click', onJumpClick)
    document.addEventListener('click', onOutsideClick)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', bindSpy)
      document.removeEventListener('click', onJumpClick)
      document.removeEventListener('click', onOutsideClick)
      hashObserver?.disconnect()
      spyObserver?.disconnect()
      hashTarget?.classList.remove('is-anchor-highlight')
      clearJump()
    }
  }, [pageKey])
}
