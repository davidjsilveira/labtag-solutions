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
  const isIcon = /\.svg(?:$|\?)/i.test(resolved.primary) || /\.svg(?:$|\?)/i.test(fallbackSrc ?? '')

  if (failed && !resolved.fallback) {
    return null
  }

  return (
    <figure
      className={`block block-image block-image-${variant}${isIcon ? ' block-image-icon' : ''}`}
    >
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
      {alt && !isIcon ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
