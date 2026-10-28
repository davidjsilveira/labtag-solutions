import type { ReactNode } from 'react'
import { useStickyScrollMenu } from '@/hooks/useStickyScrollMenu'

type Props = {
  children: ReactNode
  /** Solution page title shown on the left of the sticky jump bar. */
  title?: string
}

/** On-page jump TOC in the hero band — sticky under the header; hides on scroll-down only when 3+ link rows. */
export function SolutionQuickMenu({ children, title }: Props) {
  const ref = useStickyScrollMenu<HTMLElement>()

  return (
    <nav ref={ref} className="solution-quick-menu" aria-label="On this page">
      {title ? (
        <p className="solution-quick-menu-title" title={title}>
          {title}
        </p>
      ) : null}
      <div className="solution-quick-menu-jumps">{children}</div>
    </nav>
  )
}
