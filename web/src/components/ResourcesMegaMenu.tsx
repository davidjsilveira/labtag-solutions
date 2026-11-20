import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowSquareOut, ChatCircle, X } from '@phosphor-icons/react'
import {
  RESOURCES_MEGA_COLUMNS,
  RESOURCES_MEGA_FOOTER,
  RESOURCES_MEGA_SPOTLIGHT,
  RESOURCES_MEGA_TAGI,
  RESOURCES_MEGA_TEMPLATES_CARD,
  RESOURCES_MEGA_VIEW_ALL,
  type ResourcesMegaImage,
} from '@/content/resourcesMegaMenu'
import { resolveImageSrc } from '@/content/resolveImage'

type ResourcesMegaMenuProps = {
  open: boolean
  onClose: () => void
}

function isInternalPath(href: string) {
  return href.startsWith('/')
}

function MegaLink({
  href,
  className,
  onClose,
  children,
  'aria-label': ariaLabel,
}: {
  href: string
  className?: string
  onClose: () => void
  children: ReactNode
  'aria-label'?: string
}) {
  if (isInternalPath(href)) {
    return (
      <Link className={className} to={href} onClick={onClose} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
      {children}
    </a>
  )
}

function MegaImage({ image }: { image: ResourcesMegaImage }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
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
  )
}

export function ResourcesMegaMenu({ open, onClose }: ResourcesMegaMenuProps) {
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
      id="site-nav-resources-menu"
      className={['nav-mega', 'is-resources', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="Resources"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div className="nav-mega-bar">
        <div className="nav-mega-bar-copy">
          <p className="nav-mega-kicker">Resources</p>
          <MegaLink className="nav-mega-view-all" href={RESOURCES_MEGA_VIEW_ALL.href} onClose={onClose}>
            {RESOURCES_MEGA_VIEW_ALL.label}
            <ArrowRight size={14} weight="bold" aria-hidden />
          </MegaLink>
        </div>
        <button type="button" className="nav-mega-close" aria-label="Close resources menu" onClick={onClose}>
          <X size={18} weight="bold" aria-hidden />
        </button>
      </div>

      <div className="nav-mega-body resources-mega-body">
        <div className="resources-mega-feature-row">
          <MegaLink
            className="resources-mega-spotlight is-finder"
            href={RESOURCES_MEGA_SPOTLIGHT.href}
            onClose={onClose}
          >
            <span className="resources-mega-spotlight-media">
              <MegaImage image={RESOURCES_MEGA_SPOTLIGHT.image} />
            </span>
            <span className="resources-mega-spotlight-copy">
              <span className="resources-mega-eyebrow">{RESOURCES_MEGA_SPOTLIGHT.eyebrow}</span>
              <span className="resources-mega-spotlight-title">{RESOURCES_MEGA_SPOTLIGHT.label}</span>
              <span className="resources-mega-spotlight-desc">{RESOURCES_MEGA_SPOTLIGHT.description}</span>
              <span className="resources-mega-spotlight-cta">
                {RESOURCES_MEGA_SPOTLIGHT.cta}
                <ArrowRight size={14} weight="bold" aria-hidden />
              </span>
            </span>
          </MegaLink>

          <MegaLink className="resources-mega-tagi" href={RESOURCES_MEGA_TAGI.href} onClose={onClose}>
            <span className="resources-mega-tagi-icon" aria-hidden="true">
              <ChatCircle size={28} weight="duotone" />
            </span>
            <span className="resources-mega-tagi-copy">
              <span className="resources-mega-eyebrow">Assistant</span>
              <span className="resources-mega-tagi-title">
                {RESOURCES_MEGA_TAGI.label}
                <ArrowRight size={14} weight="bold" aria-hidden />
              </span>
              <span className="resources-mega-tagi-desc">{RESOURCES_MEGA_TAGI.description}</span>
            </span>
          </MegaLink>

          <MegaLink
            className="resources-mega-template is-single"
            href={RESOURCES_MEGA_TEMPLATES_CARD.href}
            onClose={onClose}
          >
            <span className="resources-mega-template-media is-contain">
              <MegaImage image={RESOURCES_MEGA_TEMPLATES_CARD.image} />
            </span>
            <span className="resources-mega-template-copy">
              <span className="resources-mega-eyebrow">{RESOURCES_MEGA_TEMPLATES_CARD.eyebrow}</span>
              <span className="resources-mega-template-label">{RESOURCES_MEGA_TEMPLATES_CARD.label}</span>
              <span className="resources-mega-template-detail">{RESOURCES_MEGA_TEMPLATES_CARD.description}</span>
            </span>
            <ArrowRight size={14} weight="bold" aria-hidden />
          </MegaLink>
        </div>

        <div className="resources-mega-columns">
          {RESOURCES_MEGA_COLUMNS.map((column) => (
            <div key={column.heading} className="resources-mega-column">
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <MegaLink href={link.href} onClose={onClose}>
                      <span className="resources-mega-link-label">
                        {link.label}
                        {isInternalPath(link.href) ? null : (
                          <ArrowSquareOut size={13} weight="bold" aria-hidden />
                        )}
                      </span>
                      {link.note ? <span className="resources-mega-link-note">{link.note}</span> : null}
                    </MegaLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {RESOURCES_MEGA_FOOTER.length > 0 ? (
        <div className="nav-mega-footer">
          {RESOURCES_MEGA_FOOTER.map((link) => (
            <MegaLink key={link.label} className="nav-mega-footer-link" href={link.href} onClose={onClose}>
              {link.label}
            </MegaLink>
          ))}
        </div>
      ) : null}
    </div>
  )
}
