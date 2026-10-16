import type { ReactNode } from 'react'
import { useStickyScrollMenu } from '@/hooks/useStickyScrollMenu'

type Props = {
  children: ReactNode
}

/** Dark on-page jump TOC — sticky under the header; hides on scroll-down only when 3+ link rows. */
export function SolutionQuickMenu({ children }: Props) {
  const ref = useStickyScrollMenu<HTMLElement>()

  return (
    <nav ref={ref} className="solution-quick-menu" aria-label="On this page">
      {children}
    </nav>
  )
}
