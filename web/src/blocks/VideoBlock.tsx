import { resolveImageSrc } from '@/content/resolveImage'

type Props = {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
}

const GIF_SRC = /\.gif(?:$|\?)/i

export function VideoBlockView({ src, alt, fallbackSrc, className = '' }: Props) {
  const resolved = resolveImageSrc(src, fallbackSrc)
  const primary = GIF_SRC.test(resolved.primary) && resolved.fallback && !GIF_SRC.test(resolved.fallback)
    ? resolved.fallback
    : resolved.primary
  const fallback =
    resolved.fallback &&
    resolved.fallback !== primary &&
    !GIF_SRC.test(resolved.fallback)
      ? resolved.fallback
      : undefined

  return (
    <figure className={`block block-video ${className}`.trim()}>
      <video
        src={primary}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={(event) => {
          if (fallback && event.currentTarget.src !== fallback) {
            event.currentTarget.src = fallback
          }
        }}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
