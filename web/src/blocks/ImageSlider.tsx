import { useId, useState, type KeyboardEvent } from 'react'
import type { ImageBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'

type Props = {
  images: ImageBlock[]
  className?: string
}

export function ImageSlider({ images, className = '' }: Props) {
  const labelId = useId()
  const [index, setIndex] = useState(0)

  if (!images.length) return null

  const allLogos = images.every((image) => image.variant === 'logo')
  if (allLogos) {
    return (
      <div className={`logo-grid ${className}`.trim()} role="list" aria-label="Software partners">
        {images.map((image, logoIndex) => (
          <div key={`${image.src}-${logoIndex}`} className="logo-grid-item" role="listitem">
            <ImageBlockView
              src={image.src}
              alt={image.alt}
              fallbackSrc={image.fallbackSrc}
              variant="logo"
            />
          </div>
        ))}
      </div>
    )
  }

  if (images.length === 1) {
    const image = images[0]
    return (
      <div className={className}>
        <ImageBlockView
          src={image.src}
          alt={image.alt}
          fallbackSrc={image.fallbackSrc}
          variant={image.variant}
        />
      </div>
    )
  }

  const current = images[index]
  const go = (delta: number) => {
    setIndex((value) => (value + delta + images.length) % images.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setIndex(images.length - 1)
    }
  }

  return (
    <div
      className={`image-slider ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <p id={labelId} className="sr-only">
        Image gallery, slide {index + 1} of {images.length}
      </p>

      <div className="image-slider-stage">
        <ImageBlockView
          key={`${current.src}-${index}`}
          src={current.src}
          alt={current.alt}
          fallbackSrc={current.fallbackSrc}
          variant={current.variant ?? 'gallery'}
        />
      </div>

      <div className="image-slider-chrome">
        <button
          type="button"
          className="image-slider-nav"
          onClick={() => go(-1)}
          aria-label="Previous image"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="image-slider-meta">
          <div className="image-slider-dots" role="tablist" aria-label="Choose image">
            {images.map((image, dotIndex) => (
              <button
                key={`${image.src}-${dotIndex}`}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Show image ${dotIndex + 1}`}
                className={dotIndex === index ? 'is-active' : undefined}
                onClick={() => setIndex(dotIndex)}
              />
            ))}
          </div>
          <p className="image-slider-count" aria-hidden="true">
            {index + 1}
            <span className="image-slider-count-sep">/</span>
            {images.length}
          </p>
        </div>

        <button
          type="button"
          className="image-slider-nav"
          onClick={() => go(1)}
          aria-label="Next image"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  )
}
