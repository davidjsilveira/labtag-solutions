import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { LABTAG_SAMPLE_URL, REQUEST_FORM_PATHS } from '@/content/labtagLinks'
import { resolveSolutionShopHref } from '@/content/splitActions'
import { resolveImageSrc } from '@/content/resolveImage'
import type { HeroImage } from '@/content/types'

type Props = {
  title: string
  description?: string[]
  image?: HeroImage
  crumb?: ReactNode
  solutionSlug?: string
  /** Related catalog or archive links shown under the hero CTAs. */
  related?: ReactNode
  /** Combined catalog articles stack the figure under the title instead of a two-column split. */
  layout?: 'split' | 'stack'
}

type HeroAction = {
  label: string
  href: string
  external?: boolean
}

function resolveHeroActions(title: string, solutionSlug?: string): {
  primary: HeroAction
  secondary: HeroAction
} {
  const formConfig =
    solutionSlug && solutionSlug in REQUEST_FORM_PATHS
      ? REQUEST_FORM_PATHS[solutionSlug as keyof typeof REQUEST_FORM_PATHS]
      : undefined

  if (formConfig) {
    return {
      primary: { label: formConfig.primaryLabel, href: formConfig.path },
      secondary: { label: 'Request a free sample', href: LABTAG_SAMPLE_URL, external: true },
    }
  }

  return {
    primary: {
      label: `Shop ${title}`,
      href: resolveSolutionShopHref(solutionSlug),
      external: true,
    },
    secondary: { label: 'Request a free sample', href: LABTAG_SAMPLE_URL, external: true },
  }
}

function HeroActionLink({ action, className }: { action: HeroAction; className: string }) {
  if (action.external) {
    return (
      <a className={className} href={action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    )
  }
  return (
    <Link className={className} to={action.href}>
      {action.label}
    </Link>
  )
}

export function PageHero({
  title,
  description = [],
  image,
  crumb,
  solutionSlug,
  related,
  layout = 'split',
}: Props) {
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const [current, setCurrent] = useState(resolved?.primary ?? '')
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image && resolved && !imageFailed)
  const actions = resolveHeroActions(title, solutionSlug)
  const stacked = layout === 'stack'
  const media =
    showImage && image ? (
      <figure className="page-hero-media">
        <img
          src={current}
          alt={image.alt || title}
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (resolved?.fallback && current !== resolved.fallback) {
              setCurrent(resolved.fallback)
              return
            }
            setImageFailed(true)
          }}
        />
      </figure>
    ) : null

  return (
    <header
      className={`page-hero${showImage ? (stacked ? ' page-hero-stack' : ' page-hero-split') : ''}`}
    >
      <div className="page-hero-copy">
        {crumb}
        <h1>{title}</h1>
        {description.length ? (
          <div className="page-hero-description">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        {stacked ? media : null}
        <div className="page-hero-actions">
          <HeroActionLink action={actions.primary} className="btn btn-primary" />
          <HeroActionLink action={actions.secondary} className="btn btn-secondary" />
        </div>
        {related}
      </div>

      {stacked ? null : media}
    </header>
  )
}
