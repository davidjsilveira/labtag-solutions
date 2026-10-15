import { type ReactNode, useState } from 'react'
import { LABTAG_SAMPLE_URL } from '@/content/labtagLinks'
import { resolveSolutionShopHref, resolveVideosHref } from '@/content/splitActions'
import { resolveImageSrc } from '@/content/resolveImage'
import type { HeroImage } from '@/content/types'

type Props = {
  title: string
  description?: string[]
  image?: HeroImage
  crumb?: ReactNode
  solutionSlug?: string
}

export function PageHero({ title, description = [], image, crumb, solutionSlug }: Props) {
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const [current, setCurrent] = useState(resolved?.primary ?? '')
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image && resolved && !imageFailed)
  const shopHref = resolveSolutionShopHref(solutionSlug)
  const videosHref = resolveVideosHref(solutionSlug)

  return (
    <header className={`page-hero${showImage ? ' page-hero-split' : ''}`}>
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
        <div className="page-hero-actions">
          <a className="btn btn-primary" href={shopHref} target="_blank" rel="noreferrer">
            Shop {title}
          </a>
          <a className="btn btn-secondary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
          <a className="page-hero-video" href={videosHref} target="_blank" rel="noreferrer">
            Watch videos
          </a>
        </div>
      </div>

      {showImage && image ? (
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
      ) : null}
    </header>
  )
}
