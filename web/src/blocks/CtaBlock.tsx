import { Link } from 'react-router-dom'
import { CONTACT_PATH, LABTAG_SAMPLE_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import type { CtaBlock } from '@/content/types'

function AccentLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className: string
}) {
  if (href.startsWith('http')) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    )
  }
  return (
    <Link className={className} to={href}>
      {label}
    </Link>
  )
}

export function CtaBlockView({ block }: { block: CtaBlock }) {
  const customHref = block.actionHref?.trim()
  const customLabel = block.actionLabel?.trim()
  const primaryHref = customHref || CONTACT_PATH
  const primaryLabel = customHref && customLabel ? customLabel : 'Chat with an expert'
  const showSample = primaryHref !== LABTAG_SAMPLE_URL && primaryHref !== SAMPLE_PATH

  return (
    <aside className="block block-cta">
      <div className="block-cta-copy">
        <h2>{block.title}</h2>
        {block.body ? <p>{block.body}</p> : null}
      </div>
      <div className="block-cta-actions">
        <AccentLink href={primaryHref} label={primaryLabel} className="btn btn-on-accent" />
        {showSample ? (
          <AccentLink
            href={SAMPLE_PATH}
            label="Request a free sample"
            className="btn btn-on-accent-ghost"
          />
        ) : null}
      </div>
    </aside>
  )
}
