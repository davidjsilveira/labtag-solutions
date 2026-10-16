/** Extra air below the sticky chrome so the highlight ring isn’t clipped. */
const CLEARANCE_PX = 20

/**
 * Set `--anchor-scroll-margin` from the live site header + visible on-page
 * jump menu heights. Menus vary (one vs two jump rows), so a fixed token is not enough.
 */
export function syncAnchorScrollMargin(menu?: HTMLElement | null) {
  const header = document.querySelector<HTMLElement>('.site-header')
  const headerH = header?.getBoundingClientRect().height ?? 0

  const target =
    menu ??
    document.querySelector<HTMLElement>('.solution-quick-menu:not(.is-scroll-hidden)')

  let menuH = 0
  if (target && !target.classList.contains('is-scroll-hidden')) {
    menuH = target.getBoundingClientRect().height
  }

  document.documentElement.style.setProperty(
    '--anchor-scroll-margin',
    `${Math.round(headerH + menuH + CLEARANCE_PX)}px`,
  )
}
