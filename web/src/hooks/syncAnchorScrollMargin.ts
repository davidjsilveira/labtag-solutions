/** Extra air below the sticky chrome so the highlight ring isn’t clipped. */
const CLEARANCE_PX = 20

/** Visible header depth at the top of the viewport (accounts for compact/away transforms). */
function visibleHeaderInset(header: HTMLElement | null): number {
  if (!header) return 0
  return Math.max(0, Math.round(header.getBoundingClientRect().bottom))
}

/**
 * Set `--anchor-scroll-margin` from the live visible site header + on-page
 * jump menu heights. Menus vary (one vs two jump rows), so a fixed token is not enough.
 */
export function syncAnchorScrollMargin(menu?: HTMLElement | null) {
  const header = document.querySelector<HTMLElement>('.site-header')
  const headerH = visibleHeaderInset(header)

  const target =
    menu ??
    document.querySelector<HTMLElement>('.solution-quick-menu')

  let menuH = 0
  if (target) {
    menuH = target.getBoundingClientRect().height
  }

  document.documentElement.style.setProperty(
    '--anchor-scroll-margin',
    `${Math.round(headerH + menuH + CLEARANCE_PX)}px`,
  )
}
