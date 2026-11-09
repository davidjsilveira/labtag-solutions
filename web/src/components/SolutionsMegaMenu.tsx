import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from '@phosphor-icons/react'
import {
  SOLUTIONS_MEGA_COLUMNS,
  SOLUTIONS_MEGA_VIEW_ALL,
} from '@/content/solutionsMegaMenu'

type SolutionsMegaMenuProps = {
  open: boolean
  onClose: () => void
}

function isInternalPath(href: string) {
  return href.startsWith('/')
}

export function SolutionsMegaMenu({ open, onClose }: SolutionsMegaMenuProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      id="site-nav-solutions-menu"
      className={['nav-mega', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="Solutions"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div className="nav-mega-bar">
        <div className="nav-mega-bar-copy">
          <p className="nav-mega-kicker">Solutions</p>
          <Link className="nav-mega-view-all" to={SOLUTIONS_MEGA_VIEW_ALL.href} onClick={onClose}>
            {SOLUTIONS_MEGA_VIEW_ALL.label}
            <ArrowRight size={14} weight="bold" aria-hidden />
          </Link>
        </div>
        <button type="button" className="nav-mega-close" aria-label="Close solutions menu" onClick={onClose}>
          <X size={18} weight="bold" aria-hidden />
        </button>
      </div>

      <div className="nav-mega-body">
        {SOLUTIONS_MEGA_COLUMNS.map((column) => (
          <div key={column.heading} className="nav-mega-column">
            <h3>{column.heading}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  {isInternalPath(link.href) ? (
                    <Link to={link.href} onClick={onClose}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
