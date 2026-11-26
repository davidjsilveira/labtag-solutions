import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowSquareOut, BookOpen, Files, SquaresFour, X } from '@phosphor-icons/react'
import {
  RESOURCES_MEGA_FOOTER,
  RESOURCES_MEGA_LINKS,
  RESOURCES_MEGA_SPOTLIGHT,
  RESOURCES_MEGA_TAGI,
  RESOURCES_MEGA_TOOLS,
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

const TOOL_ICONS = {
  'Label Templates': Files,
  Guides: BookOpen,
  'Brands & Classes': SquaresFour,
} as const

function MegaImage({ image }: { image: ResourcesMegaImage }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
    <img
      src={resolved.primary}
      alt={image.alt}
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
        <MegaLink className="resources-mega-banner" href={RESOURCES_MEGA_SPOTLIGHT.href} onClose={onClose}>
          <MegaImage image={RESOURCES_MEGA_SPOTLIGHT.image} />
          <span className="resources-mega-banner-copy">
            <span className="resources-mega-eyebrow">{RESOURCES_MEGA_SPOTLIGHT.eyebrow}</span>
            <span className="resources-mega-banner-title">{RESOURCES_MEGA_SPOTLIGHT.label}</span>
            <span className="resources-mega-banner-desc">{RESOURCES_MEGA_SPOTLIGHT.description}</span>
            <span className="resources-mega-banner-cta">
              {RESOURCES_MEGA_SPOTLIGHT.cta}
              <ArrowRight size={14} weight="bold" aria-hidden />
            </span>
          </span>
        </MegaLink>

        <div className="resources-mega-aside">
          <MegaLink className="resources-mega-tagi" href={RESOURCES_MEGA_TAGI.href} onClose={onClose}>
            <span className="resources-mega-eyebrow">Assistant</span>
            <span className="resources-mega-tagi-title">
              {RESOURCES_MEGA_TAGI.label}
              <ArrowRight size={16} weight="bold" aria-hidden />
            </span>
            <span className="resources-mega-tagi-desc">{RESOURCES_MEGA_TAGI.description}</span>
          </MegaLink>

          <ul className="resources-mega-tools">
            {RESOURCES_MEGA_TOOLS.map((link) => {
              const Icon = TOOL_ICONS[link.label as keyof typeof TOOL_ICONS]
              return (
                <li key={link.label}>
                  <MegaLink className="resources-mega-tool" href={link.href} onClose={onClose}>
                    {Icon ? <Icon size={22} weight="duotone" aria-hidden /> : null}
                    <span>{link.label}</span>
                  </MegaLink>
                </li>
              )
            })}
          </ul>
          <ul className="resources-mega-links">
            {RESOURCES_MEGA_LINKS.map((link) => (
              <li key={link.label}>
                <MegaLink href={link.href} onClose={onClose}>
                  {link.label}
                  {isInternalPath(link.href) ? null : <ArrowSquareOut size={13} weight="bold" aria-hidden />}
                </MegaLink>
              </li>
            ))}
          </ul>
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
