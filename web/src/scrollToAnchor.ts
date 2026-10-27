/** Scroll so `id` sits just below the sticky site header. */
export function scrollToAnchor(id: string, behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(id)
  if (!target) return false

  const header = document.querySelector<HTMLElement>('.site-header')
  const offset = Math.round((header?.getBoundingClientRect().height ?? 56) + 16)
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : behavior })
  return true
}
