import { useState } from 'react'
import { LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { HeroImage } from '@/content/types'

type Props = {
  title: string
  description?: string[]
  image?: HeroImage
  sources?: string[]
}

export function PageHero({ title, description = [], image, sources = [] }: Props) {
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const [current, setCurrent] = useState(resolved?.primary ?? '')
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image && resolved && !imageFailed)

  return (
    <header className={`page-hero${showImage ? ' page-hero-split' : ''}`}>
      <div className="page-hero-copy">
        <h1>{title}</h1>
        {description.length ? (
          <div className="page-hero-description">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        <div className="page-hero-actions">
          <a className="btn btn-primary" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Shop labels
          </a>
          <a className="btn btn-secondary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
        </div>
        {sources.length ? (
          <ul className="source-list">
            {sources.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {url.replace('https://www.labtag.com', '')}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
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
