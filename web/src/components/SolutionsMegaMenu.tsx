import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from '@phosphor-icons/react'
import {
  SOLUTIONS_MEGA_FOOTER,
  SOLUTIONS_MEGA_SECTIONS,
  SOLUTIONS_MEGA_VIEW_ALL,
} from '@/content/solutionsMegaMenu'
import { resolveImageSrc } from '@/content/resolveImage'

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
      className={['nav-mega', 'is-solutions', open ? 'is-open' : ''].filter(Boolean).join(' ')}
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
        <div className="nav-mega-sections">
          {SOLUTIONS_MEGA_SECTIONS.map((section) => {
            const image = section.featured.image
            const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

            return (
              <section key={section.heading} className="nav-mega-section">
                <Link
                  className="nav-mega-section-media"
                  to={section.featured.href}
                  onClick={onClose}
                >
                  {resolved ? (
                    <img
                      src={resolved.primary}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
                          event.currentTarget.src = resolved.fallback
                        }
                      }}
                    />
                  ) : (
                    <span className="nav-mega-section-media-empty" aria-hidden="true" />
                  )}
                  <span className="nav-mega-section-caption">
                    {section.featured.label}
                    <ArrowRight size={14} weight="bold" aria-hidden />
                  </span>
                </Link>

                <h3>{section.heading}</h3>
                <ul>
                  {section.links
                    .filter((link) => link.href !== section.featured.href)
                    .map((link) => (
                      <li key={link.href}>
                        <Link to={link.href} onClick={onClose}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>

      {SOLUTIONS_MEGA_FOOTER.length > 0 ? (
        <div className="nav-mega-footer">
          {SOLUTIONS_MEGA_FOOTER.map((link) =>
            isInternalPath(link.href) ? (
              <Link key={link.href} className="nav-mega-footer-link" to={link.href} onClick={onClose}>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                className="nav-mega-footer-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
