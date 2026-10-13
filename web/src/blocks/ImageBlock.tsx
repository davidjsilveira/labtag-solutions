import { useState } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'

type Props = {
  src: string
  alt: string
  fallbackSrc?: string
  variant?: 'hero' | 'gallery'
}

export function ImageBlockView({ src, alt, fallbackSrc, variant = 'gallery' }: Props) {
  const resolved = resolveImageSrc(src, fallbackSrc)
  const [current, setCurrent] = useState(resolved.primary)
  const [failed, setFailed] = useState(false)

  if (failed && !resolved.fallback) {
    return null
  }

  return (
    <figure className={`block block-image block-image-${variant}`}>
      <img
        src={current}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (resolved.fallback && current !== resolved.fallback) {
            setCurrent(resolved.fallback)
            return
          }
          setFailed(true)
        }}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
