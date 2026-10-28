type ScrollAlign = 'start' | 'center'

/** Scroll so `id` sits below the sticky header, or centered in the remaining viewport. */
export function scrollToAnchor(
  id: string,
  behavior: ScrollBehavior = 'smooth',
  align: ScrollAlign = id.startsWith('faq-') ? 'center' : 'start',
) {
  const target = document.getElementById(id)
  if (!target) return false

  const header = document.querySelector<HTMLElement>('.site-header')
  const headerH = header?.getBoundingClientRect().height ?? 56
  const rect = target.getBoundingClientRect()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let top: number
  if (align === 'center') {
    const viewportMid = headerH + (window.innerHeight - headerH) / 2
    const targetMid = rect.top + rect.height / 2
    top = window.scrollY + targetMid - viewportMid
  } else {
    top = window.scrollY + rect.top - headerH - 16
  }

  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  window.scrollTo({
    top: Math.min(Math.max(0, top), max),
    behavior: reduce ? 'auto' : behavior,
  })
  return true
}
