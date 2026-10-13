import { useState } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'

type Props = {
  src: string
  alt: string
  fallbackSrc?: string
  variant?: 'hero' | 'gallery' | 'logo'
}

export function ImageBlockView({ src, alt, fallbackSrc, variant = 'gallery' }: Props) {
  const resolved = resolveImageSrc(src, fallbackSrc)
  const [current, setCurrent] = useState(resolved.primary)
  const [failed, setFailed] = useState(false)
  const isSvg = /\.svg(?:$|\?)/i.test(resolved.primary) || /\.svg(?:$|\?)/i.test(fallbackSrc ?? '')
  const isLogo = variant === 'logo' || isSvg

  if (failed && !resolved.fallback) {
    return null
  }

  return (
    <figure
      className={`block block-image block-image-${variant}${isLogo ? ' block-image-icon' : ''}`}
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
      {alt && !isLogo ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
