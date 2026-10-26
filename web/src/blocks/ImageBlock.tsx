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
  const [failedPrimary, setFailedPrimary] = useState<string | null>(null)
  const primaryFailed = failedPrimary === resolved.primary
  const current = primaryFailed && resolved.fallback ? resolved.fallback : resolved.primary
  const failed = primaryFailed && !resolved.fallback
  const isSvg = /\.svg(?:$|\?)/i.test(resolved.primary) || /\.svg(?:$|\?)/i.test(fallbackSrc ?? '')
  const isLogo = variant === 'logo' || isSvg

  if (failed) {
    return null
  }

  return (
    <figure
      className={`block block-image block-image-${variant}${isLogo ? ' block-image-icon' : ''}`}
    >
      <img
        key={current}
        src={current}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailedPrimary(resolved.primary)}
      />
      {alt && !isLogo ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
