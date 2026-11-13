/** Extra air below the sticky chrome so the highlight ring isn’t clipped. */
const CLEARANCE_PX = 20

/** Visible header depth at the top of the viewport (accounts for compact/away transforms). */
function visibleHeaderInset(header: HTMLElement | null): number {
  if (!header) return 0
  return Math.max(0, Math.round(header.getBoundingClientRect().bottom))
}

/**
 * Set `--anchor-scroll-margin` from the live visible site header so in-page
 * anchors clear the sticky header.
 */
export function syncAnchorScrollMargin() {
  const header = document.querySelector<HTMLElement>('.site-header')
  const headerH = visibleHeaderInset(header)

  document.documentElement.style.setProperty(
    '--anchor-scroll-margin',
    `${Math.round(headerH + CLEARANCE_PX)}px`,
  )
}
