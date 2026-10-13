import { resolveImageSrc } from '@/content/resolveImage'

type Props = {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
}

export function VideoBlockView({ src, alt, fallbackSrc, className = '' }: Props) {
  const resolved = resolveImageSrc(src, fallbackSrc)

  return (
    <figure className={`block block-video ${className}`.trim()}>
      <video
        src={resolved.primary}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={(event) => {
          if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
            event.currentTarget.src = resolved.fallback
          }
        }}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
