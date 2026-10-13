import { useState } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'
import type { HeroImage } from '@/content/types'

type Props = {
  title: string
  description?: string[]
  image?: HeroImage
  sources?: string[]
  eyebrow?: string
}

export function PageHero({
  title,
  description = [],
  image,
  sources = [],
  eyebrow = 'LabTAG Solutions',
}: Props) {
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const [current, setCurrent] = useState(resolved?.primary ?? '')
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image && resolved && !imageFailed)

  return (
    <header className={`page-hero${showImage ? ' page-hero-split' : ''}`}>
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description.length ? (
          <div className="page-hero-description">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
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
