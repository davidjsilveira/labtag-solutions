import { useEffect, type CSSProperties, type RefObject } from 'react'

export function motionIndex(i: number): CSSProperties {
  return { ['--i' as string]: i }
}

const REDUCE = '(prefers-reduced-motion: reduce)'

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count)
  if (!Number.isFinite(target)) return

  const prefix = el.dataset.prefix ?? ''
  const suffix = el.dataset.suffix ?? ''
  const duration = 900
  const start = performance.now()

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`
    if (t < 1) requestAnimationFrame(tick)
    else el.textContent = `${prefix}${target}${suffix}`
  }

  requestAnimationFrame(tick)
}

/**
 * Website motion: hero appear once on mount, section intros once at 30% view,
 * stories pause when the section leaves the viewport.
 */
export function usePageMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia(REDUCE).matches) {
      root.querySelectorAll('[data-motion-hero], [data-motion-section]').forEach((el) => {
        el.classList.add('is-in', 'is-visible')
      })
      return
    }

    const heroes = root.querySelectorAll('[data-motion-hero]')
    const failsafe = window.setTimeout(() => {
      heroes.forEach((hero) => hero.classList.add('is-in'))
    }, 900)

    const start = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroes.forEach((hero) => hero.classList.add('is-in'))
        window.clearTimeout(failsafe)
      })
    })

    const sections = root.querySelectorAll<HTMLElement>('[data-motion-section]')
    const counted = new WeakSet<HTMLElement>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            el.classList.add('is-in', 'is-visible')
            if (!counted.has(el)) {
              counted.add(el)
              el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp)
            }
          } else if (!entry.isIntersecting) {
            el.classList.remove('is-visible')
          }
        }
      },
      { threshold: [0, 0.3] },
    )

    sections.forEach((section) => io.observe(section))

    return () => {
      window.cancelAnimationFrame(start)
      window.clearTimeout(failsafe)
      io.disconnect()
    }
  }, [rootRef])
}
