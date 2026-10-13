import { useState } from 'react'

type Props = {
  src: string
  alt: string
  fallbackSrc?: string
  variant?: 'hero' | 'gallery'
}

export function ImageBlockView({ src, alt, fallbackSrc, variant = 'gallery' }: Props) {
  const [current, setCurrent] = useState(src)

  return (
    <figure className={`block block-image block-image-${variant}`}>
      <img
        src={current}
        alt={alt}
        loading="lazy"
        onError={() => {
          if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc)
        }}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  )
}
